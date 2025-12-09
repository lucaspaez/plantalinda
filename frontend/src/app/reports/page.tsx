'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import ProGuard from '@/components/ProGuard';
import RoleGuard from '@/components/RoleGuard';
import { currentUserHasPermission } from '@/utils/permissions';
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
    const [userPlan, setUserPlan] = useState('FREE');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const plan = payload.plan || 'FREE';
                setUserPlan(plan);
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

    const TRANSLATIONS: Record<string, string> = {
        'id': 'ID',
        'name': 'Nombre',
        'strain': 'Cepa',
        'status': 'Estado',
        'plantCount': 'Cantidad de Plantas',
        'harvestYield': 'Rendimiento (g)',
        'batchId': 'ID Lote',
        'batchName': 'Nombre Lote',
        'totalLogs': 'Registros Totales',
        'timeline': 'Línea de Tiempo',
        'date': 'Fecha',
        'type': 'Tipo',
        'notes': 'Notas',
        // Inventory Types
        'SEED': 'Semilla',
        'FERTILIZER': 'Fertilizante',
        'SUBSTRATE': 'Sustrato',
        'SUPPLEMENT': 'Suplemento',
        'EQUIPMENT': 'Equipamiento',
        'PLANT_ACTIVE': 'Planta Activa',
        'HARVEST_WET': 'Cosecha Húmeda',
        'HARVEST_DRY': 'Cosecha Seca',
        'FINAL_PRODUCT': 'Producto Final',
        'OTHER': 'Otros'
    };

    const downloadCSV = (report: Report) => {
        try {
            const data = JSON.parse(report.content);
            const items = Array.isArray(data) ? data : [data];
            if (items.length === 0) return alert('Reporte vacío');

            // Get keys and translate headers
            const keys = Array.from(new Set(items.flatMap(item => Object.keys(item))));
            const headers = keys.map(k => TRANSLATIONS[k] || k);

            const csvContent = [
                headers.join(','),
                ...items.map(item => keys.map(key => {
                    const val = item[key];
                    return typeof val === 'object' ? JSON.stringify(val).replace(/,/g, ';') : val;
                }).join(','))
            ].join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `reporte-${report.type}-${report.id}.csv`;
            a.click();
        } catch (e) {
            console.error(e);
            alert('Error al exportar CSV');
        }
    };

    const printReport = (report: Report) => {
        try {
            const data = JSON.parse(report.content);
            const printWindow = window.open('', '_blank');
            if (!printWindow) return alert('Por favor permite los popups');
            const reportLabel = REPORT_TYPES.find(t => t.value === report.type)?.label || report.type;

            let contentHtml = '';

            // Lógica de renderizado según disponibilidad de datos
            if (Array.isArray(data)) {
                contentHtml = renderTable(data);
            } else if (data.batches && Array.isArray(data.batches)) {
                // Caso: Reporte de Producción / Trazabilidad
                contentHtml = `<h2>Resumen</h2>
                               <p><strong>Total Lotes:</strong> ${data.totalBatches || data.batches.length}</p>
                               ${renderTable(data.batches)}`;
            } else if (data.period && data.summary && data.production) {
                // Caso: Reporte REPROCANN
                contentHtml = `
                    <div class="grid">
                        <div class="card">
                            <h3>Resumen General</h3>
                            <ul>
                                <li><strong>Lotes Totales:</strong> ${data.summary.totalBatches}</li>
                                <li><strong>Activos:</strong> ${data.summary.activeBatches}</li>
                                <li><strong>Cosechados:</strong> ${data.summary.harvestedBatches}</li>
                            </ul>
                        </div>
                        <div class="card">
                            <h3>Producción</h3>
                            <ul>
                                <li><strong>Rendimiento Total:</strong> ${data.production.totalYield} ${data.production.unit}</li>
                                <li><strong>Promedio:</strong> ${data.production.averagePerBatch.toFixed(2)} ${data.production.unit}</li>
                            </ul>
                        </div>
                        <div class="card">
                            <h3>Inventario</h3>
                            <ul>
                                <li><strong>Items Totales:</strong> ${data.inventory.totalItems}</li>
                                <li><strong>Bajo Stock:</strong> ${data.inventory.lowStockItems}</li>
                            </ul>
                        </div>
                    </div>
                `;
            } else if (data.itemsByType) {
                // Caso: Resumen Inventario
                contentHtml = `
                    <h3>Resumen General</h3>
                    <p><strong>Total Items:</strong> ${data.totalItems}</p>
                    <p><strong>Bajo Stock:</strong> ${data.lowStockCount}</p>
                    <h3>Por Categoría</h3>
                    <ul>
                        ${Object.entries(data.itemsByType).map(([k, v]) => `<li><strong>${TRANSLATIONS[k] || k}:</strong> ${v}</li>`).join('')}
                    </ul>
                 `;
            } else {
                contentHtml = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
            }

            const htmlContent = `<!DOCTYPE html><html><head><title>Reporte ${report.type}</title><style>
                body{font-family:system-ui,-apple-system,sans-serif;padding:2rem;color:#1f2937}
                h1{color:#166534;border-bottom:2px solid #166534;padding-bottom:1rem}
                h2,h3{color:#166534;margin-top:1.5rem}
                .meta{color:#666;margin-bottom:2rem;background:#f3f4f6;padding:1rem;border-radius:0.5rem}
                table{width:100%;border-collapse:collapse;margin-top:1rem;font-size:0.875rem}
                th,td{border:1px solid #e5e7eb;padding:0.75rem;text-align:left}
                th{background-color:#f9fafb;font-weight:600}
                tr:nth-child(even){background-color:#f9fafb}
                .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1.5rem}
                .card{border:1px solid #e5e7eb;padding:1rem;border-radius:0.5rem;box-shadow:0 1px 2px 0 rgba(0,0,0,0.05)}
                ul{list-style:none;padding:0}
                li{margin-bottom:0.5rem}
                pre{background-color:#f8fafc;padding:1rem;border-radius:.5rem;overflow-x:auto}
            </style></head><body>
                <h1>Reporte: ${reportLabel}</h1>
                <div class="meta">
                    <p><strong>Fecha Generación:</strong> ${new Date(report.createdAt).toLocaleString()}</p>
                    <p><strong>Periodo:</strong> ${new Date(report.startDate).toLocaleDateString()} - ${new Date(report.endDate).toLocaleDateString()}</p>
                </div>
                ${contentHtml}
                <script>window.print();</script>
            </body></html>`;
            printWindow.document.write(htmlContent);
            printWindow.document.close();
        } catch (e) {
            console.error(e);
            alert('Error al imprimir');
        }
    };

    const renderTable = (items: any[]) => {
        if (!items || items.length === 0) return '<p>Sin datos</p>';
        return `<table><thead><tr>${Object.keys(items[0] || {}).map(k => `<th>${TRANSLATIONS[k] || k}</th>`).join('')}</tr></thead>
                <tbody>${items.map(item => `<tr>${Object.values(item).map(v => `<td>${typeof v === 'object' ? JSON.stringify(v) : v}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    };

    return (
        <ProGuard feature="Reportes">
            <RoleGuard requiredPermission="canViewReports" feature="Reportes">
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
                            {currentUserHasPermission('canGenerateReports') && (
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
                            )}
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
                                                    {report.status === 'FAILED' && (
                                                        <p className="text-sm text-red-600 mt-2 bg-red-50 p-2 rounded">
                                                            {report.content}
                                                        </p>
                                                    )}
                                                </div>
                                                {report.status === 'COMPLETED' && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => downloadCSV(report)}
                                                            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm"
                                                            title="Abrir en Excel"
                                                        >
                                                            <FileText className="w-4 h-4" />
                                                            CSV
                                                        </button>
                                                        <button
                                                            onClick={() => printReport(report)}
                                                            className="flex items-center gap-2 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 text-sm"
                                                            title="Imprimir o Guardar como PDF"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                            Imprimir
                                                        </button>
                                                        <button
                                                            onClick={() => downloadReport(report)}
                                                            className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 text-sm"
                                                            title="Descargar JSON Crudo"
                                                        >
                                                            <FileText className="w-4 h-4" />
                                                            JSON
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </DashboardLayout>
            </RoleGuard>
        </ProGuard>
    );
}
