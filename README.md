# School Management System - Frontend

A modern school management system built with Next.js, TypeScript, and Bootstrap.

## Features

- Student management
- Teacher portal
- Parent access
- Attendance tracking
- Grade management
- Document management with search, filter, and pagination
- Task management with Kanban board
- User management with search, filter, and pagination
- Settings configuration
- Dashboard with statistics and activity feed
- Monochromatic deep gray color scheme
- Poppins font for improved readability
- Modular component architecture
- Mobile-responsive design
- User authentication (login/logout)
- Sidebar navigation in dashboard
- Protected routes

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework for production
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Bootstrap](https://getbootstrap.com/) - CSS framework
- [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) - Custom styling
- [Lucide React](https://lucide.dev/) - Icon library
- [@dnd-kit](https://docs.dndkit.com/) - Drag and drop library

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd app-saw-school-management-frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Development

To start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

To build the application for production:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Project Structure

```
.
├── components/           # React components
│   ├── auth/             # Authentication components and context
│   ├── layout/           # Layout components (Navigation, Footer, Sidebar, etc.)
│   └── ui/               # UI components (Card, Button, Login, Register, etc.)
├── pages/                # Next.js pages
│   ├── dashboard/        # Dashboard pages with sidebar navigation
│   ├── _app.tsx          # Custom App component
│   ├── index.tsx         # Login page (homepage)
│   ├── about.tsx         # About page
│   └── register.tsx      # Registration page
├── styles/               # CSS styles
├── public/               # Static assets
│   └── data/             # JSON data files
├── package.json          # Project dependencies and scripts
└── README.md             # Project documentation
```

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the application for production
- `npm run start` - Starts the production server
- `npm run lint` - Runs the linter

## Customization

1. **Styling**: Modify `styles/globals.css` for global styles
2. **Color Scheme**: The application uses a monochromatic deep gray color scheme defined in CSS variables
3. **Typography**: The application uses the Poppins font family
4. **Components**: Add reusable components in the `components/` directory
5. **Pages**: Add new pages in the `pages/` directory

## Modular Architecture

The application follows a modular architecture with:

- **Auth Components**: Authentication context and protected route components
- **Layout Components**: Reusable components for page structure (Navigation, Footer, Sidebar, Layout)
- **UI Components**: Reusable presentational components (Card, Button, Login, Register, Loading)
- **Pages**: Individual pages that compose components to create views

This structure makes it easy to maintain and extend the application.

## Mobile Responsiveness

The application is fully responsive and optimized for mobile devices:

- Mobile-first CSS approach
- Flexible grid system
- Responsive typography
- Touch-friendly navigation
- Optimized spacing for all screen sizes

## Authentication

The application includes a complete authentication system:

- Login page as the homepage
- Registration page with form validation
- Logout functionality via sidebar
- Protected routes for dashboard pages
- Authentication context for state management
- Token-based authentication simulation

## Navigation Flow

1. **Homepage (/)** - Login page
2. **Dashboard (/dashboard)** - Main application dashboard with sidebar (protected)
3. **Users (/dashboard/users)** - User management with search, filter, and pagination (protected)
4. **Documents (/dashboard/documents)** - Document management with search, filter, and pagination (protected)
5. **Tasks (/dashboard/tasks)** - Task management with Kanban board and drag-and-drop (protected)
6. **Settings (/dashboard/settings)** - System settings (protected)
7. **Register (/register)** - User registration page
8. **About (/about)** - About the application

## Dashboard Features

The dashboard includes:

- Statistics cards showing key metrics
- Recent activity feed
- Upcoming events
- Quick action buttons
- Responsive layout for all screen sizes

## User Management

The user management page includes:

- Search functionality
- Role and status filtering
- Pagination
- Data table view
- Action buttons for each user

## Document Management

The document management page includes:

- Search functionality
- Category, type, and status filtering
- Pagination
- Data table view
- Action buttons for each document

## Task Management

The task management page includes:

- Kanban board with three columns (To Do, In Progress, Done)
- Drag-and-drop functionality using @dnd-kit
- Task and subtask support
- Priority and status indicators
- Progress tracking
- Filtering and search capabilities

## Settings Page

The settings page includes:

- Profile settings
- Security configuration
- Notification preferences
- Data management
- System preferences

## Color Scheme

The application implements a professional monochromatic deep gray color scheme using CSS variables:

- 10 shades of gray from light (gray-50) to dark (gray-900)
- Primary color based on gray-700 with hover states
- Custom background and text colors for improved readability
- Consistent styling across all Bootstrap components

To customize the color scheme, modify the CSS variables in `styles/globals.css`.

## Typography

The application uses the Poppins font family from Google Fonts, which provides excellent readability and a modern appearance. The font is loaded via CDN in `styles/globals.css`.

## Development Tools

### Debugging Features

The application includes comprehensive debugging tools to help with development:

1. **Debug Panel** - A draggable panel that displays real-time application state
2. **Debug Context** - Centralized debugging information management
3. **Debug Toggle** - Easy enable/disable of debugging features
4. **Debug Hooks** - Custom hooks for tracking renders, state changes, and performance

To enable debugging:
- Click the "Enable Debug" button in the bottom-right corner during development
- The debug panel can be dragged to any position on the screen
- Debug information is automatically collected from various components

### Debug Information Collected

- Component render counts
- State changes
- Function calls
- Performance metrics
- API responses
- Filter and search operations
- User interactions
- Authentication status

### Custom Debug Hooks

- `useRenderCount` - Tracks how many times a component renders
- `useDebugState` - Monitors state changes
- `useDebugFunction` - Logs function calls with arguments
- `useDebugPerformance` - Measures component mount time

## Data Management

The application uses JSON files for data storage:

- `public/data/users.json` - User data
- `public/data/documents.json` - Document data
- `public/data/tasks.json` - Task data

In a production environment, these would be replaced with API calls to a backend service.

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Bootstrap Documentation](https://getbootstrap.com/docs)
- [dnd-kit Documentation](https://docs.dndkit.com/)

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

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

## API Mocking with MirageJS

This project uses MirageJS for API mocking during development. MirageJS intercepts HTTP requests and provides realistic mock data, allowing you to develop and test features without a backend.

### Features

- Realistic mock data generation
- API endpoint simulation
- Development environment only (disabled in production)
- Seamless integration with existing code
- Easy to extend with new endpoints

### How It Works

MirageJS is automatically initialized when running in development mode (`npm run dev`). It intercepts all HTTP requests to `/api/*` endpoints and responds with mock data.

The mock server is configured in `mirage/server.ts` and includes:

- Models for users, documents, tasks, and subtasks
- Factories for generating realistic mock data
- Seeded data from existing JSON files
- Full CRUD operations for all entities
- Authentication endpoints
- Dashboard statistics endpoints

### API Documentation

Comprehensive API documentation is available in two formats:

1. **JSDoc Annotations** - Inline documentation in the MirageJS server code (`mirage/server.ts`)
2. **OpenAPI Specification** - Standalone OpenAPI 3.0 YAML file (`openapi.yaml`)

See [`docs/API.md`](docs/API.md) for detailed information on how to use and extend the API documentation.

### Validating the OpenAPI Specification

To validate the OpenAPI specification:

```bash
npm run validate:openapi
```

### Extending MirageJS

To add new endpoints or modify existing ones:

1. Edit `mirage/server.ts`
2. Add new models in the `models` section
3. Add new factories in the `factories` section
4. Add new routes in the `routes()` method
5. Document endpoints with JSDoc annotations
6. Update `openapi.yaml` with new endpoints and schemas
7. Restart the development server

### Using in Components

Components automatically use MirageJS in development and fall back to static JSON files in production. No code changes are needed in your components.

Test files are located in the `cypress/e2e` directory with the following structure:

```
cypress/
├── e2e/
│   ├── login.cy.ts          # Login page tests
│   ├── dashboard.cy.ts      # Dashboard tests
│   ├── users.cy.ts          # User management tests
│   ├── documents.cy.ts      # Document management tests
│   ├── tasks.cy.ts          # Task management tests
│   └── settings.cy.ts       # Settings page tests
├── fixtures/                # Test data fixtures
├── support/                 # Custom commands and configuration
└── tsconfig.json           # TypeScript configuration for Cypress
```

### Writing Tests

To create new tests:

1. Add a new file in `cypress/e2e/` with the `.cy.ts` extension
2. Use the `cy.login()` custom command to authenticate before tests
3. Write tests using Cypress best practices
4. Run tests using `npm run cypress:open` or `npm test`