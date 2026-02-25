export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: February 22, 2026</p>

        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
            <p>RecurringTasks (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is operated by Das Group. This Privacy Policy explains how we collect, use, and protect your information when you use our Notion integration.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
            <p>When you connect your Notion workspace, we collect:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Notion workspace information:</strong> Workspace ID, workspace name, and an OAuth access token to interact with your databases on your behalf.</li>
              <li><strong>Database metadata:</strong> Names and IDs of databases you grant access to, used to configure recurring rules.</li>
              <li><strong>Account information:</strong> Your email address if provided during checkout.</li>
            </ul>
            <p className="mt-2">We do <strong>not</strong> read, store, or process the content of your Notion pages beyond what is necessary to create new pages per your configured rules.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To authenticate and connect your Notion workspace.</li>
              <li>To create recurring task pages in your databases based on rules you configure.</li>
              <li>To manage your subscription and billing via Stripe.</li>
              <li>To improve and maintain our service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Data Storage & Security</h2>
            <p>Your data is stored securely in a PostgreSQL database hosted on Neon (cloud provider). OAuth tokens are stored server-side and are never exposed to the client. All communications use HTTPS encryption.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Third-Party Services</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Notion API:</strong> To access and create pages in your databases.</li>
              <li><strong>Stripe:</strong> To process payments for premium subscriptions.</li>
              <li><strong>Vercel:</strong> To host and run the application.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Data Sharing</h2>
            <p>We do not sell, rent, or share your personal information with third parties except as required to provide the service (e.g., payment processing) or as required by law.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Data Deletion</h2>
            <p>You can disconnect RecurringTasks from your Notion workspace at any time via Notion Settings → My connections. To request deletion of all your data, email us at <a href="mailto:support@dasgroupllc.com" className="text-blue-600 hover:underline">support@dasgroupllc.com</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify users of significant changes via the application.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Contact</h2>
            <p>If you have questions about this Privacy Policy, contact us at <a href="mailto:support@dasgroupllc.com" className="text-blue-600 hover:underline">support@dasgroupllc.com</a>.</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t text-sm text-gray-500">
          <p>Das Group · <a href="/" className="text-blue-600 hover:underline">RecurringTasks</a></p>
        </div>
      </div>
    </div>
  );
}
