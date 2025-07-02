# PaySafe - SMS Scam Detection Platform

## Overview

PaySafe is a React-based web application designed to help users in the Philippines detect and avoid SMS scams through AI-powered message analysis. The application provides a modern, glassmorphic UI for users to analyze suspicious text messages and learn about common scam patterns.

## System Architecture

The application follows a modern full-stack architecture with clear separation between client and server:

- **Frontend**: React with TypeScript, using Vite as the build tool
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Styling**: Tailwind CSS with shadcn/ui components for consistent design
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing

## Key Components

### Frontend Architecture
- **React + TypeScript**: Provides type safety and modern development experience
- **Vite**: Fast build tool with hot module replacement for efficient development
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **shadcn/ui**: Pre-built, accessible component library based on Radix UI
- **TanStack Query**: Handles API calls, caching, and server state synchronization
- **Wouter**: Lightweight routing solution for single-page application navigation

### Backend Architecture
- **Express.js**: Minimalist web framework for API endpoints
- **TypeScript**: Type safety across the entire backend codebase
- **Drizzle ORM**: Type-safe database toolkit with migrations support
- **Memory Storage**: In-memory storage implementation for development (easily replaceable with database)

### UI Design System
- **Glassmorphic Design**: Modern glass-effect cards with backdrop blur
- **Custom Color Palette**: Blue-themed gradient system with PaySafe branding
- **Responsive Layout**: Mobile-first design with breakpoint-based adaptations
- **Accessibility**: Built on Radix UI primitives ensuring WCAG compliance

### Database Schema
- **Users Table**: Basic user authentication with username, password, and timestamps
- **Scan Results Table**: Stores message scans with platform, scam detection results, probability scores, and analysis reasons
- **Drizzle Configuration**: PostgreSQL dialect with array support for storing analysis reasons
- **Type-Safe Operations**: Generated TypeScript types from database schema with proper relations

## Data Flow

1. **Client Requests**: Frontend makes API calls using TanStack Query
2. **API Layer**: Express routes handle HTTP requests with middleware logging
3. **Storage Layer**: Abstracted storage interface allows switching between memory and database
4. **Database Operations**: Drizzle ORM provides type-safe database interactions
5. **Response Handling**: Structured error handling with consistent API responses

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/react-***: Accessible UI primitives
- **class-variance-authority**: Type-safe CSS class variants
- **zod**: Runtime type validation

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Static type checking
- **Tailwind CSS**: Utility-first styling
- **ESBuild**: Fast JavaScript bundler for production

## Deployment Strategy

The application is configured for deployment with the following approach:

1. **Development**: 
   - Vite dev server serves the frontend
   - Express server handles API requests
   - Hot module replacement for rapid development

2. **Production Build**:
   - Vite builds the frontend to `dist/public`
   - ESBuild bundles the server to `dist/index.js`
   - Static files served from the build directory

3. **Database Setup**:
   - Drizzle migrations handle schema changes
   - Environment variable `DATABASE_URL` configures connection
   - Supports both development and production PostgreSQL instances

4. **Environment Configuration**:
   - Development: Uses tsx for TypeScript execution
   - Production: Compiled JavaScript with Node.js runtime
   - Environment-specific configurations through NODE_ENV

The architecture supports easy scaling and deployment to various platforms including Vercel, Railway, or traditional VPS hosting.

## Changelog

- July 02, 2025: Initial setup with homepage and scan page
- July 02, 2025: Added PostgreSQL database with scan results storage

## User Preferences

Preferred communication style: Simple, everyday language.