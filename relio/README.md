# 🚀 Relio - Resume to Portfolio in Seconds

**Relio** is a SaaS application that converts resumes into beautiful portfolio websites using AI. Built with Next.js, Prisma, and Cerebras AI.

## ✨ Features

- 🤖 **AI-Powered Parsing** - Converts PDF/DOCX resumes to structured portfolios using Cerebras Cloud SDK
- 🎨 **Beautiful UI** - Modern, responsive design with TailwindCSS and Framer Motion
- 🔐 **Multi-Auth Support** - Google, GitHub, and email/password authentication via NextAuth.js
- 🆓 **Try Without Signup** - Anonymous mode with 24-hour temporary portfolios
- 📊 **Dashboard** - User-friendly interface to manage and edit portfolios
- 🌐 **Dynamic Routes** - Each user gets a custom portfolio at `/[username]`
- 🗄️ **PostgreSQL + Prisma** - Robust database with type-safe ORM
- ⏰ **Auto Cleanup** - Scheduled jobs to remove expired temporary portfolios

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Styling**: TailwindCSS 4 + Framer Motion
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (Google, GitHub, Credentials)
- **AI**: Cerebras Cloud SDK for resume parsing
- **File Parsing**: pdf-parse, mammoth (PDF/DOCX support)
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database (local or cloud)
- Cerebras API key ([Get one here](https://cloud.cerebras.ai/))
- OAuth credentials for Google/GitHub (optional)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd relio
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/relio"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-generate-with-openssl"

# Cerebras AI
CEREBRAS_API_KEY="your-cerebras-api-key"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth (optional)
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app!

## 📁 Project Structure

```
relio/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # NextAuth endpoints
│   │   │   ├── upload/        # Resume upload
│   │   │   ├── portfolio/     # Portfolio CRUD
│   │   │   ├── dashboard/     # Dashboard data
│   │   │   └── cleanup/       # Temp user cleanup
│   │   ├── auth/              # Auth pages (signin/signup)
│   │   ├── dashboard/         # User dashboard
│   │   ├── try/               # Anonymous try mode
│   │   ├── [username]/        # Dynamic portfolio pages
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── components/            # React components
│   │   ├── PortfolioView.tsx
│   │   ├── Providers.tsx
│   │   └── ui/                # UI components
│   ├── lib/                   # Utilities
│   │   ├── ai.ts              # Cerebras integration
│   │   ├── auth.ts            # NextAuth config
│   │   ├── prisma.ts          # Prisma client
│   │   └── utils.ts
│   └── types/                 # TypeScript types
└── package.json
```

## 🔑 Key Features Explained

### 1. **Anonymous Try Mode** (`/try`)
- Users can upload resumes without signing up
- Temporary portfolios expire in 24 hours
- Random username assigned (e.g., `temp-9281`)
- Banner prompts signup to save permanently

### 2. **AI Resume Parsing**
Cerebras AI extracts:
- Personal info (name, contact, links)
- Skills and technologies
- Work experience with achievements
- Education history
- Projects with descriptions

### 3. **Authentication Flow**
- Sign in with Google, GitHub, or email/password
- After temp use, sign up to migrate portfolio
- Protected dashboard and portfolio management

### 4. **Dynamic Portfolios**
- Each user gets `/[username]` route
- Real-time portfolio rendering from database config
- Responsive design with smooth animations

### 5. **Cleanup Job** (`/api/cleanup`)
Set up a cron job (Vercel Cron or external service):
```bash
curl -X POST https://your-app.vercel.app/api/cleanup
```

## 🎨 Customization

### Add More Themes
Edit `/components/PortfolioView.tsx` to add theme variants.

### Modify AI Prompts
Update `/lib/ai.ts` to customize resume parsing behavior.

### Change Database Schema
Modify `prisma/schema.prisma` and run:
```bash
npx prisma migrate dev --name your_migration_name
```

## 🚢 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

**Configure Cron Jobs:**
Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cleanup",
    "schedule": "0 */6 * * *"
  }]
}
```

### Database Options
- **Vercel Postgres** (recommended)
- **Supabase**
- **Neon**
- **PlanetScale**
- **Railway**

## 🔧 Troubleshooting

**Prisma Client Issues:**
```bash
npx prisma generate
```

**Database Connection Failed:**
- Check `DATABASE_URL` format
- Ensure PostgreSQL is running
- Verify credentials

**OAuth Not Working:**
- Confirm redirect URIs in OAuth app settings
- Check client ID/secret in `.env`

**File Upload Errors:**
- Ensure temp directory exists: `mkdir -p /tmp/uploads`
- Check file size limits in Next.js config

## 📚 API Reference

### POST `/api/upload`
Upload resume (PDF/DOCX) and parse with AI.

### GET `/api/portfolio`
Get user's portfolio config.

### POST `/api/portfolio`
Create/update portfolio.

### POST `/api/cleanup`
Delete expired temporary users.

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Cerebras Cloud SDK](https://cerebras.ai/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📧 Support

For issues or questions, please open a GitHub issue or contact the maintainers.

---

Made with ❤️ by the Relio team
