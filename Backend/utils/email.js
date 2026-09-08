// utils/email.js
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationCode(email, code) {
  await resend.emails.send({
    from: 'PlayVerse <onboarding@resend.dev>',
    to: email,
    subject: 'Your PlayVerse verification code',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h1 style="color: #22c55e;">Verify your email</h1>
        <p>Enter this code on PlayVerse to continue:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; background: #111; color: #22c55e; padding: 16px 24px; border-radius: 8px; text-align: center; margin: 16px 0;">
          ${code}
        </div>
        <p style="color: #888; font-size: 13px;">This code expires in 10 minutes.</p>
      </div>
    `
  })
}