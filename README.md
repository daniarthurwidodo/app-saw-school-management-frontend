# School Management System - Frontend

A modern school management system built with Next.js, TypeScript, and Bootstrap.

## Features

- Student management
- Teacher portal
- Parent access
- Attendance tracking
- Grade management
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
- **UI Components**: Reusable presentational components (Card, Button, Login, Register)
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
3. **Documents (/dashboard/documents)** - Document management (protected)
4. **Tasks (/dashboard/tasks)** - Task management (protected)
5. **Settings (/dashboard/settings)** - System settings (protected)
6. **Register (/register)** - User registration page
7. **About (/about)** - About the application

## Color Scheme

The application implements a professional monochromatic deep gray color scheme using CSS variables:

- 10 shades of gray from light (gray-50) to dark (gray-900)
- Primary color based on gray-700 with hover states
- Custom background and text colors for improved readability
- Consistent styling across all Bootstrap components

To customize the color scheme, modify the CSS variables in `styles/globals.css`.

## Typography

The application uses the Poppins font family from Google Fonts, which provides excellent readability and a modern appearance. The font is loaded via CDN in `styles/globals.css`.

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Bootstrap Documentation](https://getbootstrap.com/docs)

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.