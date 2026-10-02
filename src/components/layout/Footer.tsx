import React from 'react';
import { Send, MessageCircle, Mail, Phone, ExternalLink, Sparkles } from 'lucide-react';
import { DENI_CONFIG } from '../../config/deniConfig.ts';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800/80">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1 text-left">
            <span className="text-2xl font-display font-bold text-white tracking-wider">
              {DENI_CONFIG.BRAND.name}
            </span>
            <p className="text-xs text-stone-400 font-serif-ka italic">
              {DENI_CONFIG.BRAND.philosophy}
            </p>
            <p className="text-xs text-stone-400 leading-relaxed">
              {DENI_CONFIG.BRAND.heroTagline}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-semibold text-stone-100 uppercase tracking-wider">
              ნავიგაცია
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => onNavigate('landing')}
                  className="hover:text-white transition-colors"
                >
                  მთავარი
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('portfolio')}
                  className="hover:text-white transition-colors"
                >
                  ნამუშევრები & შაბლონები
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors"
                >
                  ჩვენ შესახებ
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('builder')}
                  className="hover:text-white transition-colors text-amber-400 font-medium"
                >
                  + მოსაწვევის აწყობა
                </button>
              </li>
            </ul>
          </div>

          {/* Event Categories */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-semibold text-stone-100 uppercase tracking-wider">
              ღონისძიებები
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              {DENI_CONFIG.CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onNavigate('portfolio')}
                    className="hover:text-white transition-colors"
                  >
                    {cat.number} — {cat.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-semibold text-stone-100 uppercase tracking-wider">
              კონტაქტი
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <a
                href={`mailto:${DENI_CONFIG.CONTACTS.email}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-amber-500" />
                <span>{DENI_CONFIG.CONTACTS.email}</span>
              </a>
              <a
                href={DENI_CONFIG.CONTACTS.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp: {DENI_CONFIG.CONTACTS.whatsapp}</span>
              </a>
              <a
                href={DENI_CONFIG.CONTACTS.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-sky-400" />
                <span>Telegram: {DENI_CONFIG.CONTACTS.telegram}</span>
              </a>
              <a
                href={DENI_CONFIG.CONTACTS.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>TikTok: {DENI_CONFIG.CONTACTS.tiktok}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>{DENI_CONFIG.BRAND.copyright}</p>
          <p className="font-serif-ka">
            {DENI_CONFIG.BRAND.coreIdea}
          </p>
        </div>
      </div>
    </footer>
  );
};
