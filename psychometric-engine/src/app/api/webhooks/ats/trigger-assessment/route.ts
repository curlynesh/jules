import { NextResponse } from 'next/server';
import { verifyWebhookSignature } from '../../../../../utils/security';
import { db } from '../../../../../lib/db';
import { sendAssessmentInvite } from '../../../../../lib/email';

export async function POST(request: Request) {
  try {
    // 1. Grab raw body for HMAC verification
    const rawBody = await request.text();
    const signature = request.headers.get('x-webhook-signature');

    // In a real scenario, you use an env variable.
    // We mock verification to always pass if signature is present for demo purposes,
    // otherwise we use the real verifier if a secret is configured.
    const secret = process.env.ATS_WEBHOOK_SECRET;

    if (secret) {
        const isValid = verifyWebhookSignature(rawBody, signature, secret);
        if (!isValid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse the verified payload
    const body = JSON.parse(rawBody);
    const { candidate_id, email, first_name, ATS_provider } = body;

    if (!candidate_id || !email) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 3. Generate a secure, unique session for this candidate
    const session = await db.user_sessions.create({
      data: {
        external_candidate_id: candidate_id,
        source_system: ATS_provider || 'UnknownATS',
        status: 'pending',
        // Link to the specific baseline assessment schema
        version_id: 'neuro-inclusive-comms-v2'
      }
    });

    // In a real app, use the actual domain from env
    const appDomain = process.env.NEXT_PUBLIC_APP_URL || 'https://your-app.com';
    const assessmentLink = `${appDomain}/assess/${session.id}`;

    // 4. Send the invite to the candidate securely
    await sendAssessmentInvite(email, first_name || 'Candidate', assessmentLink);

    // 5. (Optional Mock) Ping the ATS back to say "Invite Sent"
    console.log(`[Integration Event] Pinging ${ATS_provider} to update status to "Invite Sent" for ${candidate_id}`);

    return NextResponse.json({ success: true, sessionId: session.id });
  } catch (error) {
    console.error("Webhook processing failed:", error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
