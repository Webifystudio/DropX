'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { sendOrderStatusEmail } from './send-email-flow';
import { render } from '@react-email/components';
import { SupportTicketEmail } from '@/components/emails/support-ticket-email';
import type { UserInfo } from 'firebase/auth';
import type { SupportMessage } from '@/lib/types';

// Define schemas for chat input and output
export const SupportChatInputSchema = z.object({
  user: z.any(), // Firebase User object can be complex, using any for simplicity
  history: z.array(z.object({
      from: z.enum(['user', 'bot']),
      text: z.string(),
      time: z.string(),
  })),
});
export type SupportChatInput = z.infer<typeof SupportChatInputSchema>;

// This flow is the main entry point for the support chat
export async function handleSupportChat(input: SupportChatInput): Promise<string> {
    return await supportChatFlow(input);
}

const supportTriagePrompt = ai.definePrompt({
    name: 'supportTriagePrompt',
    input: { schema: z.object({ conversation: z.string() }) },
    output: { schema: z.object({ 
        isCritical: z.boolean().describe("Is the user's issue critical (related to payments, orders, shipping, account access, or personal data)?"),
        summary: z.string().describe("A concise one-sentence summary of the user's problem."),
        nextQuestion: z.string().describe("If the issue is NOT critical, ask a single, relevant clarifying question to help solve the problem. If it IS critical, this should be an empty string."),
    })},
    prompt: `You are a support agent analyzing a new customer query. Your task is to triage the issue.
    
    Analyze the following conversation:
    {{{conversation}}}

    Determine if the issue is critical. Critical issues include problems with payment, orders, shipping, account access, or personal data.
    
    If the issue is critical:
    - Set isCritical to true.
    - Provide a summary.
    - Leave nextQuestion blank.

    If the issue is NOT critical (e.g., asking about product details, store hours, return policy):
    - Set isCritical to false.
    - Provide a summary.
    - Formulate a single, helpful question to gather more information or guide the user to a solution.
    `,
});

const formFillPrompt = ai.definePrompt({
    name: 'formFillPrompt',
    input: { schema: z.object({ conversation: z.string() }) },
    output: { schema: z.object({
        name: z.string().optional().describe("The user's full name, if mentioned."),
        email: z.string().optional().describe("The user's email address, if mentioned."),
        phone: z.string().optional().describe("The user's phone number, if mentioned."),
    })},
    prompt: `Extract the user's name, email, and phone number from this conversation.
    
    Conversation:
    {{{conversation}}}
    
    Only extract the information explicitly provided by the user in their last message.`,
});

const supportChatFlow = ai.defineFlow(
    {
        name: 'supportChatFlow',
        inputSchema: SupportChatInputSchema,
        outputSchema: z.string(),
    },
    async (input) => {
        const { user, history } = input;
        const lastUserMessage = history[history.length - 1];
        const conversationString = history.map(m => `${m.from}: ${m.text}`).join('\n');
        
        // Determine the current state of the conversation
        const isAwaitingProblem = history.length === 1; // Bot has just greeted
        const isAwaitingContactInfo = history.some(m => m.text.includes("I will create a support ticket for you"));
        
        if (isAwaitingProblem) {
            // User just described their problem, so we triage it.
            const { output: triage } = await supportTriagePrompt({ conversation: conversationString });
            if (!triage) throw new Error("Triage failed.");

            if (triage.isCritical) {
                return `Thank you for explaining. This issue requires personal attention from our support team. I will create a support ticket for you. \n\nPlease provide your full name, email, and phone number.`;
            } else {
                return triage.nextQuestion || "I see. Could you tell me a bit more about that?";
            }
        } else if (isAwaitingContactInfo) {
            // User has provided contact info, so we extract it and create a ticket.
            const { output: contactInfo } = await formFillPrompt({ conversation: lastUserMessage.text });
            
            const ticketData = {
                userName: contactInfo?.name || user.displayName,
                userEmail: contactInfo?.email || user.email,
                userPhone: contactInfo?.phone || '',
                problem: history.filter(m => m.from === 'user').map(m => m.text).join('\n\n'),
                date: new Date().toLocaleString('en-IN'),
            };

            const emailHtml = render(<SupportTicketEmail {...ticketData} />);

            await sendOrderStatusEmail({
                to: 'dropxindia.in@gmail.com',
                subject: `New Support Ticket: ${history[1].text.substring(0, 30)}...`,
                html: emailHtml,
            });

            return `Thank you, ${ticketData.userName}! Your support ticket has been created. Our team will contact you at ${ticketData.userEmail} or ${ticketData.userPhone} shortly.`;

        } else {
             // It's a non-critical ongoing conversation, let's try to help.
             const { output: triage } = await supportTriagePrompt({ conversation: conversationString });
             if (!triage) throw new Error("Triage failed.");
             
             if (triage.isCritical) {
                 return `Thank you. This seems to be a critical issue. I need to escalate this to our support team. \n\nPlease provide your full name, email, and phone number.`;
             } else {
                 return triage.nextQuestion || "I understand. Is there anything else I can help with?";
             }
        }
    }
);
