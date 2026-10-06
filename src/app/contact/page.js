import ContactForm from "@/components/contact-form";
import ContentPage from "@/components/content-page";
import { SITE } from "@/constants/site";

export const metadata = {
  title: "Contact Us",
  description: `Questions, feedback, bug reports or ideas for ${SITE.name}? Here's how to get in touch.`,
};

export default function ContactPage() {
  return (
    <ContentPage
      eyebrow="Contact"
      title="Contact Us"
      intro={`Have a question, found a problem, or have an idea that could make ${SITE.name} better? We'd love to hear from you.`}
    >
      <h2>Send us a message</h2>
      <p>For questions, feedback, bug reports or suggestions, fill in the form and we&apos;ll get back to you by email.</p>
      <ContactForm />

      <h2>Bug reports</h2>
      <p>When reporting a problem, it helps to include:</p>
      <ul>
        <li>What you were trying to do</li>
        <li>What happened</li>
        <li>What you expected to happen</li>
        <li>Your browser and device</li>
        <li>Any error message you saw</li>
      </ul>
      <p>
        Please don&apos;t send your full resume or personal details unless they&apos;re needed to explain the problem.
      </p>

      <h2>Feature requests</h2>
      <p>Tell us what you&apos;d like {SITE.name} to do and why it would make creating your resume easier.</p>
    </ContentPage>
  );
}
