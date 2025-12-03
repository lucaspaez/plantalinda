'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/services/api';
import { Package, AlertTriangle, Filter, Plus, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';

interface InventoryItem {
    id: number;
    name: string;
    type: string;
    currentQuantity: number;
    minimumQuantity: number | null;
    unit: string;
    strain: string | null;
    brand: string | null;
    isLowStock: boolean;
    batchName: string | null;
}

const TYPE_LABELS: Record<string, string> = {
    SEED: 'Semillas',
    FERTILIZER: 'Fertilizante',
    SUBSTRATE: 'Sustrato',
    SUPPLEMENT: 'Suplemento',
    EQUIPMENT: 'Equipamiento',
    PLANT_ACTIVE: 'Planta Activa',
    HARVEST_WET: 'Cosecha Húmeda',
    HARVEST_DRY: 'Cosecha Seca',
    FINAL_PRODUCT: 'Producto Final',
    OTHER: 'Otro'
};

const UNIT_LABELS: Record<string, string> = {
    UNIT: 'unidad(es)',
    GRAM: 'g',
    KILOGRAM: 'kg',
    LITER: 'L',
    MILLILITER: 'ml',
    PACKAGE: 'paquete(s)'
};

export default function InventoryPage() {
    const router = useRouter();
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterType, setFilterType] = useState<string>('ALL');

    useEffect(() => {
        fetchInventory();
    }, [filterType]);

    const fetchInventory = async () => {
        try {
            const endpoint = filterType === 'ALL'
                ? '/inventory/items'
                : `/inventory/items/type/${filterType}`;
            const response = await api.get(endpoint);
            setItems(response.data);
        } catch (err: any) {
            if (err.response?.status === 403) {
                setError('Esta funcionalidad es solo para usuarios PRO');
            } else {
                setError('Error al cargar inventario');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este item?')) return;

        try {
            await api.delete(`/inventory/items/${id}`);
            fetchInventory();
        } catch (err) {
            alert('Error al eliminar item');
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="text-xl text-gray-600 dark:text-gray-400">Cargando inventario...</div>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md text-center">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Acceso Restringido</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                        <button
                            onClick={() => router.push('/upgrade')}
                            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold transition-colors"
                        >
                            Actualizar a PRO
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const lowStockItems = items.filter(item => item.isLowStock);

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <Package className="w-8 h-8 text-green-600" />
                            Inventario
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Gestión completa de insumos y productos
                        </p>
                    </div>
                    <button
                        onClick={() => router.push('/inventory/new')}
                        className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-lg"
                    >
                        <Plus size={20} />
                        Nuevo Item
                    </button>
                </div>

                {/* Low Stock Alert */}
                {lowStockItems.length > 0 && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                        <div className="flex items-center">
                            <AlertTriangle className="text-yellow-500 mr-3" size={24} />
                            <div>
                                <p className="font-bold text-yellow-800 dark:text-yellow-200">Stock Bajo Detectado</p>
                                <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                                    {lowStockItems.length} item(s) requieren reposición inmediata
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filter */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <Filter className="text-gray-400" size={20} />
                        <label className="text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">
                            Filtrar por tipo:
                        </label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full md:w-auto px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white"
                        >
                            <option value="ALL">Todos los items</option>
                            {Object.entries(TYPE_LABELS).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Items Grid */}
                {items.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center border border-gray-200 dark:border-gray-700">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="w-10 h-10 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Inventario Vacío
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                            No tienes items registrados. Comienza agregando tus semillas, fertilizantes o equipamiento.
                        </p>
                        <button
                            onClick={() => router.push('/inventory/new')}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                        >
                            Crear Primer Item
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className={`
                                    bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all border
                                    ${item.isLowStock
                                        ? 'border-yellow-500 dark:border-yellow-500'
                                        : 'border-gray-200 dark:border-gray-700'
                                    }
                                `}
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1" title={item.name}>
                                            {item.name}
                                        </h3>
                                        {item.isLowStock && (
                                            <span className="text-yellow-500" title="Stock Bajo">
                                                <AlertTriangle size={20} />
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Tipo</span>
                                            <span className="font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                                {TYPE_LABELS[item.type]}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Stock Actual</span>
                                            <span className={`font-bold ${item.isLowStock ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-900 dark:text-white'}`}>
                                                {item.currentQuantity} {UNIT_LABELS[item.unit]}
                                            </span>
                                        </div>
                                        {item.minimumQuantity && (
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500 dark:text-gray-400">Stock Mínimo</span>
                                                <span className="text-gray-700 dark:text-gray-300">
                                                    {item.minimumQuantity} {UNIT_LABELS[item.unit]}
                                                </span>
                                            </div>
                                        )}
                                        {(item.strain || item.brand) && (
                                            <div className="pt-2 border-t border-gray-100 dark:border-gray-700 mt-2">
                                                {item.strain && (
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        Cepa: <span className="text-gray-700 dark:text-gray-300">{item.strain}</span>
                                                    </div>
                                                )}
                                                {item.brand && (
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        Marca: <span className="text-gray-700 dark:text-gray-300">{item.brand}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => router.push(`/inventory/${item.id}`)}
                                            className="flex-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 py-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors font-medium text-sm"
                                        >
                                            Ver Detalles
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            title="Eliminar"
                                        >
                                            <Trash2 size={18} />
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
