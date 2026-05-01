# Developer and Operations Guide

## Local development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure `.env.local` with required Supabase values.
3. Start development server:
   ```bash
   npm run dev
   ```

## Quality checks

Run these before pushing:

```bash
npm run typecheck
npm run test
npm run build
```

## Deployment

1. Import the repository in Vercel.
2. Set environment variables for preview and production.
3. Apply `supabase/schema.sql` to the target Supabase project.
4. Deploy and verify authenticated hub and API behavior.

## Reference docs

- API contracts: [../api-reference.md](../api-reference.md)
- Architecture details: [../architecture.md](../architecture.md)
- Database + RLS details: [../database-schema.md](../database-schema.md)
