# React + Vite App with Supabase

A modern React application built with Vite, TypeScript, and Supabase integration.

## Features

- **React 18** - Fast, interactive UI
- **Vite** - Lightning-fast build tool with Hot Module Reloading (HMR)
- **React Router** - Client-side routing
- **Supabase** - Backend-as-a-Service authentication and database
- **TypeScript** - Type-safe development

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Supabase account ([sign up here](https://supabase.com))

## Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd <your-project-name>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env.local`
   - Add your Supabase credentials:
     ```
     VITE_SUPABASE_URL=your-supabase-project-url
     VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
     ```
   - Get these from your Supabase project settings (API → Project URL and anon key)

4. **Start the development server**
   ```bash
   npm run dev
   ```
   - The app will be available at `http://localhost:5000`

## Available Scripts

- `npm run dev` - Start the development server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview the production build locally

## Project Structure

```
src/
├── components/        # Reusable React components
├── pages/            # Page components
├── App.jsx           # Main App component
├── index.jsx         # Entry point
├── index.css         # Global styles
└── supabase.js       # Supabase client configuration
```

## Deployment

### Building for Production

```bash
npm run build
```

The optimized build will be in the `dist/` folder.

### Environment Variables for Production

Make sure to set the same environment variables in your production environment:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Development Tips

- Keep sensitive credentials in environment variables
- Never commit `.env` or `.env.local` files
- Use `.env.example` to document required environment variables

## Troubleshooting

- **Port already in use?** Change the port in `vite.config.js`
- **Supabase connection issues?** Verify your credentials in `.env.local`
- **Build errors?** Clear `node_modules` and `package-lock.json`, then run `npm install` again

## License

ISC
