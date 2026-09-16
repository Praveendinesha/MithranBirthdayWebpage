import React, { useState } from 'react';
import { invitationData } from './config/invitationData';
import { HeroEntrance } from './components/HeroEntrance';
import { FloatingDecorations } from './components/FloatingDecorations';
import { FloatingMusicPlayer } from './components/FloatingMusicPlayer';
import { HeroSection } from './components/HeroSection';
import { CountdownTimer } from './components/CountdownTimer';
import { PhotoGalleryCarousel } from './components/PhotoGalleryCarousel';
import { BossBioCard } from './components/BossBioCard';
import { MilestoneTimeline } from './components/MilestoneTimeline';
import { PartySchedule } from './components/PartySchedule';
import { EventLogistics } from './components/EventLogistics';
import { GuestbookWall } from './components/GuestbookWall';
import { Footer } from './components/Footer';
import { ShareModal } from './components/ShareModal';
import { PartyCelebrationModal } from './components/PartyCelebrationModal';

export const App: React.FC = () => {
  const [isUnwrapped, setIsUnwrapped] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [celebrationPopupTrigger, setCelebrationPopupTrigger] = useState<number>(0);

  const whatsappUrl = `https://wa.me/${invitationData.event.rsvp.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    invitationData.event.rsvp.defaultMessage
  )}`;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#F2F8FC] via-[#FFFDF9] to-[#FBF4EC] text-pastel-navy-800 flex justify-center selection:bg-pastel-gold-200">
      {/* Background Floating Ambient Particles */}
      <FloatingDecorations />

      {/* Hero Entrance: Gift Unwrap Overlay */}
      {!isUnwrapped && (
        <HeroEntrance
          babyName={invitationData.baby.fullName}
          onUnwrap={() => setIsUnwrapped(true)}
        />
      )}

      {/* Main Invitation Container (Spacious, Classic & Mobile-First Frame) */}
      <main className="relative z-10 w-full max-w-md min-h-screen flex flex-col bg-white/60 backdrop-blur-xs shadow-2xl border-x border-pastel-blue-100/70 pb-12 space-y-2">
        {/* Floating Music Controls */}
        <FloatingMusicPlayer autoStart={isUnwrapped} />

        {/* Section 1: Hero & Crown Reveal (Large Prominent Name & Full Date/Time) */}
        <HeroSection
          baby={invitationData.baby}
          event={{
            dateFormatted: invitationData.event.dateFormatted,
            timeFormatted: invitationData.event.timeFormatted,
            venueName: invitationData.event.venueName,
            hall: invitationData.event.hall,
          }}
          onShareClick={() => setIsShareModalOpen(true)}
        />

        {/* Section 2: Live Countdown Timer */}
        <CountdownTimer
          targetDate={invitationData.event.targetDate}
        />

        {/* Section 3: Baby & Family Moments Photo Carousel */}
        <PhotoGalleryCarousel
          photos={invitationData.gallery}
          babyName={invitationData.baby.fullName}
        />

        {/* Section 4: Baby Boss Resume & Fun Stats */}
        <BossBioCard bossResume={invitationData.bossResume} />

        {/* Section 5: 12 Months in 12 Seconds Timeline */}
        <MilestoneTimeline milestones={invitationData.milestones} />

        {/* Section 6: Celebration Itinerary Highlights */}
        <PartySchedule />

        {/* Section 7: Event Logistics & Action Hub (Maps, Calendar, RSVP) */}
        <EventLogistics event={invitationData.event} />

        {/* Section 8: Blessings & Virtual Guestbook Wall */}
        <GuestbookWall initialBlessings={invitationData.initialBlessings} />

        {/* Section 9: Footer & Family Love Note */}
        <Footer
          parents={invitationData.baby.parents}
          babyName={invitationData.baby.fullName}
          onReplayUnwrap={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setIsUnwrapped(false);
          }}
        />

        {/* 7:00 PM Celebration Test Preview Button */}
        <div className="flex justify-center pb-4">
          <button
            onClick={() => setCelebrationPopupTrigger((prev) => prev + 1)}
            className="text-[11px] font-bold text-pastel-gold-700 hover:text-pastel-gold-900 bg-pastel-gold-100/90 hover:bg-pastel-gold-200 px-4 py-1.5 rounded-full border border-pastel-gold-300 transition-all shadow-2xs flex items-center gap-1.5"
          >
            <span>🎉 Preview 7:00 PM Celebration Pop-up</span>
          </button>
        </div>
      </main>

      {/* Share Invitation Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        babyName={invitationData.baby.fullName}
      />

      {/* Sharply at 7:00 PM Oct 4 Celebration Pop-up */}
      <PartyCelebrationModal
        targetDate={invitationData.event.targetDate}
        babyName={invitationData.baby.fullName}
        parents={invitationData.baby.parents}
        venueName={invitationData.event.venueName}
        whatsappUrl={whatsappUrl}
        forceOpenTrigger={celebrationPopupTrigger}
      />
    </div>
  );
};

export default App;
