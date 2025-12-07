'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProGuard from '@/components/ProGuard';
import RoleGuard from '@/components/RoleGuard';
import api from '@/services/api';

interface InventoryItem {
    id: number;
    name: string;
    type: string;
    description: string;
    currentQuantity: number;
    minimumQuantity: number | null;
    unit: string;
    strain: string | null;
    brand: string | null;
    supplier: string | null;
    expirationDate: string | null;
    batchId: number | null;
    batchName: string | null;
    unitCost: number | null;
    location: string | null;
    isLowStock: boolean;
}

interface Movement {
    id: number;
    type: string;
    quantity: number;
    previousQuantity: number;
    newQuantity: number;
    notes: string;
    batchName: string | null;
    cost: number | null;
    timestamp: string;
}

const TYPE_LABELS: Record<string, string> = {
    SEED: 'Semillas', FERTILIZER: 'Fertilizante', SUBSTRATE: 'Sustrato',
    SUPPLEMENT: 'Suplemento', EQUIPMENT: 'Equipamiento', PLANT_ACTIVE: 'Planta Activa',
    HARVEST_WET: 'Cosecha Húmeda', HARVEST_DRY: 'Cosecha Seca',
    FINAL_PRODUCT: 'Producto Final', OTHER: 'Otro'
};

const UNIT_LABELS: Record<string, string> = {
    UNIT: 'unidad(es)', GRAM: 'g', KILOGRAM: 'kg',
    LITER: 'L', MILLILITER: 'ml', PACKAGE: 'paquete(s)'
};

const MOVEMENT_TYPES = [
    { value: 'PURCHASE', label: 'Compra', icon: '🛒' },
    { value: 'DONATION', label: 'Donación', icon: '🎁' },
    { value: 'PRODUCTION', label: 'Producción', icon: '🌱' },
    { value: 'USAGE', label: 'Uso', icon: '📤' },
    { value: 'SALE', label: 'Venta', icon: '💰' },
    { value: 'LOSS', label: 'Pérdida', icon: '❌' },
    { value: 'TRANSFER', label: 'Transferencia', icon: '🔄' },
    { value: 'ADJUSTMENT', label: 'Ajuste', icon: '⚙️' }
];

export default function InventoryDetailPage() {
    const router = useRouter();
    const params = useParams();
    const itemId = params.id as string;

    const [item, setItem] = useState<InventoryItem | null>(null);
    const [movements, setMovements] = useState<Movement[]>([]);
    const [loading, setLoading] = useState(true);
    const [showMovementForm, setShowMovementForm] = useState(false);
    const [movementForm, setMovementForm] = useState({
        type: 'PURCHASE',
        quantity: '',
        notes: '',
        cost: ''
    });

    useEffect(() => {
        fetchData();
    }, [itemId]);

    const fetchData = async () => {
        try {
            const [itemRes, movementsRes] = await Promise.all([
                api.get(`/inventory/items/${itemId}`),
                api.get(`/inventory/items/${itemId}/movements`)
            ]);
            setItem(itemRes.data);
            setMovements(movementsRes.data);
        } catch (err) {
            console.error('Error loading data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMovement = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await api.post('/inventory/movements', {
                inventoryItemId: parseInt(itemId),
                type: movementForm.type,
                quantity: parseFloat(movementForm.quantity),
                notes: movementForm.notes || null,
                cost: movementForm.cost ? parseFloat(movementForm.cost) : null,
                batchId: null
            });
            setShowMovementForm(false);
            setMovementForm({ type: 'PURCHASE', quantity: '', notes: '', cost: '' });
            fetchData();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error al registrar movimiento');
        }
    };

    const getMovementLabel = (type: string) => {
        return MOVEMENT_TYPES.find(t => t.value === type)?.label || type;
    };

    const getMovementIcon = (type: string) => {
        return MOVEMENT_TYPES.find(t => t.value === type)?.icon || '📦';
    };

    if (loading) {
        return (
            <ProGuard feature="Ver detalles de inventario">
                <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
                    <div className="text-xl text-gray-600">Cargando...</div>
                </div>
            </ProGuard>
        );
    }

    if (!item) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
                <div className="text-xl text-gray-600">Item no encontrado</div>
            </div>
        );
    }

    return (
        <ProGuard feature="Ver detalles de inventario">
            <RoleGuard requiredPermission="canManageInventory" feature="Inventario">
                <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
                    <div className="max-w-6xl mx-auto">
                        {/* Header */}
                        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                        {item.name}
                                    </h1>
                                    <div className="flex gap-2 items-center">
                                        <span className="text-sm bg-gray-100 px-3 py-1 rounded">
                                            {TYPE_LABELS[item.type]}
                                        </span>
                                        {item.isLowStock && (
                                            <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded font-semibold">
                                                ⚠️ Stock Bajo
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => router.push('/inventory')}
                                    className="text-gray-600 hover:text-gray-800"
                                >
                                    ← Volver
                                </button>
                            </div>

                            {/* Item Details */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">Stock Actual</p>
                                    <p className="text-3xl font-bold text-green-600">
                                        {item.currentQuantity} {UNIT_LABELS[item.unit]}
                                    </p>
                                </div>
                                {item.minimumQuantity && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Stock Mínimo</p>
                                        <p className="text-2xl font-bold text-gray-700">
                                            {item.minimumQuantity} {UNIT_LABELS[item.unit]}
                                        </p>
                                    </div>
                                )}
                                {item.unitCost && (
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">Valor Total</p>
                                        <p className="text-2xl font-bold text-blue-600">
                                            ${(item.currentQuantity * item.unitCost).toFixed(2)}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Additional Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                {item.description && (
                                    <div className="md:col-span-2">
                                        <p className="text-sm text-gray-600 font-semibold">Descripción:</p>
                                        <p className="text-gray-700">{item.description}</p>
                                    </div>
                                )}
                                {item.strain && (
                                    <div>
                                        <p className="text-sm text-gray-600 font-semibold">Cepa:</p>
                                        <p className="text-gray-700">{item.strain}</p>
                                    </div>
                                )}
                                {item.brand && (
                                    <div>
                                        <p className="text-sm text-gray-600 font-semibold">Marca:</p>
                                        <p className="text-gray-700">{item.brand}</p>
                                    </div>
                                )}
                                {item.supplier && (
                                    <div>
                                        <p className="text-sm text-gray-600 font-semibold">Proveedor:</p>
                                        <p className="text-gray-700">{item.supplier}</p>
                                    </div>
                                )}
                                {item.location && (
                                    <div>
                                        <p className="text-sm text-gray-600 font-semibold">Ubicación:</p>
                                        <p className="text-gray-700">{item.location}</p>
                                    </div>
                                )}
                                {item.batchName && (
                                    <div>
                                        <p className="text-sm text-gray-600 font-semibold">Lote:</p>
                                        <p className="text-gray-700">{item.batchName}</p>
                                    </div>
                                )}
                                {item.expirationDate && (
                                    <div>
                                        <p className="text-sm text-gray-600 font-semibold">Vencimiento:</p>
                                        <p className="text-gray-700">{new Date(item.expirationDate).toLocaleDateString('es-AR')}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Movements */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    📊 Movimientos
                                </h2>
                                <button
                                    onClick={() => setShowMovementForm(!showMovementForm)}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                                >
                                    {showMovementForm ? 'Cancelar' : '+ Nuevo Movimiento'}
                                </button>
                            </div>

                            {/* Movement Form */}
                            {showMovementForm && (
                                <form onSubmit={handleAddMovement} className="bg-gray-50 p-6 rounded-lg mb-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                Tipo de Movimiento
                                            </label>
                                            <select
                                                value={movementForm.type}
                                                onChange={(e) => setMovementForm({ ...movementForm, type: e.target.value })}
                                                className="w-full px-3 py-2 border rounded-lg"
                                            >
                                                {MOVEMENT_TYPES.map(type => (
                                                    <option key={type.value} value={type.value}>
                                                        {type.icon} {type.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                Cantidad
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                required
                                                value={movementForm.quantity}
                                                onChange={(e) => setMovementForm({ ...movementForm, quantity: e.target.value })}
                                                className="w-full px-3 py-2 border rounded-lg"
                                                placeholder="10"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                Costo (opcional)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={movementForm.cost}
                                                onChange={(e) => setMovementForm({ ...movementForm, cost: e.target.value })}
                                                className="w-full px-3 py-2 border rounded-lg"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                Notas
                                            </label>
                                            <input
                                                type="text"
                                                value={movementForm.notes}
                                                onChange={(e) => setMovementForm({ ...movementForm, notes: e.target.value })}
                                                className="w-full px-3 py-2 border rounded-lg"
                                                placeholder="Notas opcionales..."
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                                    >
                                        Registrar Movimiento
                                    </button>
                                </form>
                            )}

                            {/* Movements List */}
                            {movements.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    No hay movimientos registrados
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {movements.map((movement) => (
                                        <div key={movement.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl">{getMovementIcon(movement.type)}</span>
                                                    <div>
                                                        <p className="font-semibold text-gray-800">
                                                            {getMovementLabel(movement.type)}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            {new Date(movement.timestamp).toLocaleString('es-AR')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`text-lg font-bold ${movement.quantity >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {movement.quantity >= 0 ? '+' : ''}{movement.quantity} {UNIT_LABELS[item.unit]}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {movement.previousQuantity} → {movement.newQuantity}
                                                    </p>
                                                </div>
                                            </div>
                                            {movement.notes && (
                                                <p className="text-sm text-gray-700 mt-2">{movement.notes}</p>
                                            )}
                                            {movement.cost && (
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Costo: ${movement.cost.toFixed(2)}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </RoleGuard>
        </ProGuard>
    );
}
