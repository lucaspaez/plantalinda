'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import ProGuard from '@/components/ProGuard';
import RoleGuard from '@/components/RoleGuard';
import api from '@/services/api';

export default function NewBatchPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        strain: '',
        plantCount: '',
        germinationDate: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/batches', {
                ...formData,
                plantCount: parseInt(formData.plantCount)
            });
            router.push('/batches');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al crear lote');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProGuard feature="Crear nuevos lotes">
            <RoleGuard requiredPermission="canManageBatches" feature="Crear lotes">
                <DashboardLayout>
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">

                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">
                                        Nombre del Lote *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Ej: Lote Primavera 2024"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">
                                        Cepa / Genética *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.strain}
                                        onChange={(e) => setFormData({ ...formData, strain: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Ej: OG Kush, White Widow, etc."
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">
                                        Cantidad de Plantas *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={formData.plantCount}
                                        onChange={(e) => setFormData({ ...formData, plantCount: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Ej: 10"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">
                                        Fecha de Germinación *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.germinationDate}
                                        onChange={(e) => setFormData({ ...formData, germinationDate: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">
                                        Notas (Opcional)
                                    </label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Información adicional sobre este lote..."
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => router.push('/batches')}
                                        className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50"
                                    >
                                        {loading ? 'Creando...' : 'Crear Lote'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </DashboardLayout>
            </RoleGuard>
        </ProGuard>
    );
}
