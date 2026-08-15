/**
 * Mock Email Service
 * Simulates sending secure assessment invitations to candidates.
 */

export async function sendAssessmentInvite(email: string, firstName: string, link: string) {
    // Simulate network latency to an email provider like SendGrid/Postmark
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log(`
      ================================================
      EMAIL DISPATCHED
      To: ${email}
      Subject: Action Required: Neuro-inclusive Profile Assessment

      Hi ${firstName},

      You've reached the next stage in the interview process.
      Please complete your profile configuration securely using the link below:
      ${link}

      ================================================
    `);

    return true;
  }
