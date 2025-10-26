# Chizenum's AAC Communication Board

An Augmentative and Alternative Communication (AAC) application built for individuals with communication difficulties. This web-based communication board provides an intuitive interface with customizable buttons for expressing needs, feelings, activities, and more.

## Overview

This project was developed for the TOM Makeathon 2025 to create an accessible, personalized communication tool. The application features:

- **Interactive Communication Cards**: Visual buttons with images and text labels
- **Audio Feedback**: Text-to-speech and custom audio playback
- **Multi-Page Navigation**: Organized categories (Hungry, Activities, Places, People, Feelings, Chat, etc.)
- **Customizable Interface**: Password-protected settings for caregivers to modify layouts and content
- **Offline-First**: Works without internet connection using local storage

## Features

### Core Functionality
- **Audio Buttons**: Speak words/phrases using text-to-speech or custom recorded audio
- **Link Buttons**: Navigate between different category pages
- **Static Image Library**: Pre-loaded images for common items, people, activities, and places
- **Bottom Quick Actions**: Always-accessible Yes/Help/No buttons
- **Back Navigation**: Easy return to previous pages

### Administrative Features
- **Password-Protected Settings** (Default: `123`)
- **Page Management**: Create, edit, and customize pages
- **Button Management**: Add, remove, and configure buttons
- **Layout Customization**: Adjust grid columns/rows and colors
- **Asset Management**: Upload custom audio recordings and images
- **Auto-Save**: Changes persist in browser storage

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **Routing**: React Router DOM 6
- **State Management**: Zustand with persistence
- **Database**: Dexie (IndexedDB wrapper)
- **Font**: Outfit (via Google Fonts)

## Project Structure

```
app/
├── src/
│   ├── assets/           # Static images for buttons
│   ├── components/       # React components
│   │   ├── ButtonCard.tsx      # Individual button component
│   │   ├── TopBar.tsx          # Navigation header
│   │   ├── BottomBar.tsx       # Quick action buttons
│   │   └── SettingsModal.tsx   # Admin settings interface
│   ├── pages/
│   │   └── PageView.tsx        # Main page renderer
│   ├── store/
│   │   ├── useAppStore.ts      # Zustand state management
│   │   └── db.ts               # IndexedDB configuration
│   ├── utils/
│   │   └── imageMap.ts         # Static image mappings
│   ├── types.ts          # TypeScript type definitions
│   ├── App.tsx           # Root component
│   └── main.tsx          # Application entry point
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TOM_makeathon_2025/app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:5173`
   - The app will load with default pages and buttons

### Build for Production
```bash
npm run build
npm run preview  # Preview the production build
```

## Usage

### For Users

1. **Navigate Pages**: Tap any button with a "+" symbol to navigate to that category
2. **Speak Words**: Tap audio buttons to hear the word/phrase spoken
3. **Quick Actions**: Use the Yes/Help/No buttons at the bottom of every page
4. **Go Back**: Tap the "← Back" button in the top-left to return to the previous page

### For Caregivers/Administrators

1. **Access Settings**: Tap the "⚙ Settings" button in the top-right
2. **Enter Password**: Default password is `123`
3. **Customize**:
   - Modify page layouts (grid size, colors)
   - Add, edit, or remove buttons
   - Upload custom audio recordings
   - Upload custom images
   - Create new pages and link buttons to them
   - Change the admin password
4. **Save Changes**: Click "Save" and confirm to apply changes
5. **Auto-Close**: Settings modal automatically closes after 30 seconds of being open

## Page Categories

The application includes the following pre-configured pages:

### Main Categories
- **Home**: Central navigation hub
- **Hungry**: Food, drinks, restaurants, meals, snacks, desserts
- **Activities**: Art, dance, music, TV, yoga, pottery, swimming, walking
- **Places**: Restaurants, shopping, bathroom, home, park, movies, church, bowling
- **People**: Mom, doctor, teacher, pets (dog, cat), pronouns (he, her), Chizenum
- **Feelings**: Emotions (happy, sad, angry, bored), physical states (hot, cold, sick, hurt)
- **Chat**: Common phrases (maybe, done, later, more, I don't know, stop, thank you, please)
- **I Need**: Bathroom, help, sleep, medicine
- **I Did**: Past tense expressions linking to other categories

### Subpages
- **Restaurants**: Zaxby's, iHOP, Kroger, Applebee's, Wendy's, Olive Garden, and more
- **Drinks**: Water, juice, milk
- **Art Activities**: Draw, color, paint
- **TV Shows**: Nursery rhymes, Lorax, Clifford, Netflix, PBS, and more
- **Shopping**: Mall, Target, Dollar General
- **Sick Symptoms**: Sore throat, cramps, headache, stomach ache
- **Body Parts (Hurt)**: Head, stomach, legs, arms

## Configuration

### Static Image Mapping

Images are pre-loaded and mapped in `app/src/utils/imageMap.ts`. To add new images:

1. Place image files in `app/src/assets/`. Images should be named in lowercase and separated by underscores(_).
2. Import the image in `imageMap.ts`
3. Add mapping: `"Button Label": ImageVariable`

Example:
```typescript
import NewImg from "../assets/new-image.png";

export const staticImageMap: Record<string, string> = {
  // ... existing mappings
  "New Button": NewImg
};
```

### Button Types

- **Audio Buttons**: Play text-to-speech or custom audio
- **Link Buttons**: Navigate to another page (shows "+" indicator)

### Data Persistence

- **Page Configuration**: Stored in browser localStorage via Zustand
- **Uploaded Assets**: Stored in IndexedDB via Dexie
- **Default Password**: `123` (changeable in settings)

## Customization Guide

### Adding a New Page

1. Open Settings (password: `123`)
2. Scroll to "Create New Page" section
3. Enter page title, slug, grid dimensions, and color
4. Click "Create"
5. Link buttons to the new page using the "Link Page" dropdown

### Uploading Custom Audio

1. Open Settings
2. Find "Upload Audio" section
3. Select one or more audio files
4. Note the asset ID shown after upload
5. Assign the asset ID to a button's "Audio Asset" field

### Customizing Button Images

Option 1: **Use Static Images** (recommended)
- Add image to `app/src/assets/`
- Map in `imageMap.ts` matching the button label

Option 2: **Upload Dynamic Images**
- Open Settings → "Upload Image"
- Note the asset ID
- Assign to button's "Image Asset" field

## Design Decisions

### Color Scheme
- **Primary Brand Color**: #9146FF (purple)
- **Home Background**: #C3B1E1 (light purple)
- **Hungry Background**: #F3E8FF (very light purple/pink)
- **Activities Background**: #E0F2FE (light blue)

### Typography
- **Font**: Outfit (Google Fonts)
- **Button Labels**: Bold, 28px, prominent visibility

### Layout
- **Responsive Grid**: Adapts to different screen sizes
- **No Scrolling**: Content always fits viewport
- **Touch-Friendly**: Large buttons with adequate spacing
- **Visual Feedback**: Hover and active states for better UX

### Accessibility
- **High Contrast**: Purple buttons on light backgrounds
- **Large Touch Targets**: Buttons sized for motor accessibility
- **Audio Feedback**: Text-to-speech for all audio buttons
- **Visual Indicators**: "+" symbol shows navigation buttons

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires:
- IndexedDB support
- Web Speech API (for text-to-speech)
- Modern CSS Grid support

## Troubleshooting

### Audio Not Playing
- Check browser permissions for audio playback
- Ensure audio files are properly uploaded
- Try using text-to-speech as fallback

### Settings Won't Open
- Clear browser cache and localStorage
- Default password is `123`
- Check browser console for errors

### Images Not Showing
- Verify image files exist in `app/src/assets/`
- Check imageMap.ts for proper imports and mappings
- Rebuild the application after adding new images

## Future Enhancements

- [ ] Multi-language support
- [ ] Voice recording directly in the app
- [ ] Export/import configuration for backup
- [ ] User profiles for multiple users
- [ ] Analytics and usage tracking
- [ ] Mobile app (React Native version)
- [ ] Cloud sync for multi-device access

## Contributing

This project was developed for the TOM Makeathon 2025. Contributions, suggestions, and improvements are welcome!

## License

This project is intended for educational and assistive technology purposes.

## Acknowledgments

- Built for Chizenum and individuals with communication needs
- Developed during TOM Makeathon 2025
- Special thanks to caregivers and AAC specialists for requirements guidance

---

**For support or questions**, please open an issue in the repository.
