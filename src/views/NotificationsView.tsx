import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Mail, Heart, Sparkles, ShoppingBag } from 'lucide-react';
import { NotificationItem } from '../types/index.ts';
import { api } from '../services/api.ts';
import { Button } from '../components/ui/Button.tsx';

interface NotificationsViewProps {
  onNavigate: (view: string) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({ onNavigate }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifs = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch {
      // Ignore
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      // Ignore
    }
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'rsvp':
        return <Mail className="w-4 h-4 text-emerald-600" />;
      case 'wish':
        return <Heart className="w-4 h-4 text-rose-500" />;
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-amber-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-sky-600" />;
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto px-4 sm:px-6 py-6 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-stone-900">
            შეტყობინებები
          </h1>
          <p className="text-xs text-stone-500">
            ახალი RSVP პასუხები, მილოცვები და შეკვეთის სიახლეები
          </p>
        </div>

        {notifications.some((n) => !n.read) && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleMarkAllRead}
            icon={<CheckCheck className="w-3.5 h-3.5" />}
          >
            ყველას წაკითხულად მონიშვნა
          </Button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs divide-y divide-stone-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-stone-400">
            შეტყობინებები იტვირთება...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Bell className="w-8 h-8 text-stone-300 mx-auto" />
            <p className="text-sm font-semibold text-stone-800">შეტყობინებები არ არის</p>
            <p className="text-xs text-stone-500">
              როდესაც სტუმრები გამოგიგზავნიან RSVP-ს ან მილოცვას, აქ გამოჩნდება.
            </p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.read && handleMarkRead(n.id)}
              className={`p-4 flex items-start gap-3.5 transition-colors cursor-pointer ${
                n.read ? 'bg-white hover:bg-stone-50' : 'bg-amber-50/40 hover:bg-amber-50/60'
              }`}
            >
              <div className="p-2 rounded-xl bg-white border border-stone-200 shrink-0 shadow-xs">
                {getIcon(n.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`text-xs font-semibold ${n.read ? 'text-stone-800' : 'text-stone-900 font-bold'}`}>
                    {n.title}
                  </h4>
                  <span className="text-[10px] text-stone-400">
                    {new Date(n.createdAt).toLocaleDateString('ka-GE', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                  {n.message}
                </p>
                {n.link && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (n.link?.includes('/rsvps')) onNavigate('rsvps');
                      else if (n.link?.includes('/orders')) onNavigate('orders');
                    }}
                    className="text-[11px] text-amber-800 font-semibold hover:underline mt-1 block"
                  >
                    დეტალების ნახვა →
                  </button>
                )}
              </div>

              {!n.read && (
                <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0 mt-2" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
