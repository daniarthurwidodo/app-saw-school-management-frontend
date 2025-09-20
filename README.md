# Next.js Dashboard Application with TanStack

This is a Next.js application featuring a dashboard with sidebar navigation and integration with TanStack Table and TanStack Query.

## Features

- Dashboard layout with sidebar navigation
- TanStack Table for data presentation
- TanStack Query for data fetching and state management
- Responsive design
- Multiple dashboard pages (Home, Users, Documents, Tasks, Settings)

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the login page. Click "Go to Dashboard" to access the dashboard.

## Project Structure

```
.
├── components/           # Reusable UI components
│   ├── Sidebar.tsx       # Navigation sidebar
│   ├── Header.tsx        # Page header
│   └── TanstackExample.tsx # TanStack Table and Query example
├── pages/                # Next.js pages
│   ├── dashboard/        # Dashboard pages with sidebar navigation
│   │   ├── index.tsx     # Dashboard home page
│   │   ├── users.tsx     # Users management page
│   │   ├── documents.tsx # Documents management page
│   │   ├── tasks.tsx     # Task management page
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

## Dependencies

- Next.js 15.5.3
- React 19.1.1
- TypeScript 5.9.2
- @tanstack/react-table
- @tanstack/react-query
- @tanstack/react-query-devtools

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

# Run linter
npm run lint
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!