# ProductivityFlow - Personal Productivity Management App

## Overview

ProductivityFlow is a modern web application designed to help users manage their daily productivity through tasks, habits, and challenges. The application provides an integrated approach to personal productivity management with features for task tracking, habit building, challenge participation, and achievement earning. Built with a React frontend and Express backend, it offers a responsive, user-friendly interface with real-time updates and comprehensive productivity analytics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Routing**: Wouter for lightweight client-side routing without the complexity of React Router
- **State Management**: TanStack Query (React Query) for server state management, caching, and synchronization
- **UI Framework**: Shadcn/ui components built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for REST API endpoints
- **Language**: TypeScript for full-stack type safety
- **API Design**: RESTful architecture with CRUD operations for tasks, habits, challenges, and achievements
- **Data Storage**: In-memory storage with plans for database integration using Drizzle ORM
- **Request Handling**: Express middleware for JSON parsing, URL encoding, and error handling

### Data Layer
- **ORM**: Drizzle ORM configured for PostgreSQL with type-safe schema definitions
- **Schema Management**: Shared TypeScript schemas between frontend and backend using Zod for validation
- **Database**: PostgreSQL (configured but not yet implemented, currently using in-memory storage)
- **Validation**: Zod schemas for runtime validation and type inference

### Component Architecture
- **Design System**: Consistent component library using Radix UI primitives
- **Form Handling**: React Hook Form with Zod resolver for validation
- **Responsive Design**: Mobile-first approach with dedicated mobile navigation
- **Theme System**: CSS custom properties for light/dark mode support

### Key Features
- **Task Management**: Create, update, delete, and categorize tasks with priorities and due dates
- **Habit Tracking**: Build and track daily habits with streak counting and progress visualization
- **Challenge System**: Participate in productivity challenges with progress tracking and badges
- **Achievement System**: Earn achievements and badges for reaching productivity milestones
- **Dashboard Analytics**: Overview of productivity metrics and progress summaries

## External Dependencies

### Core Runtime Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless driver for database connectivity
- **drizzle-orm**: Type-safe ORM for database operations and schema management
- **drizzle-zod**: Integration between Drizzle schemas and Zod validation

### Frontend Libraries
- **@tanstack/react-query**: Server state management, caching, and data synchronization
- **@hookform/resolvers**: Form validation integration with React Hook Form
- **wouter**: Lightweight routing library for React applications
- **@radix-ui/react-***: Comprehensive set of accessible UI primitives
- **class-variance-authority**: Utility for creating component variants with Tailwind
- **tailwind-merge**: Utility for merging Tailwind CSS classes

### Development Tools
- **vite**: Build tool and development server with hot reload
- **typescript**: Static type checking for JavaScript
- **tailwindcss**: Utility-first CSS framework for styling
- **postcss**: CSS processing and transformation

### UI and UX Enhancements
- **embla-carousel-react**: Carousel component for image and content sliders
- **date-fns**: Date manipulation and formatting utilities
- **lucide-react**: Icon library with React components

### Backend Infrastructure
- **express**: Web application framework for Node.js
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **tsx**: TypeScript execution environment for development

The application is structured as a monorepo with shared schemas and types between frontend and backend, ensuring consistency and type safety across the entire stack. The architecture supports both development and production environments with appropriate tooling and build processes.
