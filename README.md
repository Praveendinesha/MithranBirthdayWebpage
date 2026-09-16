# 👑 Prince Liam's 1st Royal Birthday Celebration — Web Invitation

A mobile-first, vertical 1st birthday invitation web application built with **React**, **TypeScript**, **Tailwind CSS**, **Lucide Icons**, **Framer Motion**, and **Canvas Confetti**.

---

## ✨ Key Features

1. 🎁 **Hero Entrance / 3D Gift Box Reveal**:
   - Pulsing 3D gift box with ribbon and *"Tap to unwrap!"* CTA.
   - Triggers multi-angle canvas confetti explosion and audio fanfare upon reveal.
   - Floating background ambient music toggle with native Web Audio API music box melody.

2. ⏱️ **Live Countdown Timer & Party State**:
   - 4 rounded pastel cards displaying **Days**, **Hours**, **Minutes**, and **Seconds** in real-time.
   - Automatically transitions to a celebratory *"🎉 IT'S PARTY TIME! 🎂"* state with automatic side-cannon confetti when the party arrives (includes a live test toggle button).

3. 💼 **Baby "Boss" Bio & Resume**:
   - *"CEO of High Chair Drama & Naptime Negotiations"*.
   - Animated KPI bars for Toothless Smile (100%), Remote Stealing (Level 99), Crawling Speed (Mach 1), and Spoon Throwing Accuracy.
   - Tab toggle between Performance KPIs, Superpowers, and Core Vocabulary.

4. 🚀 **"12 Months in 12 Seconds" Interactive Timeline**:
   - Month-by-month milestone carousel (Month 1 to 12) with photos, captions, and badges.
   - **"12s Auto Tour"** button that automatically advances one month every second.
   - Interactive month scrubber pills and photo like button with heart bursts.

5. 🏆 **"The Family Debate" Micro-Poll**:
   - Live voting: *"Mom's Radiant Smile vs Dad's Cheeky Mischief"*.
   - Animated live percentage bars, heart explosions, and feedback toast.
   - Persists votes in `localStorage`.

6. 🎪 **Party Schedule & Event Itinerary**:
   - Highlights: Red Carpet Arrival, Magic Show & Fun Zone, Royal Cake Smash, and Feast.

7. 📍 **Event Logistics & Action Hub**:
   - Venue, hall, date, time, and dress code cards with one-click address copy.
   - **Navigate to Venue**: Direct Google Maps routing.
   - **Add to Calendar**: Generates Google Calendar link and downloadable Apple/Outlook `.ics` file.
   - **Confirm RSVP via WhatsApp**: 1-click pre-filled WhatsApp message.

8. 💌 **Interactive Blessings & Guestbook Wall**:
   - Guest submission form with name, optional relationship, message, and emoji sticker selector.
   - Dynamic sticky cards with like counters and `localStorage` persistence.

---

## 🎨 Easy Customization Guide

All event details, baby name, photos, party datetime, coordinates, and RSVP phone number are centralized in:
📂 **`src/config/invitationData.ts`**

Simply edit this file to update:
- `baby.fullName`, `baby.photoUrl`, `baby.parents`
- `event.dateFormatted`, `event.timeFormatted`, `event.venueName`, `event.address`
- `event.rsvp.whatsappNumber` and `event.rsvp.phone`
- `milestones` photos and captions
- `poll` questions and options

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Build for production
npm run build
```

---

## 📱 Mobile-First Design

Optimized specifically for WhatsApp and mobile browser link sharing, while maintaining an elegant framed presentation on desktop screens.
