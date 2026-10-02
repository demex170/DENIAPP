import React from 'react';
import { LayoutDashboard, Mail, Plus, Users, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

interface BottomNavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentView, onNavigate }) => {
  const { isAuthenticated, openAuthModal } = useAuth();

  const handleNav = (view: string) => {
    if (!isAuthenticated && ['invitations', 'rsvps', 'profile'].includes(view)) {
      openAuthModal('login');
      return;
    }
    onNavigate(view);
  };

  const navItems = [
    { id: 'dashboard', label: 'მთავარი', icon: LayoutDashboard },
    { id: 'invitations', label: 'მოსაწვევები', icon: Mail },
    { id: 'builder', label: 'შექმნა', icon: Plus, isPrimary: true },
    { id: 'rsvps', label: 'RSVP', icon: Users },
    { id: 'profile', label: 'პროფილი', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-2 py-1.5 safe-area-pb">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          if (item.isPrimary) {
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className="flex flex-col items-center justify-center -mt-5"
                aria-label="ახალი მოსაწვევის შექმნა"
              >
                <div className="w-12 h-12 rounded-full bg-amber-800 text-amber-50 flex items-center justify-center shadow-lg active:scale-95 transition-transform border-2 border-white">
                  <Plus className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-semibold text-amber-900 mt-0.5">
                  შექმნა
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors ${
                isActive ? 'text-amber-800 font-semibold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-1.5'}`} />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
