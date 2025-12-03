"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Leaf, ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setSent(true);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4">
            <div className="w-full max-w-md space-y-8">
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Volver al inicio de sesión
                </Link>

                <div className="bg-white rounded-xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                <Leaf className="w-7 h-7 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">Plata Linda</span>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
                            Recuperar Contraseña
                        </h2>
                        <p className="text-sm text-gray-600">
                            Te enviaremos un enlace para restablecer tu contraseña
                        </p>
                    </div>

                    {!sent ? (
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Enviando..." : "Enviar Enlace de Recuperación"}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                ¡Correo Enviado!
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Hemos enviado un enlace de recuperación a <strong>{email}</strong>
                            </p>
                            <p className="text-sm text-gray-500 mb-6">
                                Si no recibes el correo en unos minutos, revisa tu carpeta de spam.
                            </p>
                            <button
                                onClick={() => router.push('/login')}
                                className="text-green-600 hover:text-green-700 font-semibold"
                            >
                                Volver al inicio de sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
