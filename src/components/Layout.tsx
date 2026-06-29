import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, MapPin, Search } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/items', icon: Package, label: '物品' },
    { path: '/locations', icon: MapPin, label: '位置' },
    { path: '/search', icon: Search, label: '搜索' },
  ];

  return (
    <div className="min-h-screen bg-[#F5E6D3]">
      {/* 顶部导航栏 */}
      <header className="bg-[#5D4037] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">家庭物品位置管理</h1>
        </div>
      </header>

      {/* 导航菜单 */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex space-x-8 py-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-[#5D4037] text-white shadow-md'
                        : 'text-[#5D4037] hover:bg-[#F5E6D3] hover:shadow-sm'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* 主内容区域 */}
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
};