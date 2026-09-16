export interface MilestoneMonth {
  month: number;
  title: string;
  subtitle: string;
  description: string;
  stats: { label: string; value: string };
  badge: string;
  image: string;
  themeColor: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  caption: string;
  category: string;
  imageUrl: string;
}

export interface GuestBlessing {
  id: string;
  name: string;
  relationship: string;
  message: string;
  timestamp: string;
  avatarEmoji: string;
  likes: number;
  color: string;
}

/**
 * EXACT TARGET PARTY DATE & TIME:
 * Sunday, October 4, 2026 at 7:00:00 PM
 * Note: JavaScript Date month index for October is 9 (0-indexed: 0=Jan ... 9=Oct).
 */
export const TARGET_PARTY_DATE = new Date(2026, 9, 4, 19, 0, 0);

export const invitationData = {
  baby: {
    fullName: "Shri Magizh Mithran",
    shortName: "Magizh Mithran",
    nicknames: ["Magizh", "Little Mithran", "Boss Baby", "Heartbreaker 💔"],
    age: 1,
    birthDate: "October 04, 2025",
    headline: "Our Little Prince Turns One! 👑",
    subheadline: "The girls are already in queue! 💃 Join us to celebrate his ONE-derful birthday before he gets busy with his GFs! 🍼😉",
    taglineBadge: "🔥 The Girls Are Already In Queue!",
    parents: "Saravanan & Soundharya",
    familyNote: "With immense love and joy in our hearts, we invite you to bless our little prince as he steps into his ONE-derful first year!",
    // Real Baby Photo for Shri Magizh Mithran
    photoUrl: "/images/Mithran.jpeg",
    themeEmoji: "👑",
  },
  event: {
    title: "Shri Magizh Mithran's 1st Royal Birthday Celebration",
    dateFormatted: "Sunday, 04 | 10 | 2026",
    timeFormatted: "7:00 PM onwards",
    isoDateTime: "2026-10-04T19:00:00",
    targetDate: TARGET_PARTY_DATE,
    venueName: "DD Palace",
    hall: "Grand Celebration Hall",
    address: "No 74A, Erukanchery High Road, Chennai, Tamil Nadu 600039",
    landmark: "Near Ambedkar Arts College Signal",
    dressCode: "Pastel Elegance & Festive (Powder Blue, Cream, Gold or Traditional)",
    googleMapsUrl: "https://maps.google.com/?q=DD+Palace+No+74A+Erukanchery+high+road+Chennai+Tamil+Nadu+600039",
    calendarDetails: {
      title: "👑 Shri Magizh Mithran's 1st Birthday Celebration!",
      description: "Celebrating Shri Magizh Mithran's ONE-derful 1st Birthday with Saravanan & Soundharya! Cake cutting, fun games & grand feast. Venue: DD Palace, Erukanchery High Road, Chennai.",
      location: "DD Palace, No 74A, Erukanchery High Road, Near Ambedkar Arts College Signal, Chennai, Tamil Nadu 600039",
    },
    rsvp: {
      phone: "+919876543210",
      whatsappNumber: "919876543210",
      deadline: "October 1, 2026",
      defaultMessage: "Hi Saravanan & Soundharya! 👋 We received the invitation for Shri Magizh Mithran's 1st Birthday at DD Palace on Oct 4! Count us in! 🎉👶✨ (Guests attending: [Number])",
    }
  },
  gallery: [
    {
      id: "g1",
      title: "Prince Shri Magizh Mithran 👑",
      caption: "Spreading million-dollar smiles and royal charm every single day.",
      category: "Baby Prince",
      imageUrl: "/carousel/WhatsApp Image 2026-09-16 at 4.37.01 PM.jpeg",
    },
    {
      id: "g2",
      title: "Sweet Cuddle Moments ❤️",
      caption: "Wrapped in Amma Soundharya's unconditional warmth and love.",
      category: "Mom & Mithran",
      imageUrl: "/carousel/WhatsApp Image 2026-09-16 at 4.37.01 PM (1).jpeg",
    },
    {
      id: "g3",
      title: "Appa's Little Champion 😎",
      caption: "Partner in crime with Appa Saravanan, mastering boss moves.",
      category: "Dad & Mithran",
      imageUrl: "/carousel/WhatsApp Image 2026-09-16 at 4.37.01 PM (2).jpeg",
    },
    {
      id: "g4",
      title: "Playful Little Prince 🎈",
      caption: "Fun, smiles, and baby acrobatics in full swing!",
      category: "Pure Joy",
      imageUrl: "/carousel/WhatsApp Image 2026-09-16 at 4.37.02 PM.jpeg",
    },
    {
      id: "g5",
      title: "Curious Little Explorer 🧸",
      caption: "Investigating the world one cute crawl at a time.",
      category: "Playtime",
      imageUrl: "/carousel/WhatsApp Image 2026-09-16 at 4.37.02 PM (1).jpeg",
    },
    {
      id: "g6",
      title: "Angel in Peaceful Slumber ☁️",
      caption: "Recharging superpowers for the next 5:00 AM baby alarm.",
      category: "Dreamland",
      imageUrl: "/carousel/WhatsApp Image 2026-09-16 at 4.37.02 PM (2).jpeg",
    },
    {
      id: "g7",
      title: "The Royal Look 🌟",
      caption: "Looking sharp, handsome, and ready to charm the entire hall!",
      category: "Royal Look",
      imageUrl: "/carousel/WhatsApp Image 2026-09-16 at 4.37.02 PM (3).jpeg",
    },
    {
      id: "g8",
      title: "Cutest Giggles & Wonder ✨",
      caption: "Bright eyes, curious heart, and endless giggles.",
      category: "Wonder",
      imageUrl: "/carousel/WhatsApp Image 2026-09-16 at 4.37.03 PM.jpeg",
    },
    {
      id: "g9",
      title: "Happy Family Love 👨‍👩‍👦",
      caption: "Surrounded by endless blessings from Amma and Appa.",
      category: "Family Love",
      imageUrl: "/carousel/WhatsApp Image 2026-09-16 at 4.37.03 PM (1).jpeg",
    },
    {
      id: "g10",
      title: "Celebrating 1 ONE-derful Year! 🎂",
      caption: "Ready to cut his grand birthday cake and celebrate with all of you!",
      category: "1st Milestone",
      imageUrl: "/carousel/WhatsApp Image 2026-09-16 at 4.37.04 PM.jpeg",
    },
  ],
  bossResume: {
    title: "CEO of High Chair Drama & Chief Girl Charmer 😉",
    department: "Executive Committee of the Saravanan-Soundharya Household",
    experience: "1.0 Year (Promoted directly to Chief Boss)",
    favoriteSnack: "Sweet Rice Puffs, Apple Puree & Giggles",
    keyStats: [
      { label: "Toothless / Cutest Smile", value: 100, display: "100% (Melted All Hearts)", color: "from-amber-400 to-amber-500", icon: "Smile" },
      { label: "Queue of Girl Admirers", value: 99, display: "Queue Extending Outside", color: "from-rose-400 to-pink-500", icon: "Target" },
      { label: "Remote & Phone Snatching", value: 98, display: "Master Ninja Level", color: "from-blue-400 to-cyan-500", icon: "Tv" },
      { label: "Crawling Velocity", value: 96, display: "Mach 1 (Towards wires)", color: "from-emerald-400 to-teal-500", icon: "Zap" },
      { label: "Baby Babble Fluency", value: 100, display: "Fluent in Amma, Appa & Ta-Ta", color: "from-purple-400 to-indigo-500", icon: "MessageCircle" },
    ],
    superpowers: [
      { title: "The Queue of Admirers 💃", description: "The girls are already standing in queue! Just one wink turns every auntie and friend into a lifelong fan.", icon: "✨" },
      { title: "Thatha & Paati Mind Control 👵👴", description: "A single dimpled look makes grandparents instantly surrender snacks, extra cuddles, and all the toys.", icon: "👑" },
      { title: "Lightning Fast Escape 🚀", description: "Able to crawl across the room at supersonic speed the exact second diaper change is announced.", icon: "💨" },
    ],
    favoriteWords: ["Appa!", "Amma!", "Ta-Ta!", "Nom-Nom", "Uh-Oh!"],
  },
  milestones: [
    {
      month: 1,
      title: "Welcome Magizh Mithran!",
      subtitle: "Fresh Arrival of our Little Prince",
      description: "Entered the world bringing infinite sunshine to Amma and Appa. Mastered the art of sleeping 19 hours and glowing with angelic cuteness.",
      stats: { label: "Milestone", value: "Pure Perfection" },
      badge: "🐣 The Royal Arrival",
      image: "/carousel/WhatsApp Image 2026-09-16 at 4.37.01 PM.jpeg",
      themeColor: "bg-blue-50 border-blue-200 text-blue-700",
    },
    {
      month: 2,
      title: "First Million-Dollar Smiles",
      subtitle: "Heart Melting Era Begins",
      description: "Gave Amma Soundharya and Appa Saravanan the first conscious, ear-to-ear grin. Discovered the magical rotating ceiling fans.",
      stats: { label: "Favorite View", value: "Ceiling Fan Lights" },
      badge: "😊 Big Giggles",
      image: "/carousel/WhatsApp Image 2026-09-16 at 4.37.01 PM (1).jpeg",
      themeColor: "bg-amber-50 border-amber-200 text-amber-700",
    },
    {
      month: 3,
      title: "Tummy Time Champion",
      subtitle: "Lifting Heads & Ruling Beds",
      description: "Held his head up high like a prince inspecting his court! Discovered his tiny fingers and decided they are the tastiest snack.",
      stats: { label: "Skill", value: "90° Head Lift" },
      badge: "💪 Little Champ",
      image: "/carousel/WhatsApp Image 2026-09-16 at 4.37.01 PM (2).jpeg",
      themeColor: "bg-emerald-50 border-emerald-200 text-emerald-700",
    },
    {
      month: 4,
      title: "The Great Roll-Over",
      subtitle: "No Mat Can Keep Him Still",
      description: "Rolled over back-to-belly effortlessly! Giggled uncontrollably whenever Appa played peek-a-boo.",
      stats: { label: "Move", value: "360° Mat Spin" },
      badge: "🔄 Rolling Ninja",
      image: "/carousel/WhatsApp Image 2026-09-16 at 4.37.02 PM.jpeg",
      themeColor: "bg-rose-50 border-rose-200 text-rose-700",
    },
    {
      month: 5,
      title: "Grasping Everything",
      subtitle: "If It's Shiny, It's Mithran's",
      description: "Unlocked lightning-fast pincer grasp. Phones, spectacles, and shiny bangles are all target objects for Magizh!",
      stats: { label: "Target", value: "Appa's Phone" },
      badge: "✋ Grab Master",
      image: "/carousel/WhatsApp Image 2026-09-16 at 4.37.02 PM (1).jpeg",
      themeColor: "bg-cyan-50 border-cyan-200 text-cyan-700",
    },
    {
      month: 6,
      title: "Halfway There & Yummy Solids",
      subtitle: "6 Months Milestone & Food Fun",
      description: "Tasted yummy mashed fruit purees and porridge. 20% eaten, 80% artistically applied to cheeks and bib.",
      stats: { label: "Favorite Food", value: "Sweet Apple Mash" },
      badge: "🥑 Foodie Prince",
      image: "/carousel/WhatsApp Image 2026-09-16 at 4.37.02 PM (2).jpeg",
      themeColor: "bg-purple-50 border-purple-200 text-purple-700",
    },
    {
      month: 7,
      title: "Sitting Like a Prince",
      subtitle: "Royal Posture Achieved",
      description: "Can sit independently with poise and majesty! Bounced cheerfully to rhythmic songs and musical rhymes.",
      stats: { label: "Posture", value: "Royal Throne Pose" },
      badge: "👑 Sitting King",
      image: "/carousel/WhatsApp Image 2026-09-16 at 4.37.02 PM (3).jpeg",
      themeColor: "bg-amber-50 border-amber-200 text-amber-700",
    },
    {
      month: 8,
      title: "First Pearl Tooth",
      subtitle: "Watch Out for the Chompers!",
      description: "Tiny pearl tooth emerged! Started commando army crawling across the living room with supreme agility.",
      stats: { label: "Teeth", value: "1 Pearl Tooth" },
      badge: "🦷 Tooth Alert",
      image: "/carousel/WhatsApp Image 2026-09-16 at 4.37.03 PM.jpeg",
      themeColor: "bg-blue-50 border-blue-200 text-blue-700",
    },
    {
      month: 9,
      title: "Pulling to Stand",
      subtitle: "Elevation Unlocked!",
      description: "Pulls up to stand using sofa and chairs. Uttered his first clear 'Amma' and 'Appa' to cheerful celebrations!",
      stats: { label: "First Word", value: "'Amma / Appa'" },
      badge: "🗣️ Talker",
      image: "/carousel/WhatsApp Image 2026-09-16 at 4.37.03 PM (1).jpeg",
      themeColor: "bg-teal-50 border-teal-200 text-teal-700",
    },
    {
      month: 10,
      title: "Cruising Speed Activated",
      subtitle: "Cruising Along Furniture",
      description: "Cruises along every corner of the house. Learned to clap enthusiastically and wave sweet 'Ta-Ta' bye-byes.",
      stats: { label: "Special Skill", value: "Clapping & Ta-Ta" },
      badge: "👏 Clapping Pro",
      image: "/carousel/WhatsApp Image 2026-09-16 at 4.37.04 PM.jpeg",
      themeColor: "bg-rose-50 border-rose-200 text-rose-700",
    },
    {
      month: 11,
      title: "First Independent Steps",
      subtitle: "Look Amma & Appa, No Hands!",
      description: "Took wobbly, bold steps straight into Amma's arms! Instant applause and high fives from the entire family.",
      stats: { label: "Steps Record", value: "First Bold Steps" },
      badge: "🚶 Toddler Mode",
      image: "/carousel/WhatsApp Image 2026-09-16 at 4.37.01 PM (1).jpeg",
      themeColor: "bg-indigo-50 border-indigo-200 text-indigo-700",
    },
    {
      month: 12,
      title: "ONE-DERFUL YEAR OF PURE JOY!",
      subtitle: "The Royal 1st Milestone 🎂",
      description: "365 days of infinite smiles, playful mischief, and endless love. Magizh Mithran is ready to cut his grand birthday cake!",
      stats: { label: "Total Love", value: "Infinity & Beyond" },
      badge: "🎉 1st Birthday!",
      image: "/images/Mithran.jpeg",
      themeColor: "bg-amber-100 border-amber-300 text-amber-800 font-bold",
    },
  ],
  initialBlessings: [
    {
      id: "b1",
      name: "Thatha & Paati",
      relationship: "Grandparents",
      message: "Happy 1st Birthday to our darling grandson Shri Magizh Mithran! May God bless you with long life, good health, and infinite happiness! We love you so much! 💖✨",
      timestamp: "1 hour ago",
      avatarEmoji: "👵👴",
      likes: 18,
      color: "from-amber-50 to-orange-50 border-amber-200",
    },
    {
      id: "b2",
      name: "Periyappa & Periyamma",
      relationship: "Family",
      message: "Happy Birthday to our favorite Little Prince! The girls are already in queue indeed! Wishing you a lifetime of joy and success Mithran! 🎂🎈",
      timestamp: "3 hours ago",
      avatarEmoji: "👑",
      likes: 14,
      color: "from-blue-50 to-cyan-50 border-blue-200",
    },
    {
      id: "b3",
      name: "Chithi & Mama",
      relationship: "Aunt & Uncle",
      message: "Happy 1st Birthday Magizh kutty! Can't wait to dance and celebrate with Saravanan & Soundharya at DD Palace! 🚀🎉",
      timestamp: "5 hours ago",
      avatarEmoji: "🌟",
      likes: 12,
      color: "from-emerald-50 to-teal-50 border-emerald-200",
    },
    {
      id: "b4",
      name: "Chennai Friends Circle",
      relationship: "Family Friends",
      message: "Happy ONE-derful Birthday to handsome Mithran! Looking forward to the grand feast and celebrations on October 4th! 🚗🎁",
      timestamp: "Yesterday",
      avatarEmoji: "🧸",
      likes: 15,
      color: "from-purple-50 to-pink-50 border-purple-200",
    }
  ],
  partyHighlights: [
    { time: "7:00 PM", title: "Grand Red Carpet Arrival & Welcome Drinks 🍹", icon: "Sparkles" },
    { time: "7:30 PM", title: "Fun Games, Music & Kids Entertainment 🎈", icon: "Wand2" },
    { time: "8:15 PM", title: "The Grand Royal Cake Cutting Ceremony 🎂", icon: "Cake" },
    { time: "8:45 PM", title: "Delicious Birthday Feast & Photo Session 📸", icon: "Utensils" },
  ]
};
