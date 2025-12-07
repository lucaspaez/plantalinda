'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/services/api';
import { getUserRoleAndPlan, hasPermission, Role, RolePermissions } from '@/utils/permissions';
import {
    Leaf,
    Package,
    BookOpen,
    TrendingUp,
    AlertTriangle,
    Activity,
    Calendar,
    ArrowRight
} from 'lucide-react';

interface DashboardStats {
    totalBatches: number;
    activeBatches: number;
    totalDiagnoses: number;
    lowStockItems: number;
    recentActivity: Activity[];
}

interface Activity {
    id: number;
    type: string;
    message: string;
    timestamp: string;
    icon: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats>({
        totalBatches: 0,
        activeBatches: 0,
        totalDiagnoses: 0,
        lowStockItems: 0,
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);
    const [userPlan, setUserPlan] = useState<string>('FREE');
    const [userRole, setUserRole] = useState<Role>('VIEWER');

    // Helper para verificar si una acción está disponible según plan Y rol
    const isActionAvailable = (isPro: boolean, requiredPermission?: keyof RolePermissions): boolean => {
        // Si es PRO, verificar plan
        if (isPro) {
            const hasPlan = userPlan === 'PRO' || userPlan === 'ENTERPRISE';
            if (!hasPlan) return false;
        }
        // Si requiere permiso específico, verificar rol
        if (requiredPermission) {
            return hasPermission(userRole, requiredPermission);
        }
        return true;
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch diagnoses count
            const diagnosesRes = await api.get('/diagnosis/history');
            const totalDiagnoses = diagnosesRes.data.length;

            let totalBatches = 0;
            let activeBatches = 0;
            let lowStockItems = 0;

            // Try to fetch PRO features
            try {
                const batchesRes = await api.get('/batches');
                totalBatches = batchesRes.data.length;
                activeBatches = batchesRes.data.filter((b: any) =>
                    b.currentStage !== 'HARVEST' && b.currentStage !== 'CURING'
                ).length;
            } catch (err) {
                // User is FREE or error
            }

            try {
                const inventoryRes = await api.get('/inventory/items/low-stock');
                lowStockItems = inventoryRes.data.length;
            } catch (err) {
                // User is FREE
            }

            setStats({
                totalBatches,
                activeBatches,
                totalDiagnoses,
                lowStockItems,
                recentActivity: [
                    {
                        id: 1,
                        type: 'diagnosis',
                        message: 'Nuevo diagnóstico realizado',
                        timestamp: 'Hace 2 horas',
                        icon: '🔍'
                    }
                ]
            });
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }

        // Get plan and role from JWT
        const { role, plan } = getUserRoleAndPlan();
        setUserPlan(plan);
        setUserRole(role);
    };

    const quickActions = [
        {
            title: 'Nuevo Diagnóstico',
            description: 'Analiza una planta con IA',
            icon: Leaf,
            color: 'from-green-500 to-emerald-600',
            href: '/diagnosis',
            available: isActionAvailable(false, 'canCreateDiagnosis')
        },
        {
            title: 'Calculadora VPD',
            description: 'Optimiza tu ambiente',
            icon: Activity,
            color: 'from-blue-500 to-cyan-600',
            href: '/tools',
            available: true
        },
        {
            title: 'Nuevo Lote',
            description: 'Registra un nuevo cultivo',
            icon: BookOpen,
            color: 'from-purple-500 to-pink-600',
            href: '/batches/new',
            available: isActionAvailable(true, 'canManageBatches'),
            pro: true
        },
        {
            title: 'Agregar Inventario',
            description: 'Registra insumos o cosecha',
            icon: Package,
            color: 'from-orange-500 to-red-600',
            href: '/inventory/new',
            available: isActionAvailable(true, 'canManageInventory'),
            pro: true
        }
    ];

    const statCards = [
        {
            title: 'Diagnósticos Totales',
            value: stats.totalDiagnoses,
            icon: Leaf,
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-100 dark:bg-green-900/20',
            change: '+12%',
            available: true
        },
        {
            title: 'Lotes Activos',
            value: stats.activeBatches,
            icon: BookOpen,
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-100 dark:bg-purple-900/20',
            change: '+5%',
            available: userPlan === 'PRO' || userPlan === 'ENTERPRISE',
            pro: true
        },
        {
            title: 'Items en Stock',
            value: stats.totalBatches,
            icon: Package,
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-100 dark:bg-blue-900/20',
            change: '+8%',
            available: userPlan === 'PRO' || userPlan === 'ENTERPRISE',
            pro: true
        },
        {
            title: 'Alertas de Stock',
            value: stats.lowStockItems,
            icon: AlertTriangle,
            color: 'text-orange-600 dark:text-orange-400',
            bgColor: 'bg-orange-100 dark:bg-orange-900/20',
            change: stats.lowStockItems > 0 ? 'Requiere atención' : 'Todo bien',
            available: userPlan === 'PRO' || userPlan === 'ENTERPRISE',
            pro: true
        }
    ];

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="text-xl text-gray-600 dark:text-gray-400">Cargando...</div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                    <h2 className="text-2xl font-bold mb-2">
                        ¡Bienvenido de vuelta! 🌿
                    </h2>
                    <p className="text-green-100">
                        Gestiona tu cultivo de cannabis medicinal de forma profesional
                    </p>
                    {userPlan === 'FREE' && (
                        <button
                            onClick={() => router.push('/upgrade')}
                            className="mt-4 bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors"
                        >
                            Actualizar a PRO →
                        </button>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, index) => (
                        stat.available ? (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                        <stat.icon className={stat.color} size={24} />
                                    </div>
                                    {stat.pro && (
                                        <span className="px-2 py-1 text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded">
                                            PRO
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
                                    {stat.title}
                                </h3>
                                <div className="flex items-end justify-between">
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {stat.value}
                                    </p>
                                    <span className="text-sm text-green-600 dark:text-green-400">
                                        {stat.change}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div
                                key={index}
                                className="bg-gray-100 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
                                <div className="relative">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 rounded-lg bg-gray-200 dark:bg-gray-700">
                                            <stat.icon className="text-gray-400" size={24} />
                                        </div>
                                        <span className="px-2 py-1 text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded">
                                            PRO
                                        </span>
                                    </div>
                                    <h3 className="text-gray-500 dark:text-gray-500 text-sm font-medium mb-1">
                                        {stat.title}
                                    </h3>
                                    <p className="text-2xl font-bold text-gray-400 dark:text-gray-600">
                                        Bloqueado
                                    </p>
                                </div>
                            </div>
                        )
                    ))}
                </div>

                {/* Quick Actions */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Acciones Rápidas
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {quickActions.map((action, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    // Si no está disponible y es PRO que usuario FREE no tiene, ir a upgrade
                                    if (!action.available && action.pro && userPlan === 'FREE') {
                                        router.push('/upgrade');
                                    } else if (!action.available) {
                                        // Si no está disponible por permisos de rol, navegar igual (RoleGuard bloqueará)
                                        router.push(action.href);
                                    } else {
                                        router.push(action.href);
                                    }
                                }}
                                className={`
                                    relative p-6 rounded-xl text-left transition-all cursor-pointer
                                    bg-white dark:bg-gray-800 hover:shadow-lg border border-gray-200 dark:border-gray-700
                                `}
                            >
                                <div className={`
                                    w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} 
                                    flex items-center justify-center mb-4
                                    ${!action.available && 'opacity-50'}
                                `}>
                                    <action.icon className="text-white" size={24} />
                                </div>
                                <h4 className={`font-semibold mb-1 ${action.available ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                                    {action.title}
                                    {action.pro && (
                                        <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded">
                                            PRO
                                        </span>
                                    )}
                                </h4>
                                <p className={`text-sm ${action.available ? 'text-gray-600 dark:text-gray-400' : 'text-gray-500'}`}>
                                    {action.description}
                                </p>
                                {action.available && (
                                    <ArrowRight className="absolute bottom-6 right-6 text-gray-400" size={20} />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Actividad Reciente
                        </h3>
                        <button className="text-sm text-green-600 dark:text-green-400 hover:underline">
                            Ver todo
                        </button>
                    </div>
                    {stats.recentActivity.length > 0 ? (
                        <div className="space-y-3">
                            {stats.recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <span className="text-2xl">{activity.icon}</span>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {activity.message}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {activity.timestamp}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <Calendar size={48} className="mx-auto mb-2 opacity-50" />
                            <p>No hay actividad reciente</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
