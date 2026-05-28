import { Resend } from 'resend'

function getClient() {
  if (!process.env.RESEND_API_KEY) throw new Error('SMTP not configured')
  return new Resend(process.env.RESEND_API_KEY)
}

const FROM = 'JS.hub <onboarding@resend.dev>'

const baseCard = (title, subtitle, otp, note) => `
  <div style="font-family:monospace;max-width:480px;margin:0 auto;padding:32px 24px;background:#13131F;color:#E8E8F0;border-radius:12px;border:1px solid rgba(255,255,255,0.07)">
    <p style="margin:0 0 4px;font-size:18px;font-weight:700;color:#F7DF1E">JS<span style="color:#E8E8F0">.hub</span></p>
    <p style="margin:0 0 28px;font-size:13px;color:#7A8299">${subtitle}</p>
    <p style="margin:0 0 16px;font-size:14px;color:#7A8299">${title}</p>
    <div style="font-size:38px;font-weight:700;letter-spacing:14px;color:#F7DF1E;background:#0D0D14;padding:20px 0;border-radius:8px;text-align:center;margin:0 0 24px">${otp}</div>
    <p style="margin:0;font-size:13px;color:#7A8299">${note}</p>
  </div>
`

export function sendVerificationEmail(to, otp) {
  return getClient().emails.send({
    from: FROM,
    to,
    subject: 'Verify your JS.hub account',
    text: `Your verification code is: ${otp}\n\nExpires in 10 minutes.`,
    html: baseCard(
      'Your verification code:',
      'Almost there — confirm your email to activate your account.',
      otp,
      'Expires in <strong style="color:#E8E8F0">10 minutes</strong>. If you didn\'t create an account, you can safely ignore this email.'
    ),
  })
}

export function sendOtpEmail(to, otp) {
  return getClient().emails.send({
    from: FROM,
    to,
    subject: 'Your JS.hub password reset code',
    text: `Your reset code is: ${otp}\n\nExpires in 10 minutes.`,
    html: baseCard(
      'Your reset code:',
      'Password reset request',
      otp,
      'Expires in <strong style="color:#E8E8F0">10 minutes</strong>. If you didn\'t request this, you can safely ignore this email.'
    ),
  })
}
