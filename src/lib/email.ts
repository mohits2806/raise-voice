import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendPasswordResetEmailParams {
    email: string;
    resetUrl: string;
    userName?: string;
}

export async function sendPasswordResetEmail({ 
    email, 
    resetUrl, 
    userName = 'User' 
}: SendPasswordResetEmailParams) {
    try {
        const { data, error } = await resend.emails.send({
            from: process.env.EMAIL_FROM || 'RaiseVoice <onboarding@resend.dev>',
            to: [email],
            subject: 'Reset Your Password - RaiseVoice',
            html: getPasswordResetTemplate(resetUrl, userName),
        });

        if (error) {
            console.error('Resend error:', error);
            throw new Error('Failed to send email');
        }

        console.log('Password reset email sent:', data);
        return data;
    } catch (error) {
        console.error('Email sending error:', error);
        throw error;
    }
}

function getPasswordResetTemplate(resetUrl: string, userName: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
        <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <!-- Header with Gradient -->
            <div style="background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%); padding: 40px 32px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700;">RaiseVoice</h1>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">Password Reset Request</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 32px;">
                <h2 style="color: #111827; font-size: 24px; font-weight: 600; margin: 0 0 16px 0;">Hi ${userName},</h2>
                
                <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                    We received a request to reset your password for your RaiseVoice account. Click the button below to create a new password:
                </p>
                
                <!-- CTA Button -->
                <div style="text-align: center; margin: 32px 0;">
                    <a href="${resetUrl}" style="display: inline-block; background-color: #9333ea; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(147, 51, 234, 0.25);">
                        Reset Your Password
                    </a>
                </div>
                
                <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 24px 0 0 0;">
                    Or copy and paste this link into your browser:
                </p>
                <p style="color: #9333ea; font-size: 14px; word-break: break-all; margin: 8px 0 0 0;">
                    ${resetUrl}
                </p>
                
                <!-- Warning Box -->
                <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 8px; margin: 32px 0;">
                    <p style="color: #92400e; font-size: 14px; margin: 0; line-height: 1.5;">
                        <strong>⚠️ Security Notice:</strong> This link will expire in <strong>1 hour</strong>. If you didn't request this password reset, please contact us at support.
                    </p>
                </div>
                
                <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 24px 0 0 0;">
                    Thanks,<br>
                    The RaiseVoice Team
                </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 24px 32px; border-top: 1px solid #e5e7eb; text-align: center;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                    RaiseVoice - 100% Anonymous Community Issue Reporting
                </p>
                <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0 0;">
                    This is an automated email. Please do not reply.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
}
