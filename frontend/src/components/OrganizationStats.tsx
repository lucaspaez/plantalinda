// components/OrganizationStats.tsx
'use client';

import { useState, useEffect } from 'react';
import { organizationService, OrganizationStats as StatsType } from '@/services/organizationService';

export default function OrganizationStats() {
    const [stats, setStats] = useState<StatsType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await organizationService.getStats();
            setStats(data);
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!stats) return null;

    const planColors: Record<string, string> = {
        FREE: 'bg-gray-100 text-gray-800',
        PRO: 'bg-blue-100 text-blue-800',
        ENTERPRISE: 'bg-purple-100 text-purple-800'
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Organization Name */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Organización</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">
                            {stats.organizationName}
                        </h3>
                    </div>
                    <div className="flex-shrink-0">
                        <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Plan */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Plan Actual</p>
                        <div className="mt-2">
                            <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${planColors[stats.plan] || 'bg-gray-100 text-gray-800'}`}>
                                {stats.plan}
                            </span>
                        </div>
                    </div>
                    <div className="flex-shrink-0">
                        <svg className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Users */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Usuarios</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">
                            {stats.userCount}
                            {stats.maxUsers && <span className="text-gray-400"> / {stats.maxUsers}</span>}
                        </h3>
                        {!stats.canAddUsers && (
                            <p className="text-xs text-red-600 mt-1">Límite alcanzado</p>
                        )}
                    </div>
                    <div className="flex-shrink-0">
                        <svg className="h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
