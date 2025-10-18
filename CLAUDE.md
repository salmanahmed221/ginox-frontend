# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server with host access (accessible on network)
- `npm run build` - Build for production
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview production build

### Testing
No specific test commands are configured in package.json. Check with team for testing procedures.
Note: Project includes TypeScript type definitions but uses JavaScript files with JSX.

## Architecture Overview

This is a **React 18** application built with **Vite** as the build tool, featuring:

### Core Technologies
- **Frontend Framework**: React 18 with JSX
- **Build Tool**: Vite with React plugin
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Redux Toolkit with Redux Persist for session persistence
- **Routing**: React Router DOM v6 with protected routes
- **HTTP Client**: Axios with custom interceptors for session management

### Key Integrations
- **Web3**: Wagmi + RainbowKit for wallet connections (Ethereum mainnet)
- **OAuth**: Google OAuth integration via @react-oauth/google
- **Telegram**: Telegram authentication and bot integration
- **Real-time**: Socket.io client for live features
- **Charts**: Recharts for data visualization
- **Animations**: Framer Motion for UI animations

### Project Structure
- `src/pages/` - Route components organized by feature (dashboard, products, legal, etc.)
- `src/components/` - Reusable UI components 
- `src/store/` - Redux store with auth slice and persistence
- `src/api/` - API configuration and service functions
- `src/utils/` - Utilities including session management and cache handling
- `src/assets/` - Static assets

### State Management
- **Redux Store**: Centralized state with auth slice
- **Persistence**: Uses redux-persist to maintain auth state across sessions
- **Session Management**: Custom SessionManager class handles token validation and expiration

### Authentication Flow
- **Protected Routes**: Uses ProtectedRoute wrapper for authenticated pages
- **Session Handling**: Automatic session validation every 5 minutes
- **Token Management**: Axios interceptors automatically add auth tokens
- **Session Expiration**: Shows user notifications and redirects to signin on 401/404 responses
- **Multi-provider Auth**: Supports Google OAuth, Telegram, and traditional login

### API Architecture
- **Base Configuration**: Centralized axios instance in `src/api/axiosConfig.js`
- **Request Interceptors**: Automatically adds auth tokens to requests
- **Response Interceptors**: Handles session expiration (401) and user not found (404) globally
- **Environment Variables**: Uses VITE_API_BASE_URL for API endpoint configuration

### Custom Design System
Tailwind config includes extensive custom colors for the Ginox brand:
- Dark theme with `dark_background` (#010510)
- Gradient buttons with `btn_gradient_start` and `btn_gradient_end`
- Custom font families: Avapore, Avalont, Stargaze Stencil, Astronomus-Regular, Octa Brain
- Chart-specific colors for different data series (BFM, EUSD, etc.)

### Session Expiration System
Implements comprehensive session management as documented in `SESSION_EXPIRATION.md`:
- Periodic session validation every 5 minutes
- User-friendly notifications on expiration
- Automatic cleanup of localStorage, sessionStorage, and cookies
- Graceful handling during login flows to avoid false positives

### Environment Variables Required
- `VITE_API_BASE_URL` - Backend API base URL
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth client ID
- `VITE_WALLETCONNECT_PROJECT_ID` - WalletConnect project ID (optional, falls back to injected wallets)

### Code Style Notes
- Uses ESLint with React hooks and React refresh plugins
- Configured for JSX syntax with ES2020+ features
- Ignores unused variables with uppercase/underscore pattern
- React refresh warnings for component exports
- Uses JavaScript with JSX (not TypeScript) despite having type definitions for development

## Important Instructions
When working on this codebase:
- NEVER create files unless absolutely necessary for achieving the goal
- ALWAYS prefer editing existing files to creating new ones
- NEVER proactively create documentation files (*.md) or README files unless explicitly requested