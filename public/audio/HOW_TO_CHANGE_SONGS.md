# 🎵 Guide: How to Change the Background Song

You can easily manage and customize the invitation background music in **3 easy ways**:

---

## 👑 Option 1: In-App Client Portal (Easiest - No Coding Required!)

1. On the live webpage, scroll to the bottom and click **⚙️ Manage Photos** (or open `http://localhost:5173/?admin=true&tab=music`).
2. Enter the PIN: **`SMS2026`**.
3. Go to the **🎵 Song & Audio** Tab:
   - **Upload Custom MP3 / Audio File**: Tap *"Pick Audio"* to choose any `.mp3`, `.m4a`, or `.wav` from your phone/computer.
   - **Custom Audio URL / Path**: Type `/audio/your-song.mp3` or any direct web link.
   - **Test Audio Button 🎶**: Click the test button to preview and hear the song instantly!
   - **Volume Slider**: Adjust the volume level (10% to 100%).
4. Click **"Save & Apply Live"**!

---

## 🎼 Option 2: Default Built-in Birthday Music Box Melody

If no custom song is set (or if the audio file fails to load/404):
The webpage **automatically and smoothly plays the built-in gentle Music Box chime synthesizer** with the classic *"Happy Birthday to You"* notes via the browser's native Web Audio API (100% royalty-free, works offline, zero loading delay).

---

## 🚀 Option 3: Placing Permanent MP3 in the Codebase

1. **Place your `.mp3` file in**:
   `BirthdayInvitation/public/audio/song.mp3`

2. **In [`src/config/invitationData.ts`](file:///e:/Projects/BirthdayInvitation/src/config/invitationData.ts)**:
   ```ts
   music: {
     songUrl: "/audio/song.mp3",
     title: "Shri Magizh Mithran's Birthday Theme",
     volume: 0.5,
   },
   ```

