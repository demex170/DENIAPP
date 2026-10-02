import React from 'react';
import {
  LayoutDashboard,
  Mail,
  PlusCircle,
  Users,
  ShoppingBag,
  Bell,
  User,
  HelpCircle,
  Shield,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  unreadCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, unreadCount = 0 }) => {
  const { user, isAdmin, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'მთავარი პანელი', icon: LayoutDashboard },
    { id: 'invitations', label: 'ჩემი მოსაწვევები', icon: Mail },
    { id: 'builder', label: '+ ახალი მოსაწვევი', icon: PlusCircle, isHighlight: true },
    { id: 'rsvps', label: 'RSVP პასუხები', icon: Users },
    { id: 'orders', label: 'შეკვეთები', icon: ShoppingBag },
    { id: 'notifications', label: 'შეტყობინებები', icon: Bell, badge: unreadCount },
    { id: 'profile', label: 'პროფილი', icon: User },
    { id: 'support', label: 'მხარდაჭერა', icon: HelpCircle },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-stone-200/80 min-h-[calc(100vh-4rem)] p-4 text-left justify-between shrink-0">
      <div className="space-y-6">
        {/* User Card */}
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60 flex items-center gap-3">
          <img
            src={
              user?.avatarUrl ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                user?.firstName || 'D'
              )}`
            }
            alt={user?.firstName}
            className="w-10 h-10 rounded-full border border-stone-200 object-cover"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-semibold text-stone-900 truncate">
              {user?.firstName} {user?.lastName}
            </h4>
            <p className="text-[11px] text-stone-500 truncate">{user?.email}</p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-stone-900 text-stone-50 shadow-xs'
                    : item.isHighlight
                    ? 'bg-amber-50 text-amber-900 hover:bg-amber-100 font-semibold'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : ''}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && item.badge > 0 ? (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-600 text-white">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}

          {isAdmin && (
            <div className="pt-4 mt-4 border-t border-stone-200/80">
              <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider px-3 mb-1 block">
                ადმინისტრირება
              </span>
              <button
                onClick={() => onNavigate('admin')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                  currentView === 'admin'
                    ? 'bg-amber-900 text-white shadow-xs'
                    : 'text-amber-900 hover:bg-amber-50'
                }`}
              >
                <Shield className="w-4 h-4 text-amber-600" />
                <span>ადმინ პანელი</span>
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* Logout */}
      <div className="pt-4 border-t border-stone-200/80">
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>გასვლა</span>
        </button>
      </div>
    </aside>
  );
};
