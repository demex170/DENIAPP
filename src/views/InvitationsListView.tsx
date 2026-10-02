import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Mail,
  Edit,
  Eye,
  Share2,
  Trash2,
  Users,
  ExternalLink,
  Filter,
} from 'lucide-react';
import { Invitation } from '../types/index.ts';
import { api } from '../services/api.ts';
import { Button } from '../components/ui/Button.tsx';
import { QRCodeModal } from '../components/ui/QRCodeModal.tsx';
import { DENI_CONFIG } from '../config/deniConfig.ts';

interface InvitationsListViewProps {
  onNavigate: (view: string, data?: any) => void;
  onEditInvitation: (inv: Invitation) => void;
  onPreviewInvitation: (inv: Invitation) => void;
  onManageRSVP: (invitationId: string) => void;
}

export const InvitationsListView: React.FC<InvitationsListViewProps> = ({
  onNavigate,
  onEditInvitation,
  onPreviewInvitation,
  onManageRSVP,
}) => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'created' | 'eventDate'>('created');
  const [shareInv, setShareInv] = useState<Invitation | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await api.getInvitations();
      setInvitations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`ნამდვილად გსურთ წაშალოთ მოსაწვევი „${title}“?`)) {
      try {
        await api.deleteInvitation(id);
        setInvitations((prev) => prev.filter((i) => i.id !== id));
      } catch (err: any) {
        alert(err.message || 'წაშლა ვერ მოხერხდა');
      }
    }
  };

  // Filter and sort
  const filteredInvitations = invitations
    .filter((inv) => {
      const matchesSearch =
        inv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.coupleOrHostNames.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.venueCity.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || inv.eventType === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'eventDate') {
        return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-stone-900">
            ჩემი მოსაწვევები
          </h1>
          <p className="text-xs text-stone-500">
            მართე, შეცვალე და გაუგზავნე ონლაინ მოსაწვევები შენს სტუმრებს
          </p>
        </div>

        <Button
          size="md"
          variant="amber"
          onClick={() => onNavigate('builder')}
          icon={<Plus className="w-4 h-4" />}
        >
          + ახალი მოსაწვევი
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
            <input
              type="text"
              placeholder="ძებნა სათაურით, სახელით, ქალაქით..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-800"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-800"
          >
            <option value="all">ყველა კატეგორია</option>
            {DENI_CONFIG.CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-800"
          >
            <option value="all">ყველა სტატუსი</option>
            <option value="published">გამოქვეყნებული (Published)</option>
            <option value="draft">დრაფტი (Draft)</option>
            <option value="archived">არქივი (Archived)</option>
          </select>
        </div>
      </div>

      {/* Content Grid */}
      {isLoading ? (
        <div className="p-16 text-center text-xs text-stone-400">
          მოსაწვევები იტვირთება...
        </div>
      ) : filteredInvitations.length === 0 ? (
        /* Empty State */
        <div className="p-12 rounded-3xl bg-white border border-dashed border-stone-300 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center mx-auto">
            <Mail className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-stone-900">
              მოსაწვევები ვერ მოიძებნა
            </h3>
            <p className="text-xs text-stone-500">
              შესაძლოა ფილტრის პირობები არ ემთხვევა ან ჯერ არ შეგიქმნია მოსაწვევი.
            </p>
          </div>
          <Button
            size="sm"
            variant="amber"
            onClick={() => onNavigate('builder')}
            icon={<Plus className="w-4 h-4" />}
          >
            შექმენი ახალი მოსაწვევი
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvitations.map((inv) => (
            <div
              key={inv.id}
              className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Cover Image & Badges */}
              <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden group">
                <img
                  src={inv.coverImage}
                  alt={inv.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold uppercase tracking-wider">
                  {inv.packageType}
                </div>
                <div
                  className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                    inv.status === 'published'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-700 text-white'
                  }`}
                >
                  {inv.status === 'published' ? 'გამოქვეყნებული' : 'დრაფტი'}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-stone-400">
                    <span className="capitalize">{inv.eventType}</span>
                    <span>
                      {new Date(inv.eventDate).toLocaleDateString('ka-GE', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-stone-900 line-clamp-1">
                    {inv.title}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-1">
                    {inv.venueName}, {inv.venueCity}
                  </p>
                </div>

                {/* Card Action Buttons: Open, Edit, Preview, Share, RSVP, Delete */}
                <div className="pt-3 border-t border-stone-100 space-y-2">
                  <div className="grid grid-cols-3 gap-1.5">
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
                    >
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => onManageRSVP(inv.id)}
                      icon={<Users className="w-3.5 h-3.5" />}
                    >
                      RSVP
                    </Button>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShareInv(inv)}
                        icon={<Share2 className="w-3.5 h-3.5" />}
                      >
                        გაზიარება
                      </Button>
                      <a
                        href={`/i/${inv.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg text-xs inline-flex items-center gap-1"
                        title="გახსნა პირდაპირ"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>გახსნა</span>
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(inv.id, inv.title)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="წაშლა"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
