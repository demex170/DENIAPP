import React, { useState, useEffect } from 'react';
import { Heart, Send, MessageSquareHeart } from 'lucide-react';
import { WishMessage } from '../../types/index.ts';
import { Button } from '../ui/Button.tsx';
import { Input, Textarea } from '../ui/Input.tsx';
import { api } from '../../services/api.ts';

interface WishesGuestbookProps {
  invitationId: string;
}

export const WishesGuestbook: React.FC<WishesGuestbookProps> = ({ invitationId }) => {
  const [wishes, setWishes] = useState<WishMessage[]>([]);
  const [guestName, setGuestName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWishes = async () => {
    try {
      const data = await api.getWishes(invitationId);
      setWishes(data);
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    loadWishes();
  }, [invitationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !message.trim()) {
      setError('გთხოვთ მიუთითოთ სახელი და სურვილი');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const newWish = await api.submitWish(invitationId, guestName.trim(), message.trim());
      setWishes([newWish, ...wishes]);
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'მილოცვის გაგზავნა ვერ მოხერხდა');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto w-full text-left">
      <div className="text-center space-y-1">
        <span className="text-[11px] uppercase tracking-widest text-amber-800 font-semibold">
          მილოცვების წიგნი
        </span>
        <h3 className="text-xl font-serif-ka font-semibold text-stone-900">
          დაუტოვე თბილი სურვილი
        </h3>
        <p className="text-xs text-stone-500">
          შენი სიტყვები სამახსოვროდ დარჩება მასპინძლებისთვის
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-xs space-y-3"
      >
        <Input
          placeholder="თქვენი სახელი"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          required
        />
        <Textarea
          placeholder="დაწერეთ თქვენი გულწრფელი სურვილი ან მილოცვა..."
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        {error && <p className="text-xs text-rose-600">{error}</p>}
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="amber"
            size="sm"
            isLoading={isSubmitting}
            icon={<Send className="w-3.5 h-3.5" />}
          >
            სურვილის გაგზავნა
          </Button>
        </div>
      </form>

      {/* Wishes List */}
      <div className="space-y-3">
        {wishes.length === 0 ? (
          <div className="p-6 text-center rounded-xl bg-stone-50/50 border border-stone-200/60 text-stone-400">
            <MessageSquareHeart className="w-8 h-8 mx-auto mb-2 opacity-50 text-amber-800" />
            <p className="text-xs font-medium">ჯერ არ არის მილოცვები. იყავი პირველი!</p>
          </div>
        ) : (
          wishes.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-white border border-stone-200/70 shadow-xs space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-800 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  {item.guestName}
                </span>
                <span className="text-[11px] text-stone-400">
                  {new Date(item.createdAt).toLocaleDateString('ka-GE', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pl-5">
                {item.message}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
