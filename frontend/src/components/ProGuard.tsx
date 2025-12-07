'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from './DashboardLayout';
import { Shield } from 'lucide-react';

interface ProGuardProps {
    children: ReactNode;
    feature?: string;
}

/**
 * Componente que protege páginas que requieren plan PRO.
 * Verifica el plan del JWT antes de renderizar el contenido.
 * Si el usuario es FREE, redirige a /upgrade.
 */
export default function ProGuard({ children, feature = 'esta funcionalidad' }: ProGuardProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isPro, setIsPro] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const plan = payload.plan || 'FREE';

            if (plan === 'PRO' || plan === 'ENTERPRISE') {
                setIsPro(true);
            } else {
                // Usuario FREE intentando acceder a página PRO
                setIsPro(false);
            }
        } catch (e) {
            console.error('Error parsing token:', e);
            router.push('/login');
            return;
        }

        setIsLoading(false);
    }, [router]);

    // Mostrar loading mientras verifica
    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="text-xl text-gray-600 dark:text-gray-400">
                        Verificando acceso...
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // Usuario FREE - mostrar mensaje de upgrade
    if (!isPro) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md text-center border border-gray-200 dark:border-gray-700">
                        <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Shield className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                            Función PRO
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {feature} está disponible solo para usuarios con plan PRO o Enterprise.
                        </p>
                        <button
                            onClick={() => router.push('/upgrade')}
                            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-semibold transition-colors"
                        >
                            Ver Planes PRO
                        </button>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="w-full mt-3 text-gray-600 dark:text-gray-400 py-2 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            Volver al Dashboard
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // Usuario PRO - mostrar contenido
    return <>{children}</>;
}
