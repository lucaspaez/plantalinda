'use client';

import { ReactNode, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/services/api';
import { getUserRoleAndPlan, hasPermission, Role, RolePermissions } from '@/utils/permissions';
import {
    Home,
    Leaf,
    Package,
    BookOpen,
    Calculator,
    Settings,
    LogOut,
    Menu,
    X,
    Sun,
    Moon,
    Bell,
    User,
    Users,
    ChevronDown,
    FileText
} from 'lucide-react';

interface DashboardLayoutProps {
    children: ReactNode;
}

interface NavItem {
    name: string;
    href: string;
    icon: any;
    badge?: string;
    pro?: boolean;
    requiredPermission?: keyof RolePermissions;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [userPlan, setUserPlan] = useState('FREE');
    const [userRole, setUserRole] = useState<Role>('VIEWER');

    useEffect(() => {
        const { role, plan } = getUserRoleAndPlan();
        setUserPlan(plan);
        setUserRole(role);
    }, []);

    // Initialize dark mode from localStorage
    useEffect(() => {
        const isDark = localStorage.getItem('darkMode') === 'true';
        setDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
        }
    }, []);

    // Fetch notification count
    useEffect(() => {
        fetchNotificationCount();
        const interval = setInterval(fetchNotificationCount, 30000); // Every 30s
        return () => clearInterval(interval);
    }, []);

    const fetchNotificationCount = async () => {
        try {
            const response = await api.get('/notifications/unread/count');
            setNotificationCount(response.data.count);
        } catch (err) {
            // Silently fail
        }
    };

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('darkMode', String(newMode));
        if (newMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    const allNavigation: NavItem[] = [
        { name: 'Dashboard', href: '/dashboard', icon: Home },
        { name: 'Diagnóstico IA', href: '/diagnosis', icon: Leaf, requiredPermission: 'canCreateDiagnosis' },
        { name: 'Lotes & Bitácora', href: '/batches', icon: BookOpen, pro: true, requiredPermission: 'canViewBatches' },
        { name: 'Inventario', href: '/inventory', icon: Package, pro: true, requiredPermission: 'canManageInventory' },
        { name: 'Reportes', href: '/reports', icon: FileText, pro: true, requiredPermission: 'canViewReports' },
        { name: 'Equipo', href: '/settings/team', icon: Users, pro: true, requiredPermission: 'canViewTeam' },
        { name: 'Herramientas', href: '/tools', icon: Calculator },
    ];

    // Filtrar navegación según permisos del rol
    const navigation = allNavigation.filter(item => {
        if (!item.requiredPermission) return true;
        return hasPermission(userRole, item.requiredPermission);
    });

    const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/');

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar for desktop */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
                transform transition-transform duration-300 ease-in-out
                lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                <Leaf className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                Plata Linda
                            </span>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        {navigation.map((item) => {
                            const isPro = item.pro;
                            const isFreePlan = userPlan !== 'PRO' && userPlan !== 'ENTERPRISE';

                            return (
                                <button
                                    key={item.name}
                                    onClick={() => {
                                        // Si es menú PRO y usuario FREE, redirigir a upgrade
                                        if (isPro && isFreePlan) {
                                            router.push('/upgrade');
                                        } else {
                                            router.push(item.href);
                                        }
                                        setSidebarOpen(false);
                                    }}
                                    className={`
                                        w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                                        ${isActive(item.href)
                                            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }
                                    `}
                                >
                                    <item.icon size={20} />
                                    <span className="flex-1 text-left">{item.name}</span>
                                    {isPro && isFreePlan && (
                                        <span className="px-2 py-0.5 text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded">
                                            PRO
                                        </span>
                                    )}
                                    {item.badge && (
                                        <span className="px-2 py-0.5 text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded">
                                            {item.badge}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    {/* User section */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => router.push('/settings')}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <Settings size={20} />
                            <span>Configuración</span>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-1"
                        >
                            <LogOut size={20} />
                            <span>Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top header */}
                <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6">
                        {/* Mobile menu button */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <Menu size={24} />
                        </button>

                        {/* Page title - hidden on mobile, shown on desktop */}
                        <div className="hidden lg:block">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
                            </h1>
                        </div>

                        {/* Right side actions */}
                        <div className="flex items-center gap-2 sm:gap-4 ml-auto lg:ml-0">
                            {/* Dark mode toggle */}
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                                title={darkMode ? 'Modo claro' : 'Modo oscuro'}
                            >
                                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                            </button>

                            {/* Notifications */}
                            <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors">
                                <Bell size={20} />
                                {notificationCount > 0 && (
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                                )}
                            </button>

                            {/* User menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                                        <User size={16} className="text-white" />
                                    </div>
                                    <ChevronDown size={16} className="text-gray-500 dark:text-gray-400 hidden sm:block" />
                                </button>

                                {userMenuOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setUserMenuOpen(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                                            <button
                                                onClick={() => {
                                                    router.push('/profile');
                                                    setUserMenuOpen(false);
                                                }}
                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                Mi Perfil
                                            </button>
                                            <button
                                                onClick={() => {
                                                    router.push('/settings');
                                                    setUserMenuOpen(false);
                                                }}
                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                Configuración
                                            </button>
                                            <hr className="my-1 border-gray-200 dark:border-gray-700" />
                                            <button
                                                onClick={handleLogout}
                                                className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                Cerrar Sesión
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
