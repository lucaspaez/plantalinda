'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/services/api';

interface Batch {
    id: number;
    name: string;
    strain: string;
    plantCount: number;
    currentStage: string;
    germinationDate: string;
    harvestDate: string | null;
    notes: string;
    totalDays: number;
}

interface BatchLog {
    id: number;
    timestamp: string;
    ph: number | null;
    ec: number | null;
    temperature: number | null;
    humidity: number | null;
    notes: string;
    photoUrl: string | null;
    stageAtTime: string;
}

const STAGES = [
    { value: 'GERMINATION', label: 'Germinación' },
    { value: 'SEEDLING', label: 'Plántula' },
    { value: 'VEGETATIVE', label: 'Vegetativo' },
    { value: 'FLOWERING', label: 'Floración' },
    { value: 'HARVEST', label: 'Cosecha' },
    { value: 'CURING', label: 'Curado' }
];

const STAGE_LABELS: Record<string, string> = {
    GERMINATION: 'Germinación',
    SEEDLING: 'Plántula',
    VEGETATIVE: 'Vegetativo',
    FLOWERING: 'Floración',
    HARVEST: 'Cosecha',
    CURING: 'Curado'
};

export default function BatchDetailPage() {
    const router = useRouter();
    const params = useParams();
    const batchId = params.id as string;

    const [batch, setBatch] = useState<Batch | null>(null);
    const [logs, setLogs] = useState<BatchLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [showLogForm, setShowLogForm] = useState(false);
    const [logForm, setLogForm] = useState({
        ph: '',
        ec: '',
        temperature: '',
        humidity: '',
        notes: ''
    });

    useEffect(() => {
        fetchBatchData();
    }, [batchId]);

    const fetchBatchData = async () => {
        try {
            const [batchRes, logsRes] = await Promise.all([
                api.get(`/batches/${batchId}`),
                api.get(`/batches/${batchId}/logs`)
            ]);
            setBatch(batchRes.data);
            setLogs(logsRes.data);
        } catch (err) {
            console.error('Error loading batch:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStageChange = async (newStage: string) => {
        if (!confirm(`¿Cambiar etapa a ${STAGE_LABELS[newStage]}?`)) return;

        try {
            await api.put(`/batches/${batchId}/stage?stage=${newStage}`);
            fetchBatchData();
        } catch (err) {
            alert('Error al cambiar etapa');
        }
    };

    const handleAddLog = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const logData = {
                batchId: parseInt(batchId),
                ph: logForm.ph ? parseFloat(logForm.ph) : null,
                ec: logForm.ec ? parseFloat(logForm.ec) : null,
                temperature: logForm.temperature ? parseFloat(logForm.temperature) : null,
                humidity: logForm.humidity ? parseFloat(logForm.humidity) : null,
                notes: logForm.notes || null
            };

            await api.post('/batches/logs', logData);
            setShowLogForm(false);
            setLogForm({ ph: '', ec: '', temperature: '', humidity: '', notes: '' });
            fetchBatchData();
        } catch (err) {
            console.error('Error al agregar entrada:', err);
            alert('Error al agregar entrada');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
                <div className="text-xl text-gray-600">Cargando...</div>
            </div>
        );
    }

    if (!batch) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
                <div className="text-xl text-gray-600">Lote no encontrado</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                {batch.name}
                            </h1>
                            <p className="text-gray-600">
                                {batch.strain} • {batch.plantCount} plantas • {batch.totalDays} días
                            </p>
                        </div>
                        <button
                            onClick={() => router.push('/batches')}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            ← Volver
                        </button>
                    </div>

                    {/* Stage Selector */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">
                            Etapa Actual:
                        </label>
                        <select
                            value={batch.currentStage}
                            onChange={(e) => handleStageChange(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                            {STAGES.map((stage) => (
                                <option key={stage.value} value={stage.value}>
                                    {stage.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {batch.notes && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-700">{batch.notes}</p>
                        </div>
                    )}
                </div>

                {/* Bitácora */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            📋 Bitácora
                        </h2>
                        <button
                            onClick={() => setShowLogForm(!showLogForm)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        >
                            {showLogForm ? 'Cancelar' : '+ Nueva Entrada'}
                        </button>
                    </div>

                    {/* Log Form */}
                    {showLogForm && (
                        <form onSubmit={handleAddLog} className="bg-gray-50 p-6 rounded-lg mb-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        pH
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={logForm.ph}
                                        onChange={(e) => setLogForm({ ...logForm, ph: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        placeholder="6.5"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        EC (mS/cm)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={logForm.ec}
                                        onChange={(e) => setLogForm({ ...logForm, ec: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        placeholder="1.5"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Temp (°C)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={logForm.temperature}
                                        onChange={(e) => setLogForm({ ...logForm, temperature: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        placeholder="24"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Humedad (%)
                                    </label>
                                    <input
                                        type="number"
                                        step="1"
                                        value={logForm.humidity}
                                        onChange={(e) => setLogForm({ ...logForm, humidity: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        placeholder="60"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Notas
                                </label>
                                <textarea
                                    value={logForm.notes}
                                    onChange={(e) => setLogForm({ ...logForm, notes: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="Observaciones del día..."
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                            >
                                Guardar Entrada
                            </button>
                        </form>
                    )}

                    {/* Logs List */}
                    {logs.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No hay entradas en la bitácora aún
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {logs.map((log) => (
                                <div key={log.id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="text-sm text-gray-600">
                                            {new Date(log.timestamp).toLocaleString('es-AR')}
                                        </div>
                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                            {STAGE_LABELS[log.stageAtTime]}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                                        {log.ph && (
                                            <div className="text-sm">
                                                <span className="font-semibold">pH:</span> {log.ph}
                                            </div>
                                        )}
                                        {log.ec && (
                                            <div className="text-sm">
                                                <span className="font-semibold">EC:</span> {log.ec} mS/cm
                                            </div>
                                        )}
                                        {log.temperature && (
                                            <div className="text-sm">
                                                <span className="font-semibold">Temp:</span> {log.temperature}°C
                                            </div>
                                        )}
                                        {log.humidity && (
                                            <div className="text-sm">
                                                <span className="font-semibold">Humedad:</span> {log.humidity}%
                                            </div>
                                        )}
                                    </div>
                                    {log.notes && (
                                        <p className="text-sm text-gray-700 mt-2">{log.notes}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
