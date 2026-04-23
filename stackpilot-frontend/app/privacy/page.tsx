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

export default function PrivacyPolicyPage() {
  return (
    <PremiumPageLayout>
      <section className="pt-4 md:pt-32 pb-20 px-4 md:px-8 max-w-3xl mx-auto relative z-10 text-white">
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-[#f5f0e8]">
            Privacy Policy
          </h1>
          <p className="text-gray-400">
            Effective Date: April 6, 2026 &nbsp;·&nbsp; Last Updated: April 6,
            2026
          </p>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-2xl p-8 md:p-12 shadow-xl space-y-8">
          <p className="text-gray-300 text-[15px] leading-relaxed">
            StackPilot (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is
            committed to protecting your privacy. This Privacy Policy explains
            how we collect, use, disclose, and safeguard your information when
            you visit{" "}
            <strong className="text-white">stackpilot-jext.onrender.com</strong>{" "}
            and use our services. By using StackPilot, you agree to the
            practices described in this policy.
          </p>

          <Section title="1. Information We Collect">
            <p>
              <strong className="text-white">Account Information:</strong> When
              you register, we collect your name, email address, and (if using
              OAuth) your profile picture provided by Google, GitHub, or
              Microsoft.
            </p>
            <p>
              <strong className="text-white">Resume Data:</strong> When you
              upload a PDF resume, we process its content to extract structured
              information (skills, experience, education, projects) using the
              Google Gemini API for the purpose of ATS scoring and job matching.
              We do not sell or share this data with third parties.
            </p>
            <p>
              <strong className="text-white">Usage Data:</strong> We collect
              information about how you interact with the platform, including
              pages visited, features used, resume scans performed, and searches
              made. This is used to improve our service and enforce usage limits
              on the free tier.
            </p>
            <p>
              <strong className="text-white">Device & Log Data:</strong> We may
              collect your IP address, browser type, operating system, and
              access timestamps for security monitoring and debugging purposes.
            </p>
          </Section>

          <Section title="2. How We Use Your Information">
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Provide, operate, and maintain the StackPilot platform.</li>
              <li>
                Process your resume and compute your ATS score and job match
                results.
              </li>
              <li>
                Send transactional emails: welcome messages, job match alerts,
                and daily digests. You may opt out of non-essential emails at
                any time.
              </li>
              <li>Detect and prevent fraud, abuse, and security incidents.</li>
              <li>Comply with legal obligations.</li>
              <li>
                Improve our algorithms, matching quality, and user experience
                through aggregate, anonymized analytics.
              </li>
            </ul>
          </Section>

          <Section title="3. Third-Party Services">
            <p>
              We integrate with the following third-party services to deliver
              our functionality. Each has its own privacy policy:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-white">Google Gemini API</strong> — Used
                to semantically parse resume content and score it. Resume text
                is transmitted to Google&apos;s API infrastructure for
                processing.
              </li>
              <li>
                <strong className="text-white">JSearch (RapidAPI)</strong> —
                Used to source live job listings. No personal user data is sent
                to this service.
              </li>
              <li>
                <strong className="text-white">Neon (PostgreSQL)</strong> —
                Serverless database hosting for your account and resume data.
                Data is stored encrypted at rest.
              </li>
              <li>
                <strong className="text-white">Render</strong> — Cloud hosting
                provider for our frontend and backend infrastructure.
              </li>
              <li>
                <strong className="text-white">
                  Google / GitHub / Microsoft OAuth
                </strong>{" "}
                — Used for social login. We only receive your public profile
                information (name, email, avatar) as permitted by these
                providers.
              </li>
            </ul>
          </Section>

          <Section title="4. Data Retention">
            <p>
              We retain your account and resume data for as long as your account
              is active. You may delete your account and all associated data at
              any time by contacting us at{" "}
              <strong className="text-white">edusmart500@gmail.com</strong>. We
              will fulfil deletion requests within 30 days.
            </p>
          </Section>

          <Section title="5. Data Security">
            <p>
              StackPilot implements industry-standard security measures
              including JWT authentication, bcrypt password hashing, rate
              limiting, SQL injection prevention via TypeORM, input validation,
              and HTTPS-enforced transport. However, no system is 100% secure.
              We encourage you to use a strong, unique password.
            </p>
          </Section>

          <Section title="6. Cookies">
            <p>
              We use minimal, essential session cookies to maintain your
              authenticated state. We do not use tracking cookies or third-party
              advertising cookies. If you use a browser extension that blocks
              cookies, some features of the platform may not function correctly.
            </p>
          </Section>

          <Section title="7. Children's Privacy">
            <p>
              StackPilot is not directed to individuals under the age of 13. We
              do not knowingly collect personal information from children. If
              you believe a child has provided us with personal data, please
              contact us immediately.
            </p>
          </Section>

          <Section title="8. Your Rights">
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your account and data.</li>
              <li>
                Object to processing or request restriction of processing.
              </li>
              <li>
                Lodge a complaint with a supervisory authority (e.g. your
                national data protection authority).
              </li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, email us at{" "}
              <strong className="text-white">edusmart500@gmail.com</strong>.
            </p>
          </Section>

          <Section title="9. Changes to This Policy">
            <p>
              We may update this Privacy Policy periodically. We will notify
              registered users of material changes via email. Continued use of
              StackPilot after the update constitutes acceptance of the revised
              policy.
            </p>
          </Section>

          <Section title="10. Contact Us">
            <p>
              If you have any questions about this Privacy Policy, please
              contact us at{" "}
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
