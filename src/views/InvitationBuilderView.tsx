import React, { useState, useEffect } from 'react';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Eye,
  Edit3,
  Calendar,
  Clock,
  MapPin,
  Upload,
  Plus,
  Trash2,
  Share2,
  CheckCircle2,
  Info,
  HelpCircle,
  Smartphone,
  Monitor,
} from 'lucide-react';
import { DENI_CONFIG } from '../config/deniConfig.ts';
import {
  Invitation,
  EventCategoryType,
  PackageType,
  TimelineItem,
  GalleryItem,
  FAQItem,
  DressCode,
  RSVPSettings,
  PremiumFeatures,
} from '../types/index.ts';
import { Button } from '../components/ui/Button.tsx';
import { Input, Textarea, Select } from '../components/ui/Input.tsx';
import { ImageUploader } from '../components/ui/ImageUploader.tsx';
import { PublicInvitationView } from './PublicInvitationView.tsx';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface InvitationBuilderViewProps {
  initialInvitation?: Invitation | null;
  onFinished: (invitationId: string) => void;
  onCancel: () => void;
}

export const InvitationBuilderView: React.FC<InvitationBuilderViewProps> = ({
  initialInvitation,
  onFinished,
  onCancel,
}) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  const [publishedInv, setPublishedInv] = useState<Invitation | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Invitation>>(() => {
    if (initialInvitation) return initialInvitation;

    return {
      eventType: 'wedding',
      templateId: 'wedding-classic',
      packageType: 'premium',
      status: 'draft',
      title: 'გიორგი & ნინო — ქორწილი',
      coupleOrHostNames: 'გიორგი & ნინო',
      secondaryNames: '',
      eventDate: '2026-10-24',
      eventTime: '16:00',
      venueName: 'შატო მუხრანი',
      venueAddress: 'მუხრანი, მცხეთა-მთიანეთი',
      venueCity: 'მცხეთა',
      googleMapsUrl: 'https://maps.google.com/?q=Chateau+Mukhrani',
      locationNotes: 'ცერემონია დაიწყება ბაღში, რის შემდეგაც გადავინაცვლებთ დარბაზში.',
      heroMessage: 'სიყვარულით გეპატიჟებით ჩვენი ცხოვრების უმნიშვნელოვანეს დღეს',
      description: 'ჩვენთვის დიდი პატივი იქნება, თუ ამ განსაკუთრებულ დღეს გაიზიარებთ ჩვენთან ერთად.',
      coverImage: DENI_CONFIG.ASSETS.heroWedding,
      heroImage: DENI_CONFIG.ASSETS.heroWedding,
      storyTitle: 'ჩვენი ისტორია',
      storyContent: 'ყველაფერი 4 წლის წინ დაიწყო. მას შემდეგ ყოველი დღე სავსეა სიყვარულითა და ერთგულებით.',
      countdownEnabled: true,
      countdownMessage: 'ქორწილამდე დარჩა:',
      timeline: [
        { id: '1', time: '16:00', title: 'სტუმრების მიღება & Welcome Drink' },
        { id: '2', time: '17:00', title: 'საზეიმო ცერემონია' },
        { id: '3', time: '19:00', title: 'გალა ვახშამი & ტორტი' },
      ],
      gallery: [
        { id: 'g1', url: DENI_CONFIG.ASSETS.heroWedding, caption: 'ჩვენი დღე', isCover: true },
      ],
      dressCode: {
        type: 'Black Tie',
        description: 'საღამოს კლასიკური სამოსი პასტელურ ან მუქ ტონებში.',
        palette: ['#0f172a', '#b45309', '#e2e8f0'],
      },
      faqs: [
        { id: 'f1', question: 'როდემდე შეგვიძლია RSVP დადასტურება?', answer: 'გთხოვთ დაადასტუროთ ღონისძიებამდე 2 კვირით ადრე.' },
      ],
      rsvpSettings: {
        enabled: true,
        deadlineDate: '2026-10-10',
        maxPlusGuests: 2,
        allowChildren: true,
        customQuestion: 'კვებითი შეზღუდვები ხომ არ გაქვთ?',
      },
      premiumFeatures: {
        animatedIntro: true,
        introTitle: 'გიორგი & ნინო',
        introSubtitle: '24 ოქტომბერი, 2026',
        musicEnabled: false,
        guestbookEnabled: true,
        confettiEffect: true,
      },
    };
  });

  const updateField = (field: keyof Invitation, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const steps = [
    { num: 1, title: 'ღონისძიების ტიპი' },
    { num: 2, title: 'დიზაინის შაბლონი' },
    { num: 3, title: 'პაკეტი' },
    { num: 4, title: 'ძირითადი ინფორმაცია' },
    { num: 5, title: 'მთავარი ფოტოები' },
    { num: 6, title: 'Countdown' },
    { num: 7, title: 'განრიგი (Timeline)' },
    { num: 8, title: 'ლოკაცია & რუკა' },
    { num: 9, title: 'ფოტოალბომი' },
    { num: 10, title: 'დრეს კოდი' },
    { num: 11, title: 'FAQ' },
    { num: 12, title: 'RSVP პარამეტრები' },
    { num: 13, title: 'Premium ფუნქციები' },
    { num: 14, title: 'სრული Preview' },
    { num: 15, title: 'გამოქვეყნება' },
  ];

  // Price calculation
  const currentCategory = formData.eventType || 'wedding';
  const categoryPrices = DENI_CONFIG.PRICING[currentCategory] || { standard: 50, premium: 100 };
  const currentPrice = formData.packageType === 'premium' ? categoryPrices.premium : categoryPrices.standard;

  // Handlers for dynamic lists
  const addTimelineItem = () => {
    const newItem: TimelineItem = {
      id: 't-' + Date.now(),
      time: '18:00',
      title: 'ახალი აქტივობა',
      description: '',
    };
    updateField('timeline', [...(formData.timeline || []), newItem]);
  };

  const removeTimelineItem = (id: string) => {
    updateField('timeline', (formData.timeline || []).filter((t) => t.id !== id));
  };

  const updateTimelineItem = (id: string, updates: Partial<TimelineItem>) => {
    updateField(
      'timeline',
      (formData.timeline || []).map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const addFAQItem = () => {
    const newItem: FAQItem = {
      id: 'f-' + Date.now(),
      question: 'კითხვა',
      answer: 'პასუხი',
    };
    updateField('faqs', [...(formData.faqs || []), newItem]);
  };

  const removeFAQItem = (id: string) => {
    updateField('faqs', (formData.faqs || []).filter((f) => f.id !== id));
  };

  const updateFAQItem = (id: string, updates: Partial<FAQItem>) => {
    updateField(
      'faqs',
      (formData.faqs || []).map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const addGalleryImage = (url: string) => {
    if (!url) return;
    const newItem: GalleryItem = {
      id: 'g-' + Date.now(),
      url,
      caption: '',
    };
    updateField('gallery', [...(formData.gallery || []), newItem]);
  };

  const removeGalleryImage = (id: string) => {
    updateField('gallery', (formData.gallery || []).filter((g) => g.id !== id));
  };

  // Submit & Publish
  const handlePublish = async () => {
    if (!isAuthenticated) {
      openAuthModal('register');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      let savedInv: Invitation;
      if (initialInvitation?.id) {
        savedInv = await api.updateInvitation(initialInvitation.id, formData);
      } else {
        savedInv = await api.createInvitation(formData);
      }

      // Publish and create order
      const result = await api.publishInvitation(savedInv.id);
      setPublishedInv(result.invitation);
    } catch (err: any) {
      setError(err.message || 'გამოქვეყნება ვერ მოხერხდა. სცადეთ თავიდან.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (publishedInv) {
    const invUrl = `${window.location.origin}/i/${publishedInv.slug}`;
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-display font-bold text-stone-900">
            გილოცავთ! მოსაწვევი გამოქვეყნდა
          </h2>
          <p className="text-sm text-stone-600 max-w-md mx-auto">
            შენი ონლაინ მოსაწვევი უკვე ხელმისაწვდომია და მზად არის სტუმრებთან გასაგზავნად.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200 text-left space-y-2">
          <span className="text-xs font-semibold text-stone-700">მოსაწვევის პირდაპირი ბმული:</span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={invUrl}
              className="w-full bg-white px-3 py-2 text-xs rounded-xl border border-stone-300 font-mono text-stone-800"
            />
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                navigator.clipboard.writeText(invUrl);
                alert('ბმული დაკოპირდა!');
              }}
            >
              კოპირება
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button
            size="lg"
            variant="primary"
            onClick={() => onFinished(publishedInv.id)}
          >
            ჩემს მოსაწვევებში გადასვლა
          </Button>
          <a
            href={`/i/${publishedInv.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-xl border border-stone-300 text-stone-800 text-sm font-medium hover:bg-stone-100 transition-colors"
          >
            მოსაწვევის გახსნა ახალ ფანჯარაში
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100/70 pb-20">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-stone-200 px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="text-xs text-stone-500 hover:text-stone-800 transition-colors font-medium flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>გამოსვლა</span>
          </button>
          <span className="text-stone-300">|</span>
          <span className="text-xs font-semibold text-stone-900 truncate max-w-[200px] sm:max-w-xs">
            {formData.title || 'ახალი მოსაწვევი'}
          </span>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="flex md:hidden bg-stone-100 p-1 rounded-xl">
          <button
            onClick={() => setMobileTab('editor')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              mobileTab === 'editor' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
            }`}
          >
            შექმნა
          </button>
          <button
            onClick={() => setMobileTab('preview')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
              mobileTab === 'preview' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-xs text-stone-500">
            ნაბიჯი {currentStep} / 15
          </span>
          {currentStep === 15 ? (
            <Button
              size="sm"
              variant="amber"
              onClick={handlePublish}
              isLoading={isSubmitting}
            >
              გამოქვეყნება ({currentPrice}₾)
            </Button>
          ) : (
            <Button
              size="sm"
              variant="primary"
              onClick={() => setCurrentStep((s) => Math.min(15, s + 1))}
            >
              შემდეგი
            </Button>
          )}
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* LEFT / EDITOR PANEL (7 cols on desktop) */}
        <div className={`md:col-span-6 lg:col-span-7 space-y-6 ${mobileTab === 'preview' ? 'hidden md:block' : 'block'}`}>
          {/* Stepper Progress bar */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
              <span className="font-semibold text-stone-800">
                ეტაპი {currentStep}: {steps[currentStep - 1]?.title}
              </span>
              <span>{Math.round((currentStep / 15) * 100)}%</span>
            </div>
            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-800 h-full rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 15) * 100}%` }}
              />
            </div>

            {/* Stepper chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 no-scrollbar">
              {steps.map((st) => (
                <button
                  key={st.num}
                  type="button"
                  onClick={() => setCurrentStep(st.num)}
                  className={`px-2.5 py-1 text-[11px] rounded-lg whitespace-nowrap transition-colors ${
                    currentStep === st.num
                      ? 'bg-stone-900 text-white font-medium'
                      : currentStep > st.num
                      ? 'bg-amber-50 text-amber-900 hover:bg-amber-100'
                      : 'text-stone-400 hover:text-stone-700 bg-stone-50'
                  }`}
                >
                  {st.num}. {st.title}
                </button>
              ))}
            </div>
          </div>

          {/* STEP CONTENTS */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6">
            {error && (
              <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
                {error}
              </div>
            )}

            {/* Step 1: Category */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-stone-900">
                    აირჩიე ღონისძიების ტიპი
                  </h3>
                  <p className="text-xs text-stone-500">
                    ღონისძიების ტიპის მიხედვით ავტომატურად შეირჩევა შესაბამისი სტილი და სტრუქტურა
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {DENI_CONFIG.CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        updateField('eventType', cat.id);
                        // set default template for category
                        const defaultTpl = DENI_CONFIG.TEMPLATES.find((t) => t.categoryId === cat.id);
                        if (defaultTpl) updateField('templateId', defaultTpl.id);
                      }}
                      className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                        formData.eventType === cat.id
                          ? 'border-amber-800 bg-amber-50/50 ring-2 ring-amber-800/30 font-semibold'
                          : 'border-stone-200 hover:border-stone-300 bg-stone-50/40'
                      }`}
                    >
                      <span className="text-[10px] text-stone-400 font-mono">{cat.number}</span>
                      <h4 className="text-sm font-semibold text-stone-900 mt-2">{cat.title}</h4>
                      <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">{cat.subtitle}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Template */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-stone-900">
                    აირჩიე დიზაინის სტილი
                  </h3>
                  <p className="text-xs text-stone-500">
                    შერჩეული კატეგორიისთვის ({formData.eventType}) ხელმისაწვდომი შაბლონები
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DENI_CONFIG.TEMPLATES.filter((t) => t.categoryId === formData.eventType || t.categoryId === 'wedding').map(
                    (tpl) => (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => updateField('templateId', tpl.id)}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          formData.templateId === tpl.id
                            ? 'border-amber-800 bg-amber-50/40 ring-2 ring-amber-800/30'
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <h4 className="text-sm font-semibold text-stone-900">
                          {tpl.georgianName} ({tpl.name})
                        </h4>
                        <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                          {tpl.description}
                        </p>
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Package */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-stone-900">
                    აირჩიე პაკეტი: Standard თუ Premium?
                  </h3>
                  <p className="text-xs text-stone-500">
                    ფასები ავტომატურად რეგულირდება კატეგორიის მიხედვით
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Standard */}
                  <div
                    onClick={() => updateField('packageType', 'standard')}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      formData.packageType === 'standard'
                        ? 'border-amber-800 bg-amber-50/40 ring-2 ring-amber-800/30'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-stone-600">Standard</span>
                      <span className="text-xl font-bold font-display text-stone-900">{categoryPrices.standard}₾</span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">სრულყოფილი ონლაინ მოსაწვევი</p>
                    <ul className="text-xs text-stone-600 space-y-1.5 mt-4">
                      {DENI_CONFIG.PACKAGES.standard.features.slice(0, 6).map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Premium */}
                  <div
                    onClick={() => updateField('packageType', 'premium')}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all relative ${
                      formData.packageType === 'premium'
                        ? 'border-amber-800 bg-amber-50/40 ring-2 ring-amber-800/30'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-amber-800">Premium ★</span>
                      <span className="text-xl font-bold font-display text-amber-900">{categoryPrices.premium}₾</span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">პერსონალური მოწვევა & ანიმაციები</p>
                    <ul className="text-xs text-stone-600 space-y-1.5 mt-4">
                      {DENI_CONFIG.PACKAGES.premium.features.slice(0, 7).map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Basic Info */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-stone-900">
                    ძირითადი ინფორმაცია
                  </h3>
                  <p className="text-xs text-stone-500">
                    მიუთითეთ სახელები, თარიღი, დრო და მოსაწვევის სათაური
                  </p>
                </div>
                <Input
                  label="მოსაწვევის სათაური *"
                  value={formData.title || ''}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="მაგ: გიორგი & ნინო — ქორწილი"
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="მთავარი სახელები (Couple / Host Names) *"
                    value={formData.coupleOrHostNames || ''}
                    onChange={(e) => updateField('coupleOrHostNames', e.target.value)}
                    placeholder="მაგ: გიორგი & ნინო"
                    required
                  />
                  <Input
                    label="დამატებითი სახელები (არასავალდებულო)"
                    value={formData.secondaryNames || ''}
                    onChange={(e) => updateField('secondaryNames', e.target.value)}
                    placeholder="მაგ: მშობლები ან ნათლიები"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="ღონისძიების თარიღი *"
                    type="date"
                    value={formData.eventDate || ''}
                    onChange={(e) => updateField('eventDate', e.target.value)}
                    required
                  />
                  <Input
                    label="დაწყების დრო *"
                    type="time"
                    value={formData.eventTime || ''}
                    onChange={(e) => updateField('eventTime', e.target.value)}
                    required
                  />
                </div>
                <Textarea
                  label="მისასალმებელი ტექსტი / ციტატა"
                  value={formData.heroMessage || ''}
                  onChange={(e) => updateField('heroMessage', e.target.value)}
                  placeholder="მაგ: სიყვარულით გეპატიჟებით ჩვენი ცხოვრების უმნიშვნელოვანეს დღეს..."
                  rows={2}
                />
                <Textarea
                  label="ჩვენი ისტორია (Love Story ან Event Story)"
                  value={formData.storyContent || ''}
                  onChange={(e) => updateField('storyContent', e.target.value)}
                  placeholder="მოკლე ისტორია იმის შესახებ, თუ როგორ დაიწყო ეს თავგადასავალი..."
                  rows={3}
                />
              </div>
            )}

            {/* Step 5: Photos */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-stone-900">
                    მთავარი ფოტოები
                  </h3>
                  <p className="text-xs text-stone-500">
                    ატვირთეთ მაღალი ხარისხის ფოტო მოსაწვევის ყდისთვის
                  </p>
                </div>
                <ImageUploader
                  label="ყდის მთავარი ფოტო (Cover Photo) *"
                  value={formData.coverImage || ''}
                  onChange={(url) => updateField('coverImage', url)}
                  aspectRatio="4:3"
                />
              </div>
            )}

            {/* Step 6: Countdown */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-stone-900">
                    Countdown (დროის ათვლა)
                  </h3>
                  <p className="text-xs text-stone-500">
                    მოსაწვევში ავტომატურად დაითვლება დღეები, საათები, წუთები და წამები
                  </p>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl border border-stone-200">
                  <input
                    type="checkbox"
                    id="countdownEnabled"
                    checked={formData.countdownEnabled}
                    onChange={(e) => updateField('countdownEnabled', e.target.checked)}
                    className="w-4 h-4 rounded text-amber-800"
                  />
                  <label htmlFor="countdownEnabled" className="text-sm font-medium text-stone-800">
                    Countdown-ის ჩვენება მოსაწვევში
                  </label>
                </div>

                <Input
                  label="Countdown-ის წარწერა"
                  value={formData.countdownMessage || ''}
                  onChange={(e) => updateField('countdownMessage', e.target.value)}
                  placeholder="ღონისძიების დაწყებამდე დარჩა:"
                />
              </div>
            )}

            {/* Step 7: Timeline */}
            {currentStep === 7 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-stone-900">
                      დღის განრიგი (Timeline)
                    </h3>
                    <p className="text-xs text-stone-500">
                      დაამატეთ ცერემონიის, სუფრისა თუ გართობის ეტაპები
                    </p>
                  </div>
                  <Button size="sm" variant="secondary" onClick={addTimelineItem} icon={<Plus className="w-4 h-4" />}>
                    დამატება
                  </Button>
                </div>

                <div className="space-y-3">
                  {(formData.timeline || []).map((item) => (
                    <div key={item.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2 relative">
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          label="დრო"
                          value={item.time}
                          onChange={(e) => updateTimelineItem(item.id, { time: e.target.value })}
                          placeholder="18:00"
                        />
                        <div className="col-span-2">
                          <Input
                            label="სათაური"
                            value={item.title}
                            onChange={(e) => updateTimelineItem(item.id, { title: e.target.value })}
                            placeholder="ჯვრისწერის ცერემონია"
                          />
                        </div>
                      </div>
                      <Input
                        label="აღწერა (არასავალდებულო)"
                        value={item.description || ''}
                        onChange={(e) => updateTimelineItem(item.id, { description: e.target.value })}
                        placeholder="მოკლე განმარტება..."
                      />
                      <button
                        type="button"
                        onClick={() => removeTimelineItem(item.id)}
                        className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 mt-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>წაშლა</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 8: Location */}
            {currentStep === 8 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-stone-900">
                    ლოკაცია და რუკა
                  </h3>
                  <p className="text-xs text-stone-500">
                    სად ტარდება ღონისძიება და როგორ მივიდნენ სტუმრები?
                  </p>
                </div>
                <Input
                  label="ადგილის / რესტორნის სახელწოდება *"
                  value={formData.venueName || ''}
                  onChange={(e) => updateField('venueName', e.target.value)}
                  placeholder="მაგ: შატო მუხრანი, რესტორანი ფუნიკულიორი"
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="მისამართი *"
                    value={formData.venueAddress || ''}
                    onChange={(e) => updateField('venueAddress', e.target.value)}
                    placeholder="მაგ: მუხრანი, სოფელი მუხრანი"
                    required
                  />
                  <Input
                    label="ქალაქი *"
                    value={formData.venueCity || ''}
                    onChange={(e) => updateField('venueCity', e.target.value)}
                    placeholder="მაგ: თბილისი, მცხეთა"
                    required
                  />
                </div>
                <Input
                  label="Google Maps ბმული"
                  value={formData.googleMapsUrl || ''}
                  onChange={(e) => updateField('googleMapsUrl', e.target.value)}
                  placeholder="https://maps.google.com/?q=..."
                />
                <Textarea
                  label="დამატებითი მითითება სტუმრებისთვის"
                  value={formData.locationNotes || ''}
                  onChange={(e) => updateField('locationNotes', e.target.value)}
                  placeholder="მაგ: პარკინგი ხელმისაწვდომია მარცხენა მხარეს..."
                  rows={2}
                />
              </div>
            )}

            {/* Step 9: Gallery */}
            {currentStep === 9 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-stone-900">
                    ფოტოალბომი (გალერეა)
                  </h3>
                  <p className="text-xs text-stone-500">
                    დაამატეთ თქვენი ერთობლივი ან საზეიმო ფოტოები
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(formData.gallery || []).map((img) => (
                    <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden border border-stone-200 group">
                      <img src={img.url} alt="Gallery" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(img.id)}
                        className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <ImageUploader
                    label="ახალი ფოტოს დამატება გალერეაში"
                    value=""
                    onChange={(url) => addGalleryImage(url)}
                    aspectRatio="1:1"
                  />
                </div>
              </div>
            )}

            {/* Step 10: Dress Code */}
            {currentStep === 10 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-stone-900">
                    დრეს კოდი
                  </h3>
                  <p className="text-xs text-stone-500">
                    აირჩიეთ სამოსის სტილი და რეკომენდებული ფერები
                  </p>
                </div>

                <Select
                  label="დრეს კოდის ტიპი"
                  value={formData.dressCode?.type || 'Black Tie'}
                  onChange={(e) =>
                    updateField('dressCode', {
                      ...formData.dressCode,
                      type: e.target.value as any,
                    })
                  }
                  options={[
                    { value: 'Black Tie', label: 'Black Tie (საღამოს კლასიკური)' },
                    { value: 'Formal', label: 'Formal (ფორმალური)' },
                    { value: 'Smart Casual', label: 'Smart Casual (ელეგანტური ყოველდღიური)' },
                    { value: 'White / Pastel', label: 'White / Pastel (თეთრი და პასტელი)' },
                    { value: 'Custom', label: 'Custom (ინდივიდუალური)' },
                  ]}
                />

                <Textarea
                  label="დრეს კოდის აღწერა"
                  value={formData.dressCode?.description || ''}
                  onChange={(e) =>
                    updateField('dressCode', {
                      ...formData.dressCode,
                      description: e.target.value,
                    })
                  }
                  rows={2}
                />
              </div>
            )}

            {/* Step 11: FAQ */}
            {currentStep === 11 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-stone-900">
                      ხშირად დასმული კითხვები (FAQ)
                    </h3>
                    <p className="text-xs text-stone-500">
                      უპასუხეთ სტუმრებისთვის მოსალოდნელ კითხვებს
                    </p>
                  </div>
                  <Button size="sm" variant="secondary" onClick={addFAQItem} icon={<Plus className="w-4 h-4" />}>
                    კითხვის დამატება
                  </Button>
                </div>

                <div className="space-y-3">
                  {(formData.faqs || []).map((faq) => (
                    <div key={faq.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
                      <Input
                        label="კითხვა"
                        value={faq.question}
                        onChange={(e) => updateFAQItem(faq.id, { question: e.target.value })}
                        placeholder="მაგ: არის თუ არა პარკინგი?"
                      />
                      <Textarea
                        label="პასუხი"
                        value={faq.answer}
                        onChange={(e) => updateFAQItem(faq.id, { answer: e.target.value })}
                        rows={2}
                      />
                      <button
                        type="button"
                        onClick={() => removeFAQItem(faq.id)}
                        className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>წაშლა</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 12: RSVP Settings */}
            {currentStep === 12 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-stone-900">
                    RSVP დადასტურების პარამეტრები
                  </h3>
                  <p className="text-xs text-stone-500">
                    მართეთ სტუმრების დასწრების ვადა და ლიმიტები
                  </p>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl border border-stone-200">
                  <input
                    type="checkbox"
                    id="rsvpEnabled"
                    checked={formData.rsvpSettings?.enabled}
                    onChange={(e) =>
                      updateField('rsvpSettings', {
                        ...formData.rsvpSettings,
                        enabled: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded text-amber-800"
                  />
                  <label htmlFor="rsvpEnabled" className="text-sm font-medium text-stone-800">
                    RSVP ფორმის გააქტიურება
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="დადასტურების ბოლო ვადა"
                    type="date"
                    value={formData.rsvpSettings?.deadlineDate || ''}
                    onChange={(e) =>
                      updateField('rsvpSettings', {
                        ...formData.rsvpSettings,
                        deadlineDate: e.target.value,
                      })
                    }
                  />
                  <Input
                    label="მაქს. დამატებითი სტუმრები (+1, +2)"
                    type="number"
                    min={0}
                    max={5}
                    value={formData.rsvpSettings?.maxPlusGuests || 1}
                    onChange={(e) =>
                      updateField('rsvpSettings', {
                        ...formData.rsvpSettings,
                        maxPlusGuests: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <Input
                  label="დამატებითი კითხვა სტუმარს (მაგ: ალერგია)"
                  value={formData.rsvpSettings?.customQuestion || ''}
                  onChange={(e) =>
                    updateField('rsvpSettings', {
                      ...formData.rsvpSettings,
                      customQuestion: e.target.value,
                    })
                  }
                  placeholder="მაგ: გაქვთ რაიმე კვებითი ალერგია?"
                />
              </div>
            )}

            {/* Step 13: Premium Features */}
            {currentStep === 13 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-stone-900">
                    Premium ფუნქციები
                  </h3>
                  <p className="text-xs text-stone-500">
                    ექსკლუზიური ეფექტები თქვენი მოსაწვევისთვის
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-stone-200">
                    <div>
                      <h4 className="text-sm font-semibold text-stone-900">
                        ანიმაციური შესავალი (Intro Screen)
                      </h4>
                      <p className="text-xs text-stone-500">
                        კინემატოგრაფიული ეკრანი მოსაწვევის გახსნის ღილაკით
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.premiumFeatures?.animatedIntro}
                      onChange={(e) =>
                        updateField('premiumFeatures', {
                          ...formData.premiumFeatures,
                          animatedIntro: e.target.checked,
                        })
                      }
                      className="w-5 h-5 rounded text-amber-800"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-stone-200">
                    <div>
                      <h4 className="text-sm font-semibold text-stone-900">
                        მილოცვების წიგნი (Guestbook)
                      </h4>
                      <p className="text-xs text-stone-500">
                        სტუმრების თბილი სურვილების დატოვების შესაძლებლობა
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.premiumFeatures?.guestbookEnabled}
                      onChange={(e) =>
                        updateField('premiumFeatures', {
                          ...formData.premiumFeatures,
                          guestbookEnabled: e.target.checked,
                        })
                      }
                      className="w-5 h-5 rounded text-amber-800"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-stone-200">
                    <div>
                      <h4 className="text-sm font-semibold text-stone-900">
                        კონფეტის ეფექტი RSVP-ზე
                      </h4>
                      <p className="text-xs text-stone-500">
                        სადღესასწაულო ანიმაცია სტუმრის დასწრების დადასტურებისას
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.premiumFeatures?.confettiEffect}
                      onChange={(e) =>
                        updateField('premiumFeatures', {
                          ...formData.premiumFeatures,
                          confettiEffect: e.target.checked,
                        })
                      }
                      className="w-5 h-5 rounded text-amber-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 14: Preview Step */}
            {currentStep === 14 && (
              <div className="space-y-4 text-center py-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-stone-900">
                  შეამოწმე შენი მოსაწვევის Preview
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  მარჯვენა მხარეს (ან მობილურზე ზედა „Preview“ ღილაკით) ხედავთ მოსაწვევს ზუსტად ისე, როგორც მას თქვენი სტუმარი იხილავს.
                </p>
                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setCurrentStep(15)}
                    icon={<ChevronRight className="w-4 h-4" />}
                  >
                    გადასვლა გამოქვეყნებაზე
                  </Button>
                </div>
              </div>
            )}

            {/* Step 15: Publish & Order */}
            {currentStep === 15 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-stone-900">
                    მოსაწვევის გამოქვეყნება & შეკვეთა
                  </h3>
                  <p className="text-xs text-stone-500">
                    გამოქვეყნების შემდეგ გენერირდება უნიკალური ბმული და QR კოდი
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
                  <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
                    <span className="text-xs font-medium text-stone-700">ღონისძიება:</span>
                    <span className="text-xs font-bold text-stone-900">{formData.title}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
                    <span className="text-xs font-medium text-stone-700">შერჩეული პაკეტი:</span>
                    <span className="text-xs font-bold uppercase text-amber-900">
                      {formData.packageType}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm font-semibold text-stone-900">სულ გადასახდელი:</span>
                    <span className="text-2xl font-display font-bold text-amber-950">
                      {currentPrice} ₾
                    </span>
                  </div>
                </div>

                <Button
                  size="lg"
                  variant="amber"
                  className="w-full"
                  isLoading={isSubmitting}
                  onClick={handlePublish}
                >
                  გამოქვეყნება ({currentPrice}₾)
                </Button>
              </div>
            )}

            {/* Back / Next Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-200/80">
              <Button
                variant="outline"
                size="sm"
                disabled={currentStep === 1}
                onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                icon={<ChevronLeft className="w-4 h-4" />}
              >
                უკან
              </Button>

              {currentStep < 15 ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setCurrentStep((s) => Math.min(15, s + 1))}
                  icon={<ChevronRight className="w-4 h-4" />}
                >
                  გაგრძელება
                </Button>
              ) : (
                <Button
                  variant="amber"
                  size="sm"
                  onClick={handlePublish}
                  isLoading={isSubmitting}
                >
                  გამოქვეყნება
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT / LIVE PREVIEW PANEL (5 cols on desktop, sticky phone-mock frame) */}
        <div
          className={`md:col-span-6 lg:col-span-5 ${
            mobileTab === 'editor' ? 'hidden md:block' : 'block'
          } sticky top-20`}
        >
          <div className="text-center mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center justify-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Live Preview (რეალური დრო)</span>
            </span>
          </div>

          {/* Smartphone mockup container */}
          <div className="w-full max-w-[390px] mx-auto bg-stone-900 p-2.5 sm:p-3 rounded-[40px] shadow-2xl border-4 border-stone-800">
            {/* Screen bezel */}
            <div className="relative w-full h-[680px] bg-stone-50 rounded-[32px] overflow-hidden overflow-y-auto no-scrollbar shadow-inner">
              <PublicInvitationView
                previewData={formData as Invitation}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
