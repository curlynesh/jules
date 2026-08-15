import { NextResponse } from 'next/server';
import { calculateRawTraits, generateOperatingManual, RawTraitScores } from '../../../../utils/scoring';
import sampleAssessment from '../../../../data/sampleAssessment.json';
import { AssessmentSchema, TraitProfile } from '../../../../types/schema';

// This acts as our mock database for the example
const mockDb = {
    getAssessmentSchema: async (): Promise<AssessmentSchema> => {
        // In reality, this queries the DB for the specific version
        return sampleAssessment as AssessmentSchema;
    },
    getUserResponses: async () => {
        // In reality, this fetches from the user_responses table
        // For the mock, we will rely on the body payload passing the responses
        return {};
    },
    saveResults: async (sessionId: string) => {
        console.log(`Saved final results for session ${sessionId}`);
    }
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, assessmentId, responses } = body;

    if (!sessionId || !assessmentId || !responses) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Fetch the assessment blueprint
    const schema = await mockDb.getAssessmentSchema();

    // 2. Run the math
    const rawScores = calculateRawTraits(responses, schema.scoring_rules);

    // 3. Generate the insights
    const operatingManual = generateOperatingManual(rawScores, schema.trait_metadata);

    // 4. Save the final results to the database
    await mockDb.saveResults(sessionId);

    // 5. Return the "Personal Operating Manual" to the frontend
    return NextResponse.json({
        success: true,
        rawScores,
        profile: operatingManual
    });

  } catch (error) {
    console.error("Scoring Error:", error);
    return NextResponse.json(
      { error: "Failed to process assessment results" },
      { status: 500 }
    );
  }
}
