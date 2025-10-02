# Relio Setup Guide

## Database Setup Steps

### 1. Make sure you have a DATABASE_URL in your .env file

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

### 2. Generate Prisma Client (Already Done ✅)

```bash
npx prisma generate
```

### 3. Create Database Tables - Run Migration

```bash
npx prisma migrate dev --name init
```

This will:
- Create all tables (User, Account, Session, Portfolio, VerificationToken)
- Apply the schema to your database
- Generate the Prisma Client with the latest schema

### 4. (Optional) View Your Database

```bash
npx prisma studio
```

This opens a visual database browser at http://localhost:5555

## Using Prisma Data Platform (console.prisma.io)

If you're using Prisma Data Platform:

1. **Create a Project** at https://console.prisma.io/
2. **Create a Database** (they provide PostgreSQL hosting)
3. **Get Connection String** from the dashboard
4. **Add to .env**:
   ```
   DATABASE_URL="prisma://accelerate.prisma-data.net/..."
   ```
5. **Run migrations**:
   ```bash
   npx prisma migrate dev --name init
   ```

## Alternative: Using Prisma Accelerate

If your DATABASE_URL starts with `prisma://`, you're using Prisma Accelerate.

### For Development:
```bash
# Use direct database URL for migrations
npx prisma migrate dev --name init
```

### For Production:
Prisma Accelerate connection strings work automatically with your deployed app.

## Troubleshooting

### Error: "Table does not exist"
**Solution:** Run the migration command above.

### Error: "Environment variable not found"
**Solution:** Make sure your `.env` file exists and contains `DATABASE_URL`.

### Error: "Connection refused"
**Solution:** 
- Check if your database is running
- Verify the connection string is correct
- For cloud databases, check if your IP is whitelisted

## Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your values

# 3. Generate Prisma Client
npx prisma generate

# 4. Create database tables
npx prisma migrate dev --name init

# 5. Start development server
npm run dev
```

## Environment Variables Needed

```bash
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Cerebras AI
CEREBRAS_API_KEY="your-cerebras-api-key"

# OAuth (Optional)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
```

## Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## Next Steps After Setup

1. Visit http://localhost:3000
2. Try the "Try without signup" feature
3. Upload a resume (PDF or DOCX)
4. Check the generated portfolio
5. Sign up to save it permanently

## Database Schemas Created

- **User**: Stores user accounts (regular and temporary)
- **Account**: OAuth provider accounts
- **Session**: User sessions
- **Portfolio**: Portfolio configurations (JSON)
- **VerificationToken**: Email verification tokens
