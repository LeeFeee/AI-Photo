# Image Generation Flow - Testing Guide

## Overview

This document provides detailed testing steps for the end-to-end image generation flow.

## Setup

The system is pre-configured with:
- Demo user: `demo-user-123`
- Initial token balance: 100 tokens
- Member status: `true` (has access to members-only prompts)
- Database: SQLite (dev.db)

## Feature Checklist

### ✅ Database Setup
- [x] Prisma schema with User, Prompt, GeneratedImage, Transaction models
- [x] SQLite database initialized
- [x] Seed data populated (demo user + 9 prompts)

### ✅ User Management
- [x] Demo user created with 100 tokens
- [x] Member status support
- [x] Token balance tracking

### ✅ Prompt Management
- [x] 9 preset prompts (6 public, 3 members-only)
- [x] Token costs: 5 tokens (public), 10 tokens (members-only)
- [x] Categories: 自然, 科幻, 奇幻
- [x] Membership gating

### ✅ Image Generation Flow
- [x] Prompt selection UI with membership badges
- [x] Reference image upload (optional, up to 5MB)
- [x] Token cost preview
- [x] Multi-step progress indicators (validating → generating → storing → completed)
- [x] Server action orchestration
- [x] Gemini AI integration (with mock fallback)
- [x] Atomic Prisma transactions for consistency

### ✅ Token System
- [x] Balance checking before generation
- [x] Token deduction on successful generation
- [x] Transaction record creation
- [x] No deduction on failure
- [x] Real-time balance updates in UI

### ✅ Error Handling
- [x] Insufficient tokens error
- [x] Membership required error
- [x] Prompt not found error
- [x] Generation failure error
- [x] Descriptive Chinese error messages
- [x] No state inconsistency on errors

### ✅ UI/UX Features
- [x] Progress step indicators with Chinese messages
- [x] Token balance display in header
- [x] Membership badge display
- [x] Locked prompt indicators
- [x] Token affordability indicators
- [x] Success/error toast notifications
- [x] Image gallery with download buttons
- [x] Reset functionality

### ✅ Server-Side Features
- [x] Server actions for all operations
- [x] Structured logging with context
- [x] Metrics tracking scaffolding
- [x] Database transaction safety
- [x] Error recovery

### ✅ Dashboard Integration
- [x] Display generated images
- [x] Show prompt titles and timestamps
- [x] Download functionality
- [x] Empty state when no images
- [x] Loading states

## Manual Testing Scenarios

### Scenario 1: Successful Generation (Public Prompt)

**Steps:**
1. Navigate to `/generate`
2. Verify token balance shows: 100 代币（会员）
3. Select a public prompt (e.g., "梦幻森林" - 5 tokens)
4. Verify "预计消耗" shows 5 代币
5. Verify "生成后余额" shows 95 代币
6. Click "生成图片"
7. Watch progress: 验证权限和余额 → 正在生成图片 → 保存图片和记录 → 生成完成
8. Verify success toast shows consumed/remaining tokens
9. Verify generated image appears in result panel
10. Verify token balance updates to 95
11. Navigate to `/dashboard`
12. Verify new image appears in gallery

**Expected Results:**
- ✅ Image generated successfully
- ✅ Tokens deducted (100 → 95)
- ✅ Transaction record created with type `token_consumption`
- ✅ GeneratedImage record created with status `completed`
- ✅ Image visible in dashboard

### Scenario 2: Successful Generation (Members-Only Prompt)

**Steps:**
1. Navigate to `/generate`
2. Select a members-only prompt (e.g., "赛博朋克街道" - 10 tokens)
3. Verify lock icon is NOT shown (user is member)
4. Verify "预计消耗" shows 10 代币
5. Click "生成图片"
6. Verify generation completes successfully
7. Verify token balance updates correctly

**Expected Results:**
- ✅ Member can access members-only prompts
- ✅ Generation succeeds with higher token cost
- ✅ Balance updated correctly

### Scenario 3: Insufficient Tokens

**Steps:**
1. Generate images until token balance is below a prompt's cost
2. Try to select a prompt you can't afford
3. Verify the prompt shows in red text
4. Attempt to generate
5. Verify error message displayed

**Expected Results:**
- ✅ Generate button disabled if insufficient tokens
- ✅ Clear error message: "代币余额不足"
- ✅ No tokens deducted
- ✅ No database records created

### Scenario 4: Membership Required (If Testing Non-Member)

To test this, you would need to change the demo user's `isMember` to `false` in the database:

```sql
UPDATE User SET isMember = 0 WHERE id = 'demo-user-123';
```

**Steps:**
1. Navigate to `/generate`
2. Try to click a members-only prompt
3. Verify prompt shows lock icon
4. Verify prompt is disabled/locked
5. Verify overlay shows "需要会员权限"

**Expected Results:**
- ✅ Members-only prompts are visually locked
- ✅ Cannot select locked prompts
- ✅ Clear membership requirement message

### Scenario 5: Reference Image Upload

**Steps:**
1. Navigate to `/generate`
2. Select a prompt
3. Click the upload area in "上传参考图片"
4. Select an image file (< 5MB)
5. Verify preview displays
6. Verify file name and size shown
7. Generate image
8. Verify generation works with reference image

**Expected Results:**
- ✅ Upload UI works correctly
- ✅ Preview displays
- ✅ File validation works (size, type)
- ✅ Reference image passed to generation

### Scenario 6: Multiple Generations

**Steps:**
1. Generate 3-4 images with different prompts
2. Verify each generation shows in result panel
3. Navigate to dashboard
4. Verify all images appear
5. Test download on each image

**Expected Results:**
- ✅ All generations tracked correctly
- ✅ Token balance decreases correctly
- ✅ All images appear in dashboard
- ✅ Downloads work for all images

### Scenario 7: Quick Regeneration

**Steps:**
1. Generate an image successfully
2. Wait for completion
3. Immediately select another prompt
4. Generate again
5. Verify both images appear in results

**Expected Results:**
- ✅ Can generate multiple times in session
- ✅ Results accumulate in UI
- ✅ All generations saved to database

### Scenario 8: Reset Functionality

**Steps:**
1. Select a prompt
2. Upload a reference image
3. Click reset button (RefreshCw icon)
4. Verify all selections cleared
5. Verify success toast shows

**Expected Results:**
- ✅ Prompt selection cleared
- ✅ Reference image removed
- ✅ Form reset to initial state

## Database Verification

After generating images, you can verify the database state:

```bash
# Connect to SQLite database
sqlite3 prisma/dev.db

# Check user tokens
SELECT id, name, tokens, isMember FROM User;

# Check generated images
SELECT id, userId, promptId, status, createdAt FROM GeneratedImage;

# Check transactions
SELECT id, userId, type, amount, balance, status, description FROM Transaction ORDER BY createdAt DESC;

# Check prompts
SELECT id, title, tokenCost, membersOnly FROM Prompt;
```

## Server Logs

Watch server logs for structured logging:

```
[2024-10-30T...] [INFO] Starting image generation | {"userId":"demo-user-123","promptId":"prompt-梦幻森林"}
[2024-10-30T...] [INFO] Token check passed | {"cost":5,"balance":100}
[2024-10-30T...] [INFO] Calling Gemini service | {"promptTitle":"梦幻森林"}
[2024-10-30T...] [INFO] Image generated successfully
[2024-10-30T...] [INFO] Image generation completed successfully | {"duration":2534,"newBalance":95,"imageId":"..."}
```

## Error Scenarios to Test

### Generation Failure (Simulated)

To test error handling, you could temporarily modify the Gemini service to return an error.

**Expected Results:**
- ✅ Error message displayed
- ✅ Progress shows "生成失败"
- ✅ No tokens deducted
- ✅ No database records created
- ✅ User can retry

## Performance Expectations

- Initial page load: < 1s
- Prompt/balance loading: < 500ms
- Image generation: 2-5s (mock), varies with real API
- Database operations: < 100ms
- File upload: instant for small files

## Accessibility Testing

1. Test keyboard navigation through prompts
2. Verify all buttons have proper aria-labels
3. Test with screen reader (prompts, status messages, errors)
4. Verify focus states visible
5. Test error messages have role="alert"

## Mobile Testing

1. Test on mobile viewport (375px)
2. Verify prompt list scrollable
3. Verify file upload touch-friendly
4. Verify images display correctly
5. Verify download works on mobile

## Integration Test Checklist

- [ ] Generate image with public prompt
- [ ] Generate image with members-only prompt
- [ ] Verify insufficient tokens handling
- [ ] Upload and use reference image
- [ ] Download generated image
- [ ] View images in dashboard
- [ ] Reset form mid-generation
- [ ] Generate multiple images in sequence
- [ ] Verify transaction records correct
- [ ] Verify atomic token deduction
- [ ] Test all error scenarios
- [ ] Verify logging output
- [ ] Test accessibility features
- [ ] Test mobile responsiveness

## Known Limitations

1. **Authentication**: Currently uses hardcoded demo user. In production, integrate with NextAuth or similar.
2. **Image Storage**: Currently uses external URLs. In production, upload to S3/Cloudinary.
3. **AI Integration**: Uses mock generation. Configure real Gemini API key or integrate with actual image generation service.
4. **File Upload**: Reference images stored as base64 in memory. In production, upload to storage service.
5. **Pagination**: Dashboard shows all images. Add pagination for large collections.

## Production Readiness Checklist

Before deploying to production:

- [ ] Replace demo user with real authentication
- [ ] Configure real AI API keys
- [ ] Set up image storage service (S3, Cloudinary, etc.)
- [ ] Add rate limiting
- [ ] Add request validation/sanitization
- [ ] Set up monitoring and alerting
- [ ] Configure production database (PostgreSQL recommended)
- [ ] Add image compression/optimization
- [ ] Implement proper file upload to storage
- [ ] Add pagination to dashboard
- [ ] Set up backup strategy
- [ ] Add admin panel for user/prompt management
- [ ] Implement proper error tracking (Sentry, etc.)
- [ ] Add analytics events
- [ ] Set up CI/CD pipeline
- [ ] Load testing

## Support & Troubleshooting

### Issue: "User not found" error
- Check DEMO_USER_ID in .env matches database
- Re-run seed script if needed

### Issue: "Prompt not found" error
- Verify prompts exist in database
- Check prompt ID being passed

### Issue: Tokens not deducting
- Check Prisma transaction is succeeding
- Look for errors in server logs
- Verify database connection

### Issue: Images not appearing in dashboard
- Check generatedImage table has records
- Verify status is 'completed'
- Check image URLs are accessible

### Issue: File upload not working
- Check file size (must be < 5MB)
- Verify file type is image/*
- Check browser console for errors
