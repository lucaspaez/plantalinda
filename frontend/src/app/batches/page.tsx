'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/services/api';

interface Batch {
    id: number;
    strainName: string;
    plantCount: number;
    currentStage: string;
    startDate: string;
    harvestDate: string | null;
    notes: string;
}

const STAGE_LABELS: Record<string, string> = {
    GERMINATION: 'Germinación',
    SEEDLING: 'Plántula',
    VEGETATIVE: 'Vegetativo',
    FLOWERING: 'Floración',
    HARVEST: 'Cosecha',
    CURING: 'Curado'
};

const STAGE_COLORS: Record<string, string> = {
    GERMINATION: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    SEEDLING: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    VEGETATIVE: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    FLOWERING: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
    HARVEST: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300',
    CURING: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
};

export default function BatchesPage() {
    const router = useRouter();
    const [batches, setBatches] = useState<Batch[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBatches();
    }, []);

    const fetchBatches = async () => {
        try {
            const response = await api.get('/batches');
            setBatches(response.data);
        } catch (err: any) {
            if (err.response?.status === 403) {
                setError('Esta funcionalidad es solo para usuarios PRO');
            } else {
                setError('Error al cargar lotes');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este lote?')) return;

        try {
            await api.delete(`/batches/${id}`);
            fetchBatches();
        } catch (err) {
            alert('Error al eliminar lote');
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="text-xl text-gray-600 dark:text-gray-400">Cargando...</div>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md">
                        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Acceso Restringido</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-6">{error}</p>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                        >
                            Volver al Dashboard
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={() => router.push('/batches/new')}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-lg"
                    >
                        + Nuevo Lote
                    </button>
                </div>

                {batches.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
                        <div className="text-6xl mb-4">🌿</div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            No tienes lotes creados
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Comienza creando tu primer lote para hacer seguimiento de tu cultivo
                        </p>
                        <button
                            onClick={() => router.push('/batches/new')}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Crear Primer Lote
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {batches.map((batch) => (
                            <div
                                key={batch.id}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                            {batch.strainName}
                                        </h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STAGE_COLORS[batch.currentStage]}`}>
                                            {STAGE_LABELS[batch.currentStage]}
                                        </span>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                                            <span className="font-semibold mr-2">Lote:</span>
                                            <span>#{batch.id}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                                            <span className="font-semibold mr-2">Plantas:</span>
                                            <span>{batch.plantCount}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                                            <span className="font-semibold mr-2">Inicio:</span>
                                            <span>{new Date(batch.startDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    {batch.notes && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                                            {batch.notes}
                                        </p>
                                    )}

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => router.push(`/batches/${batch.id}`)}
                                            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            Ver Detalles
                                        </button>
                                        <button
                                            onClick={() => handleDelete(batch.id)}
                                            className="px-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
