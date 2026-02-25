export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Terms of Use</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: February 22, 2026</p>

        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p>By using RecurringTasks (&quot;the Service&quot;), operated by Das Group, you agree to these Terms of Use. If you do not agree, do not use the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
            <p>RecurringTasks is a Notion integration that automatically creates recurring pages in your Notion databases based on schedules you configure. The Service requires a Notion account and authorization to access your workspace.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Accounts & Authorization</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>You must authorize RecurringTasks via Notion&apos;s OAuth flow to use the Service.</li>
              <li>You are responsible for maintaining the security of your Notion account.</li>
              <li>You may revoke access at any time via Notion Settings → My connections.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Free & Paid Plans</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Free plan:</strong> Up to 3 recurring rules, 1 workspace.</li>
              <li><strong>Pro plan ($12/month):</strong> Unlimited rules, multiple workspaces, template support, custom cron schedules.</li>
            </ul>
            <p className="mt-2">Paid subscriptions are processed through Stripe. By subscribing, you also agree to <a href="https://stripe.com/legal/consumer" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Stripe&apos;s Terms of Service</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Cancellation & Refunds</h2>
            <p>You may cancel your subscription at any time. Upon cancellation, you retain Pro features until the end of the current billing period. Refund requests may be submitted to <a href="mailto:support@dasgroupllc.com" className="text-blue-600 hover:underline">support@dasgroupllc.com</a> within 14 days of purchase.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Use the Service for any unlawful purpose.</li>
              <li>Attempt to access other users&apos; data or accounts.</li>
              <li>Interfere with or disrupt the Service.</li>
              <li>Reverse-engineer or attempt to extract source code.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Limitation of Liability</h2>
            <p>The Service is provided &quot;as is&quot; without warranty of any kind. Das Group shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service. Our total liability is limited to the amount you paid for the Service in the 12 months preceding the claim.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Service Availability</h2>
            <p>We strive for high availability but do not guarantee uninterrupted service. Scheduled maintenance, Notion API changes, or third-party outages may temporarily affect the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Changes to Terms</h2>
            <p>We may update these Terms from time to time. Continued use of the Service after changes constitutes acceptance of the new Terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. Contact</h2>
            <p>For questions about these Terms, contact us at <a href="mailto:support@dasgroupllc.com" className="text-blue-600 hover:underline">support@dasgroupllc.com</a>.</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t text-sm text-gray-500">
          <p>Das Group · <a href="/" className="text-blue-600 hover:underline">RecurringTasks</a></p>
        </div>
      </div>
    </div>
  );
}
