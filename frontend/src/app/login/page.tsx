"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import Link from "next/link";
import { Leaf, ArrowLeft } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await api.post("/auth/authenticate", {
                email,
                password,
            });

            const { token } = response.data;
            localStorage.setItem("token", token);
            router.push("/dashboard");
        } catch (err: any) {
            // Extraer mensaje del backend si existe
            const backendMessage = err?.response?.data?.message;
            setError(backendMessage || "Credenciales inválidas. Por favor intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4">
            <div className="w-full max-w-md space-y-8">
                {/* Back to landing */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Volver al inicio
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
                            ¡Bienvenido de vuelta!
                        </h2>
                        <p className="text-sm text-gray-600">
                            Ingresa a tu cuenta para continuar
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Correo Electrónico
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Contraseña
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-green-600 hover:text-green-500"
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                        </button>

                        <p className="text-sm text-gray-600 text-center mt-4">
                            ¿No tienes una cuenta?{" "}
                            <Link
                                href="/register"
                                className="font-medium text-green-600 hover:text-green-500"
                            >
                                Regístrate gratis
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
