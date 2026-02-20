import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
            <span className="text-xl font-bold">RecurringTasks</span>
          </div>
          <Link
            href="/api/auth/notion"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Automate Recurring Tasks
          <br />
          in Notion
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          The #1 most requested Notion feature. Stop manually creating the same tasks over and over.
          Set it once, let it run forever.
        </p>
        <Link
          href="/api/auth/notion"
          className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg"
        >
          Connect to Notion
        </Link>
        <p className="mt-4 text-sm text-gray-500">Free plan • No credit card required</p>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🔗</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Connect Your Workspace</h3>
            <p className="text-gray-600">
              Securely connect to your Notion workspace with OAuth. We only access databases you share with us.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">⚙️</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Set Up Rules</h3>
            <p className="text-gray-600">
              Choose any database and create recurring rules: daily, weekly, monthly, or custom schedules.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Let It Run</h3>
            <p className="text-gray-600">
              Tasks are automatically created on schedule. Use templates to inherit properties from existing pages.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
        <p className="text-gray-600 text-center mb-12">Start free, upgrade as you grow</p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free */}
          <div className="p-8 bg-white rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <p className="text-gray-600 mb-6">Perfect to get started</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-gray-500">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>3 recurring rules</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>1 workspace</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Basic scheduling</span>
              </li>
            </ul>
            <Link
              href="/api/auth/notion"
              className="block w-full py-3 text-center bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Get Started
            </Link>
          </div>

          {/* Pro */}
          <div className="p-8 bg-blue-600 text-white rounded-xl shadow-lg border-4 border-blue-500 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-blue-900 px-4 py-1 rounded-full text-sm font-semibold">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <p className="text-blue-100 mb-6">For power users</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">$12</span>
              <span className="text-blue-100">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-blue-200 mr-2">✓</span>
                <span>Unlimited recurring rules</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-200 mr-2">✓</span>
                <span>Multiple workspaces</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-200 mr-2">✓</span>
                <span>Template support</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-200 mr-2">✓</span>
                <span>Custom cron schedules</span>
              </li>
            </ul>
            <Link
              href="/api/auth/notion"
              className="block w-full py-3 text-center bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold"
            >
              Start Pro Trial
            </Link>
          </div>

          {/* Team */}
          <div className="p-8 bg-white rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-2xl font-bold mb-2">Team</h3>
            <p className="text-gray-600 mb-6">For organizations</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">$29</span>
              <span className="text-gray-500">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Everything in Pro</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Team management</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Advanced scheduling</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Priority support</span>
              </li>
            </ul>
            <Link
              href="/api/auth/notion"
              className="block w-full py-3 text-center bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Automate?</h2>
        <p className="text-xl text-gray-600 mb-8">
          Join thousands of Notion users saving hours every week
        </p>
        <Link
          href="/api/auth/notion"
          className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg"
        >
          Get Started for Free
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2026 RecurringTasks. Built for Notion lovers.</p>
        </div>
      </footer>
    </div>
  );
}
