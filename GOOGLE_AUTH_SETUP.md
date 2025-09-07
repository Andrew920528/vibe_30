# Google Authentication Setup Guide

This project now includes Google OAuth authentication using Supabase. Follow these steps to set it up:

## 1. Environment Variables

Create a `.env` file in your project root with the following variables:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_TEMPO=false
```

## 2. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In your Supabase dashboard, go to **Authentication** > **Providers**
3. Enable **Google** provider
4. Add your Google OAuth credentials:
   - **Client ID**: Your Google OAuth client ID
   - **Client Secret**: Your Google OAuth client secret

## 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**
4. Go to **Credentials** > **Create Credentials** > **OAuth 2.0 Client IDs**
5. Set the application type to **Web application**
6. Add authorized redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for development)
7. Copy the Client ID and Client Secret to Supabase

## 4. Features

- **Login Page**: Beautiful, responsive login page with Google OAuth
- **Protected Routes**: Automatically redirects unauthenticated users
- **Auth Context**: Manages user state throughout the app
- **OAuth Callback**: Handles authentication redirects
- **Loading States**: Smooth loading experiences during authentication

## 5. Usage

- Users can sign in with Google by clicking the "Continue with Google" button
- After successful authentication, users are redirected to the home page
- Unauthenticated users are automatically redirected to `/login`
- The auth state is persisted across page refreshes

## 6. Components

- `LoginPage`: Main login interface
- `AuthCallback`: Handles OAuth redirects
- `ProtectedRoute`: Protects routes from unauthenticated access
- `AuthContext`: Manages authentication state

## 7. Styling

The login page uses Tailwind CSS with:

- Gradient backgrounds
- Glassmorphism effects
- Smooth animations
- Responsive design
- Google's official branding colors

## 8. Security

- OAuth tokens are handled securely by Supabase
- No sensitive data is stored in localStorage
- Automatic token refresh
- Secure session management
