# Diframe website

The bilingual (English and French) website for Diframe, built with Next.js 16, React 19 and Tailwind CSS 4.

## Run it on your computer

```bash
npm install
npm run dev
```

Then open http://localhost:3000. To check the production version, run `npm run build` and then `npm start`.

## Editing the text

All visible text lives in two files, one per language:

- `content/en.json`
- `content/fr.json`

Keep the same structure in both files: the same keys, the same number of items, in the same order. After editing, run `npm run build`. It stops with an error if something is missing.

Some keys aren't visible text:

- **`icon`** (on each service) chooses that service's icon. It moves with the service if you reorder the list. The available names are in `components/solutions/service-icon.tsx`.
- **`contact.email`** shows the public email address on the contact page. Leave it empty (`""`) to hide it.

### Adding Showcase images

1. Put the image in `public/showcase/`, such as `public/showcase/brand-identity.webp`. WebP or JPEG, about 2400 px on the long side.
2. In both content files, fill in the matching item under `showcase.items`:
   - `"image": "/showcase/brand-identity.webp"`
   - `"alt"`: what the image shows, in that file's language
   - `"caption"`: an optional short line shown under the image

Frames without an image show the "We're preparing this gallery" note.

### Adding client logos or certification badges

Put the file in `public/brand/clients/` or `public/brand/certifications/`. Then add it to `lib/brand-assets.ts`, using exactly the name written in the content files. A name without a file is shown as text.

## Settings

Copy `.env.example` to `.env.local` for local work. Set the same values in Vercel under **Project → Settings → Environment Variables**.

| Name | What it's for |
|---|---|
| `RESEND_API_KEY` | Sends contact form requests. Create the key at resend.com. |
| `CONTACT_TO_EMAIL` | The inbox that receives requests: `nandy@diframe.studio` |
| `CONTACT_FROM_EMAIL` | The sender, on the domain verified with Resend: `Diframe Website <website@diframe.studio>` |
| `NEXT_PUBLIC_SITE_URL` | Optional. Leave it empty to use `https://diframe.studio`. |

Until all three email settings are set, the form tells visitors their request wasn't sent, and keeps their text.

## Launch checklist

### 1. Email (Resend)
1. Create a Resend account and add the domain `diframe.studio`.
2. Add the DNS records Resend lists in Hostinger's DNS settings for `diframe.studio`.
3. Wait until Resend shows the domain as verified.

Resend's records sit on their own sub-names, so they don't affect your existing Hostinger mailbox. Don't change or delete the existing MX records.

### 2. Hosting (Vercel)
1. Push this project to a GitHub repository.
2. Create a Vercel account. The site starts on the free Hobby plan. Vercel's terms limit Hobby to non-commercial use, so plan to move to Pro ($20/month). Your projects and settings carry over when you upgrade.
3. Import the repository. Vercel detects Next.js; keep its default settings.
4. Add the settings from the table above, then deploy.
5. Open the `.vercel.app` address Vercel gives you, and send a test request through the contact form. It should arrive at `nandy@diframe.studio`.

### 3. Domain
1. In Vercel, open **Project → Settings → Domains**, and add `diframe.studio` and `www.diframe.studio`.
2. Vercel shows the exact DNS records to set. Enter them in Hostinger, replacing the website records that point to Hostinger's own hosting (the `A` record for `@`, and `www`).
3. **Keep the MX records unchanged**, or email to `nandy@diframe.studio` will stop working.
4. Wait until Vercel shows the domain as valid. HTTPS is set up automatically.

### 4. After launch
- Send another test request from the live site.
- Open `https://diframe.studio/sitemap.xml` and `https://diframe.studio/robots.txt` to check that both load.
- Add the site to [Google Search Console](https://search.google.com/search-console) and submit the sitemap.
- Share a page link in a messaging app to check the preview image and title.
- Check the site on a real iPhone (Safari), an Android phone, and Firefox.

## Before launch: content to confirm

- The privacy notice (`privacy` in the content files) is a draft. Have it reviewed, and add your providers' names once they're chosen.
- Showcase images: fill the frames, or decide what to do with them.
- Certification names and badge usage.
