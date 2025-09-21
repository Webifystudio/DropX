
export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-12 prose max-w-4xl">
      <h1>Terms of Service for {process.env.NEXT_PUBLIC_SITE_NAME || 'DropX'} India</h1>

      <p><strong>Last Updated: 21st September 2025</strong></p>

      <h2>1. Agreement to Terms</h2>
      <p>
        By using our website, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
      </p>

      <h2>2. Use of the Service</h2>
      <p>
        You agree to use our website only for lawful purposes. You are prohibited from any use of the site that would constitute a violation of any applicable law, regulation, rule, or ordinance.
      </p>

      <h2>3. Products and Pricing</h2>
      <p>
        All products listed on the site are subject to change, as is product information, pricing, and availability. We reserve the right, at any time, to modify, suspend, or discontinue any site feature or the sale of any product with or without notice.
      </p>

      <h2>4. Orders and Payment</h2>
      <p>
        We reserve the right to refuse or cancel any order for any reason. If we cancel an order, we will notify you and provide a refund if payment has been processed.
      </p>

      <h2>5. Intellectual Property</h2>
      <p>
        All content on this website, including text, graphics, logos, and images, is the property of {process.env.NEXT_PUBLIC_SITE_NAME || 'DropX'} India or its content suppliers and is protected by international copyright laws.
      </p>

      <h2>6. Limitation of Liability</h2>
      <p>
        {process.env.NEXT_PUBLIC_SITE_NAME || 'DropX'} India shall not be liable for any special or consequential damages that result from the use of, or the inability to use, the materials on this site or the performance of the products.
      </p>

      <h2>7. Governing Law</h2>
      <p>
        These Terms of Service and any separate agreements whereby we provide you services shall be governed by and construed in accordance with the laws of India.
      </p>

      <h2>8. Contact Information</h2>
      <p>
        Questions about the Terms of Service should be sent to us at support@dropx.in.
      </p>
    </div>
  );
}
