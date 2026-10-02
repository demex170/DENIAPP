import React, { useState, useEffect } from 'react';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Copy,
  Check,
  Download,
  Trash2,
  ExternalLink,
  ChevronLeft,
  Search,
} from 'lucide-react';
import { Guest, Invitation } from '../types/index.ts';
import { api } from '../services/api.ts';
import { Button } from '../components/ui/Button.tsx';
import { Input, Textarea } from '../components/ui/Input.tsx';
import { Modal } from '../components/ui/Modal.tsx';

interface RSVPManagementViewProps {
  invitationId?: string;
  onBack: () => void;
}

export const RSVPManagementView: React.FC<RSVPManagementViewProps> = ({
  invitationId,
  onBack,
}) => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [selectedInvId, setSelectedInvId] = useState<string>(invitationId || '');
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // New Guest Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [personalNote, setPersonalNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const invs = await api.getInvitations();
      setInvitations(invs);

      const targetId = selectedInvId || (invs.length > 0 ? invs[0].id : '');
      setSelectedInvId(targetId);

      if (targetId) {
        const guestList = await api.getGuests(targetId);
        setGuests(guestList);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [invitationId]);

  const handleSelectInvitation = async (id: string) => {
    setSelectedInvId(id);
    setIsLoading(true);
    try {
      const list = await api.getGuests(id);
      setGuests(list);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !selectedInvId) return;

    setIsSubmitting(true);
    try {
      const newGuest = await api.addGuest(selectedInvId, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        personalNote: personalNote.trim(),
      });
      setGuests([newGuest, ...guests]);
      setIsAddModalOpen(false);
      setFirstName('');
      setLastName('');
      setPersonalNote('');
    } catch (err: any) {
      alert(err.message || 'სტუმრის დამატება ვერ მოხერხდა');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGuest = async (guestId: string) => {
    if (window.confirm('ნამდვილად გსურთ სტუმრის წაშლა?')) {
      try {
        await api.deleteGuest(selectedInvId, guestId);
        setGuests((prev) => prev.filter((g) => g.id !== guestId));
      } catch (err: any) {
        alert(err.message || 'წაშლა ვერ მოხერხდა');
      }
    }
  };

  const handleCopyGuestLink = (token: string) => {
    const url = `${window.location.origin}/invite/guest/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleExportCSV = () => {
    if (guests.length === 0) return;
    const headers = ['სახელი', 'გვარი', 'სტატუსი', 'რაოდენობა', 'კომენტარი', 'თარიღი'];
    const rows = guests.map((g) => [
      g.firstName,
      g.lastName,
      g.rsvpStatus === 'attending' ? 'დაესწრება' : g.rsvpStatus === 'declined' ? 'ვერ მოვა' : 'მოლოდინში',
      g.guestCount || 1,
      `"${(g.comments || '').replace(/"/g, '""')}"`,
      g.submittedAt ? new Date(g.submittedAt).toLocaleDateString('ka-GE') : '-',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DENI_Guests_${selectedInvId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics
  const attendingGuests = guests.filter((g) => g.rsvpStatus === 'attending');
  const attendingTotalCount = attendingGuests.reduce((sum, g) => sum + (g.guestCount || 1), 0);
  const declinedCount = guests.filter((g) => g.rsvpStatus === 'declined').length;
  const pendingCount = guests.filter((g) => g.rsvpStatus === 'pending').length;
  const totalCount = guests.reduce((sum, g) => sum + (g.guestCount || 1), 0);

  // Filter
  const filteredGuests = guests.filter((g) => {
    const fullName = `${g.firstName} ${g.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || g.rsvpStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const currentInv = invitations.find((i) => i.id === selectedInvId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <button
            onClick={onBack}
            className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 font-medium mb-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>უკან დაბრუნება</span>
          </button>
          <h1 className="text-2xl font-display font-bold text-stone-900">
            RSVP პასუხები და სტუმრების მართვა
          </h1>
          <p className="text-xs text-stone-500">
            აკონტროლე ვინ დაესწრება ღონისძიებას და გაუგზავნე პერსონალური ბმულები
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportCSV}
            disabled={guests.length === 0}
            icon={<Download className="w-4 h-4" />}
          >
            CSV ექსპორტი
          </Button>

          <Button
            size="sm"
            variant="amber"
            onClick={() => setIsAddModalOpen(true)}
            disabled={!selectedInvId}
            icon={<Plus className="w-4 h-4" />}
          >
            + სტუმრის დამატება
          </Button>
        </div>
      </div>

      {/* Select Invitation dropdown if multiple exist */}
      {invitations.length > 1 && (
        <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-stone-200">
          <span className="text-xs font-semibold text-stone-700 whitespace-nowrap">
            მოსაწვევი:
          </span>
          <select
            value={selectedInvId}
            onChange={(e) => handleSelectInvitation(e.target.value)}
            className="w-full text-xs font-medium text-stone-900 bg-stone-50 border border-stone-200 rounded-lg p-2 focus:outline-none"
          >
            {invitations.map((i) => (
              <option key={i.id} value={i.id}>
                {i.title} ({new Date(i.eventDate).toLocaleDateString('ka-GE')})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">სულ სტუმრები</span>
            <Users className="w-4 h-4 text-stone-700" />
          </div>
          <p className="text-2xl font-bold font-display text-stone-900 mt-1 tabular-nums">
            {totalCount}
          </p>
          <p className="text-[10px] text-stone-400">სტუმრების სრული სია</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">დადასტურებული</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold font-display text-emerald-700 mt-1 tabular-nums">
            {attendingTotalCount}
          </p>
          <p className="text-[10px] text-stone-400">{attendingGuests.length} მოწვევიდან</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">უარი (ვერ მოვა)</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-bold font-display text-rose-700 mt-1 tabular-nums">
            {declinedCount}
          </p>
          <p className="text-[10px] text-stone-400">უარი განაცხადა</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">მოლოდინში</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold font-display text-amber-700 mt-1 tabular-nums">
            {pendingCount}
          </p>
          <p className="text-[10px] text-stone-400">პასუხი არ გაუცია</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-stone-200">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            placeholder="სტუმრის ძებნა..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-800"
          >
            <option value="all">ყველა სტატუსი</option>
            <option value="attending">დაესწრება</option>
            <option value="declined">ვერ მოვა</option>
            <option value="pending">მოლოდინში</option>
          </select>
        </div>
      </div>

      {/* Guest Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-stone-400">
            სტუმრები იტვირთება...
          </div>
        ) : filteredGuests.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Users className="w-8 h-8 text-stone-300 mx-auto" />
            <p className="text-sm font-semibold text-stone-800">სტუმრები ჯერ არ არის</p>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              დაამატე კონკრეტული სტუმარი სახელობითი ბმულის შესაქმნელად ან გაუზიარე საჯარო მოსაწვევი.
            </p>
            <Button
              size="sm"
              variant="amber"
              onClick={() => setIsAddModalOpen(true)}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              სტუმრის დამატება
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">სტუმარი</th>
                  <th className="py-3 px-4">სტატუსი</th>
                  <th className="py-3 px-4">რაოდენობა</th>
                  <th className="py-3 px-4">კომენტარი / პასუხი</th>
                  <th className="py-3 px-4">პერსონალური ბმული</th>
                  <th className="py-3 px-4 text-right">მოქმედება</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredGuests.map((g) => {
                  const isCopied = copiedToken === g.token;
                  return (
                    <tr key={g.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-4 font-semibold text-stone-900">
                        {g.firstName} {g.lastName}
                        {g.personalNote && (
                          <span className="block text-[11px] font-normal text-stone-400 italic">
                            „{g.personalNote}“
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            g.rsvpStatus === 'attending'
                              ? 'bg-emerald-50 text-emerald-700'
                              : g.rsvpStatus === 'declined'
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {g.rsvpStatus === 'attending' && <CheckCircle2 className="w-3 h-3" />}
                          {g.rsvpStatus === 'declined' && <XCircle className="w-3 h-3" />}
                          {g.rsvpStatus === 'pending' && <Clock className="w-3 h-3" />}
                          <span>
                            {g.rsvpStatus === 'attending'
                              ? 'დაესწრება'
                              : g.rsvpStatus === 'declined'
                              ? 'ვერ მოვა'
                              : 'მოლოდინში'}
                          </span>
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-stone-800 tabular-nums">
                        {g.guestCount || 1}
                      </td>
                      <td className="py-3 px-4 text-stone-600 max-w-xs truncate">
                        {g.comments || g.customAnswer || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleCopyGuestLink(g.token)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] border transition-all ${
                            isCopied
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-semibold'
                              : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>დაკოპირდა!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-stone-400" />
                              <span>ბმულის კოპირება</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteGuest(g.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="სტუმრის წაშლა"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Guest Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="ახალი სტუმრის დამატება"
        subtitle="შექმენი უნიკალური პერსონალური მოწვევის ბმული"
        maxWidth="md"
      >
        <form onSubmit={handleAddGuest} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="სახელი *"
              placeholder="მაგ: ნინო"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <Input
              label="გვარი *"
              placeholder="მაგ: ჩხეიძე"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <Textarea
            label="პერსონალური შეტყობინება სტუმრისთვის (სურვილისამებრ)"
            placeholder="მაგ: ძვირფასო ნინო, გაგვიხარდება შენი ხილვა ჩვენს განსაკუთრებულ დღეს..."
            rows={3}
            value={personalNote}
            onChange={(e) => setPersonalNote(e.target.value)}
          />

          <p className="text-[11px] text-stone-500">
            სტუმრისთვის შეიქმნება პირადი ბმული ფორმატით: <code>/invite/guest/[token]</code>, სადაც ის დაინახავს მისთვის მიძღვნილ ტექსტს.
          </p>

          <Button
            type="submit"
            variant="amber"
            size="lg"
            className="w-full mt-2"
            isLoading={isSubmitting}
          >
            სტუმრის დამატება & ბმულის გენერირება
          </Button>
        </form>
      </Modal>
    </div>
  );
};
