'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/services/api';
import { FileText, Download, Calendar, TrendingUp, Package, Shield } from 'lucide-react';

interface Report {
    id: number;
    type: string;
    startDate: string;
    endDate: string;
    status: string;
    createdAt: string;
    content: string;
}

const REPORT_TYPES = [
    { value: 'REPROCANN_MONTHLY', label: 'Reporte REPROCANN Mensual', icon: Shield, description: 'Reporte oficial para REPROCANN' },
    { value: 'INVENTORY_SUMMARY', label: 'Resumen de Inventario', icon: Package, description: 'Estado actual del inventario' },
    { value: 'BATCH_PRODUCTION', label: 'Producción por Lote', icon: TrendingUp, description: 'Análisis de producción' },
    { value: 'TRACEABILITY', label: 'Trazabilidad Completa', icon: FileText, description: 'Historial completo de lotes' },
];

export default function ReportsPage() {
    const router = useRouter();
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [selectedType, setSelectedType] = useState('REPROCANN_MONTHLY');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [userRole, setUserRole] = useState('FREE');

    useEffect(() => {
        // Check user role
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const role = payload.role || 'FREE';
                setUserRole(role.replace('ROLE_', ''));
            } catch (e) { }
        }

        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await api.get('/reports');
            setReports(response.data);
        } catch (err) {
            console.error('Error loading reports:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateReport = async () => {
        if (!startDate || !endDate) {
            alert('Por favor selecciona las fechas');
            return;
        }

        setGenerating(true);
        try {
            await api.post('/reports/generate', {
                type: selectedType,
                startDate: new Date(startDate).toISOString(),
                endDate: new Date(endDate).toISOString()
            });

            alert('Reporte generado exitosamente');
            fetchReports();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error al generar reporte');
        } finally {
            setGenerating(false);
        }
    };

    const downloadReport = (report: Report) => {
        const blob = new Blob([report.content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte-${report.type}-${report.id}.json`;
        a.click();
    };

    if (userRole !== 'PRO') {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
                        <Shield className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Función PRO</h2>
                        <p className="text-gray-600 mb-6">
                            Los reportes REPROCANN y análisis avanzados están disponibles solo para usuarios PRO.
                        </p>
                        <button
                            onClick={() => router.push('/upgrade')}
                            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-semibold"
                        >
                            Actualizar a PRO
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <FileText className="w-8 h-8 text-green-600" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Reportes REPROCANN</h1>
                            <p className="text-gray-600">Genera reportes oficiales y análisis de producción</p>
                        </div>
                    </div>

                    {/* Generate Report Form */}
                    <div className="bg-gray-50 rounded-lg p-6 mt-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Generar Nuevo Reporte</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Tipo de Reporte
                                </label>
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                >
                                    {REPORT_TYPES.map(type => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                    {REPORT_TYPES.find(t => t.value === selectedType)?.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Fecha Inicio
                                    </label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Fecha Fin
                                    </label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleGenerateReport}
                            disabled={generating}
                            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50"
                        >
                            {generating ? 'Generando...' : 'Generar Reporte'}
                        </button>
                    </div>
                </div>

                {/* Reports List */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Reportes Generados</h2>

                    {loading ? (
                        <div className="text-center py-12 text-gray-500">Cargando...</div>
                    ) : reports.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No hay reportes generados. Crea tu primer reporte arriba.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {reports.map((report) => (
                                <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FileText className="w-5 h-5 text-green-600" />
                                                <h3 className="font-semibold text-gray-900">
                                                    {REPORT_TYPES.find(t => t.value === report.type)?.label || report.type}
                                                </h3>
                                                <span className={`px-2 py-1 text-xs rounded ${report.status === 'COMPLETED'
                                                        ? 'bg-green-100 text-green-700'
                                                        : report.status === 'FAILED'
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {report.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(report.startDate).toLocaleDateString('es-AR')} - {new Date(report.endDate).toLocaleDateString('es-AR')}
                                                </span>
                                                <span>
                                                    Generado: {new Date(report.createdAt).toLocaleString('es-AR')}
                                                </span>
                                            </div>
                                        </div>
                                        {report.status === 'COMPLETED' && (
                                            <button
                                                onClick={() => downloadReport(report)}
                                                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                                            >
                                                <Download className="w-4 h-4" />
                                                Descargar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
