# Sutradhaar: The All-in-One Productivity App

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Sutradhaar is a smart, all-in-one unit converter, calculator, and notes application designed to streamline your daily productivity tasks. Built with simplicity, speed, and elegance in mind by a passionate student developer.

**Check out the live app:** [sutradhaar.netlify.app](https://sutradhaar.netlify.app/)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

Sutradhaar comes packed with features to make your life easier:

*   **🔄 Unit Converter:** Seamlessly convert between a wide range of units, including length, weight, temperature, currency, and more.
*   **➗ Calculator:** A built-in calculator for performing quick calculations without ever leaving the app.
*   **📝 Notes:** An integrated notes feature to jot down important information alongside your conversions and calculations.
*   **📜 History:** Keep track of all your past activities, from conversions to calculations and notes.
*   **⭐ Favorites:** Bookmark your most frequently used conversions for quick and easy access.
*   **🔐 Authentication:** Secure user authentication to ensure your data remains private and safe.
*   **And many more!**

## Tech Stack

This project is built with a modern and powerful tech stack:

*   **Framework:** [Next.js](https://nextjs.org/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Backend & Database:** [Firebase](https://firebase.google.com/) (Firestore, Authentication)
*   **AI Features:** [Google's Genkit](https://firebase.google.com/docs/genkit)
*   **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
*   **State Management:** React Context API

## Getting Started

Follow these instructions to get a local copy of the project up and running for development and testing purposes.

### Prerequisites

You need to have the following software installed on your machine:

*   [Node.js](https://nodejs.org/) (v20 or later)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/sutradhaar.git
    cd sutradhaar
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of your project and add the necessary Firebase configuration keys. You can get these from your Firebase project settings.

    ```
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

The project follows a standard Next.js `src` directory structure:

```
sutradhaar/
├── src/
│   ├── app/              # Main application pages and layouts
│   ├── components/       # Reusable UI components
│   ├── context/          # React context for state management
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and libraries
│   ├── services/         # Firebase services
│   ├── ai/               # Genkit AI flows and configurations
│   └── ...
├── public/               # Static assets
└── ...
```

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ❤️ by Aman.
