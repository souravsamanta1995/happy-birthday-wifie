# 🎉 Barnali's Birthday Celebration Website - Setup Guide

## Welcome! 💕

This is a beautiful, animated birthday celebration website created with love for **Barnali's 24th Birthday** (May 16, 2000).

## 📸 How to Add Your Photos

All your photos should be placed in the **`public/images/`** folder. The website automatically recognizes these files:

### Photo Categories & File Names

#### 1. **Only Her Image** (15 photos)
Place these files in `public/images/`:
- `image1.jpg`
- `image2.jpg`
- `image4.jpg`
- `image5.jpg`
- `image6.jpg`
- `image7.jpg`
- `image8.jpg`
- `image9.jpg`
- `image10.jpg`
- `image11.jpg`
- `image12.jpg`
- `image13.jpg`
- `image14.jpg`
- `image15.jpg`
- `image16.jpg`

#### 2. **Memories Over Time** (3 photos)
- `old_her1.jpg`
- `old_her2.jpeg`
- `old_her3.jpeg`

#### 3. **Us Together** (6 photos)
- `together1.jpg`
- `together2.jpg`
- `together3.jpg`
- `together4.jpg`
- `together5.jpg`
- `together6.jpg`

#### 4. **Our Journey** (3 photos)
- `old_together1.jpg`
- `old_together2.jpg`
- `old_together3.jpg`

**Total: 28 photos** 📷

## 🚀 Features

### ✨ Beautiful Animations
- **Blob animations** - Smooth background element movements
- **Floating particles** - Celebratory emoji falling effect (🎉, 💕, 🌹, ✨, etc.)
- **Fade-in effects** - Smooth entrance animations
- **Interactive galleries** - Hover to expand, click to view full-size

### 📱 Fully Responsive
- Optimized for mobile, tablet, and desktop
- Portrait images display beautifully on all screen sizes

### 💌 Heartfelt Content
- Personalized hero section welcoming Barnali
- Birthday info (DOB: May 16, 2000, Age: 24)
- Romantic message from Sourav
- Special wishes section

### 🎨 Color Scheme
- Rose and pink gradients for romantic feel
- Warm, celebratory colors throughout
- Smooth transitions and hover effects

## 📂 Directory Structure

```
public/
├── images/
│   ├── image1.jpg
│   ├── image2.jpg
│   ├── together1.jpg
│   ├── old_her1.jpg
│   └── ... (28 photos total)
```

## 🎯 Quick Start

1. **Download/Download ZIP** the project from v0
2. **Install dependencies**: 
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Add your photos** to `public/images/` folder with the exact file names above

4. **Run the development server**:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open** http://localhost:3000 in your browser 🎊

## 📋 File Organization

- **Image dimensions**: All images should be portrait orientation (as mentioned)
- **File format**: JPG/JPEG (as shown in your files)
- **File size**: Recommended max 5MB per image for optimal performance

## 🎨 Customization Tips

If you want to modify the website:

1. **Change colors**: Edit the gradient backgrounds in `/app/page.tsx` and component files
2. **Update messages**: Modify text in `components/WishMessage.tsx`
3. **Add more wishes**: Update the `wishes` array in `components/WishMessage.tsx`
4. **Change emojis**: Update the `particles` and emoji references in `components/CelebrationBackground.tsx`

## 🚀 Deployment

Deploy to Vercel with one click:
1. Push to GitHub
2. Connect to Vercel
3. Deploy with zero configuration

Or use: `vercel deploy`

## 💝 What's Included

- ✅ Animated hero section
- ✅ 4 categorized photo galleries
- ✅ Falling emoji particles
- ✅ Blob background animations
- ✅ Full-screen image viewer
- ✅ Personalized love message
- ✅ Birthday wishes section
- ✅ Fully responsive design
- ✅ Smooth fade-in animations

## 📝 Notes

- All images are loaded from `public/images/` folder
- The website is optimized for 24-28 photos in 4 categories
- Images appear in the order they're listed in the gallery components
- All animations are GPU-accelerated for smooth performance

---

**Made with 💕 for Barnali's Birthday**

Happy Birthday! 🎉🎊💕
