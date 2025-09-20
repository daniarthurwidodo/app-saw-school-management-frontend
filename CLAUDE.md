# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on localhost:3000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture Overview

This is a Next.js TypeScript dashboard application with TanStack integration:

### State Management
- Uses TanStack Query (`@tanstack/react-query`) for server state management
- Uses React Context for client state management
- `providers/TanstackProvider.tsx` wraps all pages with QueryClientProvider

### Component Structure
- **`components/`** - Reusable UI components
  - `Sidebar.tsx` - Navigation sidebar
  - `Header.tsx` - Page headers
  - `TanstackExample.tsx` - TanStack Table and Query example
- **`providers/`** - React context providers
  - `TanstackProvider.tsx` - TanStack Query provider

### Page Structure
- **`pages/index.tsx`** - Login page (homepage) with redirect to dashboard
- **`pages/dashboard/index.tsx`** - Main dashboard (protected)
- **`pages/dashboard/`** - Dashboard sub-pages (users, documents, tasks, settings)

### App Configuration
- `pages/_app.tsx` wraps all pages with TanstackProvider and loads global CSS
- Custom CSS for styling
- Clean, professional design

### Technology Stack
- Next.js 15.5.3 with TypeScript
- React 19.1.1
- TanStack Query for data fetching
- TanStack Table for data presentation

### Development Notes
- Uses Pages Router (not App Router)
- TypeScript strict mode disabled in tsconfig.json
- All dashboard routes are accessible through sidebar navigation
- TanStack Query Devtools available in development mode