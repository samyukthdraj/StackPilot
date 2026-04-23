"use client";
import { PremiumPageLayout } from "@/components/landing/premium-page-layout";

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-10">
    <h2 className="font-bold text-[#f5c842] mb-4 uppercase tracking-widest text-sm">
      {title}
    </h2>
    <div className="text-gray-300 leading-relaxed space-y-3 text-[15px]">
      {children}
    </div>
  </div>
);

export default function TermsPage() {
  return (
    <PremiumPageLayout>
      <section className="pt-4 md:pt-32 pb-20 px-4 md:px-8 max-w-3xl mx-auto relative z-10 text-white">
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-[#f5f0e8]">
            Terms & Conditions
          </h1>
          <p className="text-gray-400">
            Effective Date: April 6, 2026 &nbsp;·&nbsp; Last Updated: April 6,
            2026
          </p>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-2xl p-8 md:p-12 shadow-xl space-y-8">
          <p className="text-gray-300 text-[15px] leading-relaxed">
            Please read these Terms and Conditions (&quot;Terms&quot;) carefully
            before using StackPilot (&quot;Service&quot;), operated by
            StackPilot team (&quot;we&quot;, &quot;us&quot;). By accessing or
            using StackPilot, you agree to be bound by these Terms. If you do
            not agree, do not use the Service.
          </p>

          <Section title="1. Eligibility">
            <p>
              You must be at least 13 years of age to use StackPilot. By using
              the Service, you represent and warrant that you meet this
              requirement and have the legal capacity to enter into a binding
              agreement.
            </p>
          </Section>

          <Section title="2. Your Account">
            <p>
              You are responsible for maintaining the confidentiality of your
              account credentials and for all activities that occur under your
              account. You agree to notify us immediately of any unauthorized
              use of your account.
            </p>
            <p>
              You may register via email/password or through a supported OAuth
              provider (Google, GitHub, or Microsoft). By using OAuth, you
              authorize us to access the basic profile information shared by
              those providers.
            </p>
            <p>
              We reserve the right to suspend or terminate your account if we
              detect abuse, violation of these Terms, or fraudulent activity.
            </p>
          </Section>

          <Section title="3. Permitted Use">
            <p>
              StackPilot grants you a limited, non-exclusive, non-transferable,
              revocable licence to access and use the Service for your personal,
              non-commercial career development purposes.
            </p>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Use the Service for any unlawful purpose or in violation of any
                applicable law.
              </li>
              <li>
                Upload malicious files, viruses, or any content that could harm
                our systems or other users.
              </li>
              <li>
                Attempt to reverse-engineer, scrape, or extract data from our
                platform in an automated or unauthorized manner.
              </li>
              <li>
                Misrepresent your identity or impersonate any person or entity.
              </li>
              <li>
                Use the Service to generate or distribute spam, unsolicited
                communications, or misleading content.
              </li>
              <li>
                Attempt to circumvent usage limits, rate limits, or access
                controls.
              </li>
            </ul>
          </Section>

          <Section title="4. Resume Data & Content">
            <p>
              You retain full ownership of all resume content and documents you
              upload to StackPilot. By uploading a resume, you grant us a
              limited, non-exclusive licence to process and analyze that content
              for the sole purpose of delivering our ATS scoring and job
              matching features.
            </p>
            <p>
              You represent that you have the right to upload and process any
              content you submit, and that it does not infringe any third-party
              intellectual property rights.
            </p>
            <p>
              We do not claim ownership over your resume data and will not sell
              it to third parties. See our{" "}
              <a
                href="/privacy"
                className="text-[#f5c842] underline hover:text-white transition-colors"
              >
                Privacy Policy
              </a>{" "}
              for full details on how your data is handled.
            </p>
          </Section>

          <Section title="5. Free Tier & Usage Limits">
            <p>
              The free tier of StackPilot includes a limited number of resume
              scans and job searches per account. These limits exist to ensure
              fair access for all users. We reserve the right to modify these
              limits at any time with reasonable notice.
            </p>
            <p>
              Attempting to circumvent usage limits through multiple accounts or
              automated access is a violation of these Terms and may result in
              account termination.
            </p>
          </Section>

          <Section title="6. Intellectual Property">
            <p>
              All content on the StackPilot platform that is not user-generated
              — including the software, design, branding, logos, and proprietary
              algorithms — is owned by or licenced to us and is protected by
              applicable intellectual property laws. You may not copy,
              reproduce, modify, or distribute any part of the Service without
              our express prior written consent.
            </p>
          </Section>

          <Section title="7. Third-Party Services">
            <p>
              StackPilot integrates with third-party services including Google
              Gemini API, JSearch (RapidAPI), Neon, Render, and OAuth providers.
              Your use of these integrations may be subject to their respective
              terms and policies. We are not responsible for the conduct or
              policies of these third parties.
            </p>
          </Section>

          <Section title="8. Disclaimers">
            <p>
              StackPilot is provided &quot;as is&quot; and &quot;as
              available&quot; without warranties of any kind, either express or
              implied. We do not guarantee that:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                ATS scores or job matches will result in interview calls, job
                offers, or any particular career outcome.
              </li>
              <li>
                The Service will be uninterrupted, error-free, or free of
                viruses or other harmful components.
              </li>
              <li>
                Job listings sourced from the JSearch API are accurate, current,
                or still available.
              </li>
            </ul>
            <p className="mt-3">
              The ATS scoring system is a tool to assist you, not a guarantee of
              employability. Hiring decisions are made entirely by employers
              independent of our platform.
            </p>
          </Section>

          <Section title="9. Limitation of Liability">
            <p>
              To the maximum extent permitted by applicable law, StackPilot and
              its founder shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages — including loss of
              employment opportunities, revenue, or data — arising from your use
              of or inability to use the Service, even if we have been advised
              of the possibility of such damages.
            </p>
            <p>
              Our total aggregate liability for any claim arising from your use
              of the Service shall not exceed the amount you paid us in the 12
              months preceding the claim (or, for free-tier users, zero).
            </p>
          </Section>

          <Section title="10. Indemnification">
            <p>
              You agree to indemnify, defend, and hold harmless StackPilot and
              its founder from any claims, liabilities, damages, losses, and
              expenses arising out of or related to your use of the Service,
              your violation of these Terms, or your infringement of any
              third-party right.
            </p>
          </Section>

          <Section title="11. Termination">
            <p>
              We reserve the right to suspend or terminate your access to the
              Service at our sole discretion, with or without notice, if we
              believe you have violated these Terms. You may terminate your
              account at any time by contacting us at{" "}
              <strong className="text-white">edusmart500@gmail.com</strong>.
            </p>
            <p>
              Upon termination, your right to use the Service will immediately
              cease. Sections 6, 8, 9, and 10 of these Terms survive
              termination.
            </p>
          </Section>

          <Section title="12. Governing Law">
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of India. Any disputes arising under these Terms shall be
              subject to the exclusive jurisdiction of the courts located in
              Chennai, Tamil Nadu, India.
            </p>
          </Section>

          <Section title="13. Changes to These Terms">
            <p>
              We may revise these Terms from time to time. We will notify
              registered users of material changes via email. Your continued use
              of StackPilot after any change constitutes your acceptance of the
              new Terms.
            </p>
          </Section>

          <Section title="14. Contact Us">
            <p>
              If you have questions about these Terms, please contact us at{" "}
              <strong className="text-white">edusmart500@gmail.com</strong> or
              through our{" "}
              <a
                href="/contact"
                className="text-[#f5c842] underline hover:text-white transition-colors"
              >
                Contact page
              </a>
              .
            </p>
          </Section>
        </div>
      </section>
    </PremiumPageLayout>
  );
}
