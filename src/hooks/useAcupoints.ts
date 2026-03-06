import { useState, useEffect } from 'react';
import { Acupoint } from '../types';

export const useAcupoints = () => {
    const [acupoints, setAcupoints] = useState<Acupoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAcupoints = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/acupoints');
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.statusText}`);
                }
                const data = await response.json();
                setAcupoints(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching acupoints:', err);
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchAcupoints();
    }, []);

    return { acupoints, loading, error };
};
