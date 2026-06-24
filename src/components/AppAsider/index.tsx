import type { LucideIcon } from 'lucide-react';
import {
    Activity,
    Archive,
    BarChart3,
    Calendar,
    Camera,
    ChevronDown,
    ChevronRight,
    ClipboardCheck,
    FileText,
    Flag,
    GraduationCap,
    Milestone,
    Image,
    Layers3,
    Settings,
    ShoppingBag,
    Upload,
    User,
    Workflow,
} from 'lucide-react';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import iconLululemon from '@/assets/images/lululemon-logo.svg';

type Menu = {
    label: string;
    icon: LucideIcon;
    key: string;
    link: string;
    children: Menu[];
};

const menus: Menu[] = [
    {
        label: 'Dashboard',
        icon: BarChart3,
        key: 'dashboard',
        link: '/dashboard',
        children: [],
    },
    {
        label: 'Weekly Meeting',
        icon: Calendar,
        key: 'weekly-meeting',
        link: '/weekly-meeting',
        children: [],
    },
    {
        label: 'Project Calendar',
        icon: Flag,
        key: 'project-calendar',
        link: '/project-calendar',
        children: [],
    },
    {
        label: 'Gateway Calendar',
        icon: Milestone,
        key: 'gateway-calendar',
        link: '/gateway-calendar',
        children: [],
    },
    {
        label: 'Budget Calendar',
        icon: Calendar,
        key: 'budget-project-calendar',
        link: '/budget-project-calendar',
        children: [],
    },
    {
        label: 'OPS CR Flow',
        icon: Workflow,
        key: 'ops-cr-flow',
        link: '/ops-cr-flow',
        children: [],
    },
    {
        label: 'WBS Builder',
        icon: ClipboardCheck,
        key: 'wbs-builder',
        link: '/wbs-builder',
        children: [],
    },
    {
        label: 'Daily Snapshot',
        icon: FileText,
        key: 'daily-snapshot',
        link: '/daily-snapshot',
        children: [],
    },
    {
        label: 'Gantt Builder',
        icon: BarChart3,
        key: 'gantt-builder',
        link: '/gantt-builder',
        children: [],
    },
    {
        label: 'Interview KB',
        icon: GraduationCap,
        key: 'interview-knowledge-base',
        link: '/interview-knowledge-base',
        children: [],
    },
    {
        label: 'Asset',
        icon: Image,
        key: 'assets',
        link: '/assets/list', // Direct link to asset list
        children: [], // No children for direct link
    },
    {
        label: 'Ingestion',
        icon: Upload,
        key: 'ingestion',
        link: '/ingestion/list', // Direct link to ingestion list
        children: [], // No children for direct link
    },
    {
        label: 'Task',
        icon: ClipboardCheck,
        key: 'task',
        link: '/task/list', // Direct link to tasks list
        children: [], // No children for direct link
    },
    {
        label: 'Distribution',
        icon: Archive,
        key: 'distribution',
        link: '/distribution/list', // Direct link to distribution list
        children: [], // No children for direct link
    },
    {
        label: 'Tracking List',
        icon: Activity,
        key: 'tracking',
        link: '/tracking/list', // Already correctly linked
        children: [],
    },
    {
        label: 'Image Toolkit',
        icon: Camera,
        key: 'image-toolkit',
        link: '/image-toolkit',
        children: [],
    },
    {
        label: 'Image Workflow',
        icon: Workflow,
        key: 'image-workflow',
        link: '/image-workflow',
        children: [],
    },
    {
        label: 'PDP Page',
        icon: ShoppingBag,
        key: 'pdp-page',
        link: '/pdp-page',
        children: [],
    },
    {
        label: 'Cost Forecasting',
        icon: Layers3,
        key: 'cost-forecasting',
        link: '/cost-forecasting',
        children: [],
    },
    {
        label: 'Administration',
        icon: Settings,
        key: 'administration',
        link: '/administration',
        children: [
            { label: 'Users', icon: User, key: 'users', link: '/administration/users', children: [] },
        ],
    },
];

// 拆分出渲染直接链接菜单项的函数，减少主组件函数长度
const renderDirectMenuItem = (
    menu: Menu,
    isActive: boolean,
    setActiveMenu: (key: string) => void,
    setActiveSubmenu: (key: string | null) => void,
) => (
    <Link
        to={menu.link}
        className={`relative flex w-full items-center justify-center rounded px-4 py-2.5 group-hover:justify-start hover:bg-[#1C2533] ${isActive ? 'text-white' : 'text-gray-300'}`}
        onClick={() => {
            setActiveMenu(menu.key);
            setActiveSubmenu(null);
        }}
    >
        {/* White circle background for collapsed state only */}
        {isActive && (
            <div className="absolute top-1/2 left-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white group-hover:opacity-0" />
        )}

        {/* Menu icon - with persistent highlighting */}
        <div className="absolute left-1/2 z-10 -translate-x-1/2 transition-all duration-300 group-hover:left-4 group-hover:translate-x-0">
            <menu.icon
                className={`size-5 ${isActive
                    ? 'text-[#0D1117] group-hover:text-white'
                    : 'text-gray-300'
                }`}
            />
        </div>

        {/* Menu label */}
        <span
            className={`ml-9 font-medium whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${isActive ? 'text-white' : 'text-gray-300'
            }`}
        >
            {menu.label}
        </span>
    </Link>
);

// 新增：提取子菜单渲染逻辑到单独函数
const renderSubmenuItem = (
    menu: Menu,
    isActive: boolean,
    activeSubmenu: string | null,
    setActiveMenu: (key: string) => void,
    setActiveSubmenu: (key: string | null) => void,
    toggleSubMenu: (key: string) => void,
    openMenu: string | null,
) => (
    <>
        <button
            onClick={() => toggleSubMenu(menu.key)}
            className={`relative flex w-full items-center justify-center rounded px-4 py-2.5 group-hover:justify-start hover:bg-[#1C2533] ${isActive ? 'text-white' : 'text-gray-300'}`}
        >
            {/* White circle background for collapsed state only */}
            {isActive && (
                <div className="absolute top-1/2 left-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white group-hover:opacity-0" />
            )}

            {/* Menu icon - with persistent highlighting */}
            <div className="absolute left-1/2 z-10 -translate-x-1/2 transition-all duration-300 group-hover:left-4 group-hover:translate-x-0">
                <menu.icon
                    className={`size-5 ${isActive
                        ? 'text-[#0D1117] group-hover:text-white'
                        : 'text-gray-300'
                    }`}
                />
            </div>

            {/* Menu label */}
            <span
                className={`ml-9 font-medium whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${isActive ? 'text-white' : 'text-gray-300'
                }`}
            >
                {menu.label}
            </span>

            {/* Expand/collapse indicator */}
            <span className="absolute right-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {openMenu === menu.key
                    ? (
                            <ChevronDown className={`size-4 ${isActive
                                ? 'text-white'
                                : 'text-gray-300'
                            }`}
                            />
                        )
                    : (
                            <ChevronRight className={`size-4 ${isActive
                                ? 'text-white'
                                : 'text-gray-300'
                            }`}
                            />
                        )}
            </span>
        </button>

        {/* Submenu */}
        {openMenu === menu.key && menu.children.length > 0 && (
            <ul className="mt-1 hidden w-full bg-[#161B22] transition-all duration-300 group-hover:block">
                {menu.children.map((subMenu) => {
                    const isSubActive = activeSubmenu === subMenu.key;

                    return (
                        <li key={`${menu.key}-${subMenu.key}`} className="flex justify-start py-0.5 pl-[34px]">
                            <Link
                                to={subMenu.link}
                                className={`flex w-full items-center gap-2 rounded px-3 py-1.5 text-sm ${isSubActive
                                    ? 'bg-white text-[#0D1117]'
                                    : 'text-gray-300 hover:bg-[#1C2533]'
                                }`}
                                onClick={() => {
                                    setActiveMenu(menu.key);
                                    setActiveSubmenu(subMenu.key);
                                }}
                            >
                                <subMenu.icon
                                    className={`size-4 flex-shrink-0 ${isSubActive ? 'text-[#0D1117]' : 'text-gray-400'
                                    }`}
                                />
                                <span className="whitespace-nowrap">{subMenu.label}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        )}
    </>
);

const AppAsider: FC = () => {
    const location = useLocation();
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [activeMenu, setActiveMenu] = useState<string>('dashboard'); // Default to dashboard
    const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

    // Toggle submenu display status
    const toggleSubMenu = (menuKey: string) => {
        setOpenMenu(openMenu === menuKey ? null : menuKey);
    };

    // Set active menu based on current location
    useEffect(() => {
        const path = location.pathname;

        // Check for direct menu matches
        for (const menu of menus) {
            if (menu.children.length === 0) {
                // For direct menus, check if path starts with the menu's path base
                const basePath = menu.link.split('/').slice(0, 2).join('/');
                if (path === menu.link || path.startsWith(basePath + '/')) {
                    setActiveMenu(menu.key);
                    setActiveSubmenu(null);
                    return;
                }
            } else {
                // For menus with submenus
                for (const submenu of menu.children) {
                    if (path === submenu.link || path.startsWith(submenu.link + '/')) {
                        setActiveMenu(menu.key);
                        setActiveSubmenu(submenu.key);
                        // Automatically open the parent menu
                        setOpenMenu(menu.key);
                        return;
                    }
                }

                // Check if path matches parent menu
                if (path === menu.link || path.startsWith(menu.link + '/')) {
                    setActiveMenu(menu.key);
                    setActiveSubmenu(null);
                    return;
                }
            }
        }

        // Default to dashboard if no match found
        if (path === '/' || !activeMenu) {
            setActiveMenu('dashboard');
            setActiveSubmenu(null);
        }
    }, [location.pathname, activeMenu]); // 添加 activeMenu 作为依赖项

    return (
        <div className="flex w-20 shrink-0 transition-all duration-300 group-hover:w-56">
            <div className="scrollbar-none fixed top-0 left-0 z-[60] h-screen w-20 overflow-x-hidden overflow-y-auto bg-[#0D1117] transition-all duration-300 group-hover:w-56">
                {/* Logo area */}
                <div className="flex items-center justify-center pt-6 pb-4">
                    <img src={iconLululemon} alt="Lululemon Logo" className="mb-2 size-12" />
                    <span className="ml-2 hidden text-base font-bold whitespace-nowrap text-white opacity-0 transition-opacity duration-300 group-hover:block group-hover:opacity-100">Lululemon</span>
                </div>

                {/* Navigation menu */}
                <nav className="mt-4">
                    <ul className="space-y-1">
                        {menus.map((menu) => {
                            const isActive = activeMenu === menu.key;

                            return (
                                <li key={menu.key} className="flex flex-col items-center">
                                    {menu.children.length === 0
                                        ? renderDirectMenuItem(menu, isActive, setActiveMenu, setActiveSubmenu)
                                        : renderSubmenuItem(
                                                menu,
                                                isActive,
                                                activeSubmenu,
                                                setActiveMenu,
                                                setActiveSubmenu,
                                                toggleSubMenu,
                                                openMenu,
                                            )}
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export { AppAsider };
