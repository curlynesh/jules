import crypto from 'crypto';

/**
 * Verifies the signature of an incoming webhook payload using HMAC-SHA256.
 *
 * @param payload The raw request body as a string.
 * @param signature The signature provided in the headers (e.g., `x-webhook-signature`).
 * @param secret The pre-shared secret key configured in the ATS/Middleware provider.
 * @returns boolean True if the signature is valid, false otherwise.
 */
export function verifyWebhookSignature(payload: string, signature: string | null, secret: string | undefined): boolean {
  if (!signature || !secret) {
    return false;
  }

  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    // Use timingSafeEqual to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    );
  } catch (error) {
    console.error("Signature verification failed:", error);
    return false;
  }
}
