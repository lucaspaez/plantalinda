// components/TeamMemberList.tsx
'use client';

import { useState, useEffect } from 'react';
import { organizationService, TeamMember } from '@/services/organizationService';
import { currentUserHasPermission } from '@/utils/permissions';

interface TeamMemberListProps {
    onInviteClick: () => void;
}

const roleLabels: Record<string, string> = {
    OWNER: 'Propietario',
    ADMIN: 'Administrador',
    MANAGER: 'Gerente',
    OPERATOR: 'Operador',
    VIEWER: 'Visualizador'
};

const roleColors: Record<string, string> = {
    OWNER: 'bg-purple-100 text-purple-800',
    ADMIN: 'bg-blue-100 text-blue-800',
    MANAGER: 'bg-green-100 text-green-800',
    OPERATOR: 'bg-yellow-100 text-yellow-800',
    VIEWER: 'bg-gray-100 text-gray-800'
};

export default function TeamMemberList({ onInviteClick }: TeamMemberListProps) {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalMembers, setTotalMembers] = useState(0);
    const [maxMembers, setMaxMembers] = useState<number | null>(null);
    const [canAddMore, setCanAddMore] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadTeamMembers();
    }, []);

    const loadTeamMembers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await organizationService.getTeamMembers();
            setMembers(response.members);
            setTotalMembers(response.totalMembers);
            setMaxMembers(response.maxMembers === -1 ? null : response.maxMembers);
            setCanAddMore(response.canAddMore);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar miembros del equipo');
            console.error('Error loading team members:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveMember = async (userId: number, email: string) => {
        if (!confirm(`¿Estás seguro de eliminar a ${email}?`)) {
            return;
        }

        try {
            await organizationService.removeUser(userId);
            await loadTeamMembers();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error al eliminar usuario');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
                <button
                    onClick={loadTeamMembers}
                    className="mt-2 text-red-600 hover:text-red-800 font-medium"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Equipo</h2>
                    <p className="text-gray-600 mt-1">
                        {totalMembers} {totalMembers === 1 ? 'miembro' : 'miembros'}
                        {maxMembers && ` de ${maxMembers} máximo`}
                    </p>
                </div>
                {canAddMore && currentUserHasPermission('canInviteUsers') && (
                    <button
                        onClick={onInviteClick}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        + Invitar Usuario
                    </button>
                )}
            </div>

            {/* Members List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Usuario
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Rol
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {members.map((member) => (
                            <tr key={member.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {member.firstname} {member.lastname}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-600">{member.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${roleColors[member.role] || 'bg-gray-100 text-gray-800'}`}>
                                        {roleLabels[member.role] || member.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {member.role !== 'OWNER' && currentUserHasPermission('canRemoveUsers') && (
                                        <button
                                            onClick={() => handleRemoveMember(member.id, member.email)}
                                            className="text-red-600 hover:text-red-900 transition-colors"
                                        >
                                            Eliminar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {members.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No hay miembros en el equipo</p>
                    </div>
                )}
            </div>

            {!canAddMore && maxMembers && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">
                        Has alcanzado el límite de usuarios de tu plan ({maxMembers} usuarios).
                        <a href="/settings/plan" className="ml-2 font-medium underline hover:text-yellow-900">
                            Actualizar plan
                        </a>
                    </p>
                </div>
            )}
        </div>
    );
}
