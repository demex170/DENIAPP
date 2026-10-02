import React from 'react';
import { Sparkles, User, Bell, Shield, LogIn, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { DENI_CONFIG } from '../../config/deniConfig.ts';
import { Button } from '../ui/Button.tsx';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  unreadCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, unreadCount = 0 }) => {
  const { user, isAuthenticated, isAdmin, openAuthModal, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('landing')}
            className="text-2xl font-display font-bold tracking-tight text-stone-900 hover:text-amber-900 transition-colors flex items-center gap-2"
          >
            <span>{DENI_CONFIG.BRAND.name}</span>
            <span className="hidden sm:inline text-xs font-sans font-normal text-stone-400 tracking-normal border-l border-stone-200 pl-3">
              {DENI_CONFIG.BRAND.subtitle}
            </span>
          </button>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          <button
            onClick={() => onNavigate('landing')}
            className={`transition-colors hover:text-stone-900 ${
              currentView === 'landing' ? 'text-amber-900 font-semibold' : ''
            }`}
          >
            მთავარი
          </button>
          <button
            onClick={() => onNavigate('portfolio')}
            className={`transition-colors hover:text-stone-900 ${
              currentView === 'portfolio' ? 'text-amber-900 font-semibold' : ''
            }`}
          >
            ნამუშევრები
          </button>
          <button
            onClick={() => onNavigate('about')}
            className={`transition-colors hover:text-stone-900 ${
              currentView === 'about' ? 'text-amber-900 font-semibold' : ''
            }`}
          >
            ჩვენ შესახებ
          </button>
          <button
            onClick={() => onNavigate('support')}
            className={`transition-colors hover:text-stone-900 ${
              currentView === 'support' ? 'text-amber-900 font-semibold' : ''
            }`}
          >
            კონტაქტი
          </button>
          {isAuthenticated && (
            <button
              onClick={() => onNavigate('dashboard')}
              className={`transition-colors hover:text-stone-900 ${
                ['dashboard', 'invitations', 'rsvps', 'orders'].includes(currentView)
                  ? 'text-amber-900 font-semibold'
                  : ''
              }`}
            >
              მართვის პანელი
            </button>
          )}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {isAuthenticated ? (
            <>
              {/* Notification icon */}
              <button
                onClick={() => onNavigate('notifications')}
                className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
                title="შეტყობინებები"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-600 rounded-full ring-2 ring-white" />
                )}
              </button>

              {isAdmin && (
                <button
                  onClick={() => onNavigate('admin')}
                  className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                    currentView === 'admin'
                      ? 'bg-amber-900 text-white border-amber-900'
                      : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>ადმინი</span>
                </button>
              )}

              <button
                onClick={() => onNavigate('profile')}
                className="flex items-center gap-2 p-1.5 hover:bg-stone-100 rounded-xl transition-colors text-left"
              >
                <img
                  src={
                    user?.avatarUrl ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      user?.firstName || 'D'
                    )}`
                  }
                  alt={user?.firstName}
                  className="w-8 h-8 rounded-full border border-stone-200 object-cover"
                />
                <span className="hidden sm:inline text-xs font-medium text-stone-800">
                  {user?.firstName}
                </span>
              </button>

              <Button
                size="sm"
                variant="primary"
                onClick={() => onNavigate('builder')}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                შექმნა
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => openAuthModal('login')}
                icon={<LogIn className="w-4 h-4" />}
              >
                შესვლა
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => onNavigate('builder')}
                icon={<Sparkles className="w-3.5 h-3.5 text-amber-300" />}
              >
                + ახალი მოსაწვევი
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
