# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on localhost:3000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture Overview

This is a Next.js TypeScript school management frontend with a modular component architecture:

### Authentication System
- Uses React Context (`components/auth/AuthProvider.tsx`) for authentication state
- Token-based authentication with localStorage persistence
- `useAuth` hook provides `isAuthenticated`, `login()`, and `logout()` methods
- `ProtectedRoute` component wraps pages requiring authentication

### Component Structure
- **`components/auth/`** - Authentication context and protected route components
- **`components/layout/`** - Layout components (Navigation, Footer, Sidebar, Header, Layout)
- **`components/ui/`** - Reusable UI components (Card, Button, Login, Register)
- Index files in each directory export components for clean imports

### Page Structure
- **`pages/index.tsx`** - Login page (homepage)
- **`pages/register.tsx`** - User registration
- **`pages/dashboard.tsx`** - Main dashboard (protected)
- **`pages/dashboard/`** - Dashboard sub-pages (documents, tasks, settings) - all protected
- **`pages/about.tsx`** - About page

### App Configuration
- `pages/_app.tsx` wraps all pages with AuthProvider and loads Bootstrap + global CSS
- Bootstrap 5.3.8 for styling
- Custom monochromatic gray color scheme defined in CSS variables
- Poppins font family from Google Fonts

### Technology Stack
- Next.js 15.5.3 with TypeScript
- React 19.1.1
- Bootstrap 5.3.8 for UI components
- No additional state management (uses React Context for auth)

### Development Notes
- Uses Pages Router (not App Router)
- TypeScript strict mode disabled in tsconfig.json
- Authentication is simulated (demo token) - replace with real API calls
- All dashboard routes require authentication via ProtectedRoute wrapper