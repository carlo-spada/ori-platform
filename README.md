# Ori — Your AI-Powered Career Companion

## 🌟 Overview

Ori is an autonomous up-skilling and role-acquisition agent designed to guide every person toward the work that truly fits them. As a lifelong companion for discovering, pursuing, and evolving within roles that align with your skills, values, and ambitions, Ori helps people not merely find jobs, but grow into their most fulfilling professional selves.

## 🎯 Mission

Ori exists to prove that fulfillment should be scalable, and purpose should never be a privilege. By merging real-time labor-market intelligence with personalized up-skilling and preference modeling, Ori creates an intelligent bridge between human potential and opportunity.

## 🚀 Features

- **Personalized Career Guidance**: AI-powered recommendations tailored to your unique skills, values, and aspirations
- **Continuous Learning Paths**: Adaptive up-skilling programs that evolve with market demands
- **Real-time Market Intelligence**: Access to current job market trends and opportunities
- **Application Management**: Track and manage your job applications in one place
- **Professional Profile Building**: Create and maintain a compelling professional presence
- **Goal Setting & Tracking**: Set career milestones and track your progress

## 🛠️ Technology Stack

This project is built with:

- **Framework**: Next.js 13+ with App Router
- **Language**: TypeScript
- **UI Components**: shadcn-ui
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Internationalization**: i18next
- **State Management**: React Query (TanStack Query)

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm/pnpm
- A Supabase account and project
- A Stripe account (for payment features)

### Setup

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd ori-platform
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

4. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Project Structure

```
ori-platform/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── contexts/         # React contexts (Auth, etc.)
│   ├── integrations/     # Third-party integrations
│   ├── lib/              # Utility functions and configurations
│   └── i18n.ts          # Internationalization setup
├── public/              # Static assets
│   └── locales/         # Translation files
├── ORI_MANIFESTO.md     # Project vision and philosophy
└── package.json         # Project dependencies
```

## 🌍 Internationalization

Ori supports multiple languages. Translation files are located in `public/locales/`. Currently supported languages:
- English (en)
- German (de)
- Spanish (es)
- French (fr)
- Italian (it)

## 🔐 Authentication

Ori uses Supabase Auth for secure user authentication, supporting:
- Email/password authentication
- Magic link authentication
- OAuth providers (Google, GitHub, etc.)

## 💳 Subscription Tiers

Ori offers three subscription tiers:
- **Free**: Basic features for getting started
- **Plus**: Enhanced features for active job seekers
- **Premium**: Full access for professional growth

## 🚀 Deployment

The application can be deployed to various platforms:

### Vercel (Recommended)
```bash
pnpm build
vercel deploy
```

### Docker
```bash
docker build -t ori-platform .
docker run -p 3000:3000 ori-platform
```

## 🤝 Contributing

We welcome contributions! **Required reading before contributing:**

1. **[`AGENTS.md`](./AGENTS.md)** - Complete contributor handbook with branching strategy, workflows, and best practices
2. **Agent-specific guides:**
   - [`CLAUDE.md`](./CLAUDE.md) - Implementation & building guidance
   - [`GEMINI.md`](./GEMINI.md) - Planning & research guidance
   - [`AI_ENGINE_QUICKSTART.md`](./AI_ENGINE_QUICKSTART.md) - AI Engine setup

**Workflow Overview:**
- Work on `development` branch (direct pushes to `main` are blocked)
- Follow conventional commits (`feat:`, `fix:`, `chore:`)
- Update documentation after major changes
- Create PR from `development` → `main` when ready to deploy

Major feature, infrastructure, or workflow changes must be reflected in `AGENTS.md` to keep all collaborators aligned.

## 📄 License

This project is proprietary software. All rights reserved.

## 📧 Contact

For questions or support, please contact: support@ori.ai

---

**Ori** — because fulfillment should be scalable, and purpose should never be a privilege.
