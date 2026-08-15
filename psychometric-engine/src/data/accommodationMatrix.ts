import { AccommodationMatrixEntry, Accommodation } from '../types/accommodations';

export const ACCOMMODATION_MATRIX: AccommodationMatrixEntry[] = [
  {
    trait_condition: { trait: "Context Switching Friction", min_score: 50 },
    suggested_accommodations: [
      {
        id: "acc_noise_canceling",
        category: "Equipment",
        title: "Active Noise-Canceling Headphones",
        description: "Company-provided high-fidelity noise-canceling headphones (e.g., Sony WH-1000XM5 or Bose 700).",
        business_justification: "Dramatically reduces context-switching time lost to auditory distractions, allowing for extended deep-focus blocks."
      },
      {
        id: "acc_async_comms",
        category: "Communication",
        title: "Asynchronous-First Communication",
        description: "Exemption from immediate Slack/Teams responses. Expectations set for end-of-day or 24-hour turnaround for non-emergencies.",
        business_justification: "Prevents workflow derailment and ensures responses to complex queries are thoroughly researched and accurate."
      }
    ]
  },
  {
    trait_condition: { trait: "Context Switching Fluidity", min_score: 50 },
    suggested_accommodations: [
       {
           id: "acc_multi_monitor",
           category: "Equipment",
           title: "Multi-Monitor Setup",
           description: "Provision of 2 or 3 high-resolution external monitors.",
           business_justification: "Supports rapid context switching and highly fluid multitasking without losing visual state."
       }
    ]
  }
];

export function getRecommendedAccommodations(profiles: { traitName: string; score: number }[]) {
    const recommendations = new Map<string, Accommodation>();

    profiles.forEach(profile => {
        const matches = ACCOMMODATION_MATRIX.filter(entry => {
            if (entry.trait_condition.trait !== profile.traitName) return false;
            if (entry.trait_condition.min_score !== undefined && profile.score < entry.trait_condition.min_score) return false;
            if (entry.trait_condition.max_score !== undefined && profile.score > entry.trait_condition.max_score) return false;
            return true;
        });

        matches.forEach(match => {
            match.suggested_accommodations.forEach(acc => {
                recommendations.set(acc.id, acc);
            });
        });
    });

    return Array.from(recommendations.values());
}
