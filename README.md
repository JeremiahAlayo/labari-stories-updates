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
- A lightweight editorial workspace at `/admin`
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

Production build:

```bash
npm run build
npm start
```

## Managing Posts

Open the admin workspace at:

```text
http://localhost:3000/admin
```

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

The `/admin` page provides a simple editorial workspace using browser local storage. Editors can manage title, slug, SEO description, category, platform area, audience, authors, social captions, publish status, approval status, final approver, reviewer notes, date, reading time, visual tone, and full article sections. The same structure can later be connected to an API, CMS, or database.

Suggested editorial flow:

1. Social media team creates or edits a draft.
2. The post is marked as `submitted`.
3. Head of Social Media reviews notes, caption, and article body.
4. If approved, approval status becomes `approved`.
5. Only approved posts should be moved to public `published` status.

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
- Add image upload support
- Add author profiles
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
