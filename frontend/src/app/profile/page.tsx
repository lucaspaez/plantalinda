'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { User, Mail, Shield, Calendar, Clock, Award, TrendingUp, Package, Leaf } from 'lucide-react';

export default function ProfilePage() {
    const router = useRouter();
    const [userData, setUserData] = useState({
        email: '',
        role: 'FREE',
        firstname: '',
        lastname: '',
        createdAt: null as Date | null
    });

    useEffect(() => {
        // Get user data from token
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const role = payload.role || payload.authorities?.[0]?.authority || 'FREE';

                setUserData({
                    email: payload.sub || 'usuario@ejemplo.com',
                    role: role.replace('ROLE_', ''),
                    firstname: payload.firstname || '',
                    lastname: payload.lastname || '',
                    createdAt: payload.iat ? new Date(payload.iat * 1000) : null
                });
            } catch (err) {
                console.error('Error decoding token:', err);
            }
        }
    }, []);

    const getInitials = () => {
        const first = userData.firstname?.[0] || userData.email?.[0] || 'U';
        const last = userData.lastname?.[0] || '';
        return (first + last).toUpperCase();
    };

    const formatDate = (date: Date | null) => {
        if (!date) return 'N/A';
        return date.toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getDaysSinceCreation = () => {
        if (!userData.createdAt) return 0;
        const now = new Date();
        const diff = now.getTime() - userData.createdAt.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    };

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Profile Header Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-green-500 to-emerald-600"></div>
                    <div className="px-6 pb-6">
                        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16">
                            <div className="w-32 h-32 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-lg">
                                <span className="text-4xl font-bold text-green-600 dark:text-green-400">
                                    {getInitials()}
                                </span>
                            </div>
                            <div className="flex-1 text-center sm:text-left sm:mb-4">
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {userData.firstname && userData.lastname
                                        ? `${userData.firstname} ${userData.lastname}`
                                        : userData.email.split('@')[0]
                                    }
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    Cultivador Profesional
                                </p>
                            </div>
                            <div className="sm:mb-4">
                                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-lg ${userData.role === 'PRO'
                                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}>
                                    {userData.role === 'PRO' ? (
                                        <>
                                            <Award size={20} />
                                            PRO
                                        </>
                                    ) : (
                                        <>
                                            🆓 FREE
                                        </>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Miembro desde</h3>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {formatDate(userData.createdAt)}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Días activo</h3>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {getDaysSinceCreation()}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Tipo de cuenta</h3>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {userData.role}
                        </p>
                    </div>
                </div>

                {/* Account Information */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <User size={24} className="text-green-600" />
                        Información de la Cuenta
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                <Mail size={16} className="inline mr-2" />
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                value={userData.email}
                                disabled
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Este es tu identificador único en el sistema
                            </p>
                        </div>

                        {(userData.firstname || userData.lastname) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {userData.firstname && (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Nombre
                                        </label>
                                        <input
                                            type="text"
                                            value={userData.firstname}
                                            disabled
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white cursor-not-allowed"
                                        />
                                    </div>
                                )}
                                {userData.lastname && (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Apellido
                                        </label>
                                        <input
                                            type="text"
                                            value={userData.lastname}
                                            disabled
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white cursor-not-allowed"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Plan Features */}
                {userData.role === 'FREE' && (
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg shadow-lg p-6 border-2 border-purple-200 dark:border-purple-700">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    Actualiza a PRO
                                </h2>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Desbloquea funcionalidades avanzadas para llevar tu cultivo al siguiente nivel
                                </p>
                            </div>
                            <Award className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <Leaf className="w-4 h-4 text-green-600" />
                                <span className="text-sm">Lotes ilimitados</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <Package className="w-4 h-4 text-green-600" />
                                <span className="text-sm">Inventario avanzado</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <TrendingUp className="w-4 h-4 text-green-600" />
                                <span className="text-sm">Análisis de rendimiento</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <Shield className="w-4 h-4 text-green-600" />
                                <span className="text-sm">Reportes REPROCANN</span>
                            </div>
                        </div>

                        <button
                            onClick={() => router.push('/upgrade')}
                            className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold shadow-lg"
                        >
                            Ver Planes PRO
                        </button>
                    </div>
                )}

                {userData.role === 'PRO' && (
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg shadow-lg p-6 border-2 border-purple-200 dark:border-purple-700">
                        <div className="flex items-center gap-3 mb-4">
                            <Award className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Cuenta PRO Activa
                                </h2>
                                <p className="text-gray-700 dark:text-gray-300 text-sm">
                                    Tienes acceso a todas las funcionalidades premium
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                                <Leaf className="w-6 h-6 text-green-600 mx-auto mb-1" />
                                <p className="text-xs text-gray-600 dark:text-gray-400">Lotes ilimitados</p>
                            </div>
                            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                                <Package className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                                <p className="text-xs text-gray-600 dark:text-gray-400">Inventario completo</p>
                            </div>
                            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                                <p className="text-xs text-gray-600 dark:text-gray-400">Análisis avanzado</p>
                            </div>
                            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                                <Shield className="w-6 h-6 text-orange-600 mx-auto mb-1" />
                                <p className="text-xs text-gray-600 dark:text-gray-400">Reportes oficiales</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
