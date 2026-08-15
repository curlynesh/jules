/**
 * Psychometric Validation Engine
 * Implements scientific reliability and validity checks on assessment data.
 */

/**
 * Calculates Cronbach's Alpha for internal consistency.
 *
 * Alpha >= 0.9 Excellent
 * Alpha >= 0.8 Good
 * Alpha >= 0.7 Acceptable
 * Alpha < 0.6 Questionable
 *
 * @param items Matrix of responses across multiple items measuring the same construct.
 * @returns number (Cronbach's Alpha)
 */
export function calculateCronbachAlpha(items: number[][]): number {
    if (items.length === 0 || items[0].length === 0) return 0;

    const k = items.length; // Number of items/questions
    let sumOfVariances = 0;

    const totalScores: number[] = new Array(items[0].length).fill(0);

    // Calculate variance for each item
    for (let i = 0; i < k; i++) {
        const itemScores = items[i];
        const mean = itemScores.reduce((a, b) => a + b, 0) / itemScores.length;
        const variance = itemScores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (itemScores.length - 1 || 1);

        sumOfVariances += variance;

        // Sum total scores for each respondent
        for (let j = 0; j < itemScores.length; j++) {
            totalScores[j] += itemScores[j];
        }
    }

    // Calculate variance of the total scores
    const totalMean = totalScores.reduce((a, b) => a + b, 0) / totalScores.length;
    const varianceOfTotalScores = totalScores.reduce((a, b) => a + Math.pow(b - totalMean, 2), 0) / (totalScores.length - 1 || 1);

    if (varianceOfTotalScores === 0) return 0; // Prevent division by zero

    const alpha = (k / (k - 1)) * (1 - (sumOfVariances / varianceOfTotalScores));
    return parseFloat(alpha.toFixed(2));
}

/**
 * Reverses a Likert scale score.
 * Used for reverse-coded items to prevent acquiescence bias (yea-saying).
 * @param score The raw score
 * @param maxScale The maximum possible score on the scale (e.g. 5 for a 1-5 Likert)
 */
export function reverseScore(score: number, maxScale: number): number {
    // Formula: (Max + 1) - Score
    return (maxScale + 1) - score;
}

/**
 * Calculates a basic confidence score (0-100%) for an individual's assessment.
 * A real engine would base this on attention checks, reverse-coded consistency, and hesitation metrics.
 */
export function calculateProfileConfidence(
    hesitationCount: number,
    averageResponseTimeMs: number
): number {
    let confidence = 100;

    // Penalty for suspected rapid-clicking (less than 1.5s per question on average)
    if (averageResponseTimeMs < 1500) {
        confidence -= 30;
    }

    // High hesitation might indicate confusion with the instrument, slightly lowering confidence
    if (hesitationCount > 5) {
        confidence -= 10;
    }

    return Math.max(0, confidence);
}
