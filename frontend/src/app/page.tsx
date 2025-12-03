'use client';

import { useRouter } from 'next/navigation';
import { Leaf, Brain, Package, BookOpen, Calculator, Shield, Zap, Check, LineChart, Bell, Cloud, Users, FileText, TrendingUp, Scale, ClipboardCheck } from 'lucide-react';

export default function LandingPage() {
    const router = useRouter();

    const features = [
        {
            icon: Brain,
            title: 'Diagnóstico IA Avanzado',
            description: 'Identifica problemas en tus plantas al instante con inteligencia artificial especializada en cannabis medicinal'
        },
        {
            icon: Calculator,
            title: 'Calculadora VPD Profesional',
            description: 'Optimiza tu ambiente de cultivo con cálculos precisos de déficit de presión de vapor y rangos personalizables por etapa'
        },
        {
            icon: BookOpen,
            title: 'Bitácora Digital Completa',
            description: 'Registra cada etapa del cultivo con trazabilidad completa desde semilla hasta producto final para cumplimiento regulatorio'
        },
        {
            icon: Package,
            title: 'Gestión de Inventario',
            description: 'Control total de insumos, fertilizantes, semillas y cosechas con alertas automáticas de stock bajo y reposición'
        },
        {
            icon: LineChart,
            title: 'Seguimiento de Lotes',
            description: 'Administra múltiples lotes simultáneamente con control de etapas, días de cultivo, rendimiento y estadísticas de producción'
        },
        {
            icon: FileText,
            title: 'Reportes Regulatorios',
            description: 'Genera reportes automáticos adaptados a las reglamentaciones vigentes de REPROCANN y organismos de control'
        },
        {
            icon: TrendingUp,
            title: 'Análisis de Rendimiento',
            description: 'Estadísticas detalladas de producción, costos por gramo, eficiencia de cultivo y proyecciones de cosecha'
        },
        {
            icon: Scale,
            title: 'Control de Calidad',
            description: 'Registra parámetros de calidad, contenido de cannabinoides, terpenos y cumplimiento de estándares farmacéuticos'
        },
        {
            icon: ClipboardCheck,
            title: 'Auditorías y Trazabilidad',
            description: 'Sistema completo de auditoría con historial inmutable de todas las operaciones para inspecciones y certificaciones'
        },
        {
            icon: Bell,
            title: 'Notificaciones Inteligentes',
            description: 'Recibe alertas en tiempo real sobre eventos críticos, cambios de etapa, stock bajo y recordatorios de tareas'
        },
        {
            icon: Cloud,
            title: 'Acceso Multi-dispositivo',
            description: 'Tus datos sincronizados en la nube, accesibles desde cualquier dispositivo con respaldo automático y seguridad'
        },
        {
            icon: Users,
            title: 'Gestión de Equipo',
            description: 'Asigna roles y permisos a tu equipo de trabajo, controla accesos y mantén un registro de responsabilidades'
        }
    ];

    const benefits = [
        'Cumplimiento REPROCANN y normativas vigentes',
        'Trazabilidad completa semilla→producto',
        'Optimización de costos y recursos',
        'Reportes profesionales exportables',
        'Soporte técnico especializado',
        'Actualizaciones constantes'
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-cyan-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-emerald-600/10" />

                <nav className="relative z-10 container mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                <Leaf className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">Plata Linda</span>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => router.push('/login')}
                                className="px-6 py-2 text-gray-700 hover:text-gray-900 font-semibold transition-colors"
                            >
                                Iniciar Sesión
                            </button>
                            <button
                                onClick={() => router.push('/register')}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors shadow-lg"
                            >
                                Comenzar Gratis
                            </button>
                        </div>
                    </div>
                </nav>

                <div className="relative z-10 container mx-auto px-6 py-20 text-center">
                    <h1 className="text-6xl font-bold text-gray-900 mb-6">
                        Plataforma Profesional para
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                            Cultivadores y Productores
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        La solución completa para gestión de cannabis medicinal con trazabilidad, cumplimiento regulatorio y optimización de producción
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <button
                            onClick={() => router.push('/register')}
                            className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold text-lg transition-colors shadow-xl flex items-center gap-2"
                        >
                            <Zap size={24} />
                            Comenzar Ahora - Gratis
                        </button>
                        <button
                            onClick={() => router.push('/plans')}
                            className="px-8 py-4 bg-white text-gray-900 rounded-lg hover:bg-gray-50 font-bold text-lg transition-colors shadow-xl border-2 border-gray-200"
                        >
                            Ver Planes PRO
                        </button>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div id="features" className="container mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Todo lo que necesitas para tu operación
                    </h2>
                    <p className="text-xl text-gray-600">
                        Herramientas profesionales diseñadas para cultivadores y productores exigentes
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4">
                                <feature.icon className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 py-20">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-white mb-6">
                                ¿Por qué elegir Plata Linda?
                            </h2>
                            <p className="text-green-100 text-lg mb-8">
                                Desarrollado por expertos en cultivo medicinal y tecnología, diseñado específicamente para cumplir con las regulaciones argentinas y estándares internacionales de producción.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center gap-3 text-white">
                                        <Check className="text-green-300 flex-shrink-0" size={24} />
                                        <span className="font-semibold">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                            <div className="text-center mb-6">
                                <Shield className="w-20 h-20 text-white mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    Seguridad y Cumplimiento
                                </h3>
                                <p className="text-green-100">
                                    Tus datos están protegidos con las mejores prácticas de seguridad y cumplimiento regulatorio
                                </p>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <div className="text-3xl font-bold text-white">99.9%</div>
                                    <div className="text-green-100 text-sm">Disponibilidad</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-white">SSL</div>
                                    <div className="text-green-100 text-sm">Seguro</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-white">24/7</div>
                                    <div className="text-green-100 text-sm">Soporte</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="container mx-auto px-6 py-20 text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    Comienza tu producción profesional hoy
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                    Únete a cientos de cultivadores y productores que confían en Plata Linda
                </p>
                <button
                    onClick={() => router.push('/register')}
                    className="px-10 py-5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold text-xl transition-colors shadow-2xl"
                >
                    Crear Cuenta Gratuita
                </button>
                <p className="text-gray-500 mt-4">
                    No se requiere tarjeta de crédito • Acceso inmediato • Plan gratuito para siempre
                </p>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                    <Leaf className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold">Plata Linda</span>
                            </div>
                            <p className="text-gray-400">
                                Gestión profesional para cultivadores y productores de cannabis medicinal
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Producto</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#features" className="hover:text-white">Características</a></li>
                                <li><a href="#" onClick={() => router.push('/plans')} className="hover:text-white">Planes y Precios</a></li>
                                <li><a href="#" onClick={() => router.push('/register')} className="hover:text-white">Comenzar Gratis</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Empresa</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white">Sobre Nosotros</a></li>
                                <li><a href="#" className="hover:text-white">Blog</a></li>
                                <li><a href="#" className="hover:text-white">Contacto</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Legal</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white">Privacidad</a></li>
                                <li><a href="#" className="hover:text-white">Términos</a></li>
                                <li><a href="#" className="hover:text-white">Cookies</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 Plata Linda. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
