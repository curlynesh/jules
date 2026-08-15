import { NextResponse } from 'next/server';

// Mock DB call
const fetchAnonymizedResults = async () => {
    // In a real application, this pulls from a data warehouse where PII is stripped.
    return [
        { session_id: 'anon-1', trait_scores: { "Context_Switching_Friction": 75 }, avg_time_ms: 4500, total_hesitations: 2 },
        { session_id: 'anon-2', trait_scores: { "Context_Switching_Friction": 40 }, avg_time_ms: 1200, total_hesitations: 0 },
        { session_id: 'anon-3', trait_scores: { "Context_Switching_Friction": 90 }, avg_time_ms: 6000, total_hesitations: 5 },
    ];
};

export async function GET(request: Request) {
    try {
        // Authenticate: Ensure only authorized psychometricians/researchers can hit this endpoint.
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.RESEARCH_API_KEY || 'test_key'}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await fetchAnonymizedResults();

        // Check if format query param is CSV
        const { searchParams } = new URL(request.url);
        const format = searchParams.get('format');

        if (format === 'csv') {
            // Convert to basic CSV for SPSS/R import
            const headers = ['session_id', 'avg_time_ms', 'total_hesitations', 'Context_Switching_Friction'];
            const rows = data.map(row => [
                row.session_id,
                row.avg_time_ms,
                row.total_hesitations,
                row.trait_scores['Context_Switching_Friction'] || 0
            ].join(','));

            const csvContent = [headers.join(','), ...rows].join('\n');

            return new NextResponse(csvContent, {
                headers: {
                    'Content-Type': 'text/csv',
                    'Content-Disposition': 'attachment; filename="anonymized_research_data.csv"'
                }
            });
        }

        // Default JSON
        return NextResponse.json({ data });

    } catch (error) {
        console.error("Research Export Error:", error);
        return NextResponse.json({ error: "Failed to export data" }, { status: 500 });
    }
}
