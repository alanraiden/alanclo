import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'alansarang21@gmail.com',
      subject: `Portfolio message from ${name}`,
      html: `
        <div style="font-family:monospace;background:#03070f;color:#e8f0ed;padding:32px;border-radius:12px;max-width:560px">
          <h2 style="color:#00F5D2;margin:0 0 20px">📬 New message from your portfolio</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr>
              <td style="color:#6b9e94;padding:8px 0;width:80px">Name</td>
              <td style="color:#e8f0ed;padding:8px 0">${name}</td>
            </tr>
            <tr>
              <td style="color:#6b9e94;padding:8px 0">Email</td>
              <td style="padding:8px 0"><a href="mailto:${email}" style="color:#00F5D2">${email}</a></td>
            </tr>
            <tr>
              <td style="color:#6b9e94;padding:8px 0;vertical-align:top">Message</td>
              <td style="color:#e8f0ed;padding:8px 0;line-height:1.7">${message.replace(/\n/g, '<br/>')}</td>
            </tr>
          </table>
          <p style="margin:28px 0 0;color:#6b9e94;font-size:11px">Sent via alan.cloud portfolio contact form</p>
        </div>
      `,
      replyTo: email,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Resend error:', err)
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 })
  }
}
