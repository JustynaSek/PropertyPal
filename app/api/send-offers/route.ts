import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, agentName, draftEmail } = body;
    if (!email || !agentName || !draftEmail) {
      return NextResponse.json({ error: 'Missing or invalid email, agent name, or draftEmail.' }, { status: 400 });
    }

    // Instantiate Resend inside the handler
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error('[RESEND ERROR] RESEND_API_KEY is not set in environment variables.');
      return NextResponse.json({ error: 'RESEND_API_KEY is not set on the server.' }, { status: 500 });
    }
    const resend = new Resend(resendApiKey);

    // Send the email using Resend
    const sendResult = await resend.emails.send({
      from: 'Real Estate Agent <noreply@yourdomain.com>',
      to: email,
      subject: `Property Offers from ${agentName}`,
      html: draftEmail,
    });

    if (sendResult.error) {
      console.error('[RESEND ERROR]', sendResult.error);
      return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 });
    }

    return NextResponse.json({ sent: true });
  } catch (error) {
    console.error('[ERROR] Email send API:', error);
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 });
  }
} 