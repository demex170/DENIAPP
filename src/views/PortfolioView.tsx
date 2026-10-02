import React, { useState } from 'react';
import { Sparkles, Eye, ArrowRight, Check } from 'lucide-react';
import { DENI_CONFIG } from '../config/deniConfig.ts';
import { Button } from '../components/ui/Button.tsx';
import { Modal } from '../components/ui/Modal.tsx';
import { PublicInvitationView } from './PublicInvitationView.tsx';
import { Invitation } from '../types/index.ts';

interface PortfolioViewProps {
  onUseTemplate: (categoryId: string, templateId: string) => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({ onUseTemplate }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [previewTemplate, setPreviewTemplate] = useState<Invitation | null>(null);

  const filteredTemplates = DENI_CONFIG.TEMPLATES.filter(
    (t) => activeCategory === 'all' || t.categoryId === activeCategory
  );

  const createMockInvitationForTemplate = (tpl: (typeof DENI_CONFIG.TEMPLATES)[0]): Invitation => {
    const cat = DENI_CONFIG.CATEGORIES.find((c) => c.id === tpl.categoryId) || DENI_CONFIG.CATEGORIES[0];
    return {
      id: 'demo-' + tpl.id,
      userId: 'demo',
      slug: 'demo-' + tpl.id,
      eventType: tpl.categoryId as any,
      templateId: tpl.id,
      packageType: 'premium',
      status: 'published',
      title: `${cat.title} — ${tpl.georgianName}`,
      coupleOrHostNames: tpl.categoryId === 'wedding' ? 'გიორგი & ნინო' : tpl.categoryId === 'baptism' ? 'ანდრია' : 'სალომე',
      eventDate: '2026-10-24',
      eventTime: '18:00',
      venueName: 'შატო მუხრანი',
      venueAddress: 'მუხრანი',
      venueCity: 'თბილისი',
      googleMapsUrl: 'https://maps.google.com',
      heroMessage: 'სიყვარულით გეპატიჟებით ჩვენს განსაკუთრებულ დღეს',
      description: 'გვსურს ეს დღე გაატაროთ ჩვენთან ერთად.',
      coverImage: cat.cover,
      countdownEnabled: true,
      timeline: [
        { id: '1', time: '18:00', title: 'სტუმრების მიღება' },
        { id: '2', time: '19:30', title: 'სადღესასწაულო საღამო' },
      ],
      gallery: [{ id: '1', url: cat.cover, isCover: true }],
      dressCode: {
        type: 'Black Tie',
        description: 'ელეგანტური საღამოს სამოსი.',
        palette: ['#0f172a', '#b45309'],
      },
      faqs: [],
      rsvpSettings: {
        enabled: true,
        deadlineDate: '2026-10-15',
        maxPlusGuests: 1,
        allowChildren: true,
      },
      premiumFeatures: {
        animatedIntro: true,
        musicEnabled: false,
        guestbookEnabled: true,
        confettiEffect: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 text-left">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-semibold uppercase tracking-widest text-amber-800">
          ნამუშევრები & შაბლონები
        </span>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-stone-900">
          DENI-ს დიზაინების კოლექცია
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          თითოეული დიზაინი შექმნილია უმაღლესი ესთეტიკური სტანდარტითა და ქართული ტიპოგრაფიის გათვალისწინებით
        </p>
      </div>

      {/* Category filter tabs */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
            activeCategory === 'all'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
          }`}
        >
          ყველა
        </button>
        {DENI_CONFIG.CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              activeCategory === cat.id
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
            }`}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((tpl) => {
          const cat = DENI_CONFIG.CATEGORIES.find((c) => c.id === tpl.categoryId) || DENI_CONFIG.CATEGORIES[0];
          return (
            <div
              key={tpl.id}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden">
                <img
                  src={cat.cover}
                  alt={tpl.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-medium">
                  {cat.title}
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h3 className="text-lg font-serif-ka font-bold text-stone-900">
                    {tpl.georgianName}
                  </h3>
                  <p className="text-xs text-stone-500 font-sans leading-relaxed">
                    {tpl.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPreviewTemplate(createMockInvitationForTemplate(tpl))}
                    icon={<Eye className="w-3.5 h-3.5" />}
                  >
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    variant="amber"
                    onClick={() => onUseTemplate(tpl.categoryId, tpl.id)}
                    icon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    გამოიყენე ეს დიზაინი
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <Modal
          isOpen={!!previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          title="შაბლონის Preview"
          maxWidth="2xl"
        >
          <div className="max-h-[75vh] overflow-y-auto no-scrollbar rounded-2xl bg-stone-50 border border-stone-200">
            <PublicInvitationView
              previewData={previewTemplate}
              onBackToApp={() => setPreviewTemplate(null)}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};
