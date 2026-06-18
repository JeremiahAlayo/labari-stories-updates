# Labari Stories & Updates

A standalone JavaScript blog project for Labari platform news, educational guides, tutorials, announcements, and SEO-friendly articles.

## Overview

This project provides a polished publishing area for Labari with:

- A public blog index
- Individual article pages
- Responsive article cards
- Category filtering
- Search
- SEO metadata
- Sample posts for layout testing
- A CMS-style editorial workspace at `/admin`
- Browser text-to-speech controls on article pages

The code is organized so it can be reviewed, maintained, and connected to a production content source later without changing the public user experience.

## Tech Stack

- JavaScript
- Next.js App Router
- React
- CSS

The project avoids unnecessary packages and keeps the structure straightforward for future platform work.

## Project Structure

```text
app/
  admin/
  blog/
components/
data/
styles/
utils/
public/
README.md
```

## Install and Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000/blog`.

Admin/editorial workspace:

```text
http://localhost:3000/admin
```

Production build:

```bash
npm run build
npm start
```

GitHub Pages static build:

```bash
npm run build:pages
```

## Managing Posts

Sample posts live in `data/posts.js`.

Post shape:

```js
{
  title: "Post title",
  slug: "post-title",
  description: "Short SEO-friendly description",
  date: "2026-06-12",
  category: "Announcements",
  platformArea: "Home",
  audience: "All readers",
  authorId: "labari-editorial",
  authorName: "Labari Editorial",
  submittedBy: "Social Media Team",
  approvalStatus: "submitted",
  finalApprover: "Head of Social Media",
  socialChannel: "Website, Instagram",
  readTime: "4 min read",
  status: "published",
  imageTone: "green",
  content: [
    {
      heading: "Section heading",
      paragraphs: ["Article paragraph"]
    }
  ]
}
```

Only posts with `status: "published"` appear on the public blog.

The `/admin` page provides a CMS-style publishing workspace using browser local storage for review purposes. It is structured like a professional content platform so the team can evaluate the workflow before connecting it to the main Labari backend.

Current admin capabilities include:

- Dashboard overview
- Blog post list with search and filters
- Create/edit post workspace
- Dynamic categories
- Dynamic tags
- Authors and contributor management
- Role preview for Super Admin, Head of Social, Final Approver, Content Manager, Editor, Author, and Contributor
- Review queue
- Approval workflow board
- Published and scheduled post views
- Media library placeholder
- Approval comments and feedback
- Analytics summary placeholder
- User roles and permissions screen
- Settings screen
- Activity logs
- Bulk post actions
- Featured and pinned post controls
- Archive and restore-to-draft controls
- Reading time estimate
- Revision history records
- SEO title, meta description, and slug controls
- Featured image URL field
- Scheduled publishing field

Because this is still a standalone review module, admin data is stored in the reviewer browser only. Production integration should connect these screens to authenticated Labari users, server-side permissions, a database, media storage, notification services, and a real analytics API.

Suggested editorial flow:

1. Author or contributor creates a draft.
2. Draft is submitted for review.
3. Head of Social or Admin Approver approves, rejects, or requests changes.
4. Approved content moves to final approval.
5. Final approver publishes or schedules the post.
6. Published posts become visible on the public blog.

## Analytics

Google Analytics 4 is supported through an environment variable. Create `.env.local` and add:

```text
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Do not commit real analytics IDs if the team wants to keep them private. The included `.env.example` shows the expected variable name.

## Public Preview

This project can be shown in two ways:

- GitHub repository for code review.
- GitHub Pages or Vercel for non-technical reviewers who only need a live link.

For GitHub Pages, build with `npm run build:pages` and publish the generated `out/` folder to the `gh-pages` branch.

Recommended platform areas include:

- Home
- Browse
- Dashboard
- Library
- Book Pages
- Authors
- Account & Billing
- Recommendations

## SEO

The project includes:

- Clean URLs such as `/blog/introducing-labari-every-book-your-way`
- Page titles and meta descriptions
- Canonical URLs
- Article Open Graph metadata
- Readable slugs
- Category, date, and reading-time metadata

## Integration Notes

The public routes and components are intentionally separated from the content data source. A future production setup can replace `data/posts.js` with an API, CMS, or database while keeping the same page structure.

Recommended next steps:

- Connect posts to a backend or CMS
- Add authenticated admin access
- Connect authors to real Labari user accounts
- Add server-side roles and permissions
- Add image upload and media storage
- Add notification delivery for review and approval events
- Add hard-delete trash and restore rules
- Add live GA4/dashboard analytics from the production analytics source
- Add pagination for larger post collections
- Add sitemap and RSS feed generation
- Add automated tests for filtering, routing, and post rendering

## Git Workflow

```bash
git checkout -b feature/labari-blog-module
git add .
git commit -m "feat: build Labari stories and updates"
git push -u origin feature/labari-blog-module
```
