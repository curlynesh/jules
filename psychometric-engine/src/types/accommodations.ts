export interface Accommodation {
    id: string;
    category: "Environment" | "Communication" | "Equipment" | "Schedule";
    title: string;
    description: string;
    business_justification: string;
}

export interface AccommodationMatrixEntry {
    trait_condition: {
        trait: string;
        min_score?: number;
        max_score?: number;
    };
    suggested_accommodations: Accommodation[];
}

export type DisclosureLevel = 'needs_based' | 'broad_neurodivergent' | 'full_medical';

export interface DisclosureConfig {
    level: DisclosureLevel;
    diagnosis?: string; // e.g. "ADHD", "Autism" required if level === 'full_medical'
}
