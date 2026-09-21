import React, { useState, useEffect } from 'react';
import {
  loadInvitationData,
  type EditableInvitationData,
} from './utils/photoStorage';
import { HeroEntrance } from './components/HeroEntrance';
import { FloatingDecorations } from './components/FloatingDecorations';
import { FloatingMusicPlayer } from './components/FloatingMusicPlayer';
import { HeroSection } from './components/HeroSection';
import { CountdownTimer } from './components/CountdownTimer';
import { PhotoGalleryCarousel } from './components/PhotoGalleryCarousel';
import { MemoryLaneMilestones } from './components/MemoryLaneMilestones';
import { EventLogistics } from './components/EventLogistics';
import { GuestbookWall } from './components/GuestbookWall';
import { Footer } from './components/Footer';
import { ShareModal } from './components/ShareModal';
import { PartyCelebrationModal } from './components/PartyCelebrationModal';
import { BirthdayTrainAnimation } from './components/BirthdayTrainAnimation';
import { SkyGliderAnimation } from './components/SkyGliderAnimation';
import { InteractiveFloatingBalloons } from './components/InteractiveFloatingBalloons';
import { StardustTrail } from './components/StardustTrail';
import { AdminPhotoManagerModal, type AdminTab } from './components/AdminPhotoManagerModal';

export const App: React.FC = () => {
  const [data, setData] = useState<EditableInvitationData>(loadInvitationData());
  const [isUnwrapped, setIsUnwrapped] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [adminTab, setAdminTab] = useState<AdminTab>('baby');
  const [celebrationPopupTrigger, setCelebrationPopupTrigger] = useState<number>(0);

  // Always land at the very top of the webpage on load/refresh
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // Auto open admin if url contains ?admin=true or #admin
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('admin') === 'true' || window.location.hash === '#admin') {
      const tabParam = searchParams.get('tab') as AdminTab | null;
      if (tabParam) setAdminTab(tabParam);
      setIsAdminModalOpen(true);
    }

    const handleDataUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<EditableInvitationData>;
      if (customEvent.detail) {
        setData(customEvent.detail);
      }
    };

    window.addEventListener('invitation_data_updated', handleDataUpdate);
    return () => window.removeEventListener('invitation_data_updated', handleDataUpdate);
  }, []);

  const handleUnwrap = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setIsUnwrapped(true);
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 40);
  };

  const whatsappUrl = `https://wa.me/${data.event.rsvp.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    data.event.rsvp.defaultMessage
  )}`;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#F2F8FC] via-[#FFFDF9] to-[#FBF4EC] text-pastel-navy-800 flex justify-center selection:bg-pastel-gold-200 overflow-x-hidden">
      {/* Interactive Sparkling Stardust Trail on Touch/Cursor */}
      <StardustTrail />

      {/* Interactive Floating Balloons (Tap to pop!) */}
      <InteractiveFloatingBalloons />

      {/* Background Floating Ambient Particles */}
      <FloatingDecorations />

      {/* Hero Entrance: Gift Unwrap Overlay */}
      {!isUnwrapped && (
        <HeroEntrance
          babyName={data.baby.fullName}
          onUnwrap={handleUnwrap}
        />
      )}

      {/* Main Invitation Container (Spacious, Minimal & Classic Mobile-First Frame) */}
      <main className="relative z-10 w-full max-w-lg min-h-screen flex flex-col bg-white/70 backdrop-blur-xs shadow-2xl border-x border-pastel-blue-100/70 pb-12 space-y-4">
        {/* Floating Music Controls */}
        <FloatingMusicPlayer autoStart={isUnwrapped} />

        {/* Sky Glider Airplane with Trailing Birthday Banner */}
        <SkyGliderAnimation />

        {/* Section 1: Hero Section (Prominent Royal Name, Photo, Quote, Date/Venue) */}
        <HeroSection
          baby={data.baby}
          event={{
            dateFormatted: data.event.dateFormatted,
            timeFormatted: data.event.timeFormatted,
            venueName: data.event.venueName,
            hall: data.event.hall,
          }}
          onShareClick={() => setIsShareModalOpen(true)}
          onOpenAdmin={(tab) => {
            setAdminTab(tab || 'baby');
            setIsAdminModalOpen(true);
          }}
        />

        {/* Interactive Mithran Royal Express Birthday Train */}
        <BirthdayTrainAnimation />

        {/* Section 2: Live Countdown Timer to Oct 4, 7:00 PM */}
        <CountdownTimer
          targetDate={data.event.targetDate}
          onOpenCelebrationModal={() => setCelebrationPopupTrigger((prev) => prev + 1)}
        />

        {/* Section 3: Baby & Family Moments Photo Carousel */}
        <PhotoGalleryCarousel
          photos={data.gallery}
        />

        {/* Section 4: Memory Lane (12 Months in 12 Seconds Milestones) */}
        <MemoryLaneMilestones
          milestones={data.milestones}
        />

        {/* Section 5: Event Logistics & Action Suite (Maps, Calendar, RSVP) */}
        <EventLogistics event={data.event} />

        {/* Section 6: Blessings & Virtual Guestbook Wall */}
        <GuestbookWall initialBlessings={data.initialBlessings} />

        {/* Section 7: Footer & Family Love Note */}
        <Footer
          parents={data.baby.parents}
          babyName={data.baby.fullName}
          onReplayUnwrap={() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            setIsUnwrapped(false);
          }}
          onOpenAdmin={() => {
            setAdminTab('baby');
            setIsAdminModalOpen(true);
          }}
          onOpenCelebrationModal={() => setCelebrationPopupTrigger((prev) => prev + 1)}
        />
      </main>

      {/* Share Invitation Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        babyName={data.baby.fullName}
      />

      {/* Sharply at 7:00 PM Oct 4 Celebration Pop-up */}
      <PartyCelebrationModal
        targetDate={data.event.targetDate}
        babyName={data.baby.fullName}
        parents={data.baby.parents}
        venueName={data.event.venueName}
        whatsappUrl={whatsappUrl}
        forceOpenTrigger={celebrationPopupTrigger}
      />

      {/* Client Admin Photo & Milestone Manager Modal */}
      <AdminPhotoManagerModal
        isOpen={isAdminModalOpen}
        initialTab={adminTab}
        onClose={() => setIsAdminModalOpen(false)}
        onDataUpdated={(updated) => setData(updated)}
      />
    </div>
  );
};

export default App;
