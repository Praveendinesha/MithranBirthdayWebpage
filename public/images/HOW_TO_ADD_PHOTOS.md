# 📸 Guide: Where to Add Your Photos (Baby, Family & Milestones)

You can easily customize all photos of **Shri Magizh Mithran**, Amma & Appa (**Saravanan & Soundharya**), and Family!

---

## 📁 1. Main Baby Portrait (Hero Section)
- **Location**: `public/images/Mithran.jpeg`
- **Used in**: The main circular royal portrait at the top of the invitation.

---

## 📁 2. Baby & Family Moments Carousel
- **Location**: `public/carousel/`
- Contains the 10 family moments photos showcased in the auto-playing slideshow.
- Configured in `src/config/invitationData.ts` under the `gallery` array.

---

## 📁 3. Memory Lane (12 Months Milestones)
- **Location**: `public/milestones/`
- Currently configured with distinct milestone artwork:
  - `public/milestones/month-1.svg` to `month-11.svg`
  - `public/images/Mithran.jpeg` (for 12th Month 1st Birthday Milestone!)
- **To add your own monthly baby photos**:
  Simply place your photos as:
  - `public/milestones/month-1.jpg`
  - `public/milestones/month-2.jpg`
  - ... up to `month-12.jpg`
  And update the file extension in `src/config/invitationData.ts` under `milestones`.

---

## ✏️ How to Link Your Photos in Code

Open the configuration file:
👉 **`src/config/invitationData.ts`**

- **Hero Baby Photo**: `baby.photoUrl`
- **Family Carousel**: `gallery` array
- **12 Month Milestones**: `milestones` array
