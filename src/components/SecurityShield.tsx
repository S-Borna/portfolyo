'use client';

import { useEffect } from 'react';
import { initSecurityShield } from '@/lib/security';

export function SecurityShield() {
    useEffect(() => {
        // Only enable in production
        if (process.env.NODE_ENV === 'production') {
            initSecurityShield();
        }
    }, []);

    return null;
}
