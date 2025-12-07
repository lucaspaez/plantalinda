// components/InviteUserModal.tsx
'use client';

import { useState } from 'react';
import { organizationService, InviteUserRequest } from '@/services/organizationService';

interface InviteUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const roles = [
    { value: 'ADMIN', label: 'Administrador', description: 'Puede gestionar usuarios y configuración' },
    { value: 'MANAGER', label: 'Gerente', description: 'Puede ver reportes y gestionar operaciones' },
    { value: 'OPERATOR', label: 'Operador', description: 'Puede crear bitácoras y diagnósticos' },
    { value: 'VIEWER', label: 'Visualizador', description: 'Solo puede ver datos' }
];

export default function InviteUserModal({ isOpen, onClose, onSuccess }: InviteUserModalProps) {
    const [formData, setFormData] = useState<InviteUserRequest>({
        email: '',
        firstname: '',
        lastname: '',
        role: 'OPERATOR'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [inviteResult, setInviteResult] = useState<{ email: string, password: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await organizationService.inviteUser(formData);
            // Guardar resultado con contraseña temporal
            setInviteResult({
                email: response.email,
                password: response.temporaryPassword
            });
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al invitar usuario');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ email: '', firstname: '', lastname: '', role: 'OPERATOR' });
        setInviteResult(null);
        setError(null);
        onClose();
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Contraseña copiada al portapapeles');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    if (!isOpen) return null;

    // Mostrar resultado de invitación exitosa con contraseña
    if (inviteResult) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-xl font-bold text-green-600">✅ Usuario Invitado</h3>
                    </div>
                    <div className="px-6 py-4 space-y-4">
                        <p className="text-gray-700">
                            El usuario <strong>{inviteResult.email}</strong> ha sido invitado exitosamente.
                        </p>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-sm font-semibold text-yellow-800 mb-2">
                                ⚠️ Contraseña Temporal (compártela con el usuario):
                            </p>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 bg-yellow-100 px-3 py-2 rounded text-lg font-mono text-yellow-900">
                                    {inviteResult.password}
                                </code>
                                <button
                                    onClick={() => copyToClipboard(inviteResult.password)}
                                    className="px-3 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm"
                                >
                                    Copiar
                                </button>
                            </div>
                            <p className="text-xs text-yellow-700 mt-2">
                                El usuario debe cambiar esta contraseña después de iniciar sesión.
                            </p>
                        </div>
                    </div>
                    <div className="px-6 py-4 border-t border-gray-200">
                        <button
                            onClick={handleClose}
                            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900">Invitar Usuario</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Agrega un nuevo miembro a tu equipo
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="usuario@ejemplo.com"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre *
                            </label>
                            <input
                                type="text"
                                id="firstname"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Juan"
                            />
                        </div>

                        <div>
                            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">
                                Apellido *
                            </label>
                            <input
                                type="text"
                                id="lastname"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Pérez"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                            Rol *
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                            {roles.map((role) => (
                                <option key={role.value} value={role.value}>
                                    {role.label}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            {roles.find(r => r.value === formData.role)?.description}
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Invitando...' : 'Invitar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
