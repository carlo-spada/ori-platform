'use client'

import { LegalDocument } from '@/components/legal/LegalDocument'

// Fallback content preserved for initial migration
const FALLBACK_CONTENT = `
<h2 id="introduction">1. Introduction</h2>
<p>Welcome to <strong>Ori</strong> ("Ori", "we", "us", or "our"). These Terms of Service ("Terms") govern your access to and use of our websites, applications, and related services (collectively, the "Service").</p>
<p>By creating an account, accessing, or using the Service, you agree to be bound by these Terms. If you do not agree, you must not use the Service.</p>
<p>You are entering into an agreement with <strong>Ori Technologies S.A. de C.V.</strong>, with registered office at <strong>Via Antonio Fogazzaro, 5A, 35125 Padova PD, Italia</strong> ("Company").</p>

<h2 id="eligibility">2. Eligibility</h2>
<p>You may use the Service only if you:</p>
<ul>
  <li>Are at least the age of majority in your jurisdiction (or have valid parental/guardian consent where permitted by law);</li>
  <li>Have the legal capacity to enter into a binding contract; and</li>
  <li>Use the Service in compliance with these Terms and all applicable laws and regulations.</li>
</ul>
<p>We may ask you to verify your identity or eligibility at any time and may suspend or terminate access if we reasonably believe you are not eligible.</p>

<h2 id="account-registration">3. Account Registration and Security</h2>
<p>To use certain features of the Service, you must create an account or authenticate through a third-party identity provider (e.g., Google, GitHub, Apple ID). You agree to provide accurate, current, and complete information during registration and to keep it updated.</p>
<p>You are responsible for:</p>
<ul>
  <li>Maintaining the confidentiality of your login credentials;</li>
  <li>Restricting access to your account and devices; and</li>
  <li>All activities that occur under your account.</li>
</ul>
<p>You must notify us immediately at <a href="mailto:support@carlospada.me">support@carlospada.me</a> if you suspect unauthorized access or any security breach involving your account.</p>

<h2 id="subscriptions">4. Plans, Subscriptions, and Billing</h2>
<p>Ori may offer various plans, including free and paid subscription tiers ("Free", "Plus", "Premium") with different features and usage limits.</p>
<p>By starting a paid subscription, you authorize us and our payment processor (currently <strong>Stripe</strong>) to charge you the applicable fees (plus any taxes) in accordance with your selected billing cycle (monthly or annually). Unless otherwise stated:</p>
<ul>
  <li>Subscriptions automatically renew at the end of each billing period unless cancelled;</li>
  <li>You may cancel at any time through your account settings or by contacting <a href="mailto:support@carlospada.me">support@carlospada.me</a>;</li>
  <li>Refunds are available on a prorated basis, as required under applicable consumer protection laws; and</li>
  <li>We may adjust pricing prospectively with reasonable advance notice, and you may cancel before the changes take effect.</li>
</ul>

<h2 id="trials-promotions">5. Trials and Promotions</h2>
<p>We may offer free trials, discounts, or promotional offers subject to additional terms provided at the time. We reserve the right to modify or revoke any trial or promotion if we reasonably suspect abuse, misuse, or fraud.</p>

<h2 id="usage-limits">6. Usage Limits and Fair Use</h2>
<p>Certain features may be subject to usage limits (for example, the maximum number of personalized job-opening batches or AI-generated documents per month). The applicable limits for your plan are described in the Service and may be updated or adjusted for system integrity, fairness, or abuse prevention.</p>
<p>You agree not to circumvent or attempt to circumvent any usage limits (e.g., by creating multiple accounts to gain additional free usage).</p>

<h2 id="acceptable-use">7. Acceptable Use</h2>
<p>You agree that you will not, and will not attempt to:</p>
<ul>
  <li>Use the Service for any unlawful, harmful, fraudulent, or abusive purpose;</li>
  <li>Submit or share content that is illegal, defamatory, harassing, hateful, or otherwise objectionable;</li>
  <li>Reverse engineer, decompile, or attempt to derive the source code of any part of the Service, except where permitted by law;</li>
  <li>Interfere with or disrupt the integrity, security, or performance of the Service;</li>
  <li>Access the Service using automated means (such as bots, scrapers, or crawlers) without our prior written consent, except as explicitly permitted by an API agreement;</li>
  <li>Use the Service to train or improve competing AI models or services, unless expressly permitted in a written agreement with us.</li>
</ul>
<p>We may monitor usage for abuse and reserve the right to suspend or terminate access for violations of these Terms.</p>

<h2 id="ai-guidance-disclaimer">8. Ori Guidance and No Guarantees</h2>
<p>Ori provides AI-assisted insights, recommendations, draft materials, and other guidance related to careers and job applications. You understand and agree that:</p>
<ul>
  <li>Ori does not guarantee employment, interview invitations, admissions, or any specific outcomes;</li>
  <li>Any recommendations or generated content are provided on an informational basis only and should be reviewed, edited, and evaluated by you before use;</li>
  <li>The Service does not constitute legal, financial, medical, psychological, or other professional advice.</li>
</ul>
<p>You remain solely responsible for your decisions, actions, and communications with current or prospective employers, schools, or other third parties.</p>

<h2 id="user-content">9. Your Content</h2>
<p>You may submit or upload content to the Service, including profile information, resumes, cover letters, goals, feedback, and other materials ("User Content"). You retain ownership of your User Content.</p>
<p>By submitting User Content, you grant Ori a worldwide, non-exclusive, royalty-free, transferable, and sublicensable license to use, reproduce, modify, adapt, translate, distribute, and display your User Content as reasonably necessary to:</p>
<ul>
  <li>Provide, maintain, and improve the Service;</li>
  <li>Generate outputs and recommendations for you;</li>
  <li>Analyze usage trends and performance in aggregated or de-identified form; and</li>
  <li>Comply with legal obligations.</li>
</ul>
<p>You represent and warrant that you have all necessary rights to submit User Content and grant the above license and that your User Content does not infringe any third-party rights or violate applicable laws.</p>

<h2 id="intellectual-property">10. Intellectual Property</h2>
<p>The Service, including all software, algorithms, models, designs, logos, trademarks, and content (excluding User Content), is owned by Ori or its licensors and is protected by intellectual property laws. Except for the limited rights expressly granted in these Terms, no rights are transferred to you.</p>
<p>Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Service for your personal, non-commercial purposes (or, if applicable, for internal business purposes as expressly agreed in writing).</p>

<h2 id="third-party-services">11. Third-Party Services and Links</h2>
<p>The Service may integrate with or link to third-party websites, services, or tools (for example, identity providers, job boards, or communication platforms). We do not control and are not responsible for third-party services. Your use of any third-party service is subject to that service's own terms and privacy policies.</p>

<h2 id="privacy">12. Privacy</h2>
<p>Our collection, use, and disclosure of personal data are described in our Privacy Policy, which forms part of these Terms. By using the Service, you acknowledge that we will process your personal data as described in the Privacy Policy and in compliance with EU General Data Protection Regulation (GDPR) and other applicable laws.</p>

<h2 id="termination">13. Suspension and Termination</h2>
<p>You may stop using the Service and cancel your subscription at any time, as described within the account or billing settings.</p>
<p>We may suspend or terminate your access to the Service, or any part of it, if:</p>
<ul>
  <li>You materially or repeatedly breach these Terms;</li>
  <li>We are required to do so by law or by a court or regulatory order; or</li>
  <li>We discontinue the Service in whole or in part.</li>
</ul>
<p>Where reasonably possible, we will provide notice before termination. Upon termination, your right to use the Service will cease, but certain provisions of these Terms (including intellectual property, disclaimers, limitations of liability, and dispute resolution) will survive.</p>

<h2 id="disclaimers">14. Disclaimers</h2>
<p>To the maximum extent permitted by law, the Service is provided "as is" and "as available", without warranties of any kind, whether express, implied, or statutory, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.</p>
<p>We do not warrant that the Service will be uninterrupted, error-free, secure, or free from harmful components, or that any results or outcomes from using the Service will meet your expectations.</p>

<h2 id="limitation-of-liability">15. Limitation of Liability</h2>
<p>To the maximum extent permitted by law, in no event shall Ori, its affiliates, directors, employees, or licensors be liable for any indirect, incidental, special, consequential, or punitive damages, or for any loss of profits, revenues, data, or goodwill, arising out of or related to your use of the Service, even if we have been advised of the possibility of such damages.</p>
<p>To the maximum extent permitted by law, our total aggregate liability arising out of or relating to the Service or these Terms will not exceed the greater of (a) the amounts you have paid to us for the Service in the twelve (12) months prior to the event giving rise to the claim, or (b) one hundred (100) euros (€100).</p>

<h2 id="indemnification">16. Indemnification</h2>
<p>You agree to indemnify and hold harmless Ori, its affiliates, and their respective officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses (including reasonable legal fees) arising out of or related to:</p>
<ul>
  <li>Your use of the Service;</li>
  <li>Your violation of these Terms; or</li>
  <li>Your infringement or misuse of any intellectual property or other rights of any person or entity.</li>
</ul>

<h2 id="governing-law">17. Governing Law and Dispute Resolution</h2>
<p>These Terms, and any dispute or claim arising out of or in connection with them or the Service, shall be governed by and construed in accordance with the laws of <strong>Italy</strong> and applicable <strong>European Union law</strong>, without regard to conflict-of-law principles.</p>
<p>Any dispute arising out of or related to these Terms or the Service will be subject to the exclusive jurisdiction of the <strong>courts of Padova, Italy</strong>, unless mandatory law provides otherwise. You and Ori agree to submit to the personal jurisdiction of such courts.</p>
<p>Before initiating formal legal proceedings, the parties will attempt to resolve the dispute amicably by good-faith negotiation for at least thirty (30) days, unless urgent injunctive relief is required.</p>

<h2 id="changes">18. Changes to the Service or Terms</h2>
<p>We may modify or discontinue parts of the Service from time to time in order to improve, update, or comply with legal requirements. Where a change has a material impact on your use of the Service, we will provide reasonable advance notice where practicable.</p>
<p>We may also update these Terms from time to time. The "Last updated" date at the top of the Terms will indicate when changes were made. Where changes are material, we will provide additional notice (for example, in-app notice or email). If you continue to use the Service after the effective date of the updated Terms, you will be deemed to have accepted them.</p>

<h2 id="miscellaneous">19. Miscellaneous</h2>
<p>If any provision of these Terms is held to be invalid or unenforceable, that provision will be enforced to the maximum extent permissible, and the remaining provisions will remain in full force and effect.</p>
<p>Our failure to enforce any provision of these Terms shall not constitute a waiver of that provision.</p>
<p>You may not assign or transfer these Terms or your rights or obligations under them without our prior written consent. We may assign these Terms in connection with a merger, acquisition, or sale of assets, or by operation of law.</p>

<h2 id="contact">20. Contact</h2>
<p>If you have questions about these Terms, please contact us at:</p>
<address>
  <strong>Ori Technologies S.A. de C.V.</strong><br />
  Via Antonio Fogazzaro, 5A, 35125 Padova PD, Italia<br />
  Email: <a href="mailto:support@carlospada.me">support@carlospada.me</a>
</address>

<hr />
<footer>
  &copy; 2025 Ori Technologies S.A. de C.V. – All rights reserved.
</footer>
`

const FALLBACK_TOC_ITEMS = [
  { id: 'introduction', label: '1. Introduction' },
  { id: 'eligibility', label: '2. Eligibility' },
  {
    id: 'account-registration',
    label: '3. Account Registration and Security',
  },
  { id: 'subscriptions', label: '4. Plans, Subscriptions, and Billing' },
  { id: 'trials-promotions', label: '5. Trials and Promotions' },
  { id: 'usage-limits', label: '6. Usage Limits and Fair Use' },
  { id: 'acceptable-use', label: '7. Acceptable Use' },
  {
    id: 'ai-guidance-disclaimer',
    label: '8. Ori Guidance and No Guarantees',
  },
  { id: 'user-content', label: '9. Your Content' },
  { id: 'intellectual-property', label: '10. Intellectual Property' },
  {
    id: 'third-party-services',
    label: '11. Third-Party Services and Links',
  },
  { id: 'privacy', label: '12. Privacy' },
  { id: 'termination', label: '13. Suspension and Termination' },
  { id: 'disclaimers', label: '14. Disclaimers' },
  { id: 'limitation-of-liability', label: '15. Limitation of Liability' },
  { id: 'indemnification', label: '16. Indemnification' },
  {
    id: 'governing-law',
    label: '17. Governing Law and Dispute Resolution',
  },
  { id: 'changes', label: '18. Changes to the Service or Terms' },
  { id: 'miscellaneous', label: '19. Miscellaneous' },
  { id: 'contact', label: '20. Contact' },
]

export default function TermsOfServicePage() {
  return (
    <LegalDocument
      namespace="legal-terms"
      fallbackContent={FALLBACK_CONTENT}
    />
  )
}
