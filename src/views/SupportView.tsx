import React, { useState } from 'react';
import { Mail, Send, MessageCircle, Sparkles, CheckCircle2, Phone } from 'lucide-react';
import { DENI_CONFIG } from '../config/deniConfig.ts';
import { Button } from '../components/ui/Button.tsx';
import { Input, Textarea, Select } from '../components/ui/Input.tsx';

export const SupportView: React.FC = () => {
  const [subject, setSubject] = useState('general');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 600);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 sm:px-6 py-6 text-left">
      <div>
        <h1 className="text-2xl font-display font-bold text-stone-900">
          მხარდაჭერა & კონტაქტი
        </h1>
        <p className="text-xs text-stone-500">
          დაუკავშირდი DENI-ს გუნდს ნებისმიერი კითხვის ან დახმარებისათვის
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Contact channels (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-5">
            <h3 className="text-base font-semibold text-stone-900">
              პირდაპირი არხები
            </h3>

            <div className="space-y-4 text-xs">
              <a
                href={DENI_CONFIG.CONTACTS.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/60 text-emerald-900 hover:bg-emerald-100 transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-semibold">WhatsApp</p>
                  <p className="text-stone-500">{DENI_CONFIG.CONTACTS.whatsapp}</p>
                </div>
              </a>

              <a
                href={DENI_CONFIG.CONTACTS.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-sky-50/60 border border-sky-200/60 text-sky-900 hover:bg-sky-100 transition-colors"
              >
                <Send className="w-5 h-5 text-sky-600 shrink-0" />
                <div>
                  <p className="font-semibold">Telegram</p>
                  <p className="text-stone-500">{DENI_CONFIG.CONTACTS.telegram}</p>
                </div>
              </a>

              <a
                href={`mailto:${DENI_CONFIG.CONTACTS.email}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-amber-900 hover:bg-amber-100 transition-colors"
              >
                <Mail className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-stone-500">{DENI_CONFIG.CONTACTS.email}</p>
                </div>
              </a>

              <a
                href={DENI_CONFIG.CONTACTS.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-pink-50/60 border border-pink-200/60 text-pink-900 hover:bg-pink-100 transition-colors"
              >
                <Sparkles className="w-5 h-5 text-pink-600 shrink-0" />
                <div>
                  <p className="font-semibold">TikTok</p>
                  <p className="text-stone-500">{DENI_CONFIG.CONTACTS.tiktok}</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Form (7 cols) */}
        <div className="md:col-span-7">
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200 shadow-xs">
            {isSent ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-semibold text-stone-900">
                  შეტყობინება მიღებულია!
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  მადლობა მომართვისთვის. DENI-ს წარმომადგენელი უმოკლეს დროში დაგიკავშირდებათ მითითებულ საკონტაქტო ნომერზე ან ელფოსტაზე.
                </p>
                <Button variant="outline" size="sm" onClick={() => setIsSent(false)}>
                  ახალი შეტყობინების გაგზავნა
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-base font-semibold text-stone-900 mb-2">
                  მოგვწერე შეტყობინება
                </h3>

                <Select
                  label="მომართვის თემა"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  options={[
                    { value: 'order', label: 'შეკვეთის შესახებ კითხვა' },
                    { value: 'technical', label: 'ტექნიკური დახმარება' },
                    { value: 'custom_design', label: 'ინდივიდუალური დიზაინის შეკვეთა' },
                    { value: 'general', label: 'ზოგადი შეკითხვა / დაგვიკავშირდი' },
                  ]}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="თქვენი სახელი *"
                    placeholder="მაგ: დავითი"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <Input
                    label="საკონტაქტო ნომერი ან ელფოსტა *"
                    placeholder="579... ან name@example.ge"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                  />
                </div>

                <Textarea
                  label="შეტყობინების ტექსტი *"
                  placeholder="აღწერეთ თქვენი შეკითხვა დეტალურად..."
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />

                <Button
                  type="submit"
                  variant="amber"
                  size="md"
                  className="w-full"
                  isLoading={isLoading}
                >
                  გაგზავნა
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
