
"use client";

import React from 'react';

export function AppBlueprint() {
  return (
    <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert mx-auto p-6">
      <h1>App Blueprint: Sutradhaar</h1>

      <h2>1. Project Overview</h2>
      <ul>
        <li><strong>App Name:</strong> Sutradhaar</li>
        <li><strong>Tagline:</strong> Your all-in-one productivity toolkit, seamlessly integrated.</li>
        <li><strong>Core Mission:</strong> To provide a fast, intuitive, and feature-rich suite of tools (converter, calculator, notes, etc.) that helps users streamline their daily tasks, with powerful customization and AI-driven features for a personalized experience.</li>
        <li><strong>Target Audience:</strong> Students, professionals, and anyone needing quick and reliable tools for calculations, conversions, and note-taking.</li>
        <li>
            <strong>Tech Stack:</strong>
            <ul>
                <li><strong>Framework:</strong> Next.js (React)</li>
                <li><strong>Language:</strong> TypeScript</li>
                <li><strong>Styling:</strong> Tailwind CSS with shadcn/ui components</li>
                <li><strong>Backend & DB:</strong> Firebase (Authentication, Firestore, Realtime Database)</li>
                <li><strong>AI:</strong> Google's Genkit for features like AI translation and smart suggestions.</li>
            </ul>
        </li>
      </ul>

      <h2>2. UI/UX Style Guide</h2>
        <ul>
            <li><strong>Primary Color:</strong> Light Sky Blue (<code>#87CEEB</code>)</li>
            <li><strong>Background Color:</strong> Off-white (<code>#F5F5F5</code>)</li>
            <li><strong>Accent Color:</strong> Electric Blue (<code>#7DF9FF</code>)</li>
            <li><strong>Font:</strong> Inter (sans-serif)</li>
            <li><strong>Layout:</strong> Clean, minimalist, and intuitive to guide user flow.</li>
            <li><strong>Icons:</strong> Minimalist icons (Lucide React) for clarity.</li>
            <li><strong>Theme:</strong> Supports Light, Dark, and a custom "Sutradhaar" theme. Premium users can create their own themes.</li>
        </ul>

      <h2>3. Core App Modules</h2>

      <h3>3.1. Dashboard (<code>/</code>)</h3>
      <p>The main landing page after login, providing an overview and quick access to other modules.</p>
      <ul>
        <li><strong>Components:</strong> <code>Dashboard</code>, <code>WelcomeHeader</code>, <code>QuickStats</code>, <code>RecentActivity</code>, <code>FeatureGrid</code></li>
        <li><strong>Functions:</strong> <code>fetchDashboardData()</code></li>
      </ul>

      <h3>3.2. Unit Converter (<code>/converter</code>)</h3>
        <p>A powerful tool for converting between various units, with AI-powered input.</p>
        <ul>
            <li><strong>Components:</strong> <code>Converter</code>, <code>CategorySelector</code>, <code>UnitSelector</code>, <code>CustomUnitManager</code> (Premium)</li>
            <li><strong>Functions:</strong> <code>parseNaturalLanguageInput(input)</code>, <code>getUnitCategories()</code>, <code>getUnitsForCategory(category)</code>, <code>performConversion(value, from, to)</code>, <code>saveCustomUnit(unit)</code>, <code>logConversionToHistory(data)</code></li>
        </ul>

      <h3>3.3. Calculator (<code>/calculator</code>)</h3>
      <p>A versatile calculator with standard and potentially scientific layouts.</p>
        <ul>
            <li><strong>Components:</strong> <code>Calculator</code>, <code>Display</code>, <code>Keypad</code></li>
            <li><strong>Functions:</strong> <code>evaluateExpression(expression)</code>, <code>handleButtonPress(key)</code>, <code>clearDisplay()</code>, <code>logCalculationToHistory(data)</code></li>
        </ul>
        
        <h3>3.4. Notepad (<code>/notes</code>)</h3>
        <p>A feature-rich note-taking module with organization and rich text editing.</p>
        <ul>
            <li><strong>Components:</strong> <code>Notepad</code>, <code>NoteCard</code>, <code>NoteEditor</code>, <code>NoteViewer</code>, <code>RichTextEditor</code></li>
            <li><strong>Functions:</strong> <code>listenToUserNotes(email, callback)</code>, <code>updateUserNotes(email, notes)</code>, <code>createNote(noteData)</code>, <code>updateNote(noteId, data)</code>, <code>softDeleteNote(noteId)</code>, <code>toggleLock(noteId)</code>, <code>exportNote(note, format)</code> (Premium)</li>
        </ul>

        <h3>3.5. Time Tools (<code>/time</code>)</h3>
        <p>A collection of utilities for time-based calculations.</p>
        <ul>
            <li><strong>Components:</strong> <code>TimeUtilities</code>, <code>DateDiffCalculator</code>, <code>Timer</code>, <code>Stopwatch</code></li>
            <li><strong>Functions:</strong> <code>calculateDateDifference(start, end)</code>, timer and stopwatch control functions.</li>
        </ul>

        <h3>3.6. History (<code>/history</code>)</h3>
        <p>(Requires Auth) Displays a log of all user activities.</p>
        <ul>
            <li><strong>Components:</strong> <code>History</code>, <code>HistoryItem</code></li>
            <li><strong>Functions:</strong> <code>fetchHistory(email)</code>, <code>clearHistory(email)</code></li>
        </ul>

        <h3>3.7. AI Translator (<code>/translator</code>)</h3>
        <p>(Coming Soon) An AI-powered text translation tool.</p>
        <ul>
            <li><strong>Components:</strong> <code>Translator</code></li>
            <li><strong>Functions:</strong> <code>translateText(text, source, target)</code>, <code>detectLanguage(text)</code></li>
        </ul>


      <h2>4. Cross-Cutting Concerns</h2>
        <h3>4.1. Authentication</h3>
        <p>Handles user sign-up, login, and session management.</p>
        <ul>
            <li><strong>Pages:</strong> <code>/welcome</code>, <code>/signup</code>, <code>/forgot-password</code>, <code>/logout</code></li>
            <li><strong>Components:</strong> <code>SignupForm</code>, <code>LoginForm</code>, <code>ForgotPasswordForm</code></li>
            <li><strong>Firebase Functions:</strong> <code>signUpWithEmail</code>, <code>signInWithEmail</code>, <code>signInWithGoogle</code>, <code>sendPasswordReset</code>, <code>signOutUser</code>, <code>onAuthStateChangedListener</code></li>
        </ul>

        <h3>4.2. User Profile (<code>/profile</code>)</h3>
        <p>(Requires Auth) Allows users to view and manage their profile.</p>
        <ul>
            <li><strong>Components:</strong> <code>Profile</code>, <code>ProfileEditForm</code>, <code>ProfilePhotoEditor</code></li>
            <li><strong>Functions:</strong> <code>updateUserProfile(email, data)</code>, <code>uploadProfileImage(email, file)</code></li>
        </ul>

        <h3>4.3. Settings (<code>/settings</code>)</h3>
        <p>(Requires Auth) Centralized location for app-wide settings.</p>
        <ul>
            <li><strong>Components:</strong> <code>Settings</code>, <code>ThemeEditor</code> (Premium), <code>LanguageSelector</code>, <code>NotePasswordManager</code></li>
            <li><strong>Functions:</strong> <code>updateUserSettings(email, data)</code>, <code>saveTheme(email, theme)</code></li>
        </ul>

        <h3>4.4. Premium & Monetization</h3>
        <p>Handles access control for premium features.</p>
        <ul>
            <li><strong>Page:</strong> <code>/premium</code></li>
            <li><strong>Components:</strong> <code>PremiumLockDialog</code></li>
            <li><strong>Functions:</strong> <code>isPremiumUser(userData)</code>, <code>initiateCheckout()</code></li>
        </ul>

        <h2>5. Data Models (Firestore)</h2>
        <pre><code>
{/* User Data */}
interface UserData {
  fullName: string;
  email: string;
  profileImage?: string;
  createdAt: string; // ISO Date
  notePassword?: string;
  settings: {
    isPremium: boolean;
    theme: 'light' | 'dark' | 'sutradhaar' | string;
    language: 'en' | 'hi';
  };
}

{/* Notes */}
interface Note {
  id: string; // uuidv4
  title: string;
  content: string; // HTML
  category: string;
  isFavorite: boolean;
  isLocked: boolean;
  attachment: string | null;
  backgroundStyle: 'none' | 'lines' | 'dots' | 'grid';
  createdAt: string; // ISO Date
  updatedAt: string; // ISO Date
  deletedAt: string | null;
}

{/* History */}
interface HistoryItem {
  id: string; // uuidv4
  type: 'conversion' | 'calculation';
  data: any;
  timestamp: string; // ISO Date
}
        </code></pre>

    </div>
  );
}
