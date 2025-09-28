
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import * as nodemailer from 'nodemailer';
import type { WithdrawalRequest } from '@/lib/types';
import { render } from '@react-email/components';
import { WithdrawalRequestEmail } from '@/components/emails/withdrawal-request-email';

const emailSchema = z.object({
  to: z.string(),
  subject: z.string(),
  html: z.string(),
});

export type EmailInput = z.infer<typeof emailSchema>;

const sendEmailFlow = ai.defineFlow(
  {
    name: 'sendEmailFlow',
    inputSchema: emailSchema,
    outputSchema: z.string(),
  },
  async (email) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'dropxindia.in@gmail.com',
        pass: 'rjnz rhwm sdsy zekd',
      },
    });

    const mailOptions = {
      from: '"DropX India" <dropxindia.in@gmail.com>',
      to: email.to,
      subject: email.subject,
      html: email.html,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      return `Message sent: ${info.messageId}`;
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }
);

export async function sendOrderStatusEmail(input: EmailInput): Promise<string> {
    return await sendEmailFlow(input);
}


// Schema for the withdrawal request data
const WithdrawalRequestSchema = z.object({
    creatorName: z.string(),
    creatorContact: z.string(),
    creatorUpiId: z.string(),
    withdrawalAmount: z.number(),
    currentBalance: z.number(),
    requestDate: z.string(),
});

// Flow for sending withdrawal request email
const sendWithdrawalRequestEmailFlow = ai.defineFlow(
  {
    name: 'sendWithdrawalRequestEmailFlow',
    inputSchema: WithdrawalRequestSchema,
    outputSchema: z.string(),
  },
  async (request) => {
    // 1. Render the React component to an HTML string
    const emailHtml = render(<WithdrawalRequestEmail request={request} />);
    
    // 2. Call the generic sendEmailFlow with the rendered HTML
    return await sendEmailFlow({
      to: 'dropxindia.in@gmail.com',
      subject: `New Withdrawal Request from ${request.creatorName}`,
      html: emailHtml,
    });
  }
);

export async function sendWithdrawalRequestEmail(request: WithdrawalRequest): Promise<string> {
    // This function acts as the public API, calling the Genkit flow
    return await sendWithdrawalRequestEmailFlow(request);
}
