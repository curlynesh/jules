import { ScoringRule, TraitMetadata, TraitProfile } from '../types/schema';

export type UserResponses = Record<string, string | number | boolean>;
export type RawTraitScores = Record<string, number>;

export function calculateRawTraits(
  responses: UserResponses,
  rules: ScoringRule[]
): RawTraitScores {
  const scores: RawTraitScores = {};

  // 1. Iterate through all scoring rules defined in the JSON schema
  for (const rule of rules) {
    const userAnswer = responses[rule.node_id];

    // 2. If the user's answer matches the rule's target option
    // (Ensure types match during comparison, mostly dealing with string/number options)
    if (userAnswer !== undefined && rule.option_id !== undefined && String(userAnswer) === String(rule.option_id)) {

      // 3. Initialize the trait category if it doesn't exist yet
      if (scores[rule.trait_category] === undefined) {
        scores[rule.trait_category] = 0;
      }

      // 4. Add the weight to the trait
      scores[rule.trait_category] += rule.weight_modifier;
    }
  }

  return scores;
}

export function generateOperatingManual(
  rawScores: RawTraitScores,
  traitMetadata?: Record<string, TraitMetadata>
): TraitProfile[] {
  const profiles: TraitProfile[] = [];

  if (!traitMetadata) return profiles;

  for (const [trait, rawScore] of Object.entries(rawScores)) {
    const meta = traitMetadata[trait];
    if (!meta) continue;

    // Normalize to 0-100 scale
    const normalizedScore = Math.min(100, Math.max(0, (rawScore / meta.maxPossibleScore) * 100));

    // Find the applicable threshold (assume thresholds are sorted, or sort them here, but we will just find the first that matches max)
    // To be safe, sort by max ascending
    const sortedThresholds = [...meta.thresholds].sort((a, b) => a.max - b.max);

    const threshold = sortedThresholds.find(t => normalizedScore <= t.max)
      || sortedThresholds[sortedThresholds.length - 1]; // Fallback to highest if somehow exceeded

    if (threshold) {
        profiles.push({
        traitName: trait.replace(/_/g, ' '),
        score: Math.round(normalizedScore),
        workingStyle: threshold.style,
        environmentNeed: threshold.need
        });
    }
  }

  return profiles;
}
