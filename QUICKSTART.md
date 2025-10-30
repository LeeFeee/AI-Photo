# Quick Start Guide - Image Generation Flow

Get up and running with the AI image generation platform in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Database

```bash
# Generate Prisma Client
DATABASE_URL="file:./dev.db" npx prisma generate

# Create database tables
DATABASE_URL="file:./dev.db" npx prisma db push

# Seed with demo data (user + prompts)
DATABASE_URL="file:./dev.db" npx tsx prisma/seed.ts
```

This creates:
- Demo user with 100 tokens
- 9 preset prompts (6 public, 3 members-only)
- SQLite database at `prisma/dev.db`

## Step 3: Start Development Server

```bash
npm run dev
```

Server starts at http://localhost:3000

## Step 4: Test the Flow

### Generate Your First Image

1. **Navigate to Generate Page**
   - Click "生成图片" in the header or go to http://localhost:3000/generate

2. **Check Your Balance**
   - You should see "当前余额：100 代币（会员）" at the top

3. **Select a Prompt**
   - Click on any prompt card (e.g., "梦幻森林")
   - Public prompts cost 5 tokens
   - Members-only prompts (with 🔒) cost 10 tokens

4. **Upload Reference Image (Optional)**
   - Click the upload area to add a reference image
   - Maximum size: 5MB
   - Supported: JPG, PNG

5. **Review Cost**
   - See "预计消耗" and "生成后余额" in the summary card

6. **Generate!**
   - Click "生成图片" button
   - Watch the progress: 验证 → 生成 → 保存 → 完成
   - Image appears in the right panel

7. **Download**
   - Click the download button to save the image

### View Your Gallery

1. Navigate to http://localhost:3000/dashboard
2. See all your generated images
3. Download any image by clicking the download button on hover

## Demo User Details

- **ID**: `demo-user-123`
- **Email**: `demo@example.com`
- **Starting Tokens**: 100
- **Member Status**: Yes (can access all prompts)

## Available Prompts

### Public Prompts (5 tokens each)
- 梦幻森林 - Dream forest
- 未来城市 - Futuristic city
- 宁静海滩 - Peaceful beach
- 山峰日出 - Mountain sunrise
- 星空夜景 - Starry night
- 樱花之春 - Cherry blossoms

### Members-Only Prompts (10 tokens each)
- 赛博朋克街道 - Cyberpunk street
- 魔法城堡 - Magic castle
- 水下世界 - Underwater world

## Testing Different Scenarios

### Test Insufficient Tokens

Generate images until your balance is below 5 tokens, then try to generate another image. You'll see an error message.

### Test Membership Gating

To test member-only features:

1. Update the demo user to non-member:
```bash
sqlite3 prisma/dev.db
UPDATE User SET isMember = 0 WHERE id = 'demo-user-123';
.exit
```

2. Refresh the page
3. Members-only prompts should now be locked

4. Restore member status:
```bash
sqlite3 prisma/dev.db
UPDATE User SET isMember = 1 WHERE id = 'demo-user-123';
.exit
```

### Test File Upload

1. Select any prompt
2. Click the upload area
3. Choose an image file
4. See the preview
5. Generate with the reference image
6. Click X to remove and try again

## Viewing Database

```bash
# Open Prisma Studio
DATABASE_URL="file:./dev.db" npx prisma studio
```

Opens at http://localhost:5555

View:
- Users and their token balances
- All prompts
- Generated images
- Transaction history

## Common Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Lint code
npm run lint

# View database
DATABASE_URL="file:./dev.db" npx prisma studio

# Reset database
rm prisma/dev.db
DATABASE_URL="file:./dev.db" npx prisma db push
DATABASE_URL="file:./dev.db" npx tsx prisma/seed.ts
```

## Troubleshooting

### "User not found" error
- Ensure seed script ran successfully
- Check `DEMO_USER_ID` in `.env` matches database

### Prisma commands fail
- Always prefix with `DATABASE_URL="file:./dev.db"`
- Or set it in your shell: `export DATABASE_URL="file:./dev.db"`

### Port 3000 already in use
- Change port: `npm run dev -- -p 3001`
- Or kill existing process

### Database is locked
- Close Prisma Studio if open
- Restart dev server

## Next Steps

1. ✅ Generate a few images
2. ✅ Check the dashboard
3. ✅ Explore different prompts
4. ✅ Test file upload
5. ✅ View transaction history in Prisma Studio
6. 📖 Read `IMAGE_GENERATION_IMPLEMENTATION.md` for architecture details
7. 📖 Read `GENERATION_FLOW_TESTS.md` for comprehensive testing
8. 🚀 Deploy to production (see deployment checklist in implementation doc)

## Development Notes

- Mock image generation is active (no real AI calls)
- To use real Gemini API:
  1. Get API key from https://makersuite.google.com/app/apikey
  2. Update `GEMINI_API_KEY` in `.env`
  3. Restart server

- All UI text is in Chinese
- Server logs are in English
- Toast notifications show in Chinese

## File Structure

```
/app
  /actions          # Server actions (API)
  /dashboard        # Gallery page
  /generate         # Generation page
  
/components
  /ui              # Reusable components
  
/lib
  prisma.ts        # Database client
  gemini.ts        # AI service
  logger.ts        # Logging & metrics
  
/prisma
  schema.prisma    # Database schema
  seed.ts          # Seed data
```

## Need Help?

- Check server logs: `tail -f dev.log`
- Check browser console for client errors
- Review `GENERATION_FLOW_TESTS.md` for detailed scenarios
- Open Prisma Studio to inspect database state

## Ready to Deploy?

See the "Production Considerations" section in `IMAGE_GENERATION_IMPLEMENTATION.md` for:
- Authentication setup
- Image storage configuration
- Database migration
- Security hardening
- Monitoring setup

---

**Happy Generating! 🎨✨**
