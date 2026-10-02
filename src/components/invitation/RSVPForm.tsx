import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, Users, HeartHandshake, Loader2 } from 'lucide-react';
import { RSVPSettings, Guest } from '../../types/index.ts';
import { Button } from '../ui/Button.tsx';
import { Input, Textarea } from '../ui/Input.tsx';
import { api } from '../../services/api.ts';

interface RSVPFormProps {
  invitationId: string;
  settings: RSVPSettings;
  guestInitial?: Guest | null;
  onSuccess?: () => void;
}

export const RSVPForm: React.FC<RSVPFormProps> = ({
  invitationId,
  settings,
  guestInitial,
  onSuccess,
}) => {
  const [firstName, setFirstName] = useState(guestInitial?.firstName || '');
  const [lastName, setLastName] = useState(guestInitial?.lastName || '');
  const [rsvpStatus, setRsvpStatus] = useState<'attending' | 'declined' | null>(
    guestInitial?.rsvpStatus === 'attending' || guestInitial?.rsvpStatus === 'declined'
      ? guestInitial.rsvpStatus
      : null
  );
  const [guestCount, setGuestCount] = useState<number>(guestInitial?.guestCount || 1);
  const [comments, setComments] = useState(guestInitial?.comments || '');
  const [customAnswer, setCustomAnswer] = useState(guestInitial?.customAnswer || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || !lastName.trim()) {
      setError('გთხოვთ მიუთითოთ თქვენი სახელი და გვარი');
      return;
    }

    if (!rsvpStatus) {
      setError('გთხოვთ მონიშნოთ, დაესწრებით თუ არა ღონისძიებას');
      return;
    }

    setIsLoading(true);
    try {
      await api.submitRSVP({
        invitationId,
        guestToken: guestInitial?.token,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        rsvpStatus,
        guestCount: rsvpStatus === 'attending' ? guestCount : 0,
        comments: comments.trim(),
        customAnswer: customAnswer.trim(),
      });

      setIsSubmitted(true);

      if (rsvpStatus === 'attending') {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#b45309', '#f59e0b', '#10b981', '#3b82f6'],
          });
        } catch {
          // Ignore confetti error if any
        }
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'დადასტურება ვერ მოხერხდა. სცადეთ თავიდან.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="p-8 rounded-2xl bg-white border border-stone-200/90 shadow-sm text-center space-y-4 max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-serif-ka font-semibold text-stone-900">
          მადლობა პასუხისთვის!
        </h3>
        <p className="text-sm text-stone-600 leading-relaxed">
          {rsvpStatus === 'attending'
            ? 'თქვენი დასწრება წარმატებით დადასტურდა. მოუთმენლად გელით ამ განსაკუთრებულ დღეს!'
            : 'თქვენი პასუხი მიღებულია. მადლობა რომ შეგვატყობინეთ!'}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsSubmitted(false)}
        >
          პასუხის შეცვლა
        </Button>
      </div>
    );
  }

  const maxGuests = 1 + (settings.maxPlusGuests || 1);

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-6 max-w-lg mx-auto text-left"
    >
      <div className="text-center space-y-1">
        <span className="text-[11px] uppercase tracking-widest text-amber-800 font-semibold">
          RSVP დადასტურება
        </span>
        <h3 className="text-xl font-serif-ka font-semibold text-stone-900">
          დაესწრები ღონისძიებას?
        </h3>
        {settings.deadlineDate && (
          <p className="text-xs text-stone-500">
            გთხოვთ დაადასტუროთ {settings.deadlineDate}-მდე
          </p>
        )}
      </div>

      {/* Choice Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setRsvpStatus('attending')}
          className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
            rsvpStatus === 'attending'
              ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 ring-2 ring-emerald-600/30 font-semibold'
              : 'border-stone-200 hover:border-stone-300 bg-stone-50/50 text-stone-700'
          }`}
        >
          <CheckCircle2
            className={`w-6 h-6 ${
              rsvpStatus === 'attending' ? 'text-emerald-600' : 'text-stone-400'
            }`}
          />
          <span className="text-sm">დიახ, დავესწრები</span>
        </button>

        <button
          type="button"
          onClick={() => setRsvpStatus('declined')}
          className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
            rsvpStatus === 'declined'
              ? 'border-stone-500 bg-stone-100 text-stone-900 ring-2 ring-stone-400 font-semibold'
              : 'border-stone-200 hover:border-stone-300 bg-stone-50/50 text-stone-700'
          }`}
        >
          <XCircle
            className={`w-6 h-6 ${
              rsvpStatus === 'declined' ? 'text-stone-700' : 'text-stone-400'
            }`}
          />
          <span className="text-sm">ვერ მოვალ</span>
        </button>
      </div>

      {/* Guest Name Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="თქვენი სახელი *"
          placeholder="მაგ: გიორგი"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <Input
          label="თქვენი გვარი *"
          placeholder="მაგ: ბერიძე"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>

      {/* If Attending: Guest Count */}
      {rsvpStatus === 'attending' && maxGuests > 1 && (
        <div className="space-y-2">
          <label className="block text-xs font-medium text-stone-700">
            სულ რამდენი ადამიანი მობრძანდებით?
          </label>
          <div className="flex items-center gap-3">
            {[...Array(maxGuests)].map((_, i) => {
              const count = i + 1;
              return (
                <button
                  key={count}
                  type="button"
                  onClick={() => setGuestCount(count)}
                  className={`w-10 h-10 rounded-xl border text-sm font-semibold transition-all ${
                    guestCount === count
                      ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                      : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800'
                  }`}
                >
                  {count}
                </button>
              );
            })}
            <span className="text-xs text-stone-500">
              {guestCount === 1 ? 'მარტო' : `${guestCount} პერსონა`}
            </span>
          </div>
        </div>
      )}

      {/* Custom Question if configured */}
      {rsvpStatus === 'attending' && settings.customQuestion && (
        <Input
          label={settings.customQuestion}
          placeholder="თქვენი პასუხი..."
          value={customAnswer}
          onChange={(e) => setCustomAnswer(e.target.value)}
        />
      )}

      {/* Comments */}
      <Textarea
        label="კომენტარი ან შეტყობინება მასპინძლებს"
        placeholder="დაგვიტოვეთ მოკლე კომენტარი..."
        rows={2}
        value={comments}
        onChange={(e) => setComments(e.target.value)}
      />

      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        isLoading={isLoading}
      >
        პასუხის დადასტურება
      </Button>
    </form>
  );
};
