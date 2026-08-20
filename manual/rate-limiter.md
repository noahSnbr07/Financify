__disclaimer__: this content is AI-Generated and may contain outdated terms/alternative structures

# Rate Limiting Quick Reference

## Installation (2 minutes)

```bash
# 1. Copy files to your Next.js project
cp lib/rate-limit.ts your-project/lib/
cp lib/rate-limit-middleware.ts your-project/lib/
cp middleware.ts your-project/

# 2. You're done! Middleware auto-applies to /api/* routes
```

## The 3 Main Ways to Use It

### 1️⃣ Automatic (Default)
Middleware handles everything. No code changes needed.

```
GET /api/users ─→ Checked by middleware
GET /api/auth/login ─→ Stricter limit by middleware
```

Just edit `middleware.ts` to customize limits per route.

---

### 2️⃣ Wrap Route Handler
Quick protection for a single route:

```typescript
// app/api/submit/route.ts
import { withRateLimit } from '@/lib/rate-limit-middleware';

export const POST = withRateLimit(
  async (request) => {
    return NextResponse.json({ ok: true });
  },
  { limit: 10, window: 60000 }  // 10 per minute
);
```

---

### 3️⃣ Manual Control
For complex logic inside handler:

```typescript
// app/api/complex/route.ts
import { checkRateLimit } from '@/lib/rate-limit-middleware';

export async function POST(request) {
  const check = await checkRateLimit(request, { limit: 5, window: 60000 });
  
  if (!check.success) {
    return check.response;  // 429 response
  }

  // Your logic here
  return NextResponse.json({ success: true });
}
```

---

## Common Scenarios

### Protect Form Submissions
```typescript
export const POST = withRateLimit(
  async (req) => handleFormSubmit(req),
  { limit: 3, window: 60 * 60 * 1000 }  // 3 per hour
);
```

### API with High Volume
```typescript
export const GET = withRateLimit(
  async (req) => fetchData(req),
  { limit: 100, window: 60 * 1000 }  // 100 per minute
);
```

### Login Attempts
```typescript
import { checkRateLimit } from '@/lib/rate-limit-middleware';

export async function POST(request) {
  // 5 attempts per 15 minutes
  const check = await checkRateLimit(request, {
    limit: 5,
    window: 15 * 60 * 1000
  });

  if (!check.success) {
    return NextResponse.json(
      { error: 'Too many login attempts' },
      { status: 429 }
    );
  }

  return handleLogin(request);
}
```

### Expensive Endpoint
```typescript
export const POST = withRateLimit(
  async (req) => runExpensiveOperation(req),
  { limit: 1, window: 60 * 1000 }  // 1 per minute
);
```

### API Key Rate Limiting
```typescript
import { identifiers } from '@/lib/rate-limit-middleware';

export const GET = withRateLimit(
  async (req) => getData(req),
  { limit: 1000, window: 60 * 1000 },
  identifiers.apiKey  // Rate limit by API key
);
```

---

## Presets

```typescript
import { RateLimitPresets } from '@/lib/rate-limit';

RateLimitPresets.strict     // 5/min
RateLimitPresets.standard   // 30/min (most common)
RateLimitPresets.relaxed    // 100/min
RateLimitPresets.api        // 60/min
RateLimitPresets.auth       // 5/15min
RateLimitPresets.search     // 20/10sec
```

Use them:
```typescript
import { withRateLimit, RateLimitPresets } from '@/lib/rate-limit-middleware';

export const POST = withRateLimit(
  handler,
  RateLimitPresets.auth  // 5 attempts per 15 minutes
);
```

---

## Response When Rate Limited

HTTP 429 response:
```json
{
  "error": "Too many requests",
  "retryAfter": 45
}
```

Headers:
```
HTTP/1.1 429 Too Many Requests
Retry-After: 45
X-RateLimit-Limit: 30
X-RateLimit-Current: 31
X-RateLimit-Reset: 1723856432
```

---

## Rate Limit By Different Things

### By IP (Default)
Already works. No config needed.

### By User ID
```typescript
import { identifiers } from '@/lib/rate-limit-middleware';

function getUserId(req) {
  return req.headers.get('x-user-id');
}

export const POST = withRateLimit(
  handler,
  RateLimitPresets.standard,
  identifiers.userId(getUserId)
);
```

### By API Key
```typescript
import { identifiers } from '@/lib/rate-limit-middleware';

export const GET = withRateLimit(
  handler,
  RateLimitPresets.api,
  identifiers.apiKey  // Looks at Authorization/x-api-key headers
);
```

### Custom Logic
```typescript
export const POST = withRateLimit(
  handler,
  RateLimitPresets.standard,
  async (req) => {
    const user = await getUser(req);
    // Different limit per user level
    return user?.isPremium ? `premium:${user.id}` : `free:${getClientIp(req)}`;
  }
);
```

---

## Handle Rate Limit on Frontend

React hook:
```typescript
'use client';

import { useState } from 'react';

export function useApi() {
  const [retryAfter, setRetryAfter] = useState(null);

  const call = async (url, options = {}) => {
    const res = await fetch(url, options);
    
    if (res.status === 429) {
      const wait = parseInt(res.headers.get('Retry-After') || '60');
      setRetryAfter(wait);
      return null;
    }

    return await res.json();
  };

  return { call, retryAfter };
}

// Use it:
function MyComponent() {
  const { call, retryAfter } = useApi();

  return (
    <button onClick={() => call('/api/submit')} disabled={retryAfter}>
      {retryAfter ? `Wait ${retryAfter}s` : 'Submit'}
    </button>
  );
}
```

---

## Debugging

### Check if it's working
Add a test route:
```typescript
// app/api/test/route.ts
import { withRateLimit } from '@/lib/rate-limit-middleware';

export const GET = withRateLimit(
  async () => NextResponse.json({ ok: true }),
  { limit: 3, window: 60000 }
);
```

Test it:
```bash
# Should work 3 times, then 429
for i in {1..5}; do curl http://localhost:3000/api/test; done
```

### Log what's happening
```typescript
// In middleware.ts or route handler
console.log(`Rate limit check: ${identifier}, ${result.current}/${config.limit}`);
```

### Check why middleware isn't applied
1. Verify `middleware.ts` exists in project root
2. Check `config.matcher` includes your routes
3. Restart dev server

---

## Scaling to Multiple Servers

**Single server?** You're good as-is.

**Multiple servers?** Each server has its own memory. To share rate limits:

Option 1: Use API Gateway (nginx, Cloudflare)
- Let your gateway do rate limiting
- Simplest solution

Option 2: Add Redis (~20 min)
```bash
npm install redis
# Then modify lib/rate-limit.ts to use Redis client
```

Option 3: Use Drizzle/Prisma with database
- More complex but works with any database

---

## Migration Checklist

Coming from Upstash/third-party?

- [ ] Copy 3 files to project
- [ ] Remove env variables for third-party service
- [ ] Update route handlers (if any custom logic)
- [ ] Test with `for i in {1..10}; do curl /api/test; done`
- [ ] Remove third-party service account
- [ ] Delete unused npm packages
- [ ] Celebrate cost savings 🎉

---

## Common Issues

**"Rate limit not working"**
- Check middleware.ts exists in project root
- Restart dev server
- Check console for errors

**"Too aggressive"**
- Increase limit or window:
  ```typescript
  { limit: 100, window: 60000 }  // 100 per minute
  ```

**"Wrong IP when behind proxy"**
- Works automatically with Vercel/Cloudflare
- Custom proxy? Make sure it sends X-Forwarded-For header

**"Memory usage"**
- Normal: < 1 MB per 10k active IPs
- Cleanup runs every 60 seconds
- If concerned, add Redis

---

## Files You Need

```
your-project/
├── lib/
│   ├── rate-limit.ts           ← Core logic
│   └── rate-limit-middleware.ts ← Route helpers
├── middleware.ts                ← Global middleware
└── app/
    └── api/
        └── your-routes/...
```

That's it. 3 files, ~400 lines total, zero dependencies.

---

## Need Help?

- Check `RATE_LIMIT_SETUP.md` for detailed docs
- Look at `examples/` for code samples
- Modify the code directly—it's yours to own

No external service. No rate limit on your rate limiter.