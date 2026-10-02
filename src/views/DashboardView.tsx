import React, { useState, useEffect } from 'react';
import {
  Plus,
  Mail,
  Users,
  CheckCircle2,
  Clock,
  Share2,
  Eye,
  Edit,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { Invitation, Guest } from '../types/index.ts';
import { api } from '../services/api.ts';
import { Button } from '../components/ui/Button.tsx';
import { QRCodeModal } from '../components/ui/QRCodeModal.tsx';

interface DashboardViewProps {
  onNavigate: (view: string, data?: any) => void;
  onEditInvitation: (inv: Invitation) => void;
  onPreviewInvitation: (inv: Invitation) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onEditInvitation,
  onPreviewInvitation,
}) => {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [shareInv, setShareInv] = useState<Invitation | null>(null);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const invs = await api.getInvitations();
      setInvitations(invs);

      // Aggregate guests across all user's invitations
      let allGuests: Guest[] = [];
      for (const inv of invs) {
        try {
          const gList = await api.getGuests(inv.id);
          allGuests = [...allGuests, ...gList];
        } catch {
          // Ignore
        }
      }
      setGuests(allGuests);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const activeInvitations = invitations.filter((i) => i.status === 'published').length;
  const draftInvitations = invitations.filter((i) => i.status === 'draft').length;
  const totalGuestsCount = guests.reduce((sum, g) => sum + (g.guestCount || 1), 0);
  const confirmedGuestsCount = guests
    .filter((g) => g.rsvpStatus === 'attending')
    .reduce((sum, g) => sum + (g.guestCount || 1), 0);
  const pendingGuestsCount = guests
    .filter((g) => g.rsvpStatus === 'pending')
    .reduce((sum, g) => sum + (g.guestCount || 1), 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6 text-left">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DENI • ონლაინ მოსაწვევები</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold">
            გამარჯობა, {user?.firstName || 'სტუმარო'}!
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl font-serif-ka">
            შექმენი შენი განსაკუთრებული დღის მოსაწვევი. მართე სტუმრები და RSVP პასუხები ერთ სივრცეში.
          </p>
        </div>

        <Button
          size="lg"
          variant="amber"
          onClick={() => onNavigate('builder')}
          icon={<Plus className="w-4 h-4" />}
          className="shrink-0"
        >
          + ახალი მოსაწვევი
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Invitations */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">აქტიური მოსაწვევები</span>
            <Mail className="w-4 h-4 text-amber-800" />
          </div>
          <p className="text-3xl font-display font-bold text-stone-900 tabular-nums">
            {activeInvitations}
          </p>
          <p className="text-[11px] text-stone-500">
            {draftInvitations > 0 ? `${draftInvitations} პროექტი (Draft)` : 'ყველა გამოქვეყნებულია'}
          </p>
        </div>

        {/* Total Guests */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">სტუმრები</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-3xl font-display font-bold text-stone-900 tabular-nums">
            {totalGuestsCount}
          </p>
          <p className="text-[11px] text-stone-500">რეგისტრირებული სტუმრები</p>
        </div>

        {/* Confirmed */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">დადასტურებული</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-display font-bold text-emerald-700 tabular-nums">
            {confirmedGuestsCount}
          </p>
          <p className="text-[11px] text-stone-500">მზად არიან დასასწრებად</p>
        </div>

        {/* Pending */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">მოლოდინში</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-display font-bold text-amber-700 tabular-nums">
            {pendingGuestsCount}
          </p>
          <p className="text-[11px] text-stone-500">პასუხის მოლოდინშია</p>
        </div>
      </div>

      {/* Invitations Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">
              ბოლო მოსაწვევები
            </h2>
            <p className="text-xs text-stone-500">
              შენი შექმნილი ონლაინ მოსაწვევების სია
            </p>
          </div>
          {invitations.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('invitations')}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              ყველას ნახვა ({invitations.length})
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-stone-400 text-xs">
            მონაცემები იტვირთება...
          </div>
        ) : invitations.length === 0 ? (
          /* Empty State */
          <div className="p-10 sm:p-14 rounded-3xl bg-white border border-dashed border-stone-300 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center mx-auto">
              <Mail className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-stone-900">
                ჯერ არ შეგიქმნია მოსაწვევი.
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                დაიწყე შენი განსაკუთრებული დღის მოსაწვევის შექმნა ეტაპობრივი ხელსაწყოთი.
              </p>
            </div>
            <Button
              size="md"
              variant="amber"
              onClick={() => onNavigate('builder')}
              icon={<Plus className="w-4 h-4" />}
            >
              შექმენი პირველი მოსაწვევი
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invitations.slice(0, 3).map((inv) => (
              <div
                key={inv.id}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="relative aspect-[16/9] bg-stone-100 overflow-hidden">
                  <img
                    src={inv.coverImage}
                    alt={inv.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-semibold uppercase tracking-wider">
                    {inv.packageType}
                  </div>
                  <div
                    className={`absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                      inv.status === 'published'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-600 text-white'
                    }`}
                  >
                    {inv.status === 'published' ? 'გამოქვეყნებული' : 'დრაფტი'}
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-stone-900 line-clamp-1">
                      {inv.title}
                    </h3>
                    <p className="text-xs text-stone-500">
                      {new Date(inv.eventDate).toLocaleDateString('ka-GE', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      • {inv.venueCity}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onEditInvitation(inv)}
                        icon={<Edit className="w-3.5 h-3.5" />}
                      >
                        რედაქტირება
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onPreviewInvitation(inv)}
                        icon={<Eye className="w-3.5 h-3.5" />}
                        title="Preview"
                      />
                    </div>

                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => setShareInv(inv)}
                      icon={<Share2 className="w-3.5 h-3.5" />}
                    >
                      გაზიარება
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Share Modal */}
      {shareInv && (
        <QRCodeModal
          isOpen={!!shareInv}
          onClose={() => setShareInv(null)}
          url={`${window.location.origin}/i/${shareInv.slug}`}
          title={shareInv.title}
        />
      )}
    </div>
  );
};
