"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import Link from "next/link";
import { Leaf, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await api.post("/auth/register", formData);
            const { token } = response.data;
            localStorage.setItem("token", token);
            router.push("/dashboard");
        } catch (err) {
            setError("Error al crear la cuenta. Por favor intenta de nuevo.");
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
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            Crea tu cuenta
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            ¿Ya tienes una cuenta?{" "}
                            <Link
                                href="/login"
                                className="font-medium text-green-600 hover:text-green-500"
                            >
                                Inicia sesión
                            </Link>
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nombre
                                </label>
                                <input
                                    name="firstname"
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Juan"
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Apellido
                                </label>
                                <input
                                    name="lastname"
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Pérez"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Correo Electrónico
                            </label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="juan@ejemplo.com"
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Contraseña
                            </label>
                            <input
                                name="password"
                                type="password"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Mínimo 8 caracteres"
                                onChange={handleChange}
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
                            {loading ? "Creando cuenta..." : "Crear Cuenta Gratis"}
                        </button>

                        <p className="text-xs text-gray-500 text-center mt-4">
                            Al registrarte, aceptas nuestros Términos de Servicio y Política de Privacidad
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
