import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

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
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Reset Your Password - RaiseVoice',
            html: getPasswordResetTemplate(resetUrl, userName),
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Password reset email sent:', info.messageId);
        return info;
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

export async function sendAdminNewIssueNotification(params: {
    adminEmails: string | string[];
    issue: any;
}) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: params.adminEmails,
            subject: `🚨 New Issue: ${params.issue.title}`,
            html: getAdminIssueNotificationTemplate(params.issue),
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Admin issue notification sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Admin notification error:', error);
        throw error;
    }
}

export async function sendIssueStatusUpdateNotification(params: {
    userEmail: string;
    userName: string;
    issue: any;
    oldStatus: string;
    newStatus: string;
}) {
    try {
        const statusLabels: { [key: string]: string } = {
            'open': '🟡 Open',
            'in-progress': '🔵 In Progress',
            'resolved': '🟢 Resolved',
        };
        const newLabel = statusLabels[params.newStatus] || params.newStatus;

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: params.userEmail,
            subject: `📢 Issue Update: "${params.issue.title}" is now ${newLabel}`,
            html: getStatusUpdateTemplate(params),
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Status update notification sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Status update notification error:', error);
        throw error;
    }
}

function getStatusUpdateTemplate(params: {
    userName: string;
    issue: any;
    oldStatus: string;
    newStatus: string;
}): string {
    const { userName, issue, oldStatus, newStatus } = params;

    const statusConfig: { [key: string]: { emoji: string; label: string; color: string; bg: string; border: string; message: string } } = {
        'open': { emoji: '🟡', label: 'Open', color: '#a16207', bg: '#fefce8', border: '#fde047', message: 'Your issue has been reopened and is awaiting review.' },
        'in-progress': { emoji: '🔵', label: 'In Progress', color: '#1d4ed8', bg: '#eff6ff', border: '#60a5fa', message: 'Great news! Your issue is now being actively worked on by our team.' },
        'resolved': { emoji: '🟢', label: 'Resolved', color: '#15803d', bg: '#f0fdf4', border: '#4ade80', message: 'Wonderful! Your issue has been resolved. Thank you for helping improve your community!' },
    };

    const newConf = statusConfig[newStatus] || statusConfig['open'];
    const oldConf = statusConfig[oldStatus] || statusConfig['open'];
    const issueUrl = `${process.env.NEXT_PUBLIC_APP_URL}/issues/${issue._id || issue.id}`;
    const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });

    const categoryEmojis: { [key: string]: string } = {
        'water-supply': '💧', 'puddle': '🌊', 'road': '🛣️', 'garbage': '🗑️',
        'electricity': '⚡', 'streetlight': '💡', 'other': '📝',
    };
    const catEmoji = categoryEmojis[issue.category] || '📝';

    // Progress steps
    const steps = ['open', 'in-progress', 'resolved'];
    const currentIdx = steps.indexOf(newStatus);
    const progressHtml = steps.map((step, i) => {
        const conf = statusConfig[step];
        const isActive = i <= currentIdx;
        const dotColor = isActive ? conf.color : '#d1d5db';
        const lineColor = i < currentIdx ? statusConfig[steps[i + 1]]?.color || '#d1d5db' : '#d1d5db';
        return `
            <td style="text-align: center; width: 33%;">
                <div style="width: 28px; height: 28px; border-radius: 50%; background-color: ${dotColor}; margin: 0 auto 6px auto; color: white; font-size: 14px; line-height: 28px;">${isActive ? '✓' : ''}</div>
                <p style="color: ${isActive ? conf.color : '#9ca3af'}; font-size: 11px; font-weight: ${isActive ? '700' : '500'}; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">${conf.label}</p>
            </td>`;
    }).join('');

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Issue Status Update</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
        <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(147, 51, 234, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #9333ea 0%, #7c3aed 50%, #6d28d9 100%); padding: 48px 32px 40px 32px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 12px;">📢</div>
                <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">Issue Status Updated!</h1>
                <p style="color: rgba(255, 255, 255, 0.85); margin: 8px 0 0 0; font-size: 15px;">Your voice is being heard</p>
                <div style="margin-top: 20px; display: inline-block; background-color: rgba(255, 255, 255, 0.18); padding: 6px 16px; border-radius: 20px;">
                    <span style="color: #ffffff; font-size: 12px; font-weight: 600;">📅 ${now}</span>
                </div>
            </div>

            <!-- Greeting -->
            <div style="padding: 32px 32px 0 32px;">
                <h2 style="color: #111827; font-size: 20px; font-weight: 600; margin: 0 0 8px 0;">Hi ${userName || 'there'} 👋</h2>
                <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin: 0;">${newConf.message}</p>
            </div>

            <!-- Status Change Card -->
            <div style="padding: 24px 32px;">
                <div style="background-color: ${newConf.bg}; border: 2px solid ${newConf.border}; border-radius: 16px; padding: 24px; text-align: center;">
                    <p style="color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px 0;">Status Changed</p>
                    <div style="display: flex; align-items: center; justify-content: center;">
                        <span style="background-color: ${oldConf.bg}; color: ${oldConf.color}; border: 1px solid ${oldConf.border}; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 700;">${oldConf.emoji} ${oldConf.label}</span>
                        <span style="font-size: 20px; margin: 0 12px; color: #9ca3af;">→</span>
                        <span style="background-color: ${newConf.bg}; color: ${newConf.color}; border: 2px solid ${newConf.border}; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 700;">${newConf.emoji} ${newConf.label}</span>
                    </div>
                </div>
            </div>

            <!-- Progress Tracker -->
            <div style="padding: 0 32px 24px 32px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>${progressHtml}</tr>
                </table>
            </div>

            <!-- Issue Details -->
            <div style="padding: 0 32px 24px 32px;">
                <div style="background: linear-gradient(135deg, #faf5ff 0%, #f5f3ff 100%); padding: 20px 24px; border-radius: 12px; border-left: 4px solid #9333ea;">
                    <p style="color: #7c3aed; font-size: 11px; font-weight: 700; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px;">${catEmoji} ${issue.category?.replace('-', ' ') || 'Issue'}</p>
                    <h3 style="color: #111827; font-size: 18px; font-weight: 700; margin: 0 0 8px 0; line-height: 1.4;">${issue.title}</h3>
                    <p style="color: #6b7280; font-size: 14px; margin: 0; line-height: 1.5;">${issue.address || ''}</p>
                </div>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; padding: 0 32px 32px 32px;">
                <a href="${issueUrl}" style="display: inline-block; background-color: #9333ea; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 12px rgba(147, 51, 234, 0.3);">
                    🔍 View Issue Details
                </a>
            </div>
            
            <!-- Footer -->
            <div style="background: linear-gradient(135deg, #faf5ff 0%, #f5f3ff 100%); padding: 24px 32px; border-top: 1px solid #e9d5ff; text-align: center;">
                <p style="color: #7c3aed; font-size: 14px; font-weight: 600; margin: 0;">🏛️ RaiseVoice</p>
                <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0 0;">Your voice matters. Thank you for helping improve your community.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

function getAdminIssueNotificationTemplate(issue: any): string {
    const categoryConfig: { [key: string]: { emoji: string; label: string; color: string; bg: string } } = {
        'water-supply': { emoji: '💧', label: 'Water Supply', color: '#0284c7', bg: '#e0f2fe' },
        'puddle': { emoji: '🌊', label: 'Waterlogging', color: '#0369a1', bg: '#e0f2fe' },
        'road': { emoji: '🛣️', label: 'Road Issue', color: '#b45309', bg: '#fef3c7' },
        'garbage': { emoji: '🗑️', label: 'Garbage', color: '#15803d', bg: '#dcfce7' },
        'electricity': { emoji: '⚡', label: 'Electricity', color: '#a16207', bg: '#fef9c3' },
        'streetlight': { emoji: '💡', label: 'Streetlight', color: '#7e22ce', bg: '#f3e8ff' },
        'other': { emoji: '📝', label: 'Other', color: '#6b7280', bg: '#f3f4f6' },
    };

    const cat = categoryConfig[issue.category] || categoryConfig['other'];
    const issueUrl = `${process.env.NEXT_PUBLIC_APP_URL}/issues/${issue._id || issue.id}`;
    const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });

    // Generate images HTML if any
    let imagesHtml = '';
    if (issue.images && issue.images.length > 0) {
        imagesHtml = `
        <div style="margin-top: 24px; padding: 0 32px;">
            <p style="color: #7c3aed; font-size: 11px; font-weight: 700; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 1px;">📸 Attached Images</p>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                ${issue.images.map((img: string) => `
                    <div style="width: 120px; height: 120px; border-radius: 8px; overflow: hidden; border: 1px solid #e9d5ff;">
                        <img src="${img}" alt="Issue visual" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                `).join('')}
            </div>
        </div>
        `;
    }

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Issue Reported</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
        <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(147, 51, 234, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #9333ea 0%, #7c3aed 50%, #6d28d9 100%); padding: 48px 32px 40px 32px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 12px;">🚨</div>
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">New Issue Reported!</h1>
                <p style="color: rgba(255, 255, 255, 0.85); margin: 8px 0 0 0; font-size: 15px;">A community member needs your attention</p>
                <div style="margin-top: 20px; display: inline-block; background-color: rgba(255, 255, 255, 0.18); padding: 6px 16px; border-radius: 20px;">
                    <span style="color: #ffffff; font-size: 12px; font-weight: 600;">📅 ${now}</span>
                </div>
            </div>

            <!-- Category Badge -->
            <div style="padding: 28px 32px 0 32px; text-align: center;">
                <div style="display: inline-block; background-color: ${cat.bg}; color: ${cat.color}; padding: 8px 20px; border-radius: 24px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;">
                    ${cat.emoji} ${cat.label}
                </div>
            </div>

            <!-- Issue Details -->
            <div style="padding: 24px 32px;">
                <h2 style="color: #111827; font-size: 22px; font-weight: 700; margin: 0 0 16px 0; line-height: 1.4; text-align: center;">${issue.title}</h2>
                <div style="background: linear-gradient(135deg, #faf5ff 0%, #f5f3ff 100%); padding: 20px 24px; border-radius: 12px; border-left: 4px solid #9333ea; margin-bottom: 28px;">
                    <p style="color: #4b5563; font-size: 15px; line-height: 1.7; margin: 0;">${issue.description}</p>
                </div>

                <!-- Info Cards -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
                    <tr>
                        <td style="padding: 0 6px 12px 0;" width="50%">
                            <div style="background-color: #faf5ff; border-radius: 12px; padding: 16px; border: 1px solid #e9d5ff;">
                                <p style="color: #7c3aed; font-size: 11px; font-weight: 700; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 1px;">📍 Location</p>
                                <p style="color: #374151; font-size: 14px; margin: 0; font-weight: 500; line-height: 1.4;">${issue.address || 'View on map →'}</p>
                            </div>
                        </td>
                        <td style="padding: 0 0 12px 6px;" width="50%">
                            <div style="background-color: #faf5ff; border-radius: 12px; padding: 16px; border: 1px solid #e9d5ff;">
                                <p style="color: #7c3aed; font-size: 11px; font-weight: 700; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 1px;">📊 Status</p>
                                <p style="color: #374151; font-size: 14px; margin: 0; font-weight: 500;">🟢 Open — Needs Review</p>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding: 0;">
                            <div style="background-color: #faf5ff; border-radius: 12px; padding: 16px; border: 1px solid #e9d5ff; text-align: center;">
                                <p style="color: #7c3aed; font-size: 11px; font-weight: 700; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 1px;">🕵️ Anonymity Policy</p>
                                <p style="color: #374151; font-size: 14px; margin: 0; font-weight: 500;">🔒 Reported anonymously to protect the citizen's identity.</p>
                            </div>
                        </td>
                    </tr>
                </table>

                ${imagesHtml}

                <!-- CTA Buttons -->
                <div style="text-align: center; margin: 32px 0 8px 0;">
                    <a href="${issueUrl}" style="display: inline-block; background-color: #9333ea; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 700; font-size: 14px; margin-right: 8px; box-shadow: 0 4px 12px rgba(147, 51, 234, 0.3);">
                        🌍 View on Map
                    </a>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="background: linear-gradient(135deg, #faf5ff 0%, #f5f3ff 100%); padding: 24px 32px; border-top: 1px solid #e9d5ff; text-align: center;">
                <p style="color: #7c3aed; font-size: 14px; font-weight: 600; margin: 0;">🏛️ RaiseVoice Admin Panel</p>
                <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0 0;">You're receiving this because you are an administrator. Reporter identity is hidden by default.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}