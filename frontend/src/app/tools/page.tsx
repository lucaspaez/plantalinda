'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/services/api';

interface VpdResult {
    vpd: number;
    status: string;
    message: string;
    minRecommended: number;
    maxRecommended: number;
}

interface Preferences {
    vpdVegMin: number;
    vpdVegMax: number;
    vpdFlowerMin: number;
    vpdFlowerMax: number;
    tempVegDayMin: number;
    tempVegDayMax: number;
    tempVegNightMin: number;
    tempVegNightMax: number;
    tempFlowerDayMin: number;
    tempFlowerDayMax: number;
    tempFlowerNightMin: number;
    tempFlowerNightMax: number;
    humidityVegMin: number;
    humidityVegMax: number;
    humidityFlowerMin: number;
    humidityFlowerMax: number;
    phMin: number;
    phMax: number;
    ecVegMin: number;
    ecVegMax: number;
    ecFlowerMin: number;
    ecFlowerMax: number;
}

export default function ToolsPage() {
    const router = useRouter();

    // VPD Calculator State
    const [temperature, setTemperature] = useState('');
    const [humidity, setHumidity] = useState('');
    const [stage, setStage] = useState('VEGETATIVE');
    const [vpdResult, setVpdResult] = useState<VpdResult | null>(null);

    // Preferences State
    const [preferences, setPreferences] = useState<Preferences | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [editedPrefs, setEditedPrefs] = useState<Preferences | null>(null);

    useEffect(() => {
        fetchPreferences();
    }, []);

    useEffect(() => {
        if (temperature && humidity) {
            calculateVpd();
        }
    }, [temperature, humidity, stage]);

    const fetchPreferences = async () => {
        try {
            const response = await api.get('/tools/preferences');
            setPreferences(response.data);
            setEditedPrefs(response.data);
        } catch (err) {
            console.error('Error loading preferences:', err);
        }
    };

    const calculateVpd = async () => {
        try {
            const response = await api.post('/tools/vpd/calculate', {
                temperature: parseFloat(temperature),
                humidity: parseFloat(humidity),
                stage
            });
            setVpdResult(response.data);
        } catch (err) {
            console.error('Error calculating VPD:', err);
        }
    };

    const savePreferences = async () => {
        try {
            await api.put('/tools/preferences', editedPrefs);
            setPreferences(editedPrefs);
            setEditMode(false);
            alert('Preferencias guardadas exitosamente');
        } catch (err) {
            alert('Error al guardar preferencias');
        }
    };

    const resetPreferences = async () => {
        if (!confirm('¿Resetear a valores profesionales por defecto?')) return;

        try {
            const response = await api.post('/tools/preferences/reset');
            setPreferences(response.data);
            setEditedPrefs(response.data);
            setEditMode(false);
            alert('Preferencias reseteadas a valores por defecto');
        } catch (err) {
            alert('Error al resetear preferencias');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPTIMAL': return 'bg-green-100 text-green-800 border-green-500';
            case 'LOW': return 'bg-yellow-100 text-yellow-800 border-yellow-500';
            case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-500';
            case 'DANGER': return 'bg-red-100 text-red-800 border-red-500';
            default: return 'bg-gray-100 text-gray-800 border-gray-500';
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* VPD Calculator */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-400 mb-4 flex items-center">
                            <span className="mr-2">📊</span>
                            Calculadora VPD
                        </h2>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Temperatura (°C)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={temperature}
                                        onChange={(e) => setTemperature(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="25"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Humedad (%)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={humidity}
                                        onChange={(e) => setHumidity(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="60"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Etapa de Cultivo
                                </label>
                                <select
                                    value={stage}
                                    onChange={(e) => setStage(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    <option value="VEGETATIVE">Vegetativo</option>
                                    <option value="FLOWERING">Floración</option>
                                </select>
                            </div>

                            {vpdResult && (
                                <div className={`border-2 rounded-lg p-6 ${getStatusColor(vpdResult.status)}`}>
                                    <div className="text-center mb-4">
                                        <p className="text-sm uppercase tracking-wide mb-1">Déficit de Presión de Vapor</p>
                                        <p className="text-5xl font-bold">{vpdResult.vpd} kPa</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-semibold mb-2">{vpdResult.message}</p>
                                        <p className="text-sm">
                                            Rango recomendado: {vpdResult.minRecommended} - {vpdResult.maxRecommended} kPa
                                        </p>
                                    </div>
                                </div>
                            )}

                            {!vpdResult && temperature && humidity && (
                                <div className="bg-gray-100 rounded-lg p-6 text-center text-gray-500">
                                    Ingresa temperatura y humedad para calcular VPD
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Reference */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-purple-800 dark:text-purple-400 mb-4 flex items-center">
                            <span className="mr-2">📋</span>
                            Referencia Rápida
                        </h2>

                        {preferences && (
                            <div className="space-y-4">
                                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                                    <h3 className="font-bold text-purple-900 dark:text-purple-300 mb-2">VPD (kPa)</h3>
                                    <div className="grid grid-cols-2 gap-2 text-sm text-purple-800 dark:text-purple-200">
                                        <div>
                                            <span className="font-semibold">Vegetativo:</span> {preferences.vpdVegMin} - {preferences.vpdVegMax}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Floración:</span> {preferences.vpdFlowerMin} - {preferences.vpdFlowerMax}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                    <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2">Temperatura (°C)</h3>
                                    <div className="text-sm space-y-1 text-blue-800 dark:text-blue-200">
                                        <div><span className="font-semibold">Veg Día:</span> {preferences.tempVegDayMin} - {preferences.tempVegDayMax}</div>
                                        <div><span className="font-semibold">Veg Noche:</span> {preferences.tempVegNightMin} - {preferences.tempVegNightMax}</div>
                                        <div><span className="font-semibold">Flor Día:</span> {preferences.tempFlowerDayMin} - {preferences.tempFlowerDayMax}</div>
                                        <div><span className="font-semibold">Flor Noche:</span> {preferences.tempFlowerNightMin} - {preferences.tempFlowerNightMax}</div>
                                    </div>
                                </div>

                                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                                    <h3 className="font-bold text-green-900 dark:text-green-300 mb-2">Humedad (%)</h3>
                                    <div className="grid grid-cols-2 gap-2 text-sm text-green-800 dark:text-green-200">
                                        <div><span className="font-semibold">Vegetativo:</span> {preferences.humidityVegMin} - {preferences.humidityVegMax}</div>
                                        <div><span className="font-semibold">Floración:</span> {preferences.humidityFlowerMin} - {preferences.humidityFlowerMax}</div>
                                    </div>
                                </div>

                                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                                    <h3 className="font-bold text-yellow-900 dark:text-yellow-300 mb-2">pH y EC</h3>
                                    <div className="text-sm space-y-1 text-yellow-800 dark:text-yellow-200">
                                        <div><span className="font-semibold">pH:</span> {preferences.phMin} - {preferences.phMax}</div>
                                        <div><span className="font-semibold">EC Veg:</span> {preferences.ecVegMin} - {preferences.ecVegMax}</div>
                                        <div><span className="font-semibold">EC Flor:</span> {preferences.ecFlowerMin} - {preferences.ecFlowerMax}</div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setEditMode(true)}
                                    className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    ⚙️ Personalizar Rangos
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Edit Modal */}
                {editMode && editedPrefs && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-auto">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full my-8">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                    Personalizar Rangos Ideales
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-96 overflow-y-auto pr-2">
                                    {/* VPD */}
                                    <div className="space-y-3">
                                        <h3 className="font-bold text-purple-900 dark:text-purple-300">VPD (kPa)</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input type="number" step="0.1" placeholder="Veg Min" value={editedPrefs.vpdVegMin} onChange={(e) => setEditedPrefs({ ...editedPrefs, vpdVegMin: parseFloat(e.target.value) })} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                                            <input type="number" step="0.1" placeholder="Veg Max" value={editedPrefs.vpdVegMax} onChange={(e) => setEditedPrefs({ ...editedPrefs, vpdVegMax: parseFloat(e.target.value) })} className="px-3 py-2 border rounded" />
                                            <input type="number" step="0.1" placeholder="Flor Min" value={editedPrefs.vpdFlowerMin} onChange={(e) => setEditedPrefs({ ...editedPrefs, vpdFlowerMin: parseFloat(e.target.value) })} className="px-3 py-2 border rounded" />
                                            <input type="number" step="0.1" placeholder="Flor Max" value={editedPrefs.vpdFlowerMax} onChange={(e) => setEditedPrefs({ ...editedPrefs, vpdFlowerMax: parseFloat(e.target.value) })} className="px-3 py-2 border rounded" />
                                        </div>
                                    </div>

                                    {/* Temperature */}
                                    <div className="space-y-3">
                                        <h3 className="font-bold text-blue-900 dark:text-blue-300">Temperatura (°C)</h3>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <input type="number" step="0.1" placeholder="Veg Día Min" value={editedPrefs.tempVegDayMin} onChange={(e) => setEditedPrefs({ ...editedPrefs, tempVegDayMin: parseFloat(e.target.value) })} className="px-2 py-1 border rounded" />
                                            <input type="number" step="0.1" placeholder="Veg Día Max" value={editedPrefs.tempVegDayMax} onChange={(e) => setEditedPrefs({ ...editedPrefs, tempVegDayMax: parseFloat(e.target.value) })} className="px-2 py-1 border rounded" />
                                            <input type="number" step="0.1" placeholder="Veg Noche Min" value={editedPrefs.tempVegNightMin} onChange={(e) => setEditedPrefs({ ...editedPrefs, tempVegNightMin: parseFloat(e.target.value) })} className="px-2 py-1 border rounded" />
                                            <input type="number" step="0.1" placeholder="Veg Noche Max" value={editedPrefs.tempVegNightMax} onChange={(e) => setEditedPrefs({ ...editedPrefs, tempVegNightMax: parseFloat(e.target.value) })} className="px-2 py-1 border rounded" />
                                            <input type="number" step="0.1" placeholder="Flor Día Min" value={editedPrefs.tempFlowerDayMin} onChange={(e) => setEditedPrefs({ ...editedPrefs, tempFlowerDayMin: parseFloat(e.target.value) })} className="px-2 py-1 border rounded" />
                                            <input type="number" step="0.1" placeholder="Flor Día Max" value={editedPrefs.tempFlowerDayMax} onChange={(e) => setEditedPrefs({ ...editedPrefs, tempFlowerDayMax: parseFloat(e.target.value) })} className="px-2 py-1 border rounded" />
                                            <input type="number" step="0.1" placeholder="Flor Noche Min" value={editedPrefs.tempFlowerNightMin} onChange={(e) => setEditedPrefs({ ...editedPrefs, tempFlowerNightMin: parseFloat(e.target.value) })} className="px-2 py-1 border rounded" />
                                            <input type="number" step="0.1" placeholder="Flor Noche Max" value={editedPrefs.tempFlowerNightMax} onChange={(e) => setEditedPrefs({ ...editedPrefs, tempFlowerNightMax: parseFloat(e.target.value) })} className="px-2 py-1 border rounded" />
                                        </div>
                                    </div>

                                    {/* Humidity */}
                                    <div className="space-y-3">
                                        <h3 className="font-bold text-green-900 dark:text-green-300">Humedad (%)</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input type="number" step="0.1" placeholder="Veg Min" value={editedPrefs.humidityVegMin} onChange={(e) => setEditedPrefs({ ...editedPrefs, humidityVegMin: parseFloat(e.target.value) })} className="px-3 py-2 border rounded" />
                                            <input type="number" step="0.1" placeholder="Veg Max" value={editedPrefs.humidityVegMax} onChange={(e) => setEditedPrefs({ ...editedPrefs, humidityVegMax: parseFloat(e.target.value) })} className="px-3 py-2 border rounded" />
                                            <input type="number" step="0.1" placeholder="Flor Min" value={editedPrefs.humidityFlowerMin} onChange={(e) => setEditedPrefs({ ...editedPrefs, humidityFlowerMin: parseFloat(e.target.value) })} className="px-3 py-2 border rounded" />
                                            <input type="number" step="0.1" placeholder="Flor Max" value={editedPrefs.humidityFlowerMax} onChange={(e) => setEditedPrefs({ ...editedPrefs, humidityFlowerMax: parseFloat(e.target.value) })} className="px-3 py-2 border rounded" />
                                        </div>
                                    </div>

                                    {/* pH and EC */}
                                    <div className="space-y-3">
                                        <h3 className="font-bold text-yellow-900 dark:text-yellow-300">pH y EC</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input type="number" step="0.1" placeholder="pH Min" value={editedPrefs.phMin} onChange={(e) => setEditedPrefs({ ...editedPrefs, phMin: parseFloat(e.target.value) })} className="px-3 py-2 border rounded" />
                                            <input type="number" step="0.1" placeholder="pH Max" value={editedPrefs.phMax} onChange={(e) => setEditedPrefs({ ...editedPrefs, phMax: parseFloat(e.target.value) })} className="px-3 py-2 border rounded" />
                                            <input type="number" step="0.1" placeholder="EC Veg Min" value={editedPrefs.ecVegMin} onChange={(e) => setEditedPrefs({ ...editedPrefs, ecVegMin: parseFloat(e.target.value) })} className="px-3 py-2 border rounded" />
                                            <input type="number" step="0.1" placeholder="EC Veg Max" value={editedPrefs.ecVegMax} onChange={(e) => setEditedPrefs({ ...editedPrefs, ecVegMax: parseFloat(e.target.value) })} className="px-3 py-2 border rounded" />
                                            <input type="number" step="0.1" placeholder="EC Flor Min" value={editedPrefs.ecFlowerMin} onChange={(e) => setEditedPrefs({ ...editedPrefs, ecFlowerMin: parseFloat(e.target.value) })} className="px-3 py-2 border rounded" />
                                            <input type="number" step="0.1" placeholder="EC Flor Max" value={editedPrefs.ecFlowerMax} onChange={(e) => setEditedPrefs({ ...editedPrefs, ecFlowerMax: parseFloat(e.target.value) })} className="px-3 py-2 border rounded" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-6">
                                    <button onClick={() => setEditMode(false)} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                                        Cancelar
                                    </button>
                                    <button onClick={resetPreferences} className="flex-1 bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700">
                                        Resetear
                                    </button>
                                    <button onClick={savePreferences} className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
                                        Guardar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

