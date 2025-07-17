import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, agentName, draftEmail } = body;
    console.log('[SEND-OFFERS] Incoming request body:', body);
    if (!email || !agentName || !draftEmail) {
      console.error('[SEND-OFFERS] Missing or invalid email, agentName, or draftEmail:', { email, agentName, draftEmail });
      return NextResponse.json({ error: 'Missing or invalid email, agent name, or draftEmail.' }, { status: 400 });
    }

    // Instantiate Resend inside the handler
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error('[RESEND ERROR] RESEND_API_KEY is not set in environment variables.');
      return NextResponse.json({ error: 'RESEND_API_KEY is not set on the server.' }, { status: 500 });
    }
    console.log('[SEND-OFFERS] RESEND_API_KEY is set:', !!resendApiKey);
    const resend = new Resend(resendApiKey);

    const emailPayload = {
      from: 'onboarding@resend.dev',
      to: email,
      subject: `Property Offers from ${agentName}`,
      html: draftEmail,
    };
    console.log('[SEND-OFFERS] Sending email with payload:', emailPayload);

    // Send the email using Resend
    const sendResult = await resend.emails.send(emailPayload);
    console.log('[SEND-OFFERS] Resend sendResult:', sendResult);

    if (sendResult.error) {
      console.error('[RESEND ERROR]', sendResult.error);
      return NextResponse.json({ error: 'Failed to send email.', details: sendResult.error }, { status: 500 });
    }

    return NextResponse.json({ sent: true, sendResult });
  } catch (error) {
    console.error('[ERROR] Email send API:', error);
    return NextResponse.json({ error: 'Failed to send email.', details: error }, { status: 500 });
  }
} 