
"use client";

import React from 'react';

export function AppBlueprint() {
  return (
    <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert mx-auto p-6">
      <h1>Sutradhaar: The Complete Application Blueprint</h1>

      <h2>1. Introduction & Philosophy</h2>
      <p>This document outlines the complete architecture for <strong>Sutradhaar</strong>. The core philosophy is to build a modular, scalable, and maintainable application using a modern tech stack. Each feature is encapsulated within its own components and routes, with shared functionality abstracted into services and contexts.</p>
      <ul>
        <li><strong>App Name:</strong> Sutradhaar</li>
        <li><strong>Tech Stack:</strong> Next.js, TypeScript, Tailwind CSS, Firebase (Auth, Firestore, Storage), Genkit (for AI).</li>
      </ul>

      <h2>2. Global Architecture & Core Components</h2>
      <p>These components form the shell of the application and are present on most pages.</p>
      
      <h3>2.1. <code>/src/app/layout.tsx</code></h3>
      <p>The absolute root of the application. It sets up global providers that are needed on every single page.</p>
      <ul>
        <li><strong>Responsibility:</strong> To provide essential, top-level context to the entire application.</li>
        <li><strong>Components Used:</strong>
          <ul>
            <li><code>ThemeProvider</code>: Manages the application's theme (light, dark, sutradhaar). Wraps the entire app so any component can access and change the theme.</li>
            <li><code>LanguageProvider</code>: Manages the application's language for internationalization (i18n).</li>
            <li><code>RootLayoutContent</code>: The primary layout component containing the UI shell.</li>
          </ul>
        </li>
      </ul>

      <h3>2.2. <code>RootLayoutContent</code> (inside <code>layout.tsx</code>)</h3>
      <p>This component contains the main visible UI shell, including the header, sidebar, and global dialogs.</p>
      <ul>
        <li><strong>Responsibility:</strong> Manages the main application frame, user authentication state, and global UI elements like the sidebar and modals.</li>
        <li><strong>State Management:</strong>
          <ul>
            <li><code>isLoggedIn</code>: Tracks if a user is currently authenticated.</li>
            <li><code>profile</code>: Stores the logged-in user's data from Firestore.</li>
            <li><code>showLoginDialog</code>, <code>showLogoutDialog</code>, <code>showComingSoonDialog</code>: Manages the visibility of global modals.</li>
          </ul>
        </li>
        <li><strong>Core Components:</strong>
          <ul>
            <li><code>Header</code>: The top bar of the app.</li>
            <li><code>Sidebar</code>: The main navigation menu.</li>
            <li><code>MaintenanceRedirect</code>: A component that handles redirecting users to the maintenance page if maintenance mode is active.</li>
            <li>Global <code>AlertDialog</code>s for Login, Logout, and "Coming Soon" notifications.</li>
          </ul>
        </li>
      </ul>

      <h2>3. App Pages & Features (The Routes)</h2>
      <p>This section details each page (route) within the application.</p>

      <h3>3.1. Dashboard (<code>/</code>)</h3>
      <ul>
        <li><strong>Route:</strong> <code>/src/app/page.tsx</code></li>
        <li><strong>Purpose:</strong> The user's main landing page, offering a high-level overview and quick entry points into the app's features.</li>
        <li><strong>Component Breakdown:</strong>
          <ul>
            <li><code>DashboardPage</code>: The entry component for the route.</li>
            <li><code>WelcomeHeader</code>: Shows a personalized greeting.</li>
            <li><code>QuickStats</code>: Displays cards with key metrics like "Notes Created" or "Conversions Made". Fetches data from Firestore.</li>
            <li><code>RecentActivity</code>: A list of recently accessed notes or calculations, acting as shortcuts.</li>
            <li><code>FeatureGrid</code>: Large, icon-driven buttons for navigating to the Converter, Calculator, and Notes.</li>
          </ul>
        </li>
      </ul>
      
      <h3>3.2. Unit Converter (<code>/converter</code>)</h3>
      <ul>
        <li><strong>Route:</strong> <code>/src/app/converter/page.tsx</code></li>
        <li><strong>Purpose:</strong> To convert values between different units of measurement.</li>
        <li><strong>Component Breakdown:</strong>
          <ul>
            <li><code>ConverterPage</code>: The main component. Manages all state for the conversion process.</li>
            <li><strong>State:</strong> <code>inputValue</code>, <code>fromUnit</code>, <code>toUnit</code>, <code>selectedCategory</code>, <code>result</code>.</li>
            <li><code>CategorySelector</code>: A dropdown to pick a measurement type (Length, Mass, etc.).</li>
            <li><code>UnitSelector</code>: Two dropdowns to select the source and target units. Their options update based on the selected category.</li>
            <li><code>SwapButton</code>: An icon button to quickly swap the <code>fromUnit</code> and <code>toUnit</code>.</li>
          </ul>
        </li>
      </ul>

      <h3>3.3. Calculator (<code>/calculator</code>)</h3>
      <ul>
        <li><strong>Route:</strong> <code>/src/app/calculator/page.tsx</code></li>
        <li><strong>Purpose:</strong> To provide a standard and reliable calculator.</li>
        <li><strong>Component Breakdown:</strong>
          <ul>
            <li><code>CalculatorPage</code>: The parent component.</li>
            <li><strong>State:</strong> <code>currentExpression</code>, <code>displayValue</code>, <code>history</code>.</li>
            <li><code>Display</code>: A screen that shows the current numbers and results.</li>
            <li><code>Keypad</code>: A grid of <code>Button</code> components for numbers (0-9), operators (+, -, *, /), clear (C), and equals (=). Each button click updates the state in the parent component.</li>
          </ul>
        </li>
      </ul>
      
      <h3>3.4. Notes Module</h3>
      <h4>3.4.1. Notes List (<code>/notes</code>)</h4>
      <ul>
        <li><strong>Route:</strong> <code>/src/app/notes/page.tsx</code></li>
        <li><strong>Purpose:</strong> To display all of the user's notes and allow them to search, filter, and create new notes.</li>
        <li><strong>Component Breakdown:</strong>
            <ul>
              <li><code>NotepadPage</code>: Fetches the user's notes from Firestore and manages the display.</li>
              <li><strong>State:</strong> <code>notes[]</code>, <code>searchTerm</code>, <code>filter</code>.</li>
              <li><code>SearchBar</code>: An input field that filters the displayed notes based on title or content.</li>
              <li><code>NoteCard</code>: A small, clickable card representing one note, showing its title and a snippet of content. Clicking it navigates to the editor.</li>
              <li><code>CreateNoteButton</code>: A floating action button that navigates to <code>/notes/new</code>.</li>
            </ul>
        </li>
      </ul>
      <h4>3.4.2. Note Editor (<code>/notes/[noteId]</code>)</h4>
      <ul>
        <li><strong>Route:</strong> <code>/src/app/notes/[noteId]/page.tsx</code></li>
        <li><strong>Purpose:</strong> A full-screen editor for creating a new note or modifying an existing one.</li>
        <li><strong>Component Breakdown:</strong>
            <ul>
              <li><code>NoteEditor</code>: The main component, identified by the <code>noteId</code> from the URL ('new' for a new note).</li>
              <li><strong>State:</strong> Manages the entire <code>Note</code> object state (title, content, category, isLocked, etc.) using a <code>useReducer</code> for complex state logic.</li>
              <li><code>Input</code> (for Title/Category): Standard text fields.</li>
              <li><code>RichTextEditor</code>: A sophisticated text editor component (likely wrapping Tiptap/ProseMirror) that provides formatting options (bold, italic, lists) and handles the <code>content</code> state.</li>
              <li><code>SaveButton</code>: Saves the current note state to Firestore.</li>
              <li><code>DeleteButton</code>: Soft-deletes the note.</li>
              <li><code>LockToggleButton</code>: Toggles the <code>isLocked</code> state, prompting for a password if none is set.</li>
            </ul>
        </li>
      </ul>

      <h2>4. Data Models (Firestore)</h2>
      <p>A detailed breakdown of the data structures used in Firestore.</p>
      <pre><code>
{
  "users": {
    "{userEmail}": {
      "fullName": "string",
      "profileImage": "string | null",
      "settings": {
        "isPremium": "boolean",
        "theme": "string",
        "language": "string"
      }
    }
  },
  "notes": {
    "{userEmail}": {
      "userNotes": [
        {
          "id": "string",
          "title": "string",
          "content": "string",
          "isLocked": "boolean",
          "createdAt": "timestamp"
        }
      ]
    }
  }
}
      </code></pre>

    </div>
  );
}
