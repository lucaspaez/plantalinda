'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import ProGuard from '@/components/ProGuard';
import RoleGuard from '@/components/RoleGuard';
import api from '@/services/api';

const ITEM_TYPES = [
    { value: 'SEED', label: 'Semillas' },
    { value: 'FERTILIZER', label: 'Fertilizante' },
    { value: 'SUBSTRATE', label: 'Sustrato' },
    { value: 'SUPPLEMENT', label: 'Suplemento' },
    { value: 'EQUIPMENT', label: 'Equipamiento' },
    { value: 'PLANT_ACTIVE', label: 'Planta Activa' },
    { value: 'HARVEST_WET', label: 'Cosecha Húmeda' },
    { value: 'HARVEST_DRY', label: 'Cosecha Seca' },
    { value: 'FINAL_PRODUCT', label: 'Producto Final' },
    { value: 'OTHER', label: 'Otro' }
];

const UNITS = [
    { value: 'UNIT', label: 'Unidad(es)' },
    { value: 'GRAM', label: 'Gramos' },
    { value: 'KILOGRAM', label: 'Kilogramos' },
    { value: 'LITER', label: 'Litros' },
    { value: 'MILLILITER', label: 'Mililitros' },
    { value: 'PACKAGE', label: 'Paquete(s)' }
];

interface Batch {
    id: number;
    name: string;
}

export default function NewInventoryItemPage() {
    const router = useRouter();
    const [batches, setBatches] = useState<Batch[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        type: 'SEED',
        description: '',
        currentQuantity: '',
        minimumQuantity: '',
        unit: 'UNIT',
        strain: '',
        brand: '',
        supplier: '',
        expirationDate: '',
        batchId: '',
        unitCost: '',
        location: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBatches();
    }, []);

    const fetchBatches = async () => {
        try {
            const response = await api.get('/batches');
            setBatches(response.data);
        } catch (err) {
            console.error('Error loading batches:', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                ...formData,
                currentQuantity: parseFloat(formData.currentQuantity),
                minimumQuantity: formData.minimumQuantity ? parseFloat(formData.minimumQuantity) : null,
                batchId: formData.batchId ? parseInt(formData.batchId) : null,
                unitCost: formData.unitCost ? parseFloat(formData.unitCost) : null,
                strain: formData.strain || null,
                brand: formData.brand || null,
                supplier: formData.supplier || null,
                expirationDate: formData.expirationDate || null,
                location: formData.location || null,
                description: formData.description || null
            };

            await api.post('/inventory/items', payload);
            router.push('/inventory');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al crear item');
        } finally {
            setLoading(false);
        }
    };

    const showField = (field: string) => {
        const type = formData.type;
        switch (field) {
            case 'strain':
                return ['SEED', 'PLANT_ACTIVE', 'HARVEST_WET', 'HARVEST_DRY', 'FINAL_PRODUCT'].includes(type);
            case 'brand':
                return ['FERTILIZER', 'SUBSTRATE', 'SUPPLEMENT', 'EQUIPMENT'].includes(type);
            case 'supplier':
                return ['FERTILIZER', 'SUBSTRATE', 'SUPPLEMENT', 'EQUIPMENT', 'SEED'].includes(type);
            case 'expirationDate':
                return ['FERTILIZER', 'SUPPLEMENT'].includes(type);
            case 'batch':
                return ['PLANT_ACTIVE', 'HARVEST_WET', 'HARVEST_DRY'].includes(type);
            default:
                return true;
        }
    };

    return (
        <ProGuard feature="Crear nuevo item de inventario">
            <RoleGuard requiredPermission="canManageInventory" feature="Inventario">
                <DashboardLayout>
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                📦 Nuevo Item de Inventario
                            </h1>

                            {error && (
                                <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Información Básica */}
                                <div className="border-b pb-4">
                                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Información Básica</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                                Nombre *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                                                placeholder="Ej: Semillas OG Kush"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                                Tipo *
                                            </label>
                                            <select
                                                required
                                                value={formData.type}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                                            >
                                                {ITEM_TYPES.map(type => (
                                                    <option key={type.value} value={type.value}>{type.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                                Unidad de Medida *
                                            </label>
                                            <select
                                                required
                                                value={formData.unit}
                                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                                            >
                                                {UNITS.map(unit => (
                                                    <option key={unit.value} value={unit.value}>{unit.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                                Descripción
                                            </label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                rows={3}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                                                placeholder="Descripción opcional del item..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Cantidades */}
                                <div className="border-b pb-4">
                                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Cantidades</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                                Cantidad Actual *
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                required
                                                value={formData.currentQuantity}
                                                onChange={(e) => setFormData({ ...formData, currentQuantity: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                                                placeholder="100"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                                Cantidad Mínima (Alerta)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.minimumQuantity}
                                                onChange={(e) => setFormData({ ...formData, minimumQuantity: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                                                placeholder="10"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Detalles Específicos */}
                                <div className="border-b pb-4">
                                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Detalles Específicos</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {showField('strain') && (
                                            <div>
                                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                                    Cepa/Genética
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.strain}
                                                    onChange={(e) => setFormData({ ...formData, strain: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                                                    placeholder="OG Kush"
                                                />
                                            </div>
                                        )}

                                        {showField('brand') && (
                                            <div>
                                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                                    Marca
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.brand}
                                                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                                                    placeholder="Marca del producto"
                                                />
                                            </div>
                                        )}

                                        {showField('supplier') && (
                                            <div>
                                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                                    Proveedor
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.supplier}
                                                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                                                    placeholder="Nombre del proveedor"
                                                />
                                            </div>
                                        )}

                                        {showField('expirationDate') && (
                                            <div>
                                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                                    Fecha de Vencimiento
                                                </label>
                                                <input
                                                    type="date"
                                                    value={formData.expirationDate}
                                                    onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                                                />
                                            </div>
                                        )}

                                        {showField('batch') && batches.length > 0 && (
                                            <div>
                                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                                    Lote Asociado
                                                </label>
                                                <select
                                                    value={formData.batchId}
                                                    onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                                                >
                                                    <option value="">Ninguno</option>
                                                    {batches.map(batch => (
                                                        <option key={batch.id} value={batch.id}>{batch.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                                Costo Unitario
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.unitCost}
                                                onChange={(e) => setFormData({ ...formData, unitCost: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                                                placeholder="0.00"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                                Ubicación
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                                                placeholder="Estante A, Cuarto 1, etc."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => router.push('/inventory')}
                                        className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50"
                                    >
                                        {loading ? 'Creando...' : 'Crear Item'}
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

