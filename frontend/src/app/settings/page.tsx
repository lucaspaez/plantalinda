'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Bell, Settings } from 'lucide-react';

export default function SettingsPage() {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    useEffect(() => {
        const notifEnabled = localStorage.getItem('notificationsEnabled') !== 'false';
        setNotificationsEnabled(notifEnabled);
    }, []);

    const toggleNotifications = () => {
        const newState = !notificationsEnabled;
        setNotificationsEnabled(newState);
        localStorage.setItem('notificationsEnabled', String(newState));
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
                            <Settings size={32} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Configuración</h2>
                            <p className="text-gray-600 dark:text-gray-400">Preferencias de la aplicación</p>
                        </div>
                    </div>

                    <div className="space-y-4">

                        <div className="flex items-center justify-between">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    <Bell size={16} className="inline mr-2" />
                                    Notificaciones
                                </label>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Recibe alertas de stock bajo y actualizaciones
                                </p>
                            </div>
                            <button
                                onClick={toggleNotifications}
                                className={`relative w-14 h-7 rounded-full transition-colors ${notificationsEnabled ? 'bg-green-600' : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${notificationsEnabled ? 'transform translate-x-7' : ''
                                        }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
