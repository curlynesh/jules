/**
 * Mock Database Client
 * Simulates a Prisma/Postgres connection for Enterprise ATS/HRIS integrations.
 */
import crypto from 'crypto';

interface UserSessionCreateInput {
  external_candidate_id: string;
  source_system: string;
  status: 'pending' | 'in-progress' | 'completed';
  version_id: string;
}

interface ConsentLogCreateInput {
  user_id: string;
  action: 'SHARED_WITH_MANAGER' | 'EXPORTED_PDF' | 'REVOKED_ACCESS' | 'DATA_ANONYMIZED';
  target_email?: string;
  ip_address: string;
}

export const db = {
  user_sessions: {
    create: async ({ data }: { data: UserSessionCreateInput }) => {
      // Simulate DB write latency
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        id: crypto.randomUUID(),
        ...data,
        created_at: new Date().toISOString()
      };
    }
  },
  consent_logs: {
    create: async ({ data }: { data: ConsentLogCreateInput }) => {
       await new Promise(resolve => setTimeout(resolve, 100));
       return {
           id: crypto.randomUUID(),
           ...data,
           timestamp: new Date().toISOString()
        };
    }
  }
};
