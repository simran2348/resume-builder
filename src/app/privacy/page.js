import Link from "next/link";

import ContentPage from "@/components/content-page";
import { SITE } from "@/constants/site";

export const metadata = {
  title: "Privacy Policy",
  description: `How ${SITE.name} handles your resume data: stored in your browser, not on our servers.`,
};

// Keep every statement in line with the implementation:
// - resume data: zustand persist → localStorage ("resume-builder", "imported-resume")
// - uploads: POST /api/resume/parse, parsed in memory, nothing stored, no third-party service
// - no analytics, advertising or tracking scripts; fonts are self-hosted via next/font
export default function PrivacyPage() {
  return (
    <ContentPage
      title="Privacy Policy"
      meta={`Last updated: ${SITE.legalLastUpdated}`}
      intro={`Your privacy matters, especially when you're creating a document full of personal and professional information. This policy explains what happens to your data when you use ${SITE.name}.`}
    >
      <h2>Your resume data</h2>
      <p>
        Everything you enter into {SITE.name}, including your name, contact details, photo, work history, education,
        skills and projects, is stored locally in your browser on your device, using your browser&apos;s local storage.
        Your template, theme settings and favourite templates are stored the same way.
      </p>
      <p>
        Editing, previewing and creating your PDF all happen in your browser. We don&apos;t have accounts or a database
        of resumes, and the information you type into the editor is not sent to or stored on our servers.
      </p>

      <h2>Uploaded resumes</h2>
      <p>
        If you choose to import an existing resume (PDF or Word .docx, up to 10 MB), the file is sent to our server so its
        text can be extracted. The file is processed in memory, the extracted details are sent straight
        back to your browser, and the file is not saved or shared with any third-party service.
      </p>
      <p>
        The extracted details are then stored in your browser like the rest of your resume. You can remove an uploaded
        resume at any time from the home page.
      </p>

      <h2>Data sharing</h2>
      <p>
        {SITE.name} does not sell, rent or share your resume information. Because your resume is stored in your
        browser, we never receive the information you type into the editor.
      </p>

      <h2>Local storage</h2>
      <p>Because your resume lives in your browser&apos;s local storage, it:</p>
      <ul>
        <li>Stays on the device and browser where you created it</li>
        <li>Doesn&apos;t automatically sync between devices or browsers</li>
        <li>Is removed if you clear your browser or site data, or use the &ldquo;Reset resume&rdquo; button</li>
        <li>Can be seen by anyone with access to your browser profile</li>
      </ul>
      <p>
        We recommend downloading a PDF of your resume and using &ldquo;Save backup&rdquo; on the Preview &amp; download
        step to keep a copy you can restore later.
      </p>

      <h2>Cookies and analytics</h2>
      <p>
        {SITE.name} doesn&apos;t use advertising, analytics or tracking cookies, and doesn&apos;t include third-party
        analytics or advertising scripts. Fonts are served from our own site, not loaded from a third party. Local storage
        is used only to save your resume and preferences, as described above.
      </p>

      <h2>Hosting and technical logs</h2>
      <p>
        Like most websites, {SITE.name} runs on hosting infrastructure that may automatically record standard technical
        information about requests, such as IP addresses, browser type, the pages requested and timestamps, for security,
        reliability and troubleshooting. If an uploaded file can&apos;t be read, a technical error message may be logged;
        the contents of your resume are not intentionally logged.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy if {SITE.name}&apos;s features or data practices change. When we do, we&apos;ll update
        the &ldquo;Last updated&rdquo; date at the top of this page.
      </p>

      <h2>Questions</h2>
      <p>
        If you have questions about this policy, please visit our <Link href="/contact">Contact page</Link>.
      </p>
    </ContentPage>
  );
}
