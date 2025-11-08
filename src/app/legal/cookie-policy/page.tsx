import { LegalPageLayout } from '@/components/legal/LegalPageLayout';

const content = `
<h2 id="intro">1. Introduction</h2>
<p>
  This Cookie Policy explains how <strong>Ori</strong> ("AURA", "we", "us", or "our") uses cookies and similar technologies when you use our websites and applications (the "Service"). It should be read together with our Privacy Policy.
</p>

<h2 id="what-are-cookies">2. What Are Cookies?</h2>
<p>
  Cookies are small text files that are stored on your device when you visit a website or use an online service. They are widely used to make websites work, to remember your preferences, and to provide information to the site owner.
</p>
<p>
  We also use similar technologies, such as local storage, pixels, and tracking scripts. In this Policy, we refer to all of these technologies collectively as "cookies".
</p>

<h2 id="types-of-cookies">3. Types of Cookies We Use</h2>
<p>
  We use the following categories of cookies:
</p>
<ul>
  <li>
    <strong>Strictly necessary cookies</strong>: These cookies are essential for the operation of the Service and cannot be switched off in our systems. They are usually set only in response to actions you take, such as setting your privacy preferences, logging in, or filling in forms.
  </li>
  <li>
    <strong>Performance and analytics cookies</strong>: These cookies help us understand how users interact with the Service by collecting information such as page views, traffic sources, and feature usage. We use this information to improve performance and user experience.
  </li>
  <li>
    <strong>Functionality cookies</strong>: These cookies allow the Service to remember choices you make (such as language or region) and provide enhanced, more personalized features.
  </li>
  <li>
    <strong>Advertising and marketing cookies</strong> (if and when used): These cookies may be used to deliver relevant advertisements, to measure the effectiveness of campaigns, or to prevent the same ad from being shown repeatedly. If we start using advertising cookies, we will update this Policy and, where required, obtain your consent.
  </li>
</ul>

<h2 id="specific-cookies">4. Specific Cookies and Similar Technologies</h2>
<p>
  The specific cookies we use may change over time as we improve or update the Service. A more detailed and up-to-date list of cookies and similar technologies (including names, providers, and purposes) may be made available within the Service, such as in a cookie banner, preference center, or help page.
</p>

<h2 id="managing-cookies">5. How You Can Control Cookies</h2>
<p>
  You have several options for managing cookies:
</p>
<ul>
  <li>
    <strong>Browser settings</strong>: Most web browsers allow you to delete cookies, block cookies, or receive a warning before a cookie is stored. Please refer to your browser's help or settings for more information. If you block all cookies, some parts of the Service may not function properly.
  </li>
  <li>
    <strong>Cookie banner or preference center</strong> (if implemented): We may provide on-site controls to manage non-essential cookies (for example, analytics or advertising cookies). Where required by law, we will request your consent before using such cookies.
  </li>
  <li>
    <strong>Third-party opt-out mechanisms</strong>: Some analytics and advertising providers offer their own opt-out options. Where applicable, links or information may be provided within the Service or in our Privacy Policy.
  </li>
</ul>

<h2 id="legal-basis-cookies">6. Legal Basis for Using Cookies</h2>
<p>
  Where required by law (for example, in the EEA, UK, or similar jurisdictions), we rely on:
</p>
<ul>
  <li><strong>Consent</strong> for placing and accessing non-essential cookies (such as analytics or advertising cookies); and</li>
  <li><strong>Legitimate interests</strong> or equivalent legal bases for strictly necessary cookies that are required to operate the Service.</li>
</ul>

<h2 id="changes">7. Changes to This Cookie Policy</h2>
<p>
  We may update this Cookie Policy from time to time to reflect changes to our use of cookies, legal requirements, or the Service. When we do, we will update the "Last updated" date and, where required, obtain consent again for certain cookies.
</p>

<h2 id="contact">8. Contact</h2>
<p>
  If you have questions about this Cookie Policy or our use of cookies and similar technologies, please contact us at:
</p>
<p>
  <strong>Ori Technologies S.A. de C.V.</strong><br />
  Via Antonio Fogazzaro, 5A, 35125 Padova PD, Italia<br />
  Email: <a href="mailto:support@carlospada.me">support@carlospada.me</a>
</p>

<hr />
<footer>
  &copy; 2025 Ori Technologies S.A. de C.V. – All rights reserved.
</footer>
`;

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout
      title="Cookie Policy"
      lastUpdated="Last updated: March 1, 2025"
      metaDescription="Understand how AURA uses cookies and similar tracking technologies."
      tocItems={[
        { id: 'intro', label: '1. Introduction' },
        { id: 'what-are-cookies', label: '2. What Are Cookies?' },
        { id: 'types-of-cookies', label: '3. Types of Cookies We Use' },
        { id: 'specific-cookies', label: '4. Specific Cookies and Similar Technologies' },
        { id: 'managing-cookies', label: '5. How You Can Control Cookies' },
        { id: 'legal-basis-cookies', label: '6. Legal Basis for Using Cookies' },
        { id: 'changes', label: '7. Changes to This Cookie Policy' },
        { id: 'contact', label: '8. Contact' },
      ]}
      content={content}
    />
  );
}
