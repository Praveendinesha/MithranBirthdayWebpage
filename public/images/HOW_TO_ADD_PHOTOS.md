# 📸 Guide: Where to Add Your Photos (Baby & Family)

You can easily replace the placeholder photos with your own real photos of **Shri Magizh Mithran**, Amma & Appa (**Saravanan & Soundharya**), and Family!

---

## 📁 Recommended Folder Location

Place your image files in:
`BirthdayInvitation/public/images/photos/`

For example:
- `public/images/photos/baby-main.jpg` (For the Main Royal Profile Photo)
- `public/images/photos/family-cuddle.jpg` (For Family Gallery Photo 1)
- `public/images/photos/baby-appa.jpg` (With Appa Saravanan)
- `public/images/photos/baby-amma.jpg` (With Amma Soundharya)
- `public/images/photos/baby-month1.jpg` to `baby-month12.jpg` (For the 12-Month Milestones)

---

## ✏️ How to Link Your Photos in Code

Open the configuration file:
👉 **`src/config/invitationData.ts`**

1. **Main Baby Hero Photo**:
   Update `baby.photoUrl`:
   ```ts
   photoUrl: "/images/photos/baby-main.jpg",
   ```

2. **Family & Baby Photo Carousel Gallery**:
   Update the `gallery` array:
   ```ts
   gallery: [
     {
       id: "g1",
       title: "The Little Prince 👑",
       caption: "Spreading million-dollar smiles every single day.",
       category: "Baby Prince",
       imageUrl: "/images/photos/baby-main.jpg",
     },
     {
       id: "g2",
       title: "Precious Cuddle Moments ❤️",
       caption: "With Amma Soundharya.",
       category: "With Amma",
       imageUrl: "/images/photos/baby-amma.jpg",
     },
     // ...
   ]
   ```

3. **12 Months Milestones**:
   Update the `milestones` array:
   ```ts
   {
     month: 1,
     title: "Welcome Magizh Mithran!",
     // ...
     image: "/images/photos/baby-month1.jpg",
   }
   ```

Any image placed in `public/images/photos/filename.jpg` is automatically accessible at `/images/photos/filename.jpg` in your browser!
