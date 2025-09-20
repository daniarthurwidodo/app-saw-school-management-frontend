# Qwen Code - Project Setup Documentation

## Project: School Management System Frontend

This document outlines the setup and configuration of the School Management System frontend, implemented with Next.js, TypeScript, Bootstrap, and CSS.

## Technologies Implemented

1. **Next.js** - React framework for production-ready applications
2. **TypeScript** - Typed superset of JavaScript for enhanced code quality
3. **Bootstrap** - CSS framework for responsive UI components
4. **CSS** - Custom styling for project-specific design needs
5. **Lucide React** - Icon library for consistent UI icons
6. **@dnd-kit** - Drag and drop library for interactive components

## Project Structure

```
.
├── components/           # Reusable UI components
│   ├── auth/             # Authentication components and context
│   ├── layout/           # Layout components (Navigation, Footer, Sidebar, etc.)
│   └── ui/               # UI components (Card, Button, Login, Register, etc.)
├── pages/                # Next.js pages
│   ├── dashboard/        # Dashboard pages with sidebar navigation
│   ├── _app.tsx          # Custom App component
│   ├── index.tsx         # Login page (homepage)
│   ├── about.tsx         # About page
│   └── register.tsx      # Registration page
├── styles/               # Custom CSS styles
│   └── globals.css       # Global styling
├── public/               # Static assets
│   └── data/             # JSON data files
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```

## Setup Process

### 1. Dependencies Installation

Installed core dependencies:
- `next`, `react`, `react-dom` - Core framework
- `typescript`, `@types/react`, `@types/node`, `@types/react-dom` - TypeScript support
- `bootstrap` - CSS framework
- `lucide-react` - Icon library
- `@dnd-kit/core`, `@dnd-kit/sortable` - Drag and drop functionality

### 2. Scripts Configuration

Added development scripts to package.json:
- `dev` - Run development server
- `build` - Create production build
- `start` - Start production server
- `lint` - Run Next.js linter

### 3. Application Configuration

Created custom `_app.tsx` to:
- Import Bootstrap CSS
- Add global custom CSS
- Implement layout components
- Set up authentication context

### 4. Page Creation

Developed dashboard pages:
- Dashboard index with statistics and activity feed
- User management with search, filter, and pagination
- Document management with search, filter, and pagination
- Task management with Kanban board and drag-and-drop
- Settings page with configuration options
- Login and registration pages
- About page with project information

### 5. Component Architecture

Implemented reusable components:
- Authentication components (AuthProvider, ProtectedRoute)
- Layout components (Sidebar, Navigation, Footer)
- UI components (Card, Button, Login, Register, Loading)
- Custom hooks and utilities

### 6. Styling

Implemented comprehensive CSS:
- Professional monochromatic color scheme
- Responsive grid system
- Custom component styling
- Animation and transition effects
- Mobile-first approach

## Key Features

- Responsive design using Bootstrap grid system
- Custom component architecture with TypeScript interfaces
- TypeScript type safety throughout the application
- Modern UI with hover effects and animations
- Clean project structure following Next.js conventions
- User authentication and protected routes
- Data management with JSON files (simulating API)
- Interactive drag-and-drop task management
- Comprehensive search, filter, and pagination
- Loading states and error handling

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Open Cypress test runner
npm run cypress:open

# Run tests in headless mode
npm run cypress:run

# Run tests as part of the test script
npm test
```

## Testing

### Cypress End-to-End Tests

This project includes comprehensive end-to-end tests using Cypress. The tests cover all major functionality including authentication, dashboard features, user management, document management, task management, and settings.

Test files are organized by feature area:
- Login and authentication
- Dashboard with statistics and activity feed
- User management with search, filter, and pagination
- Document management with search, filter, and pagination
- Task management with Kanban board and drag-and-drop
- Settings configuration

### Custom Cypress Commands

The project includes custom Cypress commands for common operations:
- `cy.login()` - Authenticates a user
- `cy.logout()` - Logs out the current user

## Recent Enhancements

### Dashboard UI
- Enhanced dashboard with statistics cards
- Recent activity feed
- Upcoming events section
- Quick actions panel
- Improved visual design and consistency

### User Management
- Data table with search and filtering
- Pagination controls
- Role and status filtering
- Responsive design for all screen sizes

### Document Management
- Data table with search and filtering
- Category, type, and status filtering
- Pagination controls
- Tag display for documents

### Task Management
- Kanban board with three columns
- Drag-and-drop functionality
- Task and subtask support
- Priority and status indicators
- Progress tracking

### Settings Page
- Card-free layout with custom styling
- Hover effects and animations
- Consistent icon usage
- Responsive grid layout

### UI Components
- Added Loading component for consistent loading states
- Enhanced Card component with better header styling
- Improved Button component with size variants
- Consistent styling across all pages

### Styling Improvements
- Removed duplicate CSS styles
- Added custom animations and transitions
- Enhanced mobile responsiveness
- Improved color scheme consistency
- Better typography and spacing

## API Mocking with MirageJS

For development and testing, the project uses MirageJS to mock API endpoints. This provides:

- Realistic mock data generation using Faker.js
- Seamless development experience without backend dependencies
- Easy testing of edge cases and error conditions
- Consistent data for automated tests
- Full CRUD operations for all entities

### Features
- Models for users, documents, tasks, and subtasks
- Factories for generating realistic mock data
- Seeded data from existing JSON files
- Authentication endpoints
- Dashboard statistics endpoints
- Pagination and filtering support
- JSDoc annotations for all endpoints
- OpenAPI 3.0 specification

### Development Workflow
MirageJS is automatically enabled in development mode (`npm run dev`) and disabled in production. Components automatically use MirageJS endpoints in development and fall back to static JSON files in production.

### API Documentation
The API is fully documented with:
- JSDoc annotations in the MirageJS server code
- Complete OpenAPI 3.0 specification in `openapi.yaml`
- Detailed schema definitions for all entities
- Endpoint descriptions, parameters, and return values
- See [`docs/API.md`](docs/API.md) for more information

## Next Steps

1. Implement additional pages for student, teacher, and parent portals
2. Add state management solution (e.g., Redux or Context API)
3. Integrate with backend API
4. Implement authentication system with real backend
5. Add form validation with libraries like Formik or React Hook Form
6. Enhance UI/UX with additional interactive components
7. Implement unit and integration testing
8. Add internationalization support
9. Implement offline functionality with service workers
10. Add analytics and monitoring