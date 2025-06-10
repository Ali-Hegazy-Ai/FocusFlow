# FocusFlow - Pomodoro Timer App

A professional Pomodoro timer web application built with React, Vite, and Tailwind CSS.

## Features

- 🕒 Customizable Pomodoro, short break, and long break durations
- 🌓 Dark/light mode toggle with system preference detection
- 🔊 Ambient background sounds (rain, nature, cafe)
- 🔔 Multiple notification/alarm sound options (bell, alarm clock, bell notification, wooden sound)
- 📖 Integrated Quran radio access via https://quran.com/radio
- 📊 Session statistics tracking
- ⚙️ Customizable settings with localStorage persistence
- 🎬 Smooth animations with Framer Motion
- 📱 Responsive design for all devices

## Technologies Used

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Howler.js](https://howlerjs.com/)

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm or yarn

### Installation

1. Clone the repository or download the source code
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
# or
yarn install
```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

The app will be available at [http://localhost:5173](http://localhost:5173)

### Build

Create a production build:

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Layout/         # Layout components like Header
│   ├── Timer.jsx       # Main timer component
│   ├── ThemeToggle.jsx # Dark/light mode toggle
│   ├── SessionStats.jsx # Session statistics display
│   └── BackgroundAudioPlayer.jsx # Sound controls
├── pages/              # Page components
│   ├── Home.jsx        # Home page with timer
│   └── Settings.jsx    # Settings page
├── context/            # React context providers
│   └── AppContext.jsx  # App-wide state management
├── utils/              # Utility functions
│   └── formatTime.js   # Time formatting utility
├── assets/             # Static assets
├── App.jsx             # Main App component
├── main.jsx            # Entry point
└── index.css           # Global styles with Tailwind
```

## License

MIT# FocusFlow
# FocusFlow
