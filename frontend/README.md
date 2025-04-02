# Student Solution Shop

A modern dashboard application for students to manage their tasks, schedule, and budget. Built with React, Vite, and Firebase.

## Features

- 📝 Todo List Management
- 📅 Weekly Planner
- 💰 Budget Tracking
- 📊 Expense Analytics
- ⚙️ Customizable Settings

## Tech Stack

- React with TypeScript
- Vite
- Firebase (Authentication & Database)
- Chakra UI
- React Router DOM
- Chart.js
- date-fns

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd student-shop
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication and Firestore
   - Copy your Firebase configuration
   - Create a `.env` file in the root directory and add your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── lib/           # Firebase and other configurations
├── hooks/         # Custom React hooks
├── styles/        # Theme and global styles
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── config/        # Application configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
