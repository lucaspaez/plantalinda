'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserRoleAndPlan, hasPermission, getRoleLabel, Role, RolePermissions } from '@/utils/permissions';

interface RoleGuardProps {
    children: React.ReactNode;
    requiredPermission: keyof RolePermissions;
    feature?: string;
    fallbackUrl?: string;
}

/**
 * Componente que protege rutas basándose en el rol del usuario.
 * Si el usuario no tiene el permiso requerido, muestra un mensaje o redirige.
 */
export default function RoleGuard({
    children,
    requiredPermission,
    feature = 'Esta funcionalidad',
    fallbackUrl
}: RoleGuardProps) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const [userRole, setUserRole] = useState<Role>('VIEWER');

    useEffect(() => {
        const { role } = getUserRoleAndPlan();
        setUserRole(role);

        const hasAccess = hasPermission(role, requiredPermission);
        setIsAuthorized(hasAccess);

        if (!hasAccess && fallbackUrl) {
            router.push(fallbackUrl);
        }
    }, [requiredPermission, fallbackUrl, router]);

    // Mientras carga
    if (isAuthorized === null) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    // Si no tiene permiso
    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Acceso Restringido
                    </h2>

                    <p className="text-gray-600 mb-6">
                        {feature} no está disponible para tu rol actual: <strong>{getRoleLabel(userRole)}</strong>.
                    </p>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
                        <p className="text-sm text-yellow-800">
                            <strong>💡 Permisos de tu rol:</strong>
                        </p>
                        <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                            {userRole === 'OPERATOR' && (
                                <>
                                    <li>✅ Crear diagnósticos con IA</li>
                                    <li>✅ Crear entradas de bitácora</li>
                                    <li>❌ Ver reportes o inventario</li>
                                </>
                            )}
                            {userRole === 'VIEWER' && (
                                <>
                                    <li>✅ Ver datos y reportes</li>
                                    <li>❌ Crear o modificar datos</li>
                                </>
                            )}
                            {userRole === 'MANAGER' && (
                                <>
                                    <li>✅ Ver reportes</li>
                                    <li>✅ Gestionar lotes e inventario</li>
                                    <li>❌ Invitar usuarios</li>
                                </>
                            )}
                        </ul>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                        >
                            Ir al Dashboard
                        </button>
                        <button
                            onClick={() => router.back()}
                            className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                        >
                            Volver
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Si tiene permiso, renderizar children
    return <>{children}</>;
}
