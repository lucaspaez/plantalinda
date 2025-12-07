'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import RoleGuard from '@/components/RoleGuard';
import api from '@/services/api';
import { Upload, AlertCircle, CheckCircle, Loader2, ChevronDown, ChevronUp, X, Leaf } from 'lucide-react';

interface DiagnosisResult {
    id: number;
    imageUrl: string;
    predictedIssue: string;
    confidence: number;
    correctiveAction: string;
}

interface ContextData {
    growthStage: string;
    visualSymptoms: string;
    temperature: string;
    humidity: string;
    ph: string;
    ec: string;
    userNotes: string;
}

export default function DiagnosisPage() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<DiagnosisResult | null>(null);
    const [error, setError] = useState('');
    const [showContext, setShowContext] = useState(false);

    const [context, setContext] = useState<ContextData>({
        growthStage: '',
        visualSymptoms: '',
        temperature: '',
        humidity: '',
        ph: '',
        ec: '',
        userNotes: ''
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setResult(null);
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('image', file);

        // Add context if any field is filled
        const hasContext = Object.values(context).some(val => val !== '');
        if (hasContext) {
            const contextData = {
                growthStage: context.growthStage || null,
                visualSymptoms: context.visualSymptoms || null,
                temperature: context.temperature ? parseFloat(context.temperature) : null,
                humidity: context.humidity ? parseFloat(context.humidity) : null,
                ph: context.ph ? parseFloat(context.ph) : null,
                ec: context.ec ? parseFloat(context.ec) : null,
                userNotes: context.userNotes || null
            };
            formData.append('context', JSON.stringify(contextData));
        }

        try {
            const response = await api.post('/diagnosis/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setResult(response.data);
        } catch (err) {
            setError('Error analyzing image. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const closeResult = () => {
        setResult(null);
        setFile(null);
        setPreview(null);
        setContext({
            growthStage: '',
            visualSymptoms: '',
            temperature: '',
            humidity: '',
            ph: '',
            ec: '',
            userNotes: ''
        });
    };

    return (
        <RoleGuard requiredPermission="canCreateDiagnosis" feature="Diagnóstico IA">
            <DashboardLayout>
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <Leaf className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Diagnóstico IA
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Sube una foto de tu planta para detectar problemas
                                </p>
                            </div>
                        </div>

                        {/* Upload Area */}
                        <div className="mb-6">
                            <label
                                htmlFor="file-upload"
                                className={`
                                relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-all
                                ${preview
                                        ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
                                        : 'border-gray-300 dark:border-zinc-600 hover:border-green-500 dark:hover:border-green-500 bg-gray-50 dark:bg-zinc-900/50'
                                    }
                            `}
                            >
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="h-full w-full object-contain rounded-xl p-2"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-10 h-10 mb-3 text-gray-400" />
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold">Click para subir</span> o arrastra y suelta
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            PNG, JPG or WEBP (MAX. 10MB)
                                        </p>
                                    </div>
                                )}
                                <input
                                    id="file-upload"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>

                        {/* Context Toggle */}
                        <div className="mb-6">
                            <button
                                onClick={() => setShowContext(!showContext)}
                                className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                            >
                                {showContext ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                {showContext ? 'Ocultar contexto adicional' : 'Añadir contexto adicional (Opcional)'}
                            </button>

                            {showContext && (
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Etapa de crecimiento
                                        </label>
                                        <select
                                            value={context.growthStage}
                                            onChange={(e) => setContext({ ...context, growthStage: e.target.value })}
                                            className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-600 rounded-lg text-sm focus:ring-2 focus:ring-green-500 dark:text-white"
                                        >
                                            <option value="">Seleccionar etapa...</option>
                                            <option value="seedling">Plántula</option>
                                            <option value="vegetative">Vegetativo</option>
                                            <option value="flowering">Floración</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Síntomas visuales
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="ej. hojas amarillas, manchas..."
                                            value={context.visualSymptoms}
                                            onChange={(e) => setContext({ ...context, visualSymptoms: e.target.value })}
                                            className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-600 rounded-lg text-sm focus:ring-2 focus:ring-green-500 dark:text-white"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Temp (°C)</label>
                                            <input
                                                type="number"
                                                value={context.temperature}
                                                onChange={(e) => setContext({ ...context, temperature: e.target.value })}
                                                className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-600 rounded-lg text-sm focus:ring-2 focus:ring-green-500 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Humedad (%)</label>
                                            <input
                                                type="number"
                                                value={context.humidity}
                                                onChange={(e) => setContext({ ...context, humidity: e.target.value })}
                                                className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-600 rounded-lg text-sm focus:ring-2 focus:ring-green-500 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">pH</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={context.ph}
                                                onChange={(e) => setContext({ ...context, ph: e.target.value })}
                                                className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-600 rounded-lg text-sm focus:ring-2 focus:ring-green-500 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">EC</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={context.ec}
                                                onChange={(e) => setContext({ ...context, ec: e.target.value })}
                                                className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-600 rounded-lg text-sm focus:ring-2 focus:ring-green-500 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={handleUpload}
                            disabled={!file || loading}
                            className={`
                            w-full py-3 px-4 rounded-xl font-bold text-white transition-all
                            ${!file || loading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-green-500/30'
                                }
                        `}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="animate-spin" />
                                    Analizando...
                                </span>
                            ) : (
                                'Analizar Planta'
                            )}
                        </button>

                        {error && (
                            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-2">
                                <AlertCircle size={20} />
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Result Modal */}
                    {result && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                            <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            <CheckCircle className="text-green-500" />
                                            Resultados del Análisis
                                        </h2>
                                        <button
                                            onClick={closeResult}
                                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-900">
                                            <img
                                                src={result.imageUrl}
                                                alt="Analyzed plant"
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                                    Problema Detectado
                                                </h3>
                                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                                    {result.predictedIssue}
                                                </p>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                                    Confianza
                                                </h3>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 h-2 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                                        <div
                                                            className="bg-green-500 h-full rounded-full"
                                                            style={{ width: `${result.confidence * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="font-bold text-gray-900 dark:text-white">
                                                        {(result.confidence * 100).toFixed(1)}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 mb-6">
                                        <h3 className="text-lg font-bold text-green-900 dark:text-green-300 mb-3 flex items-center gap-2">
                                            <Leaf className="w-5 h-5" />
                                            Acción Recomendada
                                        </h3>
                                        <p className="text-green-800 dark:text-green-200 leading-relaxed">
                                            {result.correctiveAction}
                                        </p>
                                    </div>

                                    <button
                                        onClick={closeResult}
                                        className="w-full py-3 bg-gray-100 dark:bg-zinc-700 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors"
                                    >
                                        Cerrar y Analizar Otra
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </DashboardLayout>
        </RoleGuard>
    );
}
