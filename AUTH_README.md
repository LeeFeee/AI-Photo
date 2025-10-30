# Authentication System

## Quick Start

### 1. Environment Setup

Create a `.env` file in the project root with:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

**Generate a secure secret:**
```bash
openssl rand -base64 32
```

### 2. Database Setup

```bash
# Install dependencies (if not already done)
npm install

# Run database migrations
npx prisma migrate dev

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

### 3. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Features

### User Registration
- **URL**: http://localhost:3000/register
- Register with email and password
- Optional name field
- Password must be at least 6 characters
- Automatic password hashing with bcrypt

### User Login
- **URL**: http://localhost:3000/login
- Login with registered email and password
- Session persists across browser tabs
- Automatic redirect to requested page after login

### Protected Dashboard
- **URL**: http://localhost:3000/dashboard
- Shows user account information:
  - Email and name
  - Token balance (初始值: 0)
  - Membership status (初始值: 普通用户)
- Automatically redirects to login if not authenticated

### Navigation
- **Desktop**: Shows login/register buttons or user info + logout button
- **Mobile**: Slide-in menu with same authentication features

## User Data Structure

When a new user registers, they are created with:
- `email`: User's email address
- `passwordHash`: Bcrypt hashed password (never plain text)
- `name`: Optional display name
- `tokenBalance`: 0 (initial value)
- `isMember`: false (initial value)
- `membershipExpiresAt`: null (no membership initially)

## API Endpoints

### POST /api/auth/register
Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Optional Name"
}
```

**Response (Success):**
```json
{
  "message": "注册成功",
  "user": {
    "id": "clxxx...",
    "email": "user@example.com",
    "name": "Optional Name",
    "tokenBalance": 0,
    "isMember": false
  }
}
```

### NextAuth Endpoints
- `GET/POST /api/auth/[...nextauth]` - NextAuth API routes
  - `/api/auth/signin` - Sign in
  - `/api/auth/signout` - Sign out
  - `/api/auth/session` - Get session
  - `/api/auth/csrf` - Get CSRF token

## Session Access

### Server Components
```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const session = await getServerSession(authOptions)
console.log(session?.user.email)
console.log(session?.user.tokenBalance)
```

### Client Components
```typescript
'use client'
import { useSession } from 'next-auth/react'

const { data: session, status } = useSession()
console.log(session?.user.email)
console.log(session?.user.tokenBalance)
```

## Protected Routes

Routes protected by middleware (in `middleware.ts`):
- `/dashboard/*`
- `/generate/*`
- `/account/*`

Unauthenticated users are automatically redirected to `/login` with a callback URL.

## Sign Out

### From Client Component
```typescript
import { signOut } from 'next-auth/react'

const handleSignOut = async () => {
  await signOut({ callbackUrl: '/' })
}
```

## Testing

See [AUTH_TESTING.md](./AUTH_TESTING.md) for comprehensive testing guide.

### Quick Manual Test

1. Visit `/register` and create an account
2. Login with your credentials at `/login`
3. Check dashboard at `/dashboard` shows your info
4. Try accessing `/dashboard` after logging out (should redirect)
5. Test sign out button in navigation

## Troubleshooting

### "Invalid credentials" error
- Check email and password are correct
- Ensure user exists in database (use Prisma Studio)

### Session not persisting
- Verify `NEXTAUTH_SECRET` is set in `.env`
- Check browser cookies are enabled
- Clear browser cache and cookies

### Type errors
- Run `npm run build` to check all types
- Ensure `types/next-auth.d.ts` exists

### Database errors
- Run `npx prisma generate` to regenerate Prisma Client
- Check `DATABASE_URL` in `.env`
- Delete `prisma/dev.db` and re-run migrations if needed

## Documentation

- [AUTH_IMPLEMENTATION.md](./AUTH_IMPLEMENTATION.md) - Complete implementation details
- [AUTH_TESTING.md](./AUTH_TESTING.md) - Testing guide
- [Prisma Schema](./prisma/schema.prisma) - Database schema

## Security Notes

✅ Passwords are hashed with bcrypt  
✅ JWT sessions are signed with NEXTAUTH_SECRET  
✅ Protected routes require authentication  
✅ Input validation with Zod  
✅ No sensitive data in client bundles  

⚠️ Remember to:
- Use a strong `NEXTAUTH_SECRET` in production
- Use HTTPS in production
- Keep dependencies updated
- Never commit `.env` files
