import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Navbar } from './components/layout/Navbar.tsx';
import { Sidebar } from './components/layout/Sidebar.tsx';
import { BottomNavigation } from './components/layout/BottomNavigation.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { AuthModal } from './components/auth/AuthModal.tsx';

// Views
import { LandingPage } from './views/LandingPage.tsx';
import { DashboardView } from './views/DashboardView.tsx';
import { InvitationsListView } from './views/InvitationsListView.tsx';
import { InvitationBuilderView } from './views/InvitationBuilderView.tsx';
import { PublicInvitationView } from './views/PublicInvitationView.tsx';
import { RSVPManagementView } from './views/RSVPManagementView.tsx';
import { OrdersView } from './views/OrdersView.tsx';
import { ProfileView } from './views/ProfileView.tsx';
import { SupportView } from './views/SupportView.tsx';
import { NotificationsView } from './views/NotificationsView.tsx';
import { AdminDashboardView } from './views/AdminDashboardView.tsx';
import { PortfolioView } from './views/PortfolioView.tsx';
import { AboutView } from './views/AboutView.tsx';

import { Invitation } from './types/index.ts';
import { api } from './services/api.ts';

function MainAppContent() {
  const { user, isAuthenticated, isAdmin, openAuthModal } = useAuth();

  // URL Path router detection
  const path = typeof window !== 'undefined' ? window.location.pathname : '/';
  const publicSlugMatch = path.match(/^\/i\/([a-zA-Z0-9_-]+)/);
  const guestTokenMatch = path.match(/^\/invite\/guest\/([a-zA-Z0-9_-]+)/);

  // App navigation state
  const [currentView, setCurrentView] = useState<string>(() => {
    if (publicSlugMatch || guestTokenMatch) return 'public_invitation';
    return 'landing';
  });

  const [editingInvitation, setEditingInvitation] = useState<Invitation | null>(null);
  const [previewingInvitation, setPreviewingInvitation] = useState<Invitation | null>(null);
  const [selectedRSVPInvId, setSelectedRSVPInvId] = useState<string | undefined>(undefined);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState<number>(0);

  // Fetch unread notifications for badge
  useEffect(() => {
    if (isAuthenticated) {
      api.getNotifications()
        .then((notifs) => {
          setUnreadNotifsCount(notifs.filter((n) => !n.read).length);
        })
        .catch(() => {});
    }
  }, [isAuthenticated, currentView]);

  // Handle URL changes via popstate
  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname;
      if (p.startsWith('/i/') || p.startsWith('/invite/guest/')) {
        setCurrentView('public_invitation');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Direct public invitation route
  if (publicSlugMatch || guestTokenMatch) {
    const slug = publicSlugMatch ? publicSlugMatch[1] : undefined;
    const token = guestTokenMatch ? guestTokenMatch[1] : undefined;
    return (
      <PublicInvitationView
        slug={slug}
        guestToken={token}
        onBackToApp={() => {
          window.history.pushState({}, '', '/');
          setCurrentView(isAuthenticated ? 'dashboard' : 'landing');
        }}
      />
    );
  }

  // Full-screen live preview modal from anywhere
  if (previewingInvitation) {
    return (
      <PublicInvitationView
        previewData={previewingInvitation}
        onBackToApp={() => setPreviewingInvitation(null)}
      />
    );
  }

  const navigateTo = (view: string, data?: any) => {
    // Auth guards
    if (!isAuthenticated && ['dashboard', 'invitations', 'rsvps', 'orders', 'notifications', 'profile', 'admin'].includes(view)) {
      openAuthModal('login');
      return;
    }

    if (view === 'builder') {
      if (data?.invitation) {
        setEditingInvitation(data.invitation);
      } else {
        setEditingInvitation(null);
      }
    } else if (view === 'rsvps' && data?.invitationId) {
      setSelectedRSVPInvId(data.invitationId);
    }

    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isCustomerPortal =
    isAuthenticated &&
    ['dashboard', 'invitations', 'rsvps', 'orders', 'notifications', 'profile', 'admin'].includes(
      currentView
    );

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
      {/* Top Bar Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={navigateTo}
        unreadCount={unreadNotifsCount}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Desktop Sidebar when in portal */}
        {isCustomerPortal && (
          <Sidebar
            currentView={currentView}
            onNavigate={navigateTo}
            unreadCount={unreadNotifsCount}
          />
        )}

        {/* Primary Page Content */}
        <main className="flex-1 min-w-0 pb-16 md:pb-8">
          {currentView === 'landing' && (
            <LandingPage
              onStartCreate={() => navigateTo('builder')}
              onViewPortfolio={() => navigateTo('portfolio')}
              onSelectCategory={(catId) => {
                navigateTo('builder', {
                  invitation: {
                    eventType: catId,
                    title: `ახალი ${catId} მოსაწვევი`,
                  },
                });
              }}
            />
          )}

          {currentView === 'dashboard' && (
            <DashboardView
              onNavigate={navigateTo}
              onEditInvitation={(inv) => navigateTo('builder', { invitation: inv })}
              onPreviewInvitation={(inv) => setPreviewingInvitation(inv)}
            />
          )}

          {currentView === 'invitations' && (
            <InvitationsListView
              onNavigate={navigateTo}
              onEditInvitation={(inv) => navigateTo('builder', { invitation: inv })}
              onPreviewInvitation={(inv) => setPreviewingInvitation(inv)}
              onManageRSVP={(invId) => navigateTo('rsvps', { invitationId: invId })}
            />
          )}

          {currentView === 'builder' && (
            <InvitationBuilderView
              initialInvitation={editingInvitation}
              onFinished={(invId) => {
                navigateTo('invitations');
              }}
              onCancel={() => {
                navigateTo(isAuthenticated ? 'dashboard' : 'landing');
              }}
            />
          )}

          {currentView === 'rsvps' && (
            <RSVPManagementView
              invitationId={selectedRSVPInvId}
              onBack={() => navigateTo('dashboard')}
            />
          )}

          {currentView === 'orders' && <OrdersView />}

          {currentView === 'notifications' && (
            <NotificationsView onNavigate={navigateTo} />
          )}

          {currentView === 'profile' && <ProfileView />}

          {currentView === 'admin' && <AdminDashboardView />}

          {currentView === 'portfolio' && (
            <PortfolioView
              onUseTemplate={(catId, tplId) => {
                navigateTo('builder', {
                  invitation: {
                    eventType: catId,
                    templateId: tplId,
                  },
                });
              }}
            />
          )}

          {currentView === 'about' && (
            <AboutView onStartCreate={() => navigateTo('builder')} />
          )}

          {currentView === 'support' && <SupportView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation
        currentView={currentView}
        onNavigate={navigateTo}
      />

      {/* Brand Footer on public views */}
      {!isCustomerPortal && currentView !== 'builder' && (
        <Footer onNavigate={navigateTo} />
      )}

      {/* Global Auth Modal */}
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
