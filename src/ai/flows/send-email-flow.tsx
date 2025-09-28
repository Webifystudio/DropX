
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


// Flow for sending withdrawal request email
const sendWithdrawalRequestEmailFlow = ai.defineFlow(
  {
    name: 'sendWithdrawalRequestEmailFlow',
    inputSchema: z.custom<WithdrawalRequest>(),
    outputSchema: z.string(),
  },
  async (requestData) => {
    const emailHtml = render(<WithdrawalRequestEmail request={requestData} />);
    
    return await sendEmailFlow({
      to: 'dropxindia.in@gmail.com',
      subject: `New Withdrawal Request from ${requestData.creatorName}`,
      html: emailHtml,
    });
  }
);

export async function sendWithdrawalRequestEmail(request: WithdrawalRequest): Promise<string> {
    return await sendWithdrawalRequestEmailFlow(request);
}
