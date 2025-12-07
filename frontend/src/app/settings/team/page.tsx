// app/settings/team/page.tsx
'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ProGuard from '@/components/ProGuard';
import RoleGuard from '@/components/RoleGuard';
import TeamMemberList from '@/components/TeamMemberList';
import InviteUserModal from '@/components/InviteUserModal';

export default function TeamPage() {
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleInviteSuccess = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <ProGuard feature="Gestión de Equipo">
            <RoleGuard requiredPermission="canViewTeam" feature="Gestión de Equipo">
                <DashboardLayout>
                    <div className="max-w-7xl mx-auto space-y-8">
                        {/* Page Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900">Gestión de Equipo</h1>
                            <p className="text-gray-600 mt-2">
                                Administra los miembros de tu organización y sus permisos
                            </p>
                        </div>

                        {/* Team Member List */}
                        <TeamMemberList
                            key={refreshKey}
                            onInviteClick={() => setShowInviteModal(true)}
                        />

                        {/* Invite Modal */}
                        <InviteUserModal
                            isOpen={showInviteModal}
                            onClose={() => setShowInviteModal(false)}
                            onSuccess={handleInviteSuccess}
                        />

                        {/* Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                                        <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-sm font-medium text-gray-900">Propietario</h3>
                                        <p className="text-xs text-gray-600 mt-1">Control total de la organización</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                                        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-sm font-medium text-gray-900">Administrador</h3>
                                        <p className="text-xs text-gray-600 mt-1">Gestiona usuarios y configuración</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-sm font-medium text-gray-900">Gerente</h3>
                                        <p className="text-xs text-gray-600 mt-1">Ve reportes y gestiona operaciones</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Help Section */}
                        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-blue-900 mb-2">
                                💡 Sobre los roles
                            </h3>
                            <ul className="space-y-2 text-sm text-blue-800">
                                <li className="flex items-start">
                                    <span className="font-medium mr-2">•</span>
                                    <span><strong>Operador:</strong> Puede crear bitácoras diarias y diagnósticos</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="font-medium mr-2">•</span>
                                    <span><strong>Gerente:</strong> Puede ver reportes y gestionar cultivos</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="font-medium mr-2">•</span>
                                    <span><strong>Administrador:</strong> Puede invitar usuarios y asignar roles</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="font-medium mr-2">•</span>
                                    <span><strong>Visualizador:</strong> Solo puede ver datos, sin modificar</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </DashboardLayout>
            </RoleGuard>
        </ProGuard>
    );
}
