import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Users,
  Eye,
  Share2,
  Heart,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { DENI_CONFIG } from '../config/deniConfig.ts';
import { Button } from '../components/ui/Button.tsx';
import { Modal } from '../components/ui/Modal.tsx';
import { PublicInvitationView } from './PublicInvitationView.tsx';
import { Invitation } from '../types/index.ts';

interface LandingPageProps {
  onStartCreate: () => void;
  onViewPortfolio: () => void;
  onSelectCategory: (categoryId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartCreate,
  onViewPortfolio,
  onSelectCategory,
}) => {
  const [selectedDemoPreview, setSelectedDemoPreview] = useState<Invitation | null>(null);

  // Sample mock invitation for instant portfolio preview
  const demoInvitation: Invitation = {
    id: 'demo-1',
    userId: 'demo',
    slug: 'giorgi-nino-demo',
    eventType: 'wedding',
    templateId: 'wedding-classic',
    packageType: 'premium',
    status: 'published',
    title: 'გიორგი & ნინო — ქორწილი',
    coupleOrHostNames: 'გიორგი & ნინო',
    secondaryNames: 'გიორგი მახარაძე & ნინო აბაშიძე',
    eventDate: '2026-10-24',
    eventTime: '16:00',
    venueName: 'შატო მუხრანი',
    venueAddress: 'მუხრანი, მცხეთა-მთიანეთი',
    venueCity: 'მცხეთა',
    googleMapsUrl: 'https://maps.google.com/?q=Chateau+Mukhrani',
    heroMessage: 'სიყვარულით გეპატიჟებით ჩვენი ცხოვრების უმნიშვნელოვანეს დღეს',
    description: 'გვინდა ეს განსაკუთრებული დღე ჩვენს უსაყვარლეს ადამიანებთან ერთად გავატაროთ.',
    coverImage: DENI_CONFIG.ASSETS.heroWedding,
    heroImage: DENI_CONFIG.ASSETS.heroWedding,
    storyTitle: 'ჩვენი ისტორია',
    storyContent: 'ყველაფერი 4 წლის წინ დაიწყო. მას შემდეგ ყოველი დღე სავსეა ერთგულებითა და ურთიერთპატივისცემით.',
    countdownEnabled: true,
    countdownMessage: 'ქორწილამდე დარჩა:',
    timeline: [
      { id: '1', time: '16:00', title: 'სტუმრების მიღება & Welcome Drink' },
      { id: '2', time: '17:00', title: 'ჯვრისწერის საზეიმო ცერემონია' },
      { id: '3', time: '19:00', title: 'სადღესასწაულო გალა ვახშამი' },
    ],
    gallery: [{ id: '1', url: DENI_CONFIG.ASSETS.heroWedding, isCover: true }],
    dressCode: {
      type: 'Black Tie',
      description: 'საღამოს სამოსი პასტელურ ან კლასიკურ მუქ ტონებში.',
      palette: ['#0f172a', '#b45309', '#e2e8f0'],
    },
    faqs: [
      { id: '1', question: 'არის თუ არა ავტოსადგომი?', answer: 'დიახ, შატოს ტერიტორიაზე მოწყობილია უფასო დაცული პარკინგი.' },
    ],
    rsvpSettings: {
      enabled: true,
      deadlineDate: '2026-10-15',
      maxPlusGuests: 2,
      allowChildren: true,
    },
    premiumFeatures: {
      animatedIntro: true,
      introTitle: 'გიორგი & ნინო',
      introSubtitle: '24 ოქტომბერი, 2026',
      musicEnabled: false,
      guestbookEnabled: true,
      confettiEffect: true,
    },
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-01T10:00:00.000Z',
  };

  return (
    <div className="space-y-24 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-200/80 text-amber-900 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                <span>{DENI_CONFIG.BRAND.philosophy}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight text-stone-900 leading-[1.15]">
                შენი განსაკუთრებული დღე.{' '}
                <span className="text-amber-800 font-serif-ka italic font-normal">
                  შენი განსაკუთრებული მოსაწვევი.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl">
                {DENI_CONFIG.BRAND.taglineSubtitle}
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button
                  size="lg"
                  variant="amber"
                  onClick={onStartCreate}
                  icon={<Sparkles className="w-4 h-4 text-amber-200" />}
                >
                  + ახალი მოსაწვევი
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setSelectedDemoPreview(demoInvitation)}
                  icon={<Eye className="w-4 h-4" />}
                >
                  ნამუშევრების Preview
                </Button>
              </div>

              {/* Trust markers */}
              <div className="pt-6 border-t border-stone-200/80 flex items-center gap-6 text-xs text-stone-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>რეალურ დროში RSVP</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>პერსონალური სახელობითი ბმულები</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>QR კოდი & რუკა</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-[360px] aspect-[4/5] rounded-[36px] overflow-hidden shadow-2xl border-4 border-stone-800/90 group cursor-pointer" onClick={() => setSelectedDemoPreview(demoInvitation)}>
                <img
                  src={DENI_CONFIG.ASSETS.heroWedding}
                  alt="Wedding stationery"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end text-white text-left space-y-1">
                  <span className="text-[11px] uppercase tracking-widest text-amber-300 font-semibold">
                    Live Demo
                  </span>
                  <h3 className="text-2xl font-display font-bold">
                    გიორგი & ნინო
                  </h3>
                  <p className="text-xs text-stone-200 font-serif-ka">
                    შატო მუხრანი • 24 ოქტომბერი
                  </p>
                  <div className="pt-2 flex items-center gap-1.5 text-xs text-amber-300 font-medium">
                    <span>დააჭირე სანახავად</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EVENT CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-800">
            კატეგორიები
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-stone-900">
            აირჩიე შენი ღონისძიების ტიპი
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            ყველა კატეგორიას აქვს ინდივიდუალური სტრუქტურა, შესაბამისი დიზაინი და ადაპტირებული ფერები
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DENI_CONFIG.CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="group bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-left"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                <img
                  src={cat.cover}
                  alt={cat.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-mono">
                  {cat.number}
                </div>
                {cat.badge && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-800 text-white text-[10px] font-semibold tracking-wide">
                    {cat.badge}
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-serif-ka font-bold text-stone-900">
                      {cat.title}
                    </h3>
                    <span className="text-xs text-stone-400 font-mono">
                      {DENI_CONFIG.PRICING[cat.id as keyof typeof DENI_CONFIG.PRICING]?.standard}₾-დან
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                  <button
                    onClick={() => onSelectCategory(cat.id)}
                    className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1 transition-colors"
                  >
                    <span>არჩევა და დაწყება</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setSelectedDemoPreview(demoInvitation)}
                    className="text-xs text-stone-400 hover:text-stone-700"
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PACKAGES COMPARISON */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-800">
            პაკეტები & ფასები
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-stone-900">
            აირჩიე შენთვის სასურველი პაკეტი
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            გამჭვირვალე ფასები ფარული გადასახადების გარეშე
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* STANDARD */}
          <div className="p-8 rounded-3xl bg-white border border-stone-200/90 shadow-sm flex flex-col justify-between text-left space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                  {DENI_CONFIG.PACKAGES.standard.name}
                </span>
                <span className="text-2xl font-bold font-display text-stone-900">
                  80 ₾ <span className="text-xs text-stone-400 font-normal">/ ქორწილი</span>
                </span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                {DENI_CONFIG.PACKAGES.standard.subtitle}
              </p>

              <div className="pt-4 border-t border-stone-100 space-y-2.5">
                {DENI_CONFIG.PACKAGES.standard.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              size="lg"
              variant="outline"
              onClick={onStartCreate}
              className="w-full"
            >
              Standard პაკეტის არჩევა
            </Button>
          </div>

          {/* PREMIUM */}
          <div className="p-8 rounded-3xl bg-stone-900 text-stone-100 shadow-xl flex flex-col justify-between text-left space-y-6 relative overflow-hidden border border-stone-800">
            <div className="absolute top-4 right-4 px-3 py-1 bg-amber-500 text-stone-950 text-[10px] font-bold rounded-full uppercase tracking-wider">
              {DENI_CONFIG.PACKAGES.premium.badge}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  {DENI_CONFIG.PACKAGES.premium.name}
                </span>
                <span className="text-2xl font-bold font-display text-white">
                  120 ₾ <span className="text-xs text-stone-400 font-normal">/ ქორწილი</span>
                </span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                {DENI_CONFIG.PACKAGES.premium.subtitle}
              </p>

              <div className="pt-4 border-t border-stone-800 space-y-2.5">
                {DENI_CONFIG.PACKAGES.premium.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-stone-200">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              size="lg"
              variant="amber"
              onClick={onStartCreate}
              className="w-full"
            >
              Premium პაკეტის არჩევა
            </Button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-800">
            პროცესი
          </span>
          <h2 className="text-3xl font-display font-bold text-stone-900">
            როგორ მუშაობს DENI?
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            სულ 3 მარტივი ნაბიჯი შენი სრულყოფილი მოსაწვევის შექმნამდე
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
            <span className="w-8 h-8 rounded-full bg-stone-100 text-stone-800 font-mono font-bold text-sm flex items-center justify-center">
              1
            </span>
            <h3 className="text-base font-semibold text-stone-900">
              აირჩიე სტილი და შეავსე დეტალები
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              შეარჩიე ღონისძიების კატეგორია, ატვირთე ფოტოები, მიუთითე თარიღი, ლოკაცია და დღის განრიგი.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
            <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-mono font-bold text-sm flex items-center justify-center">
              2
            </span>
            <h3 className="text-base font-semibold text-stone-900">
              იხილე Live Preview რეალურ დროში
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              დააკვირდი როგორ გამოიყურება შენი მოსაწვევი მობილურსა და კომპიუტერზე ზუსტად იმ სახით, როგორც სტუმრები ნახავენ.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
            <span className="w-8 h-8 rounded-full bg-stone-900 text-white font-mono font-bold text-sm flex items-center justify-center">
              3
            </span>
            <h3 className="text-base font-semibold text-stone-900">
              გაუგზავნე ბმული და აკონტროლე RSVP
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              გაუზიარე მოსაწვევი WhatsApp-ით, Telegram-ით ან QR კოდით და მიიღე სტუმრების დადასტურებები პირდაპირ პირად კაბინეტში.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-3 max-w-xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              DENI • ონლაინ მოსაწვევები
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold leading-tight">
              მზად ხარ შექმნა შენი განსაკუთრებული მოსაწვევი?
            </h2>
            <p className="text-xs sm:text-sm text-stone-300">
              „უბრალოდ ბმული არ არის.“ გახადე შენი დღე დაუვიწყარი პირველივე შეხებიდან.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="lg"
                variant="amber"
                onClick={onStartCreate}
                icon={<Sparkles className="w-4 h-4 text-amber-200" />}
              >
                + მოსაწვევის აწყობა
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Preview Modal */}
      {selectedDemoPreview && (
        <Modal
          isOpen={!!selectedDemoPreview}
          onClose={() => setSelectedDemoPreview(null)}
          title="მოსაწვევის საჩვენებელი Preview"
          maxWidth="2xl"
        >
          <div className="max-h-[75vh] overflow-y-auto no-scrollbar rounded-2xl bg-stone-50 border border-stone-200">
            <PublicInvitationView
              previewData={selectedDemoPreview}
              onBackToApp={() => setSelectedDemoPreview(null)}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};
