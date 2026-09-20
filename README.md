# DBtext

DBtext is a private writing helper for a small high-school study group. It
turns difficult source text into simple, natural educational writing. It does
not save users' source text or results.

## Run it on your computer

1. Install [Node.js 22 or newer](https://nodejs.org/).
2. Install the project:

   ```bash
   npm install
   ```

3. Copy the example settings file:

   ```bash
   cp .env.example .env.local
   ```

4. Open `.env.local` and change:
   - `APP_PASSCODE` to the passcode shared with your five users.
   - `AUTH_SECRET` to a long random value. Generate one with
     `openssl rand -base64 32`.
   - `AI_GATEWAY_API_KEY` to an
     [AI Gateway API key](https://vercel.com/ai-gateway) when running locally.

5. Start the app:

   ```bash
   npm run dev
   ```

6. Visit [http://localhost:3000](http://localhost:3000).

## Deploy it on Vercel

1. Import this repository into [Vercel](https://vercel.com/new).
2. Add `APP_PASSCODE` and `AUTH_SECRET` in the project's Environment Variables.
3. Deploy. Vercel deployments can authenticate to AI Gateway with OIDC, so an
   AI Gateway API key is normally only needed for local development.
4. Share the deployment link and passcode only with the intended users.

## Change the output

- Edit the writing instructions in `lib/ai/educational-rewriter.ts`.
- Change `AI_MODEL` in the environment settings to use another current Gateway
  model. The default is `google/gemini-2.5-flash-lite`, which is compatible
  with the current Gateway free tier.
- Source text is limited to 8,000 characters and model output to 1,400 tokens
  to control costs.

## Useful commands

```bash
npm run dev      # Start local development
npm run check    # Check formatting and code quality
npm run build    # Make a production build
```
