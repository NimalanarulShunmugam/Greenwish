# Birthday Love Website

A romantic birthday web app designed as a personal surprise for someone special. The project is a single-page interactive experience with multiple screens, a playful love quiz, a memory timeline, and a final birthday message with confetti and music.

## Project Overview

This project is built with plain HTML, CSS, and JavaScript, so it runs without any framework or package installation. It is ideal for a personalized birthday, anniversary, or love letter page that feels expressive and interactive.

## Features

- Multi-screen romantic story flow
- Animated floating hearts and background effects
- "Love detector" yes/no puzzle game
- Personalized reasons section
- Couple quiz with answer feedback
- Photo timeline/story section
- Typed love letter animation
- Final countdown and confetti reveal
- Background music support
- Mobile-friendly responsive layout

## Project Structure

```text
build/
├── assets/
│   ├── Photo1.png
│   ├── Photo2.png
│   ├── Photo3.png
│   ├── Photo4.png
│   └── Payye_Veeshum.mp3
├── index.html
├── script.js
├── style.css
├── README.md
└── .gitignore / .gitattributes (if present in repo)
```

## Main Files

### index.html
Contains the full page structure and all screens of the experience:

- welcome screen
- birthday message screen
- love quiz screen
- reasons screen
- couple quiz screen
- story timeline
- final letter screen
- closing birthday reveal

### style.css
Defines the visual design, layout, colors, typography, animations, and responsive styling. It includes:

- pink theme palette
- large romantic cards
- floating heart animation
- button styling
- interactive quiz grid styling
- responsive design rules

### script.js
Holds the app logic and all personalization data. The main configuration object includes:

- `HER_NAME`
- `YOUR_NAME`
- `LOVE_LETTER`
- `REASONS`
- `COUPLE_QUIZ`

This file also manages:

- screen transitions
- music controls
- confetti animation
- final countdown logic
- the yes/no game interaction
- reason carousel
- couple quiz progression
- letter typing effect

## How to Run

Because this is a static web project, you can run it in one of these ways:

1. Open `index.html` directly in a browser.
2. Or start a local server from the project folder:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Personalization

To customize the project for a new person or event, edit the `CONFIG` object in `script.js`.

### Update the names

```javascript
const CONFIG = {
  HER_NAME: "My Love",
  YOUR_NAME: "Your Name",
};
```

### Update the love letter

Change the `LOVE_LETTER` text block to match your message.

### Update the reasons

Edit the `REASONS` array to add your own heartfelt points.

### Update the couple quiz

Modify `COUPLE_QUIZ` with custom questions, multiple-choice answers, and the correct option index.

## Assets

Place your visual and audio files inside the `assets` folder:

- image files for story timeline
- background music file
- any custom media used in the page

The current project already includes:

- `Photo1.png` through `Photo4.png`
- `Payye_Veeshum.mp3`

## Notes

This is a handcrafted personal website, not a generic template framework. It is designed to be emotionally meaningful and easy to tweak for a specific relationship or milestone.

## Suggested Next Improvements

- add a custom background image
- replace the music track with a meaningful song
- create a form for automatic personalization
- add more mini-games or animations
- make the app fully multilingual

## License

This project is intended for personal use and customization. If you are using it for a personal surprise, you can freely adapt the code and content to fit your story.

---

For quick editing, start with the `CONFIG` object in `script.js` and the images in `assets/`.
