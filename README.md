# BizLevel

A Next.js application for business growth tracking and progress management.

## Features

- **Level Map**: Visualize your business journey and progress
- **Business Levels**: Structured growth framework with clear milestones
- **Artifacts**: Store and organize important business documents
- **AI Chat**: Get personalized guidance for your specific challenges

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **State Management**: React Query
- **Form Handling**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Firebase project with Authentication, Firestore, and Storage enabled

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bizlevel.git
   cd bizlevel
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with your Firebase configuration:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   
   # OpenAI API key for chat functionality
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Set up Firebase:
   - Create a new project in the [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication with Email/Password provider
   - Create a Firestore database in production mode
   - Set up Storage with appropriate security rules
   - Copy your Firebase config values to the `.env.local` file

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/`: Application routes and pages
- `components/`: Reusable UI components
- `lib/`: Utility functions and service configurations
  - `firebase/`: Firebase configuration and utility functions
- `hooks/`: Custom React hooks
- `context/`: React context providers
- `types/`: TypeScript type definitions

## Development Status

Check the current project status and next steps in the [status.md](./status.md) file.

## Documentation

- [Data Model](./docs/features/data-model.md)
- [Firebase Integration](./docs/features/firebase-integration.md)
