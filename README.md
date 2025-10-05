<div align="center">
  <img src="relio/screenshots/Relio-logo.jpg" alt="Relio Logo" width="200"/>
  
  # 🚀 Relio - Resume to Portfolio in Seconds
  
  **Transform your resume into a stunning portfolio website powered by AI**
  
  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
  [![Cerebras AI](https://img.shields.io/badge/Cerebras-AI-purple?style=for-the-badge)](https://cerebras.ai/)
  
  **Made for FutureStackGenAI Hackathon 2025** 🎯
  
  [Demo](#-demo) • [Features](#-features) • [Quick Start](#-quick-start) • [Tech Stack](#-tech-stack) • [Contributing](#-contributing)
</div>

---

## 📖 About

**Relio** is a modern SaaS platform that leverages the power of AI to automatically convert resumes (PDF/DOCX) into beautiful, responsive portfolio websites. Built with Next.js 15, Prisma, and Cerebras AI, Relio makes it incredibly easy for developers, designers, and professionals to showcase their work online.

### Why Relio?

- ⚡ **Lightning Fast**: Get your portfolio in seconds, not hours
- 🤖 **AI-Powered**: Cerebras AI intelligently extracts and structures your resume data
- 🎨 **Beautiful Templates**: Choose from multiple stunning, responsive designs
- 🆓 **Try Without Signup**: Test the platform anonymously before committing
- 🔒 **Secure**: Multi-provider authentication with NextAuth.js
- 🌐 **Custom URLs**: Get your personalized portfolio at `/your-username`

---

## 🎬 Demo

### Landing Page
<img src="relio/screenshots/landing-page.png" alt="Relio Landing Page" width="100%"/>

*Modern, eye-catching landing page with interactive pixel blast animation*

### Portfolio Demo (Static)
<img src="relio/screenshots/portfolio-demo.png" alt="Portfolio Demo" width="100%"/>

*Clean, professional portfolio layout with all your information beautifully organized*

### Portfolio Demo (Animated)
<img src="relio/screenshots/animated-portfolio-demo.png" alt="Animated Portfolio Demo" width="100%"/>

*Dynamic, animated portfolio with smooth transitions and modern design*

### Sign In Page
<img src="relio/screenshots/sign-in-page.jpeg" alt="Sign In Page" width="100%"/>

*Seamless authentication with Google, GitHub, or email/password*

---

## ✨ Features

### 🤖 **AI-Powered Resume Parsing**
Relio uses **Cerebras Cloud SDK** to intelligently extract:
- Personal information (name, contact, social links)
- Professional skills and technologies
- Work experience with detailed achievements
- Education history
- Projects with descriptions
- And more!

### 🎨 **Multiple Portfolio Templates**
Choose from beautifully designed templates:
- **Default**: Classic, professional layout
- **Animated**: Dynamic with smooth transitions and effects
- **Minimal**: Clean and simple design
- More templates coming soon!

### 🔐 **Flexible Authentication**
- **Google OAuth**: Sign in with your Google account
- **GitHub OAuth**: Authenticate via GitHub
- **Email/Password**: Traditional credentials
- **Anonymous Mode**: Try without signing up (24-hour temporary portfolios)

### 🆓 **Try Without Signup**
Experience Relio risk-free:
- Upload your resume without creating an account
- Get a temporary portfolio with a random username
- Portfolio expires in 24 hours unless you sign up
- Seamlessly convert to permanent account later

### 📊 **User Dashboard**
Manage your portfolio with ease:
- Create multiple portfolios
- Edit portfolio information
- Switch between templates
- Choose from 100 unique avatars
- Customize your slug/URL

### 🌐 **Dynamic Routing**
Each user gets their own custom portfolio URL:
```
https://relio.app/john-doe
https://relio.app/jane-designer
https://relio.app/creative-dev
```

### ⏰ **Automatic Cleanup**
Scheduled jobs automatically remove expired temporary portfolios, keeping the database clean and efficient.

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[TailwindCSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** - Smooth animations
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Lucide React](https://lucide.dev/)** - Beautiful icons
- **[Three.js](https://threejs.org/)** - 3D graphics for animations

### Backend
- **[PostgreSQL](https://www.postgresql.org/)** - Robust relational database
- **[Prisma ORM](https://www.prisma.io/)** - Type-safe database client
- **[NextAuth.js](https://next-auth.js.org/)** - Complete authentication solution
- **[Cerebras Cloud SDK](https://cerebras.ai/)** - AI-powered resume parsing

### File Processing
- **[unpdf](https://github.com/unjs/unpdf)** - PDF text extraction
- **[mammoth](https://github.com/mwilliamson/mammoth.js)** - DOCX document parsing
- **[react-dropzone](https://react-dropzone.js.org/)** - Drag & drop file uploads

### Developer Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vercel Analytics** - Performance monitoring
- **Vercel Speed Insights** - Real-time metrics

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** (with npm, yarn, or pnpm)
- **PostgreSQL** database (local or cloud)
- **Cerebras API Key** ([Get yours here](https://cloud.cerebras.ai/))
- **OAuth Credentials** (optional, for Google/GitHub login)

---

## 🚀 Quick Start

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/xkaper001/relio.git
cd relio
```

### 2️⃣ Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3️⃣ Environment Configuration

Create a `.env` file in the root directory:

```bash
# ==========================================
# DATABASE
# ==========================================
DATABASE_URL="postgresql://user:password@localhost:5432/relio"

# ==========================================
# NEXTAUTH
# ==========================================
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-generate-with-openssl"

# ==========================================
# CEREBRAS AI
# ==========================================
CEREBRAS_API_KEY="your-cerebras-api-key"

# ==========================================
# GOOGLE OAUTH (Optional)
# ==========================================
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# ==========================================
# GITHUB OAUTH (Optional)
# ==========================================
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4️⃣ Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view/edit data
npx prisma studio
```

### 5️⃣ Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see Relio in action! 🎉

---

## 📁 Project Structure

```
relio/
├── prisma/
│   ├── schema.prisma              # Database schema definition
│   └── migrations/                # Database migration files
├── public/
│   ├── avatars/                   # 100 unique SVG avatars (001-100)
│   └── *.svg                      # Static assets
├── screenshots/                   # Project screenshots
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/              # NextAuth API routes
│   │   │   ├── upload/            # Resume upload endpoint
│   │   │   ├── portfolio/         # Portfolio CRUD operations
│   │   │   ├── dashboard/         # Dashboard data API
│   │   │   └── cleanup/           # Temporary user cleanup
│   │   ├── auth/                  # Authentication pages
│   │   ├── dashboard/             # User dashboard UI
│   │   ├── try/                   # Anonymous try mode
│   │   ├── [slug]/                # Dynamic portfolio routes
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Landing page
│   │   └── globals.css            # Global styles
│   ├── components/
│   │   ├── ui/                    # Reusable UI components
│   │   ├── PortfolioView.tsx      # Portfolio renderer
│   │   ├── PixelBlast.tsx         # Animated background
│   │   └── Providers.tsx          # Context providers
│   ├── lib/
│   │   ├── ai.ts                  # Cerebras AI integration
│   │   ├── auth.ts                # NextAuth configuration
│   │   ├── prisma.ts              # Prisma client singleton
│   │   └── utils.ts               # Utility functions
│   ├── types/                     # TypeScript type definitions
│   ├── data/                      # Static data/constants
│   └── hooks/                     # Custom React hooks
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── README.md
```

---

## 🔑 Key Features Deep Dive

### 1. **Anonymous Try Mode** (`/try`)

Perfect for first-time users who want to test the platform:

- 📤 Upload resume without creating an account
- 🎲 Get a random temporary username (e.g., `temp-9281`)
- ⏰ Portfolio expires in 24 hours
- 💾 Banner prompts to sign up and save permanently
- 🔄 Seamlessly migrate to permanent account

**User Flow:**
1. Visit `/try`
2. Upload resume (PDF/DOCX)
3. AI processes and generates portfolio
4. View temporary portfolio at `/temp-[random-id]`
5. Sign up to keep portfolio forever

### 2. **AI Resume Parsing**

Powered by **Cerebras Cloud SDK**, Relio intelligently extracts:

- 👤 **Personal Information**: Name, email, phone, location
- 🔗 **Social Links**: GitHub, LinkedIn, Twitter, portfolio
- 💼 **Work Experience**: Companies, roles, dates, achievements
- 🎓 **Education**: Degrees, institutions, graduation dates
- 🛠️ **Skills**: Technologies, languages, frameworks, tools
- 🚀 **Projects**: Titles, descriptions, technologies used
- 🏆 **Achievements**: Awards, certifications, publications

**How it works:**
1. Resume uploaded via drag-and-drop
2. Text extracted from PDF/DOCX
3. Sent to Cerebras AI with structured prompt
4. JSON response parsed and validated
5. Portfolio config stored in database
6. Real-time rendering with selected template

### 3. **Authentication System**

Flexible, secure authentication powered by **NextAuth.js**:

**OAuth Providers:**
- 🔴 **Google**: Sign in with your Google account
- ⚫ **GitHub**: Authenticate via GitHub
- 📧 **Email/Password**: Traditional credentials with bcrypt hashing

**Features:**
- Session-based authentication
- Secure password hashing
- OAuth token management
- Email verification support
- Account linking
- Protected API routes

### 4. **Portfolio Templates**

Choose from multiple professionally designed templates:

**Default Template:**
- Clean, professional layout
- Responsive grid system
- Smooth scroll animations
- Card-based sections

**Animated Template:**
- Dynamic background effects
- Smooth page transitions
- Interactive hover states
- Modern glass morphism

**Minimal Template:**
- Simple, elegant design
- Focus on content
- Typography-driven
- Fast loading

*More templates coming soon!*

### 5. **Avatar System**

100 unique SVG avatars (001-100) to choose from:
- AI can auto-select based on your profession
- Manual selection in dashboard
- Lightweight SVG format
- Consistent color palette
- Professional designs

### 6. **Cleanup Job** (`/api/cleanup`)

Automated maintenance to keep the system clean:

- 🗑️ Deletes users where `isTemporary = true` and `expiresAt < now`
- 🔄 Runs via cron job (every 6 hours recommended)
- 🧹 Cascading delete removes all related data
- 📊 Returns count of deleted users

**Setup with Vercel Cron:**

Create `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cleanup",
    "schedule": "0 */6 * * *"
  }]
}
```

**Manual trigger:**
```bash
curl -X POST https://your-app.vercel.app/api/cleanup
```

---

## 🎨 Customization Guide

### Adding New Templates

1. Edit `src/components/PortfolioView.tsx`
2. Add your template variant
3. Update template selector in dashboard
4. Add preview image

```typescript
// Example: Adding a "neon" template
case 'neon':
  return <NeonPortfolioLayout config={config} />
```

### Modifying AI Prompts

Edit `src/lib/ai.ts` to customize resume parsing:

```typescript
const prompt = `
You are a resume parsing AI. Extract the following:
- Add your custom instructions here
- Modify extraction rules
- Change output format
`
```

### Database Schema Changes

1. Modify `prisma/schema.prisma`
2. Run migration:
```bash
npx prisma migrate dev --name your_migration_name
```
3. Update TypeScript types
4. Regenerate Prisma Client:
```bash
npx prisma generate
```

### Styling Customization

**Global Styles:** Edit `src/app/globals.css`
**Tailwind Config:** Modify `tailwind.config.ts`
**Component Styles:** Update individual component files

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git push origin main
   ```

2. **Import to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository

3. **Configure Environment Variables:**
   Add all `.env` variables in Vercel dashboard

4. **Deploy:**
   Click "Deploy" and wait for build to complete

5. **Setup Database:**
   - Use Vercel Postgres (recommended)
   - Or connect external PostgreSQL

6. **Configure Cron Jobs:**
   Add `vercel.json` for automated cleanup

### Database Options

**Recommended Providers:**
- ✅ **Vercel Postgres** - Seamless integration
- ✅ **Supabase** - Free tier, great DX
- ✅ **Neon** - Serverless Postgres
- ✅ **PlanetScale** - MySQL alternative
- ✅ **Railway** - Simple deployment

---

## 🔧 Troubleshooting

### Prisma Client Not Generated

```bash
npx prisma generate
```

### Database Connection Failed

- ✓ Check `DATABASE_URL` format
- ✓ Verify PostgreSQL is running
- ✓ Confirm credentials are correct
- ✓ Check firewall/network settings

### OAuth Not Working

- ✓ Verify redirect URIs in OAuth app settings
- ✓ Check client ID/secret in `.env`
- ✓ Ensure `NEXTAUTH_URL` is correct
- ✓ Confirm OAuth app is enabled

### File Upload Errors

- ✓ Check file size limits (default: 10MB)
- ✓ Verify supported formats (PDF, DOCX)
- ✓ Ensure temp directory exists
- ✓ Check server upload limits

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Rebuild
npm run build
```

---

## 📚 API Reference

### `POST /api/upload`
Upload and parse resume

**Request:**
```typescript
FormData {
  file: File (PDF/DOCX)
  userId?: string
}
```

**Response:**
```json
{
  "success": true,
  "portfolio": { /* portfolio config */ },
  "slug": "username"
}
```

### `GET /api/portfolio`
Get user's portfolio configuration

**Response:**
```json
{
  "id": "...",
  "title": "My Portfolio",
  "slug": "username",
  "template": "default",
  "config": { /* portfolio data */ }
}
```

### `POST /api/portfolio`
Create or update portfolio

**Request:**
```json
{
  "title": "My Portfolio",
  "slug": "username",
  "template": "animated",
  "config": { /* portfolio data */ }
}
```

### `POST /api/cleanup`
Delete expired temporary users

**Response:**
```json
{
  "deleted": 42
}
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Reporting Bugs

1. Check existing issues first
2. Create detailed bug report
3. Include reproduction steps
4. Add screenshots if applicable

### Suggesting Features

1. Open a feature request issue
2. Describe the feature clearly
3. Explain use cases
4. Discuss implementation ideas

### Pull Requests

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Make your changes
4. Write/update tests
5. Update documentation
6. Commit your changes:
   ```bash
   git commit -m "Add amazing feature"
   ```
7. Push to your fork:
   ```bash
   git push origin feature/amazing-feature
   ```
8. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Update README if needed
- Test your changes thoroughly

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 Relio

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

Special thanks to:

- **[Next.js Team](https://nextjs.org/)** - Amazing React framework
- **[Cerebras AI](https://cerebras.ai/)** - Powerful AI infrastructure
- **[Prisma](https://www.prisma.io/)** - Excellent ORM
- **[NextAuth.js](https://next-auth.js.org/)** - Simple authentication
- **[Tailwind CSS](https://tailwindcss.com/)** - Beautiful styling
- **[Vercel](https://vercel.com/)** - Seamless deployment
- **[Radix UI](https://www.radix-ui.com/)** - Accessible components
- **[Framer Motion](https://www.framer.com/motion/)** - Smooth animations
- **FutureStackGenAI Hackathon** - Inspiration and motivation

---

## 📞 Support & Contact

### Get Help

- 📖 [Documentation](https://github.com/xkaper001/relio/wiki) (Coming Soon)
- 💬 [Discussions](https://github.com/xkaper001/relio/discussions)
- 🐛 [Issue Tracker](https://github.com/xkaper001/relio/issues)

### Connect With Us

- 🌐 Website: [relio.app](#) (Coming Soon)
- 💼 LinkedIn: [Connect](#)
- 🐦 Twitter: [@relioapp](#)
- 📧 Email: support@relio.app

---

## 🎯 Roadmap

### Phase 1: Core Features ✅
- [x] Resume upload and parsing
- [x] AI-powered extraction
- [x] Multiple templates
- [x] User authentication
- [x] Anonymous try mode
- [x] Dashboard

### Phase 2: Enhancements 🚧
- [ ] More portfolio templates
- [ ] Custom domain support
- [ ] Analytics dashboard
- [ ] SEO optimization
- [ ] PDF export
- [ ] Social sharing

### Phase 3: Advanced Features 🎨
- [ ] Drag-and-drop portfolio editor
- [ ] Custom CSS support
- [ ] Collaborative portfolios
- [ ] Portfolio themes marketplace
- [ ] AI-powered content suggestions
- [ ] Integration with job boards

### Phase 4: Enterprise 🚀
- [ ] Team workspaces
- [ ] White-label solution
- [ ] Advanced analytics
- [ ] Custom branding
- [ ] SSO support
- [ ] API access

---

## 📊 Stats

- ⚡ **Built in**: 48 hours (Hackathon)
- 🎯 **Lines of Code**: ~15,000+
- 🎨 **Components**: 50+
- 🧪 **Technologies**: 25+
- 💜 **Made with**: Passion & Coffee

---

<div align="center">
  
  ### ⭐ Star us on GitHub — it motivates us a lot!
  
  Made with ❤️ for **FutureStackGenAI Hackathon 2025**
  
  **[⬆ Back to Top](#-relio---resume-to-portfolio-in-seconds)**
  
</div>