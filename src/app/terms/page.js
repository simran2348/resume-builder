import Link from "next/link";

import ContentPage from "@/components/content-page";
import { SITE } from "@/constants/site";

export const metadata = {
  title: "Terms & Conditions",
  description: `The terms that apply when you use ${SITE.name}, the free ATS-friendly resume builder.`,
};

export default function TermsPage() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Terms & Conditions"
      meta={`Last updated: ${SITE.legalLastUpdated}`}
      intro={`These terms apply when you use ${SITE.name}. By using the website, you agree to them.`}
    >
      <h2>The service</h2>
      <p>
        {SITE.name} provides tools for creating, editing, formatting, importing and downloading resumes. The service is
        provided free of charge, as it is currently available on the website, and features may change over time.
      </p>

      <h2>Your content</h2>
      <p>
        The information you enter into your resume belongs to you. You are responsible for making sure the information
        in your resume is accurate and that you have the right to use it.
      </p>

      <h2>Uploaded resumes</h2>
      <p>
        {SITE.name} can import existing PDF and Word (.docx) resumes. Automatic parsing is best-effort: some details may
        be missed, placed in the wrong section or imported incorrectly. Always review imported information before using
        or submitting the resulting resume.
      </p>

      <h2>Acceptable use</h2>
      <p>You agree not to use {SITE.name} to:</p>
      <ul>
        <li>Create fraudulent documents</li>
        <li>Impersonate another person</li>
        <li>Misrepresent your qualifications or experience</li>
        <li>Abuse, overload or disrupt the service</li>
        <li>Attempt to compromise the application or its infrastructure</li>
        <li>Reverse engineer the service for malicious purposes</li>
      </ul>

      <h2>No guarantee of employment</h2>
      <p>{SITE.name} cannot guarantee:</p>
      <ul>
        <li>That a resume will pass every Applicant Tracking System (ATS)</li>
        <li>That a recruiter will select your application</li>
        <li>That you will receive an interview</li>
        <li>That you will receive a job offer</li>
      </ul>
      <p>
        ATS software varies between employers and vendors, and hiring decisions depend on many factors. {SITE.name} is
        designed around broadly ATS-friendly formatting but cannot guarantee any specific outcome.
      </p>

      <h2>Data responsibility</h2>
      <p>
        Your resume is stored locally in your browser, not on our servers. You are responsible for keeping your own
        backups: clearing your browser data, using the &ldquo;Reset resume&rdquo; button or changing devices or browsers
        may remove or hide your locally stored information. Download your PDF and use &ldquo;Save backup&rdquo; to keep a
        copy.
      </p>

      <h2>The service is provided &ldquo;as is&rdquo;</h2>
      <p>
        We work to keep {SITE.name} reliable, but the service is provided &ldquo;as is&rdquo; without warranties of any
        kind, and we are not liable for any loss of data or other damages arising from its use, to the extent permitted
        by law.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We may update these terms as the service evolves. We&apos;ll update the &ldquo;Last updated&rdquo; date when we
        do, and continuing to use {SITE.name} after an update means you accept the updated terms.
      </p>

      <h2>Questions</h2>
      <p>
        If you have questions about these terms, please visit our <Link href="/contact">Contact page</Link>.
      </p>
    </ContentPage>
  );
}
