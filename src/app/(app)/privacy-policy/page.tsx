
export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 prose max-w-4xl">
      <h1>Privacy Policy for {process.env.NEXT_PUBLIC_SITE_NAME || 'DropX'} India</h1>

      <p><strong>Last Updated: 21st September 2025</strong></p>

      <p>
        Welcome to {process.env.NEXT_PUBLIC_SITE_NAME || 'DropX'} India. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
      </p>

      <h2>1. Information We Collect</h2>
      <p>
        We may collect personal information such as your name, shipping address, email address, and phone number when you place an order. We also collect non-personal information, such as browser type, operating system, and website usage data.
      </p>

      <h2>2. How We Use Your Information</h2>
      <p>
        We use the information we collect to:
      </p>
      <ul>
        <li>Process and fulfill your orders.</li>
        <li>Communicate with you about your orders and other inquiries.</li>
        <li>Improve our website and customer service.</li>
        <li>Send you promotional materials, if you opt-in.</li>
      </ul>

      <h2>3. Sharing Your Information</h2>
      <p>
        We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except to our trusted partners who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
      </p>

      <h2>4. Security</h2>
      <p>
        We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information.
      </p>

      <h2>5. Your Rights</h2>
      <p>
        You have the right to access, correct, or delete your personal information. Please contact us to make such a request.
      </p>

      <h2>6. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
      </p>

      <h2>7. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us at support@dropx.in.
      </p>
    </div>
  );
}
