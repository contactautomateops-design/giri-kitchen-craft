# Giri Food Productions - Portfolio Website

A modern, responsive portfolio website for Giri Food Productions, showcasing premium organic oils and spices.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or bun

### Installation

1. **Clone the repository**:
```bash
git clone <YOUR_REPO_URL>
cd giri-kitchen-craft
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start development server**:
```bash
npm run dev
```

The website will be available at `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Technologies Used

- **Vite** - Fast build tool
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **shadcn-ui** - Reusable components
- **React Router** - Navigation
- **AOS** - Scroll animations

## Project Structure

```
src/
├── pages/         - Main portfolio pages
├── components/    - Reusable UI components
├── data/          - Product data
├── lib/           - Utilities
└── styles/        - Global styles
```

## Deployment

Build the project for production:

```bash
npm run build
```

The optimized build will be in the `dist/` directory, ready to deploy to any static hosting service.
