# ClickUp submit Worker — deployment checklist

This Worker is the only thing that ever holds the ClickUp API token. The
checkup page never sees it. Nothing in this repo does either — the token
only exists as a Cloudflare Worker secret, set directly by you.

There's no `node`/`wrangler` installed in the environment this was built
in, and no tool available there could set a Worker secret or deploy on
your behalf anyway — that step needs to be yours regardless, so the token
never has to pass through anyone else. Two ways to do it; pick whichever's
easier.

## Option A — Cloudflare dashboard (no local install needed)

1. Go to **dash.cloudflare.com** → **Workers & Pages** → **Create** →
   **Create Worker**. Name it (e.g. `chinese-checkup-clickup-submit`).
2. Open the new Worker's editor and replace the default code with the
   full contents of `clickup-submit-worker.js` in this folder. Save/Deploy.
3. Go to the Worker's **Settings** → **Variables and Secrets** → **Add** →
   type **Secret**, name it exactly `CLICKUP_API_TOKEN`, and paste your
   ClickUp personal API token as the value. Save.
4. Deploy (if not already deployed after step 2). Copy the Worker's URL —
   it'll look like `https://chinese-checkup-clickup-submit.<your-subdomain>.workers.dev`.
5. Send me that URL. I'll drop it into `clickup-submit.js`
   (`CLICKUP_WORKER_URL`) back in the main site folder, so the results
   slide actually calls it.

## Option B — CLI (`wrangler`), if you'd rather

Requires Node.js installed first.

```bash
cd worker
npx wrangler login          # opens a browser to authorize your Cloudflare account
npx wrangler secret put CLICKUP_API_TOKEN
# paste your token when prompted -- it's never echoed or stored anywhere but Cloudflare
npx wrangler deploy
```

`wrangler deploy` prints the Worker's URL at the end — send that to me the
same as in Option A.

## After it's live

Test it once for real: submit the checkup with a throwaway email and no
`?ref=` in the URL, then check the Lead Magnet list for a new task named
after whatever company name you typed, with E-Mail filled in, Version =
China, Source = Cold, and Check-up completed ticked. Then try again with
`?ref=` set to an existing task's Ref Code value, and confirm that task's
E-Mail and Check-up completed update in place instead of a new task being
created.

## If the list ever changes

The field and dropdown-option IDs are hardcoded in
`clickup-submit-worker.js` (looked up directly from the live list, not
guessed). If "Lead Magnet" is ever rebuilt, renamed, or its fields
recreated, those IDs will change and the Worker will need updating to
match — ClickUp field IDs aren't stable across a field being deleted and
re-added, even under the same name.
