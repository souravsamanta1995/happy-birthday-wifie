# 🎉 Barnali's Birthday Website - Complete Instructions

## 🎯 What You Have

A stunning, fully animated birthday celebration website for Barnali's 24th birthday with:
- ✨ Animated hero section with floating emoji particles
- 📸 4 categorized photo galleries (28 photos total)
- 💌 Personalized love message from Sourav
- 🎨 Beautiful rose/pink celebration theme
- 📱 Fully responsive mobile-friendly design
- 🎊 Smooth animations and hover effects

---

## 📸 STEP 1: Add Your Photos

### The Setup
Your website is ready to go - all you need to do is add the 28 photos in the correct order!

### Where to Place Photos
**Folder**: `/public/images/`

Each photo file MUST have the exact filename shown below (case-sensitive, exact spelling):

### Photo Files by Category

#### 🌟 **Category 1: Just Her Beauty** (15 photos - Only her images)
```
image1.jpg
image2.jpg
image4.jpg
image5.jpg
image6.jpg
image7.jpg
image8.jpg
image9.jpg
image10.jpg
image11.jpg
image12.jpg
image13.jpg
image14.jpg
image15.jpg
image16.jpg
```

#### 📷 **Category 2: Memories Over Time** (3 photos - Old photos of her)
```
old_her1.jpg
old_her2.jpeg
old_her3.jpeg
```

#### 💕 **Category 3: Us Together** (6 photos - Together photos)
```
together1.jpg
together2.jpg
together3.jpg
together4.jpg
together5.jpg
together6.jpg
```

#### 💑 **Category 4: Our Journey** (3 photos - Old couple photos)
```
old_together1.jpg
old_together2.jpg
old_together3.jpg
```

---

## 🚀 STEP 2: Upload & Run the Website

### Option A: Using v0's Built-in Preview (Recommended)
1. Click the **"Version Box"** in the top left
2. Click the **Preview** tab
3. The website will appear with live updates as you work

### Option B: Download & Run Locally
1. Download the project ZIP from v0 (three dots menu → Download ZIP)
2. Extract the folder
3. Open terminal and navigate to the folder
4. Run: `npm install` or `pnpm install`
5. Run: `npm run dev` or `pnpm dev`
6. Open **http://localhost:3000** in your browser

### Option C: Deploy to Vercel (Free)
1. Click **Publish** button in top right of v0
2. Follow the steps to connect your GitHub account
3. Your site will be live in seconds!

---

## 🎨 Website Sections

### 1. Hero Section
- Big "Happy Birthday Barnali" message
- From Sourav
- Birthday info (May 16, 2000, Age 24)
- Floating celebration emojis
- Bouncing heart emoji

### 2. Photo Galleries (Tap/Hover to Expand)
Each category has its own beautiful card:
- **Just Her Beauty** - 15 photos showcasing her beauty
- **Memories Over Time** - 3 old/throwback photos
- **Us Together** - 6 couple photos
- **Our Journey** - 3 old couple photos

How to use:
- **Desktop**: Hover over any category card to expand and see photos
- **Mobile**: Tap the "View Gallery" button to expand
- **Click any photo** to see it fullscreen
- **Click X or anywhere outside** to close fullscreen view

### 3. Message Section
- Personalized birthday message from Sourav
- 6 special wishes for Barnali
- Birthday date stamp

---

## 💻 Using the Preview

### In v0 Preview:
1. **Add photos** to your local public/images folder first
2. **Save/Commit** changes
3. **Check the Preview** - it updates automatically!
4. Photos will appear in their respective gallery sections

### Troubleshooting:
- If images don't show:
  - ✅ Check filenames are EXACT (case-sensitive)
  - ✅ Make sure files are in `/public/images/` folder
  - ✅ Try refreshing the preview
  - ✅ Check file format (.jpg or .jpeg)

---

## 🎨 Customization Options

### Change the Message
Edit `/components/WishMessage.tsx`:
- Change the birthday message text
- Add/remove wishes in the `wishes` array
- Update dates and names

### Change Colors
The site uses rose/pink colors. To change:
- Edit `/app/page.tsx` - gradient colors
- Edit individual component files
- Use Tailwind color classes (rose-100, pink-500, red-600, etc.)

### Change Emojis
Edit `/components/CelebrationBackground.tsx`:
- Change the emoji array to different celebration emojis
- Current: 🎉 🎊 💕 🌹 ✨ 💐 🎈 💖

### Add More Wishes
Edit `/components/WishMessage.tsx`:
```tsx
const wishes = [
  "Your smile brightens my darkest days",
  "With you, every moment is magical",
  "Add your custom wish here!",
  // ... add more
];
```

---

## 📱 Responsive Features

The website automatically adapts to:
- **Mobile phones** - Stacked layout, touch-friendly buttons
- **Tablets** - 2-column grid for photos
- **Desktop** - Full featured with hover effects

All portrait images display beautifully at any size!

---

## ✅ Checklist

Before sharing with Barnali:

- [ ] Added all 28 photos to `/public/images/` with correct filenames
- [ ] Tested the website in preview or locally
- [ ] All photos appear in their correct categories
- [ ] Message section displays properly
- [ ] Website looks good on mobile (use browser's mobile preview)
- [ ] Ready to share! 🎉

---

## 🎁 Next Steps

### To Share:
1. **Email**: Simply send the URL if deployed
2. **Social Media**: Share the link on WhatsApp, Instagram, etc.
3. **In Person**: Load on phone/tablet and show her!

### To Deploy:
1. Click **Publish** in v0
2. Or download, push to GitHub, and deploy to Vercel
3. Share the live URL!

---

## 🆘 Need Help?

### Common Issues:

**Images not showing?**
- Check filenames match exactly (case-sensitive)
- Ensure files are in `/public/images/` folder
- Verify file format (.jpg or .jpeg)

**Colors look wrong?**
- Clear browser cache (Ctrl+Shift+Delete)
- Try a different browser
- Check globals.css for styling

**Animations not smooth?**
- Works best in modern browsers (Chrome, Safari, Edge, Firefox)
- Check browser hardware acceleration is enabled
- Try on a faster device/connection

**Need to change something?**
- Edit the component files directly
- Changes appear live in the preview
- Or make changes and re-deploy

---

## 💝 Special Notes

- All animations are smooth and performant
- Mobile-optimized for perfect display on phones
- Fully responsive - works on any screen size
- All 28 photos load efficiently
- Works offline once loaded
- No third-party dependencies needed (only React/Next.js)

---

## 🎊 Have Fun!

This website is designed to celebrate Barnali in the most special way. Enjoy creating these memories together!

**Happy Birthday Barnali! 🎉💕**

---

*Created with ❤️ for Barnali's 24th Birthday*
*May 16, 2026*
