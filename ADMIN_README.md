# Admin Access Shell - Quick Start

## 🔐 Admin Login

Access the admin panel at: `http://localhost:3000/admin/login`

**Default Credentials:**
- Username: `admin`
- Password: `admin123`

## 🎯 Features

### Authentication
- ✅ Separate admin authentication system (NextAuth.js)
- ✅ Bcrypt password hashing
- ✅ JWT-based sessions (httpOnly cookies)
- ✅ 24-hour session expiry

### Route Protection
- ✅ Middleware protects all `/admin/*` routes
- ✅ Automatic redirect to login for unauthorized access
- ✅ Session persistence across page reloads

### Admin Layout
- ✅ Responsive sidebar navigation
- ✅ Header with admin info and logout
- ✅ Mobile-friendly with collapsible menu

### Pages
- ✅ **Dashboard** - System metrics overview
- ✅ **Prompts** - Prompt management (placeholder)
- ✅ **Users** - User management (placeholder)
- ✅ **Transactions** - Transaction records (placeholder)

## 📂 Project Structure

```
/admin
├── /login          → Admin login page
├── /dashboard      → Main dashboard with metrics
├── /prompts        → Prompts management
├── /users          → Users management
└── /transactions   → Transaction records
```

## 🚀 Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
DATABASE_URL="file:./dev.db" npx prisma generate

# Run migrations
DATABASE_URL="file:./dev.db" npx prisma migrate dev

# Seed admin account
npm run db:seed

# Start development server
npm run dev
```

## 🔒 Security

- All admin passwords are hashed with bcrypt (10 rounds)
- Sessions use JWT tokens stored in httpOnly cookies
- Server-side route protection via middleware
- Automatic session expiry after 24 hours

## 📱 Responsive Design

- **Desktop**: Fixed sidebar, full layout
- **Tablet**: Collapsible sidebar, optimized spacing
- **Mobile**: Hamburger menu, full-screen drawer

## 🎨 Design

- Clean, minimalist interface
- Brand colors (blue/purple)
- Smooth transitions
- Accessible keyboard navigation

## 🔧 Technical Stack

- **Framework**: Next.js 14 (App Router)
- **Auth**: NextAuth.js v4
- **Database**: Prisma + SQLite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## 📖 Documentation

See `ADMIN_SETUP.md` for detailed implementation documentation.

---

**Ready to use! 🎉**
