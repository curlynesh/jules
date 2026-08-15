import { create } from 'zustand';

interface SharedLink {
    id: string;
    label: string;
    createdAt: string;
    expiresAt?: string;
    status: 'active' | 'revoked';
}

interface PrivacyState {
    sharedLinks: SharedLink[];
    generateLink: (label: string, expiresInDays?: number) => string;
    revokeLink: (id: string) => void;
}

export const usePrivacyStore = create<PrivacyState>((set) => ({
    sharedLinks: [
        {
            id: 'mock-hr-link-1',
            label: 'HR Accommodations Request',
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            status: 'active'
        }
    ],

    generateLink: (label, expiresInDays) => {
        const id = 'link-' + Date.now();
        const newLink: SharedLink = {
            id,
            label,
            createdAt: new Date().toISOString(),
            expiresAt: expiresInDays ? new Date(Date.now() + expiresInDays * 86400000).toISOString() : undefined,
            status: 'active'
        };

        set(state => ({
            sharedLinks: [newLink, ...state.sharedLinks]
        }));

        return `https://app.com/share/${id}`;
    },

    revokeLink: (id) => {
        set(state => ({
            sharedLinks: state.sharedLinks.map(link =>
                link.id === id ? { ...link, status: 'revoked' } : link
            )
        }));
    }
}));
