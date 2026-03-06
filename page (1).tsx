@import 'tailwindcss';
@import 'tw-animate-css';

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(0.98 0.002 60);
  --foreground: oklch(0.15 0.01 30);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.15 0.01 30);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.15 0.01 30);
  --primary: oklch(0.58 0.2 30);
  --primary-foreground: oklch(0.98 0 0);
  --secondary: oklch(0.96 0.01 60);
  --secondary-foreground: oklch(0.25 0.02 30);
  --muted: oklch(0.95 0.008 60);
  --muted-foreground: oklch(0.5 0.02 30);
  --accent: oklch(0.7 0.18 55);
  --accent-foreground: oklch(0.15 0.01 30);
  --destructive: oklch(0.55 0.22 27);
  --destructive-foreground: oklch(0.55 0.22 27);
  --border: oklch(0.91 0.01 60);
  --input: oklch(0.91 0.01 60);
  --ring: oklch(0.58 0.2 30);
  --chart-1: oklch(0.58 0.2 30);
  --chart-2: oklch(0.7 0.18 55);
  --chart-3: oklch(0.5 0.15 15);
  --chart-4: oklch(0.75 0.15 70);
  --chart-5: oklch(0.65 0.2 40);
  --radius: 0.625rem;
  --sidebar: oklch(0.98 0.002 60);
  --sidebar-foreground: oklch(0.15 0.01 30);
  --sidebar-primary: oklch(0.58 0.2 30);
  --sidebar-primary-foreground: oklch(0.98 0 0);
  --sidebar-accent: oklch(0.96 0.01 60);
  --sidebar-accent-foreground: oklch(0.25 0.02 30);
  --sidebar-border: oklch(0.91 0.01 60);
  --sidebar-ring: oklch(0.58 0.2 30);
  --lava-orange: #FF6B35;
  --lava-red: #D62828;
  --lava-amber: #F77F00;
  --lava-dark: #1D1D1D;
  --success: oklch(0.6 0.18 145);
  --success-foreground: oklch(0.98 0 0);
}

.dark {
  --background: oklch(0.15 0.01 30);
  --foreground: oklch(0.95 0.005 60);
  --card: oklch(0.18 0.01 30);
  --card-foreground: oklch(0.95 0.005 60);
  --popover: oklch(0.18 0.01 30);
  --popover-foreground: oklch(0.95 0.005 60);
  --primary: oklch(0.65 0.2 30);
  --primary-foreground: oklch(0.98 0 0);
  --secondary: oklch(0.25 0.01 30);
  --secondary-foreground: oklch(0.95 0.005 60);
  --muted: oklch(0.25 0.01 30);
  --muted-foreground: oklch(0.65 0.01 30);
  --accent: oklch(0.7 0.18 55);
  --accent-foreground: oklch(0.15 0.01 30);
  --destructive: oklch(0.45 0.18 25);
  --destructive-foreground: oklch(0.65 0.22 25);
  --border: oklch(0.28 0.01 30);
  --input: oklch(0.28 0.01 30);
  --ring: oklch(0.65 0.2 30);
  --chart-1: oklch(0.65 0.2 30);
  --chart-2: oklch(0.7 0.18 55);
  --chart-3: oklch(0.55 0.15 15);
  --chart-4: oklch(0.75 0.15 70);
  --chart-5: oklch(0.6 0.2 40);
  --sidebar: oklch(0.18 0.01 30);
  --sidebar-foreground: oklch(0.95 0.005 60);
  --sidebar-primary: oklch(0.65 0.2 30);
  --sidebar-primary-foreground: oklch(0.98 0 0);
  --sidebar-accent: oklch(0.25 0.01 30);
  --sidebar-accent-foreground: oklch(0.95 0.005 60);
  --sidebar-border: oklch(0.28 0.01 30);
  --sidebar-ring: oklch(0.65 0.2 30);
}

@theme inline {
  --font-sans: 'Geist', 'Geist Fallback';
  --font-mono: 'Geist Mono', 'Geist Mono Fallback';
  --color-lava-orange: var(--lava-orange);
  --color-lava-red: var(--lava-red);
  --color-lava-amber: var(--lava-amber);
  --color-lava-dark: var(--lava-dark);
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}

@keyframes lava-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes lava-pulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}

@keyframes card-reveal {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.lava-spinner {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 4px solid transparent;
  border-top-color: var(--lava-orange);
  border-right-color: var(--lava-red);
  border-bottom-color: var(--lava-amber);
  animation: lava-spin 1s linear infinite;
}

.lava-spinner-lg {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 5px solid transparent;
  border-top-color: var(--lava-orange);
  border-right-color: var(--lava-red);
  border-bottom-color: var(--lava-amber);
  animation: lava-spin 1s linear infinite;
}

.card-reveal {
  animation: card-reveal 0.5s ease-out forwards;
  opacity: 0;
}

.lava-gradient-text {
  background: linear-gradient(135deg, var(--lava-red), var(--lava-orange), var(--lava-amber));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.lava-gradient-bg {
  background: linear-gradient(135deg, var(--lava-red), var(--lava-orange), var(--lava-amber));
}
