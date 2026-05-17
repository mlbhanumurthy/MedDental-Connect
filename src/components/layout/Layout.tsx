import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  ClipboardPlus, 
  Bell, 
  Files, 
  Users, 
  LogOut, 
  Menu, 
  X,
  Stethoscope,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';
import { Button } from '../UI';
import { motion, AnimatePresence } from 'motion/react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const { profile, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Referral Portal', path: '/referral', icon: ClipboardPlus },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Reports Cache', path: '/reports', icon: Files },
    { name: 'My Profile', path: '/profile', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-200 flex overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="w-72 bg-[#0D1117] border-r border-white/5 flex flex-col fixed inset-y-0 z-50 lg:relative"
          >
            <div className="p-6 flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
                <Stethoscope className="text-white w-6 h-6" />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">
                HealthSync<br/><span className="text-blue-500">Referral</span>
              </span>
            </div>

            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
              <div className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-4 mb-2">Main Menu</div>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                      isActive 
                        ? "bg-blue-600/10 text-blue-400 font-semibold border border-blue-500/20"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-white/5">
              <div className="bg-[#161B22] p-4 rounded-xl mb-4 border border-white/5">
                <p className="text-[10px] text-slate-500 mb-1 uppercase font-bold tracking-wider">Logged in as</p>
                <p className="text-sm font-semibold text-white truncate">{profile?.displayName}</p>
                <p className="text-[10px] text-slate-400">{profile?.role} • {profile?.hospital}</p>
              </div>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                onClick={logout}
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-[#0D1117] border-b border-white/5 px-6 flex items-center justify-between flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden text-slate-400">
            {isSidebarOpen ? <X /> : <Menu />}
          </Button>
          <div className="hidden lg:block">
            <h1 className="text-lg font-medium text-white">
              {navItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-[#0D1117] bg-blue-500/20 flex items-center justify-center text-blue-400 text-[10px] font-bold">GP</div>
              <div className="w-8 h-8 rounded-full border-2 border-[#0D1117] bg-green-500/20 flex items-center justify-center text-green-400 text-[10px] font-bold">DS</div>
            </div>
            <div className="h-8 w-px bg-white/5 mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-white">{profile?.displayName}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-tighter">{profile?.role}</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-blue-600/20">
                {profile?.displayName?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#0B0E14]">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};
