App Name: Sutradhaar
Tagline: Your all-in-one productivity toolkit, seamlessly integrated.
Core Mission: To provide a fast, intuitive, and feature-rich suite of tools (converter, calculator, notes, etc.) that helps users streamline their daily tasks, with powerful customization and AI-driven features for a personalized experience.
Target Audience: Students, professionals, and anyone needing quick and reliable tools for calculations, conversions, and note-taking.
Tech Stack:
Framework: Next.js (React)
Language: TypeScript
Styling: Tailwind CSS with shadcn/ui components
Backend & DB: Firebase (Authentication, Firestore, Realtime Database)
AI: Google's Genkit for features like AI translation and smart suggestions.
Primary Color: Light Sky Blue (#87CEEB)
Background Color: Off-white (#F5F5F5)
Accent Color: Electric Blue (#7DF9FF)
Font: Inter (sans-serif)
Layout: Clean, minimalist, and intuitive to guide user flow.
Icons: Minimalist icons (Lucide React) for clarity.
Theme: Supports Light, Dark, and a custom "Sutradhaar" theme. Premium users can create their own themes.
The main landing page after login, providing an overview and quick access to other modules.

Components:
Dashboard: Main layout component.
WelcomeHeader: Displays a greeting to the user.
QuickStats: Shows summary cards (e.g., notes created, calculations made).
RecentActivity: Lists recent notes or conversions.
FeatureGrid: Quick links to major features like Converter, Calculator, and Notes.
Functions:
fetchDashboardData(): Retrieves stats and recent activity from Firestore.
A powerful tool for converting between various units, with AI-powered input.

Components:
Converter: Main interface for conversion.
CategorySelector: Dropdown to select a unit category (e.g., Length, Mass).
UnitSelector: Dropdowns for 'from' and 'to' units.
CustomUnitManager (Premium): Interface to add/manage custom units.
Functions:
parseNaturalLanguageInput(input: string): (AI Flow) Interprets input like "15 kg to pounds".
getUnitCategories(): Fetches all available unit categories.
getUnitsForCategory(category: string): Returns units for the selected category.
performConversion(value: number, from: string, to: string): Calculates the conversion.
saveCustomUnit(unit: CustomUnit): (Premium) Saves a new user-defined unit to Firestore.
logConversionToHistory(conversionData): Saves the completed conversion to user's history.
A versatile calculator with standard and potentially scientific layouts.

Components:
Calculator: The main calculator interface.
Display: Shows the current input and result.
Keypad: Buttons for numbers, operators, and functions.
Functions:
evaluateExpression(expression: string): Safely evaluates the mathematical expression.
handleButtonPress(key: string): Appends numbers/operators to the expression or triggers an action.
clearDisplay(): Resets the calculator state.
logCalculationToHistory(calculationData): Saves the result to the user's history.
A feature-rich note-taking module with organization and rich text editing.

Components:
Notepad: Main view, displays a list of all notes.
NoteCard: A single note preview in the list.
NoteEditor (/notes/edit/[id]): The editor for creating/modifying notes.
NoteViewer (/notes/view/[id]): A read-only view for locked notes.
RichTextEditor: The core text editing component (integrates a library like React-Quill).
Functions:
listenToUserNotes(email, callback): Real-time listener for all user notes from Firestore.
updateUserNotes(email, notes): Writes the entire notes array back to Firestore (for create, update, delete).
createNote(noteData: Note): Creates a new note object.
updateNote(noteId, updatedData): Updates an existing note.
softDeleteNote(noteId): Sets the deletedAt timestamp on a note.
toggleLock(noteId): Toggles the isLocked status of a note.
exportNote(note: Note, format: 'png' | 'pdf' | 'txt'): (Premium) Exports the note content into the specified format.
A collection of utilities for time-based calculations.

Components:
TimeUtilities: Main component with tabs.
DateDiffCalculator: Calculates the duration between two dates.
Timer: A countdown timer.
Stopwatch: A stopwatch with lap functionality.
Functions:
calculateDateDifference(startDate, endDate): Returns the difference in days, months, etc.
startTimer(duration) / pauseTimer() / resetTimer().
startStopwatch() / pauseStopwatch() / recordLap() / resetStopwatch().
(Requires Auth) Displays a log of all user activities.

Components:
History: Main view that lists all logged activities.
HistoryItem: A card representing a single past activity.
Functions:
fetchHistory(userEmail): Gets all history items for a user from Firestore.
clearHistory(userEmail): Deletes all history items for a user.
(Coming Soon) An AI-powered text translation tool.

Components:
Translator: The UI with two text areas for input and output, and language selectors.
Functions:
translateText(text, sourceLang, targetLang): (AI Flow) Calls the Genkit translation flow.
detectLanguage(text): (AI Flow) Automatically detects the source language.
Handles user sign-up, login, and session management.

Pages: /welcome, /signup, /forgot-password, /logout.
Components:
SignupForm, LoginForm, ForgotPasswordForm.
Firebase Functions (/lib/firebase.ts):
signUpWithEmail(email, password)
signInWithEmail(email, password)
signInWithGoogle()
sendPasswordReset(email)
signOutUser()
onAuthStateChangedListener(callback): Listens for changes in auth state.
(Requires Auth) Allows users to view and manage their profile.

Components:
Profile: Displays user information.
ProfileEditForm: Form to update user details like name.
ProfilePhotoEditor: Component to upload and crop a profile picture.
Functions:
updateUserProfile(userEmail, data): Updates user data in Firestore.
uploadProfileImage(userEmail, file): Uploads an image to Firebase Storage and updates the user's profileImage URL.
(Requires Auth) Centralized location for app-wide settings.

Components:
Settings: Main settings page.
ThemeEditor (Premium): UI for customizing app colors.
LanguageSelector: Dropdown to change the app's language.
NotePasswordManager: Interface to set or change the note-locking password.
Functions:
updateUserSettings(userEmail, settingsData): Saves all user settings to Firestore.
saveTheme(userEmail, themeObject): (Premium) Saves a custom theme.
Handles access control for premium features.

Page: /premium - A sales page detailing premium benefits.
Components:
PremiumLockDialog: A modal that appears when a non-premium user tries to access a premium feature.
Functions:
isPremiumUser(userData): A utility function that checks the isPremium flag in the user's data.
(Future) initiateCheckout(): Would integrate with a payment provider like Stripe.
users/{userEmail}
interface UserData {
  fullName: string;
  email: string;
  profileImage?: string;
  createdAt: string; // ISO Date
  notePassword?: string; // Hashed or stored securely
  settings: {
    isPremium: boolean;
    theme: 'light' | 'dark' | 'sutradhaar' | string; // string for custom theme names
    language: 'en' | 'hi';
  };
  customThemes?: { [themeName: string]: ThemeObject };
  customUnits?: CustomUnit[];
}


users/{userEmail}/notes/all
// A single document containing an array of all notes
interface NotesDocument {
    notes: Note[];
}

interface Note {
  id: string; // uuidv4
  title: string;
  content: string; // HTML from Rich Text Editor
  category: string;
  isFavorite: boolean;
  isLocked: boolean;
  attachment: string | null; // "fileName|dataUrl"
  backgroundStyle: 'none' | 'lines' | 'dots' | 'grid';
  createdAt: string; // ISO Date
  updatedAt: string; // ISO Date
  deletedAt: string | null; // For soft deletes
}


users/{userEmail}/history/all
// A single document containing an array of all history items
interface HistoryDocument {
    items: HistoryItem[];
}

interface HistoryItem {
    id: string; // uuidv4
    type: 'conversion' | 'calculation';
    data: any; // The specific data for the event
    timestamp: string; // ISO Date
}