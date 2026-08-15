import { AssessmentRunner } from '../components/assessment/AssessmentRunner';
import sampleAssessment from '../data/sampleAssessment.json';
import { AssessmentSchema } from '../types/schema';

export default function Home() {
  return (
    <AssessmentRunner schema={sampleAssessment as AssessmentSchema} />
  );
}
