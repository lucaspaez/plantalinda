/**
 * PLATA LINDA - CONFIGURACIÓN DE COLORES
 * 
 * Este archivo centraliza todos los colores utilizados en la aplicación.
 * Para cambiar la paleta completa, modifica los valores aquí.
 * 
 * IMPORTANTE: Después de cambiar colores, reinicia el servidor de desarrollo.
 */

module.exports = {
    colors: {
        // COLOR PRINCIPAL DE MARCA (Verde - Cultivadores)
        // Cambiar estos valores para nueva identidad de marca
        brand: {
            50: '#f0fdf4',   // Muy claro
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',  // Principal
            600: '#16a34a',  // Hover states
            700: '#15803d',
            800: '#166534',
            900: '#14532d',  // Muy oscuro
        },

        // COLOR SECUNDARIO (Emerald - Complementario)
        secondary: {
            50: '#ecfdf5',
            100: '#d1fae5',
            200: '#a7f3d0',
            300: '#6ee7b7',
            400: '#34d399',
            500: '#10b981',
            600: '#059669',
            700: '#047857',
            800: '#065f46',
            900: '#064e3b',
        },

        // COLORES DE ESTADO
        success: {
            light: '#22c55e',
            DEFAULT: '#16a34a',
            dark: '#15803d',
        },

        warning: {
            light: '#fbbf24',
            DEFAULT: '#f59e0b',
            dark: '#d97706',
        },

        error: {
            light: '#ef4444',
            DEFAULT: '#dc2626',
            dark: '#b91c1c',
        },

        info: {
            light: '#3b82f6',
            DEFAULT: '#2563eb',
            dark: '#1d4ed8',
        },

        // GRISES (Modo Claro y Oscuro)
        gray: {
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827',
        },
    },

    // GRADIENTES PREDEFINIDOS
    gradients: {
        primary: 'from-green-500 to-emerald-600',
        secondary: 'from-emerald-500 to-teal-600',
        dark: 'from-gray-800 to-gray-900',
        light: 'from-green-50 to-emerald-100',
    },

    // SOMBRAS
    shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    },
};

/**
 * GUÍA DE USO:
 * 
 * 1. Para cambiar color principal:
 *    - Modifica los valores en 'brand'
 *    - Usa herramienta como https://uicolors.app/create para generar escala
 * 
 * 2. Para usar en componentes:
 *    - className="bg-brand-500 text-white"
 *    - className="hover:bg-brand-600"
 * 
 * 3. Para gradientes:
 *    - className="bg-gradient-to-r from-brand-500 to-secondary-600"
 * 
 * 4. Paletas alternativas sugeridas:
 * 
 *    AZUL (Tecnología):
 *    500: '#3b82f6'
 * 
 *    PÚRPURA (Premium):
 *    500: '#a855f7'
 * 
 *    NARANJA (Energía):
 *    500: '#f97316'
 * 
 *    TEAL (Moderno):
 *    500: '#14b8a6'
 */
