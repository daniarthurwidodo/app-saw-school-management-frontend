# Qwen Code - Project Setup Documentation

## Project: Next.js Dashboard with TanStack

This document outlines the setup and configuration of a Next.js dashboard application with TanStack Table and TanStack Query integration.

## Technologies Implemented

1. **Next.js** - React framework for production-ready applications
2. **TypeScript** - Typed superset of JavaScript for enhanced code quality
3. **TanStack Table** - Headless UI for building powerful tables & datagrids
4. **TanStack Query** - Powerful asynchronous state management for React
5. **Tailwind CSS** - Utility-first CSS framework for rapid UI development
6. **React Trello** - Kanban board component for task management

## Project Structure

```
.
├── components/           # Reusable UI components
│   ├── Sidebar.tsx       # Navigation sidebar
│   ├── DashboardLayout.tsx # Dashboard layout with sidebar
│   ├── Header.tsx        # Page header
│   └── TanstackExample.tsx # TanStack Table and Query example
├── pages/                # Next.js pages
│   ├── dashboard/        # Dashboard pages with sidebar navigation
│   │   ├── index.tsx     # Dashboard home page
│   │   ├── users.tsx     # Students management page
│   │   ├── documents.tsx # Classes management page
│   │   ├── tasks.tsx     # Assignments management page
│   │   ├── kanban.tsx    # Kanban board page
│   │   └── settings.tsx  # Settings page
│   ├── _app.tsx          # Custom App component with TanStack provider
│   └── index.tsx         # Login page (homepage)
├── providers/            # React context providers
│   └── TanstackProvider.tsx # TanStack Query provider
├── styles/               # Custom CSS styles
│   └── globals.css       # Global styling
├── package.json          # Project dependencies and scripts
└── README.md             # Project documentation
```

## Setup Process

### 1. Dependencies Installation

Installed core dependencies:
- `next`, `react`, `react-dom` - Core framework
- `typescript`, `@types/react`, `@types/node`, `@types/react-dom` - TypeScript support
- `@tanstack/react-table` - Table library
- `@tanstack/react-query` - Data fetching library
- `@tanstack/react-query-devtools` - Development tools for React Query
- `react-trello` - Kanban board component

### 2. Scripts Configuration

Added development scripts to package.json:
- `dev` - Run development server
- `build` - Create production build
- `start` - Start production server
- `lint` - Run Next.js linter

### 3. Application Configuration

Created custom `_app.tsx` to:
- Add global custom CSS
- Implement TanStack Query provider
- Set up application layout

### 4. Page Creation

Developed dashboard pages:
- Dashboard index with statistics cards
- Students management page
- Classes management page
- Assignments management page
- Kanban board page
- Settings page
- Login page with redirect to dashboard

### 5. Component Architecture

Implemented reusable components:
- Sidebar navigation component with school-specific navigation
- DashboardLayout component for consistent page structure
- Header component
- TanStack Table and Query example component
- Custom providers for state management

### 6. Styling

Implemented Tailwind CSS for styling:
- Clean, professional color scheme using Tailwind's color palette
- Responsive grid system with Tailwind's flexbox and grid utilities
- Component styling using Tailwind's utility classes
- Mobile-first approach with responsive breakpoints
- Modern UI with gradients, shadows, and hover effects

## Key Features

- Responsive dashboard layout with sidebar navigation
- TanStack Table integration for data presentation
- TanStack Query integration for data fetching and state management
- Kanban board for task management
- Clean project structure following Next.js conventions
- Mobile-responsive design
- Multiple dashboard pages with consistent navigation
- School management focused UI and content

## Development Commands

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

> Note: The `npm run dev` command is not to be used per user request.

## Recent Enhancements

### Dashboard UI
- Created dashboard layout with sidebar navigation
- Added statistics cards
- Implemented consistent styling across all pages
- Improved visual design and consistency
- Enhanced sidebar with school-specific navigation items
- Modernized UI with gradients, shadows, and hover effects

### TanStack Integration
- Added TanStack Table for data presentation
- Added TanStack Query for data fetching and state management
- Created example component demonstrating both libraries
- Implemented proper provider setup in _app.tsx

### UI Components
- Created Sidebar component with navigation links
- Enhanced Header component
- Consistent styling across all pages
- Created DashboardLayout component for consistent sidebar implementation
- Updated all dashboard pages with school management focused content

### Kanban Board
- Added Kanban board page for task management
- Implemented react-trello component with dynamic import
- Created sample data for assignment tracking
- Added event handlers for card movements

### Styling Improvements
- Added custom animations and transitions
- Enhanced mobile responsiveness
- Improved color scheme consistency
- Better typography and spacing
- Modern UI with gradients, shadows, and hover effects

## Next Steps

1. Add real API integration with TanStack Query
2. Implement more complex TanStack Table features
3. Add form validation with libraries like Formik or React Hook Form
4. Enhance UI/UX with additional interactive components
5. Implement unit and integration testing
6. Add internationalization support
7. Implement offline functionality with service workers
8. Add analytics and monitoring