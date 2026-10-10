# Rireki

**A free, privacy-focused resume builder for clean, professional, ATS-friendly resumes.**
No account, no email, no paywall at the download button.

*Rireki* (履歴) is Japanese for "personal history", which is what a resume is.

---

## The problem

Try building a resume online and you'll often see the same pattern:

1. The site says it's **free**.
2. You spend half an hour typing in your work history, education and skills.
3. You click **Download**, and *then* you're asked to create an account, and then to pick a **subscription plan**.

By the time the paywall appears, you've already done all the work. That isn't free; it's a free trial you never agreed to.

Two more frustrations came up again and again:

- **Little or no control over the look.** Many builders lock you into a fixed design. You can't change the fonts,
  sizes, spacing or colours, rearrange sections, or move between layouts without starting over.
- **Pretty but hard to parse.** Many resumes are read by Applicant Tracking System (ATS) software before a human sees
  them. Heavy multi-column designs, graphics and text boxes can confuse that software, and builders rarely tell you
  which designs are the safer choice.

## The strategy

Rireki is built on a simple promise: **what you see is what you get, and it's free from start to finish.**

- **No bait-and-switch.** No sign-up, no email and no subscription anywhere in the flow, including the final download.
- **Your resume, your design.** Every template can be customised: fonts, sizes, line spacing, colours, margins,
  dividers and section order. Switch templates at any time and your content comes with you.
- **ATS-friendly by default, flexible by choice.** The recommended templates use a clean single-column layout with
  standard headings. Photo and two-column designs are available too, clearly labelled, so the choice is yours.
- **Start from what you have.** Upload an existing PDF or Word resume and keep editing instead of retyping it.
- **Private by design.** Your resume lives in your own browser, not in our database.

## Key decisions

| Decision | Why |
|---|---|
| **No accounts at all** | Accounts are what make the paywall possible. Without them there's nothing to gate, and nothing of yours to lose in a data breach. |
| **Resume data stays in the browser** (local storage) | No database of personal information to secure, sell or leak. The trade-off is that it doesn't sync between devices, so the app offers a downloadable backup file you can restore later. |
| **PDF through the browser's print dialog** | Gives a real-text PDF (selectable, searchable, clickable links, no watermark) without a paid PDF service or server-side rendering. |
| **Resume import is parsed on our own server, in memory** | PDF and Word text extraction needs server-side libraries. The file is read in memory, the extracted details go straight back to the browser, and the file is never stored or sent to a third party. |
| **Rule-based parsing, no AI** | Predictable, free to run, and your content isn't sent to an AI provider. Import is best-effort, so you're always asked to review the result. |
| **Live, paginated preview** | The preview, the template thumbnails and the printed PDF share one renderer with real A4 page breaks, so what you see is exactly what you download. |
| **Fully customisable theme** | A theme panel controls fonts, sizes, spacing, colours and dividers across every template, which is the flexibility most builders keep locked. |
| **Honest about ATS** | No "100% ATS-proof" claims. Recommended templates follow broadly ATS-friendly conventions, and riskier layouts are labelled. |
| **No analytics or trackers, self-hosted fonts** | Nothing on the site reports what you do to a third party. |

## Features

- **Templates.** A growing library: Classic, Centered, Elegant, Executive, Banner, Minimal, Timeline, Sidebar, Split,
  Profile and more, with switches for photo, two columns and grouped skills, favourites, and side-by-side comparison of up to 3 templates. Every single-column template also
  comes in a **Grouped skills** version that shows skills by category ("Frontend: React, Next.js").
- **Skill categories.** Optionally group skills into categories you name, reorder and rename; imported resumes with
  "Category: skill, skill" lines keep their categories.
- **Guided editor.** Personal details, summary, experience, skills and education, plus optional projects, hobbies,
  languages, achievements and certifications. Missing required fields are marked on each step.
- **Rich editing.** Drag-and-drop reordering of jobs, bullet points, skills and whole sections; `**bold**` and
  `*italic*` formatting; editable section titles.
- **Theme panel.** Fonts, sizes, line spacing, section spacing, page margins, accent, background and text colours,
  contact icons, dividers and photo shape.
- **Live preview** with zoom, real page breaks and example content until you start typing.
- **Import** an existing PDF or Word (.docx) resume, up to 10 MB.
- **Export.** Print or save as PDF, copy or download plain text for job portals, and save or restore a backup file.
- **Light and dark mode**, responsive down to phone screens.
- **Contact form** that emails messages to the site owner.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) and React 19, written in JavaScript
- [Tailwind CSS v4](https://tailwindcss.com) with [shadcn/ui](https://ui.shadcn.com) components on [Base UI](https://base-ui.com)
- [Zustand](https://zustand.docs.pmnd.rs) (persisted to local storage) for resume and builder state
- [dnd-kit](https://dndkit.com) for drag and drop, [react-to-print](https://github.com/MatthewHerbst/react-to-print) for PDF export
- [unpdf](https://github.com/unjs/unpdf) and [mammoth](https://github.com/mwilliamson/mammoth.js) for reading uploaded resumes
- [Zod](https://zod.dev) for form validation, [Resend](https://resend.com) for delivering contact form emails
- [lucide-react](https://lucide.dev) icons, fonts self-hosted through `next/font`

## Getting started

Requirements: Node.js 20 or later.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Only the contact form needs configuration. Create `.env.local` in the project root:

```bash
RESEND_API_KEY=re_...           # from resend.com
CONTACT_TO_EMAIL=you@example.com # where contact messages are delivered
# CONTACT_FROM_EMAIL="Rireki <hello@yourdomain.com>"  # optional, needs a domain verified in Resend
```

Without `CONTACT_FROM_EMAIL`, Resend's test sender is used, which can only deliver to the email address of your Resend
account. Everything else in the app works without any environment variables.

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Project structure

```
src/
├── app/                    Routes: home, templates, builder, about, contact, privacy, terms
│   ├── api/resume/parse/   Upload endpoint: extracts and parses resume text in memory
│   └── contact/actions.js  Server Action that emails contact form messages
├── components/
│   ├── builder/            Editor steps, preview, theme and templates panels, resume templates
│   ├── home/               Landing page sections
│   ├── templates/          Template gallery, filters and preview dialog
│   └── ui/                 Shared UI primitives (shadcn/ui) and decorations
├── constants/              Site details, landing page copy, builder steps, templates, sample resume
├── hooks/                  Pagination, step validation and builder helpers
├── lib/                    Resume parser, pagination, rich text and validation logic
└── store/                  Zustand stores (resume data, imported resume)
```

Most landing page text lives in `src/constants/home.js`, and site-wide details (name, tagline, legal dates) in
`src/constants/site.js`.

## Privacy at a glance

- Resume data is stored in your browser's local storage and never sent to us, except when you choose to **import**
  a file (read in memory on our server and not stored) or send a **contact form** message (delivered to us by email).
- No accounts, no analytics, no advertising or tracking scripts.
- See the in-app [Privacy Policy](src/app/privacy/page.js) for the full details.
