# Codebase Overview

## Application Flow
This section provides a high-level overview of the application flow, allowing you to quickly understand how the app works without reading every file.

1. **Welcome Screen** (`src/app/index.tsx`): The entry point of the application. Displays a welcome message and automatically redirects to the Login screen after a brief delay.
2. **Login Screen** (`src/app/login.tsx`): Authenticates the Female Community Health Volunteer (FCHV). Upon successful login, navigates the user to the Main Dashboard.
3. **Main Dashboard** (`src/app/dashboard/`): The core navigation hub of the application. Provides access to various modules like:
   - Maternal Health Tracking (Pregnancy, counseling, delivery)
   - Child Monitoring
   - Family Planning and Medical Guidance
   - Monthly Service Reporting
4. **Data Synchronization** (`src/api/services/sync/`): The application primarily works offline using a local SQLite database. The sync module periodically pushes new records (e.g., pregnancy registrations) to the server and fetches updates.
5. **Database Models** (`src/hooks/database/`): Local SQLite operations for fast and reliable data access, powering the dashboard and forms.

## Tech Stack
- **Framework**: React Native with Expo (Expo Router for navigation)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Local Database**: SQLite (`expo-sqlite`)
- **API & Networking**: Axios
- **Internationalization**: `react-i18next` (English & Nepali support)
- **Icons**: Lucide React Native

## Project Directory Structure

```text
c:\projects\fchv-native\
├── src/
│   ├── api/                # API clients, syncing logic, and server requests
│   ├── app/                # Expo Router pages (Screens: login, dashboard, forms)
│   ├── assets/             # Images, icons, and fonts
│   │   └── i18n/           # Translation JSON files (en.json, np.json)
│   ├── components/         # Reusable UI components (Buttons, Inputs, Cards)
│   ├── constants/          # Global constants, colors, theme tokens
│   ├── context/            # React Context providers (Language, Auth, etc.)
│   ├── hooks/
│   │   └── database/       # SQLite database initialization, models, and migrations
│   └── utils/              # Helper functions, formatting, storage utils
├── app.json                # Expo configuration file
├── tailwind.config.js      # Tailwind CSS configuration
└── package.json            # Project dependencies and scripts
```

## Core Modules & Features

### 1. Offline-First Architecture
Because FCHVs operate in areas with poor internet connectivity, this app stores all data locally using `expo-sqlite`. 
- **Location**: `src/hooks/database/`
- All reads and writes happen instantly on the local device.
- A background/manual sync mechanism (`src/api/services/sync/`) checks for network connectivity and synchronizes the local SQLite database with the remote backend.

### 2. Internationalization (i18n)
The app supports dual languages (English and Nepali). 
- **Location**: `src/assets/i18n/`
- Text is dynamically loaded based on user preference, making it accessible for local health workers.

### 3. Reporting & Analytics
The application aggregates data across multiple tables (Mother, Pregnancy, Child) to generate monthly service reports for the health workers.
- Records are categorized by Nepali (Bikram Sambat - BS) months using date-conversion utilities.

### 4. Forms and Registration
The app features dynamic, multi-step forms for registering new pregnancies, children, and maternal outcomes. These forms heavily rely on localized components (e.g., Nepali Date Pickers) to ensure data accuracy.
