'use client';

import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { Check, X, Zap } from 'lucide-react';

export default function UpgradePage() {
    const router = useRouter();

    const features = {
        free: [
            { name: 'Diagnóstico IA ilimitado', included: true },
            { name: 'Calculadora VPD', included: true },
            { name: 'Rangos personalizables', included: true },
            { name: 'Gestión de lotes', included: false },
            { name: 'Bitácora digital', included: false },
            { name: 'Inventario completo', included: false },
            { name: 'Trazabilidad semilla→producto', included: false },
            { name: 'Reportes y exportación', included: false },
            { name: 'Soporte prioritario', included: false },
        ],
        pro: [
            { name: 'Diagnóstico IA ilimitado', included: true },
            { name: 'Calculadora VPD', included: true },
            { name: 'Rangos personalizables', included: true },
            { name: 'Gestión de lotes', included: true },
            { name: 'Bitácora digital', included: true },
            { name: 'Inventario completo', included: true },
            { name: 'Trazabilidad semilla→producto', included: true },
            { name: 'Reportes y exportación', included: true },
            { name: 'Soporte prioritario', included: true },
        ]
    };

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Actualiza a <span className="text-purple-600 dark:text-purple-400">PRO</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        Desbloquea todo el potencial de tu cultivo medicinal
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* FREE Plan */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-2 border-gray-200 dark:border-gray-700">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Plan FREE
                            </h3>
                            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                $0
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">Por siempre</p>
                        </div>

                        <ul className="space-y-3 mb-8">
                            {features.free.map((feature, index) => (
                                <li key={index} className="flex items-center gap-3">
                                    {feature.included ? (
                                        <Check className="text-green-500 flex-shrink-0" size={20} />
                                    ) : (
                                        <X className="text-gray-400 flex-shrink-0" size={20} />
                                    )}
                                    <span className={feature.included ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}>
                                        {feature.name}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => router.push('/dashboard')}
                            className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                            Plan Actual
                        </button>
                    </div>

                    {/* PRO Plan */}
                    <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-2xl p-8 relative overflow-hidden">
                        <div className="absolute top-4 right-4">
                            <span className="bg-yellow-400 text-purple-900 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                <Zap size={16} />
                                POPULAR
                            </span>
                        </div>

                        <div className="text-center mb-6 text-white">
                            <h3 className="text-2xl font-bold mb-2">
                                Plan PRO
                            </h3>
                            <div className="text-4xl font-bold mb-2">
                                $29
                            </div>
                            <p className="text-purple-100">Por mes</p>
                        </div>

                        <ul className="space-y-3 mb-8">
                            {features.pro.map((feature, index) => (
                                <li key={index} className="flex items-center gap-3 text-white">
                                    <Check className="text-yellow-400 flex-shrink-0" size={20} />
                                    <span>{feature.name}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => alert('Funcionalidad de pago en desarrollo. Contacta a soporte@cannabisapp.com')}
                            className="w-full bg-white text-purple-600 py-3 rounded-lg font-bold hover:bg-purple-50 transition-colors shadow-lg"
                        >
                            Actualizar Ahora
                        </button>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                        ¿Por qué actualizar a PRO?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">📊</span>
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                                Trazabilidad Completa
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Rastrea cada planta desde semilla hasta cosecha con bitácora digital profesional
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">📦</span>
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                                Gestión de Inventario
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Control total de insumos, fertilizantes y cosechas con alertas automáticas
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">📈</span>
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                                Reportes Profesionales
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Exporta datos y genera reportes para cumplimiento regulatorio
                            </p>
                        </div>
                    </div>
                </div>

                {/* FAQ */}
                <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Preguntas Frecuentes
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                                ¿Puedo cancelar en cualquier momento?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Sí, puedes cancelar tu suscripción en cualquier momento sin penalización.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                                ¿Qué métodos de pago aceptan?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Aceptamos tarjetas de crédito, débito y transferencias bancarias.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                                ¿Hay descuentos por pago anual?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Sí, obtén 2 meses gratis pagando anualmente ($290/año en lugar de $348).
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
