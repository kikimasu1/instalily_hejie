# PartSelect AI Chat Agent

## Overview

This is a modern, full-stack chat application built for PartSelect's e-commerce platform, focused on helping customers find refrigerator and dishwasher parts. The application features a React frontend with a real-time chat interface and an Express.js backend with AI integration using the Deepseek language model.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for type safety
- **Vite** as the build tool for fast development and optimized production builds
- **shadcn/ui** component library built on Radix UI primitives for accessible, customizable components
- **Tailwind CSS** for styling with a custom PartSelect color scheme (blue/white branding)
- **TanStack Query** for efficient data fetching, caching, and state management
- **Wouter** for client-side routing (lightweight React Router alternative)

### Backend Architecture
- **Express.js** server with TypeScript
- **WebSocket** integration for real-time chat functionality
- **In-memory storage** with a well-defined interface that can be easily swapped for a database
- **Deepseek AI** integration for natural language processing and chat responses
- **RESTful API** endpoints for chat, cart, and product operations

## Key Components

### Chat System
- **Real-time messaging** via WebSockets with typing indicators
- **Message history** persistence across sessions
- **Product cards** that display inline within chat messages
- **File upload capability** for sharing appliance photos
- **Quick action buttons** for common queries

### E-commerce Integration
- **Shopping cart** functionality integrated into the chat experience
- **Product search** and compatibility checking
- **Part identification** through natural language queries
- **Installation guides** and troubleshooting support

### UI/UX Features
- **Mobile-responsive** design with adaptive layouts
- **Sidebar cart** that shows selected items with quantities and totals
- **PartSelect branding** with custom color scheme and professional styling
- **Accessibility** features through Radix UI components

## Data Flow

1. **User Interaction**: User sends message through chat interface
2. **WebSocket Communication**: Real-time message transmission to server
3. **AI Processing**: Deepseek AI processes user intent and generates responses
4. **Product Search**: Integration with product database for part recommendations
5. **Response Generation**: AI response with optional product cards sent back to client
6. **Cart Management**: Add-to-cart functionality updates session-based cart state
7. **State Management**: TanStack Query manages client-side data synchronization

## External Dependencies

### AI Integration
- **Deepseek API** for natural language processing and chat responses
- Custom prompt engineering for PartSelect domain expertise
- Context-aware conversations with message history

### UI Libraries
- **Radix UI** primitives for accessible component foundations
- **Lucide React** for consistent iconography
- **class-variance-authority** for component variant management
- **date-fns** for date formatting and manipulation

### Development Tools
- **Drizzle ORM** configured for PostgreSQL (ready for database integration)
- **Neon Database** serverless PostgreSQL setup
- **ESBuild** for efficient server-side bundling
- **PostCSS** with Autoprefixer for CSS processing

## Deployment Strategy

### Development
- **Hot Module Replacement** via Vite for fast development iteration
- **TypeScript** compilation checking across frontend, backend, and shared code
- **Replit integration** with specialized plugins for development environment

### Production Build
- **Vite build** for optimized frontend assets
- **ESBuild** for server-side code bundling
- **Static asset serving** with proper caching headers
- **Environment variable** configuration for API keys and database connections

### Database Strategy
- **Drizzle ORM** with PostgreSQL dialect configured
- **Migration system** ready for schema changes
- **In-memory storage** as development/demo fallback
- **Neon Database** serverless PostgreSQL for production

The application is designed to be easily deployable with minimal configuration changes, supporting both development and production environments with appropriate build optimizations and database connections.

## Latest Feature: Advanced Analytics System

### Analytics Components
- **AnalyticsService**: Comprehensive tracking of conversation metrics, user behavior, and system performance
- **Analytics Dashboard**: Full-featured dashboard at `/analytics` with tabbed interface showing:
  - System Overview: Sessions, messages, response times, user satisfaction
  - Conversation Analytics: Session-specific metrics and intent tracking
  - Behavioral Insights: User engagement levels and device distribution
- **Analytics Widget**: Mini analytics display integrated into chat interface
- **Real-time Tracking**: Live data collection with WebSocket integration

### Key Metrics Tracked
- **Conversation Metrics**: Message counts, duration, intent classification, product recommendations
- **Performance Data**: AI response times, error rates, system availability
- **User Behavior**: Device types, engagement levels, search patterns, bounce rates
- **Intent Analysis**: Automatic categorization of user queries (installation, compatibility, troubleshooting, etc.)

### Technical Implementation
- Analytics service with in-memory storage and structured data models
- RESTful API endpoints for analytics data retrieval
- React hooks for data fetching with TanStack Query
- Responsive dashboard with real-time updates every 30-60 seconds
- Integration with existing chat system for seamless data collection