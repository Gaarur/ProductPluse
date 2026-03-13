import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendChangelogNotification({
  to,
  companyName,
  title,
  summary,
  changelogUrl,
}: {
  to: string[];
  companyName: string;
  title: string;
  summary: string;
  changelogUrl: string;
}) {
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
    to,
    subject: `🚀 ${companyName}: ${title}`,
    html: `
      <div style="font-family: Inter, system-ui, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a1a; color: #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #7c3aed, #4f46e5); padding: 32px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; color: white; font-weight: 700;">🚀 Product Update</h1>
          <p style="margin: 8px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">from ${companyName}</p>
        </div>
        <div style="padding: 32px;">
          <h2 style="font-size: 22px; font-weight: 600; color: #a78bfa; margin-top: 0;">${title}</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #94a3b8;">${summary}</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${changelogUrl}" style="background: linear-gradient(135deg, #7c3aed, #4f46e5); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px;">
              View Full Changelog →
            </a>
          </div>
          <hr style="border: none; border-top: 1px solid #1e293b; margin: 24px 0;" />
          <p style="font-size: 12px; color: #475569; text-align: center; margin: 0;">
            You're receiving this because you subscribed to updates from ${companyName}.<br/>
            <a href="${changelogUrl}/unsubscribe" style="color: #7c3aed;">Unsubscribe</a>
          </p>
        </div>
      </div>
    `,
  });

  if (error) throw new Error(`Failed to send email: ${error.message}`);
}

export async function sendWelcomeEmail({
  to,
  name,
}: {
  to: string;
  name?: string;
}) {
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
    to: [to],
    subject: "Welcome to ProductPulse! 🎉",
    html: `
      <div style="font-family: Inter, system-ui, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a1a; color: #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #7c3aed, #4f46e5); padding: 32px; text-align: center;">
          <h1 style="margin: 0; font-size: 32px; color: white;">Welcome to ProductPulse ✨</h1>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #a78bfa;">Hey ${name || "there"}! 👋</h2>
          <p style="color: #94a3b8; line-height: 1.6;">You're all set. Start by setting up your feedback board, publishing your first changelog, or building out your product roadmap.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display:inline-block; background: linear-gradient(135deg, #7c3aed, #4f46e5); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; margin-top: 16px;">Go to Dashboard →</a>
        </div>
      </div>
    `,
  });
}
