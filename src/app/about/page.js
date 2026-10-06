import Link from "next/link";

import ContentPage from "@/components/content-page";
import { SITE } from "@/constants/site";

export const metadata = {
  title: "About Us",
  description: `Why ${SITE.name} exists: a free, privacy-focused, ATS-friendly resume builder with no account required.`,
};

export default function AboutPage() {
  return (
    <ContentPage
      title={`About ${SITE.name}`}
      intro={`${SITE.name} exists to solve a simple problem: creating a professional resume shouldn't require complicated templates, an account or a paid subscription.`}
    >
      <p>
        Many resumes are processed by Applicant Tracking System (ATS) software before they reach a recruiter.
        Complicated layouts can sometimes make that process harder. {SITE.name} focuses on clean structure,
        straightforward formatting and ATS-friendly resume design, so your experience is easy to read for both
        software and people.
      </p>

      <h2>What we&apos;re built around</h2>

      <h3>ATS-friendly formatting by default</h3>
      <p>
        Our recommended templates use a single-column structure and standard section headings, designed to stay easy
        for recruiters and resume-parsing software to understand. Photo and two-column designs are also available and
        clearly labelled, so the choice is always yours.
      </p>

      <h3>Free to use</h3>
      <p>
        You can create, preview and download your resume as a PDF without an account, an email address or a paywall.
      </p>

      <h3>Privacy by design</h3>
      <p>
        Your resume is saved in your own browser rather than on a {SITE.name} server. If you choose to import an existing
        resume, the file is processed only to read its text and isn&apos;t stored. Read more in our{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h3>Your content stays yours</h3>
      <p>
        {SITE.name} helps with structure and formatting. Your experiences, achievements, skills and professional story
        remain yours. We don&apos;t use AI to write or rewrite your resume.
      </p>

      <h2>What you can do here</h2>
      <p>Build a resume from scratch or upload an existing PDF or Word (.docx) resume. You can:</p>
      <ul>
        <li>Import the information from an existing resume</li>
        <li>Edit your details, experience, education, skills, projects and more</li>
        <li>Reorder sections, or remove optional ones</li>
        <li>Switch between templates and adjust fonts, colours and spacing</li>
        <li>Preview the result live, page by page</li>
        <li>Download a PDF, copy a plain-text version, or save a backup file</li>
      </ul>

      <h2>Questions?</h2>
      <p>
        We&apos;d love to hear from you. Visit our <Link href="/contact">Contact page</Link>.
      </p>
    </ContentPage>
  );
}
