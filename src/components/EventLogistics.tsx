import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Navigation, CalendarPlus, MessageSquare, Shirt, Check, ExternalLink, Download, Sparkles } from 'lucide-react';
import { createGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';
import { soundManager } from '../utils/audio';

interface EventLogisticsProps {
  event: {
    title: string;
    dateFormatted: string;
    timeFormatted: string;
    venueName: string;
    hall: string;
    address: string;
    landmark: string;
    dressCode: string;
    googleMapsUrl: string;
    targetDate: Date;
    calendarDetails: {
      title: string;
      description: string;
      location: string;
    };
    rsvp: {
      phone: string;
      whatsappNumber: string;
      deadline: string;
      defaultMessage: string;
    };
  };
}

export const EventLogistics: React.FC<EventLogisticsProps> = ({ event }) => {
  const [showCalendarModal, setShowCalendarModal] = useState<boolean>(false);
  const [copiedAddress, setCopiedAddress] = useState<boolean>(false);

  const startDate = new Date(event.targetDate);
  const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000);

  const calendarParams = {
    title: event.calendarDetails.title,
    description: event.calendarDetails.description,
    location: `${event.venueName}, ${event.address}`,
    startDate,
    endDate,
  };

  const handleGoogleCalendar = () => {
    soundManager.playPop();
    const url = createGoogleCalendarUrl(calendarParams);
    window.open(url, '_blank');
    setShowCalendarModal(false);
  };

  const handleDownloadIcs = () => {
    soundManager.playPop();
    downloadIcsFile(calendarParams);
    setShowCalendarModal(false);
  };

  const handleCopyAddress = () => {
    soundManager.playPop();
    navigator.clipboard.writeText(`${event.venueName}, ${event.address}`);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  const whatsappUrl = `https://wa.me/${event.rsvp.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    event.rsvp.defaultMessage
  )}`;

  return (
    <section className="px-5 sm:px-6 py-6 max-w-md mx-auto w-full">
      <div className="relative rounded-3xl p-6 sm:p-7 glass-card shadow-soft-card border border-pastel-blue-100 overflow-hidden">
        {/* Top Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-pastel-gold-100 border border-pastel-gold-300 text-pastel-gold-700 text-xs font-bold uppercase tracking-widest mb-2 shadow-2xs">
            <MapPin className="w-3.5 h-3.5" />
            <span>Celebration Logistics</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h2 className="font-display font-extrabold text-xl text-pastel-navy-900">
            Event Logistics 📍
          </h2>
          <div className="w-16 h-0.5 hairline-gold mx-auto mt-2.5" />
        </div>

        {/* Date & Time Detail */}
        <div className="space-y-3 mb-5">
          <div className="p-4 rounded-2xl bg-white border border-pastel-blue-100 shadow-xs flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-pastel-blue-100 text-pastel-blue-600 shrink-0 mt-0.5">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                When
              </span>
              <h4 className="font-display font-bold text-sm text-pastel-navy-900">
                {event.dateFormatted}
              </h4>
              <p className="text-xs text-pastel-blue-600 font-semibold flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{event.timeFormatted}</span>
              </p>
            </div>
          </div>

          {/* Venue Detail */}
          <div className="p-4 rounded-2xl bg-white border border-pastel-gold-200 shadow-xs flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-pastel-gold-100 text-pastel-gold-600 shrink-0 mt-0.5">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                Where
              </span>
              <h4 className="font-display font-bold text-sm text-pastel-navy-900">
                {event.venueName}
              </h4>
              <p className="text-xs font-medium text-pastel-gold-700">
                {event.hall}
              </p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {event.address}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5 font-serif italic">
                📍 Landmark: {event.landmark}
              </p>

              {/* Copy Address Button */}
              <button
                onClick={handleCopyAddress}
                className="mt-2 text-[11px] font-bold text-pastel-blue-600 hover:text-pastel-blue-700 flex items-center gap-1 transition-colors"
              >
                {copiedAddress ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600">Address copied!</span>
                  </>
                ) : (
                  <span>📋 Copy Full Address</span>
                )}
              </button>
            </div>
          </div>

          {/* Dress Code */}
          <div className="p-3.5 rounded-2xl bg-pastel-cream-100/70 border border-pastel-cream-300 shadow-xs flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white text-pastel-gold-600 shrink-0 shadow-xs">
              <Shirt className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-pastel-gold-700 tracking-wider block">
                Suggested Dress Code
              </span>
              <p className="text-xs font-semibold text-pastel-navy-900">
                {event.dressCode}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          {/* Action 1: Navigate to Venue */}
          <a
            href={event.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playPop()}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-pastel-blue-500 to-pastel-blue-600 text-white font-display font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Navigation className="w-4 h-4 text-white" />
            <span>Navigate via Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>

          {/* Action 2: Add to Calendar */}
          <button
            onClick={() => {
              soundManager.playPop();
              setShowCalendarModal(true);
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-white border-2 border-pastel-gold-300 text-pastel-navy-900 font-display font-bold text-sm shadow-xs hover:bg-pastel-gold-50 transition-all flex items-center justify-center gap-2"
          >
            <CalendarPlus className="w-4 h-4 text-pastel-gold-600" />
            <span>Add to Calendar</span>
          </button>

          {/* Action 3: Confirm RSVP via WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playPop()}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-display font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
          >
            <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Confirm RSVP via WhatsApp</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
          </a>
        </div>

        {/* RSVP Note */}
        <p className="text-[11px] text-gray-400 text-center mt-3 font-medium">
          Kindly RSVP by <span className="font-bold text-pastel-navy-800">{event.rsvp.deadline}</span> to assist with catering.
        </p>
      </div>

      {/* Calendar Modal */}
      <AnimatePresence>
        {showCalendarModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-pastel-gold-200 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-pastel-gold-100 text-pastel-gold-600 mx-auto flex items-center justify-center mb-3">
                <CalendarPlus className="w-6 h-6" />
              </div>

              <h3 className="font-display font-bold text-lg text-pastel-navy-900 mb-1">
                Save the Date
              </h3>
              <p className="text-xs text-gray-500 mb-5">
                Choose your preferred calendar application:
              </p>

              <div className="space-y-2.5">
                <button
                  onClick={handleGoogleCalendar}
                  className="w-full py-2.5 px-4 rounded-xl bg-pastel-blue-50 hover:bg-pastel-blue-100 border border-pastel-blue-200 text-pastel-navy-900 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-pastel-blue-600" />
                  <span>Google Calendar</span>
                </button>

                <button
                  onClick={handleDownloadIcs}
                  className="w-full py-2.5 px-4 rounded-xl bg-pastel-gold-50 hover:bg-pastel-gold-100 border border-pastel-gold-200 text-pastel-navy-900 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4 text-pastel-gold-600" />
                  <span>Apple / Outlook Calendar (.ics)</span>
                </button>
              </div>

              <button
                onClick={() => setShowCalendarModal(false)}
                className="mt-4 text-xs text-gray-400 hover:text-gray-600 font-semibold py-1"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
