'use client';

import { Leaf, Check, X, Zap } from 'lucide-react';
import Link from 'next/link';

export default function PlansPage() {
    const freePlan = [
        'Diagnóstico IA básico (5 análisis/mes)',
        'Calculadora VPD',
        'Bitácora digital',
        'Hasta 2 lotes simultáneos',
        'Inventario básico',
        'Soporte por email'
    ];

    const proPlan = [
        'Diagnóstico IA ilimitado',
        'Calculadora VPD con rangos personalizados',
        'Bitácora digital completa',
        'Lotes ilimitados',
        'Inventario avanzado con alertas',
        'Reportes REPROCANN',
        'Análisis de rendimiento',
        'Control de calidad',
        'Auditorías y trazabilidad',
        'Notificaciones en tiempo real',
        'Gestión de equipo',
        'Soporte prioritario 24/7',
        'Exportación de datos',
        'API access'
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-cyan-50">
            {/* Header */}
            <nav className="container mx-auto px-6 py-6">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                            <Leaf className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900">Plata Linda</span>
                    </Link>
                    <div className="flex gap-4">
                        <Link
                            href="/login"
                            className="px-6 py-2 text-gray-700 hover:text-gray-900 font-semibold transition-colors"
                        >
                            Iniciar Sesión
                        </Link>
                        <Link
                            href="/register"
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors shadow-lg"
                        >
                            Comenzar Gratis
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Plans Section */}
            <div className="container mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">
                        Elige el plan perfecto para tu operación
                    </h1>
                    <p className="text-xl text-gray-600">
                        Comienza gratis y actualiza cuando estés listo
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* FREE Plan */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">FREE</h2>
                            <div className="text-5xl font-bold text-gray-900 mb-2">
                                $0
                                <span className="text-xl text-gray-600">/mes</span>
                            </div>
                            <p className="text-gray-600">Para comenzar tu cultivo</p>
                        </div>

                        <ul className="space-y-4 mb-8">
                            {freePlan.map((feature, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <Link
                            href="/register"
                            className="block w-full bg-gray-100 text-gray-900 text-center py-3 rounded-lg hover:bg-gray-200 font-semibold transition-colors"
                        >
                            Comenzar Gratis
                        </Link>
                    </div>

                    {/* PRO Plan */}
                    <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-2xl p-8 border-2 border-green-700 relative">
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <span className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                                POPULAR
                            </span>
                        </div>

                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2">PRO</h2>
                            <div className="text-5xl font-bold text-white mb-2">
                                $29
                                <span className="text-xl text-green-100">/mes</span>
                            </div>
                            <p className="text-green-100">Para productores profesionales</p>
                        </div>

                        <ul className="space-y-4 mb-8">
                            {proPlan.map((feature, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                                    <span className="text-white">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <Link
                            href="/register"
                            className="block w-full bg-white text-green-600 text-center py-3 rounded-lg hover:bg-green-50 font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                            <Zap size={20} />
                            Comenzar con PRO
                        </Link>
                    </div>
                </div>

                {/* FAQ */}
                <div className="max-w-3xl mx-auto mt-20">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                        Preguntas Frecuentes
                    </h2>
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg p-6 shadow-lg">
                            <h3 className="font-bold text-gray-900 mb-2">
                                ¿Puedo cambiar de plan en cualquier momento?
                            </h3>
                            <p className="text-gray-600">
                                Sí, puedes actualizar a PRO en cualquier momento. El plan FREE es gratuito para siempre.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-lg">
                            <h3 className="font-bold text-gray-900 mb-2">
                                ¿Necesito tarjeta de crédito para el plan FREE?
                            </h3>
                            <p className="text-gray-600">
                                No, el plan FREE no requiere tarjeta de crédito. Puedes comenzar inmediatamente.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-lg">
                            <h3 className="font-bold text-gray-900 mb-2">
                                ¿Qué incluye el soporte 24/7?
                            </h3>
                            <p className="text-gray-600">
                                Los usuarios PRO tienen acceso a soporte prioritario por email, chat y teléfono las 24 horas.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
