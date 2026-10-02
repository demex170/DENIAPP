import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  Heart,
  Share2,
  Navigation,
  Volume2,
  VolumeX,
  Sparkles,
  QrCode,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Invitation, Guest } from '../types/index.ts';
import { api } from '../services/api.ts';
import { CountdownTimer } from '../components/invitation/CountdownTimer.tsx';
import { TimelineView, DressCodeCard } from '../components/invitation/TimelineView.tsx';
import { FAQAccordion, GalleryGrid } from '../components/invitation/GalleryGrid.tsx';
import { RSVPForm } from '../components/invitation/RSVPForm.tsx';
import { WishesGuestbook } from '../components/invitation/WishesGuestbook.tsx';
import { QRCodeModal } from '../components/ui/QRCodeModal.tsx';
import { Button } from '../components/ui/Button.tsx';

interface PublicInvitationViewProps {
  slug?: string;
  guestToken?: string;
  previewData?: Invitation; // When called from builder live preview!
  onBackToApp?: () => void;
}

export const PublicInvitationView: React.FC<PublicInvitationViewProps> = ({
  slug,
  guestToken,
  previewData,
  onBackToApp,
}) => {
  const [invitation, setInvitation] = useState<Invitation | null>(previewData || null);
  const [guest, setGuest] = useState<Guest | null>(null);
  const [isLoading, setIsLoading] = useState(!previewData);
  const [error, setError] = useState<string | null>(null);
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  useEffect(() => {
    if (previewData) {
      setInvitation(previewData);
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (guestToken) {
          const res = await api.getPersonalGuestInvite(guestToken);
          setInvitation(res.invitation);
          setGuest(res.guest);
        } else if (slug) {
          const inv = await api.getPublicInvitation(slug);
          setInvitation(inv);
        }
      } catch (err: any) {
        setError(err.message || 'მოსაწვევი ვერ მოიძებნა');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug, guestToken, previewData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 text-stone-600 space-y-4">
        <div className="w-10 h-10 border-2 border-stone-300 border-t-amber-800 rounded-full animate-spin" />
        <p className="text-xs uppercase tracking-widest font-medium">მოსაწვევი იტვირთება...</p>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 p-6 text-center space-y-4">
        <h2 className="text-xl font-serif-ka font-semibold text-stone-900">
          მოსაწვევი ვერ მოიძებნა
        </h2>
        <p className="text-xs text-stone-500 max-w-sm">
          შესაძლოა ბმული არასწორია ან მოსაწვევის მოქმედების ვადა ამოიწურა.
        </p>
        {onBackToApp && (
          <Button variant="primary" size="sm" onClick={onBackToApp}>
            მთავარ გვერდზე დაბრუნება
          </Button>
        )}
      </div>
    );
  }

  // Template styles configuration
  const isDarkTheme = invitation.templateId.includes('noir') || invitation.templateId.includes('dark');
  const themeBg = isDarkTheme ? 'bg-neutral-950 text-stone-100' : 'bg-stone-50 text-stone-900';
  const cardBg = isDarkTheme ? 'bg-neutral-900/90 border-neutral-800' : 'bg-white border-stone-200/90';

  // Share URL
  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://deni.ge/i/${invitation.slug}`;

  // Premium Animated Intro Modal
  const showIntroScreen = invitation.packageType === 'premium' && invitation.premiumFeatures?.animatedIntro && !isIntroOpen;

  if (showIntroScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-stone-950 text-stone-100 p-6 text-center select-none overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute inset-0 opacity-30 bg-cover bg-center filter blur-xl scale-110" style={{ backgroundImage: `url(${invitation.coverImage})` }} />
        <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-md" />

        <div className="relative z-10 max-w-md w-full flex flex-col items-center space-y-8 animate-fade-in">
          <span className="text-[11px] tracking-[0.25em] uppercase text-amber-300 font-medium">
            ონლაინ მოსაწვევი
          </span>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-white">
              {invitation.coupleOrHostNames}
            </h1>
            <p className="text-xs font-serif-ka text-stone-300 tracking-wide">
              {invitation.title}
            </p>
          </div>

          {/* Personal Greeting for Guest */}
          {guest && (
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center space-y-1 w-full animate-bounce-subtle">
              <span className="text-xs text-amber-300 font-semibold tracking-wide">
                პერსონალური მოწვევა
              </span>
              <h3 className="text-lg font-serif-ka font-semibold text-white">
                ძვირფასო {guest.firstName} {guest.lastName},
              </h3>
              {guest.personalNote && (
                <p className="text-xs text-stone-300 italic pt-1">
                  „{guest.personalNote}“
                </p>
              )}
            </div>
          )}

          <div className="pt-4 w-full flex flex-col items-center">
            <button
              onClick={() => setIsIntroOpen(true)}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-600 text-white font-medium text-sm tracking-wide shadow-xl hover:shadow-amber-900/30 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2.5"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>მოსაწვევის გახსნა</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-stone-400 mt-4 tracking-wider">
              {new Date(invitation.eventDate).toLocaleDateString('ka-GE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeBg} selection:bg-amber-100 selection:text-amber-900 font-sans-ka pb-20`}>
      {/* Top Floating Controls */}
      <div className="fixed top-4 left-4 right-4 z-40 max-w-xl mx-auto flex items-center justify-between pointer-events-none">
        {onBackToApp ? (
          <button
            onClick={onBackToApp}
            className="pointer-events-auto px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md text-xs font-medium border border-white/20 shadow-md transition-all active:scale-95"
          >
            ← რედაქტირებაზე დაბრუნება
          </button>
        ) : (
          <div className="pointer-events-auto px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[11px] text-stone-300 font-display">
            DENI
          </div>
        )}

        <div className="flex items-center gap-2 pointer-events-auto">
          {invitation.premiumFeatures?.musicEnabled && (
            <button
              onClick={() => setIsPlayingMusic(!isPlayingMusic)}
              className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 shadow-md transition-all active:scale-95"
              title={isPlayingMusic ? 'მუსიკის შეჩერება' : 'მუსიკის ჩართვა'}
            >
              {isPlayingMusic ? <Volume2 className="w-4 h-4 text-amber-300" /> : <VolumeX className="w-4 h-4" />}
            </button>
          )}

          <button
            onClick={() => setIsQRModalOpen(true)}
            className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 shadow-md transition-all active:scale-95"
            title="გაზიარება / QR კოდი"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-xl mx-auto px-4 sm:px-6 space-y-12">
        {/* HERO SECTION */}
        <section className="relative pt-16 sm:pt-20 text-center space-y-6">
          {/* Cover / Hero Photo */}
          <div className="relative w-full aspect-[4/5] sm:aspect-square rounded-3xl overflow-hidden shadow-2xl border border-stone-200/50 group">
            <img
              src={invitation.coverImage || invitation.heroImage}
              alt={invitation.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20 flex flex-col justify-end p-6 sm:p-8 text-white text-center space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-amber-300 font-medium">
                {invitation.eventType.toUpperCase()}
              </span>
              <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-white leading-tight">
                {invitation.coupleOrHostNames}
              </h1>
              {invitation.secondaryNames && (
                <p className="text-xs sm:text-sm text-stone-200 font-serif-ka">
                  {invitation.secondaryNames}
                </p>
              )}
              <div className="pt-2 flex items-center justify-center gap-3 text-xs text-stone-300">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  {new Date(invitation.eventDate).toLocaleDateString('ka-GE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  {invitation.eventTime}
                </span>
              </div>
            </div>
          </div>

          {/* Personal Guest Notice (if viewed via personal link) */}
          {guest && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200 text-stone-900 text-center space-y-1 shadow-xs">
              <span className="text-[10px] uppercase tracking-widest text-amber-800 font-bold">
                პერსონალური მოწვევა
              </span>
              <h3 className="text-base font-serif-ka font-semibold">
                ძვირფასო {guest.firstName} {guest.lastName},
              </h3>
              {guest.personalNote && (
                <p className="text-xs text-stone-600 leading-relaxed italic">
                  „{guest.personalNote}“
                </p>
              )}
            </div>
          )}

          {/* Hero Welcome Message */}
          {invitation.heroMessage && (
            <p className="text-sm sm:text-base font-serif-ka italic text-stone-700 max-w-md mx-auto leading-relaxed px-4">
              „{invitation.heroMessage}“
            </p>
          )}

          {/* COUNTDOWN TIMER */}
          {invitation.countdownEnabled && (
            <div className="pt-4">
              <CountdownTimer
                targetDate={invitation.eventDate}
                targetTime={invitation.eventTime}
                customMessage={invitation.countdownMessage || 'ღონისძიების დაწყებამდე დარჩა:'}
                theme={isDarkTheme ? 'dark' : 'light'}
              />
            </div>
          )}
        </section>

        {/* STORY SECTION */}
        {invitation.storyContent && (
          <section className="text-center space-y-3 py-6 px-4 border-y border-stone-200/80">
            <span className="text-[11px] uppercase tracking-widest text-amber-800 font-semibold">
              {invitation.storyTitle || 'ჩვენი ისტორია'}
            </span>
            <h2 className="text-2xl font-serif-ka font-semibold text-stone-900">
              როგორ დაიწყო ყველაფერი
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-md mx-auto whitespace-pre-line">
              {invitation.storyContent}
            </p>
          </section>
        )}

        {/* LOCATION & VENUE */}
        <section className="space-y-4 text-center">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-widest text-amber-800 font-semibold">
              ადგილმდებარეობა
            </span>
            <h2 className="text-2xl font-serif-ka font-semibold text-stone-900">
              სად გელოდებით?
            </h2>
          </div>

          <div className={`p-6 rounded-2xl ${cardBg} shadow-xs text-left space-y-4`}>
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-amber-50 rounded-xl text-amber-800 shrink-0 border border-amber-100">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-stone-900">
                  {invitation.venueName}
                </h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  {invitation.venueAddress}, {invitation.venueCity}
                </p>
                {invitation.locationNotes && (
                  <p className="text-xs text-stone-500 mt-2 italic leading-relaxed">
                    {invitation.locationNotes}
                  </p>
                )}
              </div>
            </div>

            {invitation.googleMapsUrl && (
              <a
                href={invitation.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-medium transition-colors shadow-xs"
              >
                <Navigation className="w-4 h-4 text-amber-400" />
                <span>როგორ მივიდე? (Google Maps)</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1 text-stone-400" />
              </a>
            )}
          </div>
        </section>

        {/* TIMELINE SECTION */}
        {invitation.timeline && invitation.timeline.length > 0 && (
          <section className="space-y-6 text-center">
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-widest text-amber-800 font-semibold">
                განრიგი
              </span>
              <h2 className="text-2xl font-serif-ka font-semibold text-stone-900">
                დღის პროგრამა
              </h2>
            </div>
            <TimelineView items={invitation.timeline} theme={isDarkTheme ? 'dark' : 'light'} />
          </section>
        )}

        {/* DRESS CODE SECTION */}
        {invitation.dressCode && (
          <section className="space-y-4 text-center">
            <DressCodeCard dressCode={invitation.dressCode} />
          </section>
        )}

        {/* PHOTO GALLERY */}
        {invitation.gallery && invitation.gallery.length > 0 && (
          <section className="space-y-6 text-center">
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-widest text-amber-800 font-semibold">
                გალერეა
              </span>
              <h2 className="text-2xl font-serif-ka font-semibold text-stone-900">
                ფოტოალბომი
              </h2>
            </div>
            <GalleryGrid items={invitation.gallery} />
          </section>
        )}

        {/* RSVP SECTION */}
        {invitation.rsvpSettings?.enabled && (
          <section className="space-y-6 text-center pt-4">
            <RSVPForm
              invitationId={invitation.id}
              settings={invitation.rsvpSettings}
              guestInitial={guest}
            />
          </section>
        )}

        {/* GUESTBOOK / WISHES (Premium) */}
        {invitation.packageType === 'premium' && invitation.premiumFeatures?.guestbookEnabled && (
          <section className="space-y-6 text-center pt-4">
            <WishesGuestbook invitationId={invitation.id} />
          </section>
        )}

        {/* FAQ ACCORDION */}
        {invitation.faqs && invitation.faqs.length > 0 && (
          <section className="space-y-6 text-center pt-4">
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-widest text-amber-800 font-semibold">
                კითხვები & პასუხები
              </span>
              <h2 className="text-2xl font-serif-ka font-semibold text-stone-900">
                ხშირად დასმული კითხვები
              </h2>
            </div>
            <FAQAccordion faqs={invitation.faqs} />
          </section>
        )}

        {/* SHARE BAR */}
        <section className="p-6 rounded-2xl bg-stone-100 border border-stone-200/80 text-center space-y-4">
          <h3 className="text-sm font-semibold text-stone-800">
            გაუზიარე მოსაწვევი მეგობრებსა და ოჯახს
          </h3>
          <div className="flex items-center justify-center gap-3">
            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsQRModalOpen(true)}
              icon={<QrCode className="w-4 h-4" />}
            >
              QR კოდი & გაზიარება
            </Button>
          </div>
        </section>

        {/* BRAND FOOTER */}
        <footer className="pt-10 text-center space-y-3 text-stone-400">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs uppercase tracking-widest font-display text-stone-500">
              DENI
            </span>
            <span>·</span>
            <span className="text-xs font-serif-ka text-stone-500">
              ონლაინ მოსაწვევები
            </span>
          </div>
          <p className="text-[11px] text-stone-400">
            „უბრალოდ ბმული არ არის.“
          </p>
        </footer>
      </div>

      {/* Share / QR Modal */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        url={currentUrl}
        title={invitation.title}
      />
    </div>
  );
};
