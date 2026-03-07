import Link from 'next/link';
import Image from 'next/image';

function CheckIcon() {
  return (
    <span className="check-icon">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );
}

function NotionIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.017 4.313l55.333-4.087c6.797-.583 8.543-.19 12.817 2.917l17.663 12.443c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277-1.553 6.807-6.99 7.193L24.467 99.967c-4.08.193-6.023-.39-8.16-3.113L3.3 79.94c-2.333-3.113-3.3-5.443-3.3-8.167V11.113c0-3.497 1.553-6.413 6.017-6.8z" fill="#fff"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M61.35.227l-55.333 4.087C1.553 4.7 0 7.617 0 11.113v60.66c0 2.723.967 5.053 3.3 8.167l12.007 16.913c2.137 2.723 4.08 3.307 8.16 3.113l64.257-3.89c5.433-.387 6.99-2.917 6.99-7.193V20.64c0-2.21-.873-2.847-3.443-4.733L74.167 3.143C69.893.027 68.147-.357 61.35.227zM25.518 19.458c-5.487.33-6.738.404-9.867-2.126L7.467 10.796c-1.75-1.557-1.167-3.5 2.333-3.693l52.833-3.887c4.467-.387 6.8 1.167 8.543 2.527L80.7 12.96c.583.39 2.333 2.723.583 2.723l-54.437 3.3-.33.477zm-5.297 74.253V28.563c0-2.527.777-3.693 3.107-3.887l58.52-3.5c2.14-.193 3.107 1.167 3.107 3.693v64.76c0 2.53-.39 4.67-3.883 4.863l-56.19 3.307c-3.497.193-4.66-1.553-4.66-3.887zm53.466-62.057c.39 1.75 0 3.5-1.75 3.697l-2.723.58v47.83c-2.333 1.363-4.467 2.14-6.223 2.14-2.913 0-3.69-.973-5.827-3.503l-17.86-28.02v27.247l5.637 1.163s0 3.5-4.86 3.5l-13.397.777c-.39-.777 0-2.723 1.363-3.11l3.5-.973V35.96l-4.857-.39c-.39-1.75.583-4.277 3.3-4.47l14.367-.967 18.587 28.407V33.24l-4.667-.583c-.393-2.14 1.163-3.693 3.107-3.887l13.303-.777z" fill="#000"/>
    </svg>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Ambient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-100 rounded-full blur-[120px] opacity-40" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-violet-100 rounded-full blur-[120px] opacity-30" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-amber-50 rounded-full blur-[100px] opacity-30" />
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-50 glass-card border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="RecurringTasks" width={32} height={32} className="rounded-lg" />
            <span className="text-lg font-semibold tracking-tight">RecurringTasks</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition hidden sm:block">
              Pricing
            </Link>
            <Link
              href="/api/auth/notion"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition shadow-sm"
            >
              <NotionIcon />
              Connect Notion
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="max-w-3xl mx-auto text-center">
          <div className="animate-fade-up inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-full mb-8 border border-blue-100">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            The #1 most requested Notion feature
          </div>

          <h1 className="animate-fade-up-delay-1 text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Recurring tasks,
            <br />
            <span className="text-gradient">fully automated</span>
          </h1>

          <p className="animate-fade-up-delay-2 text-lg md:text-xl text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
            Stop creating the same Notion pages by hand. Set a schedule once — daily, weekly, monthly — and let it run forever.
          </p>

          <div className="animate-fade-up-delay-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/api/auth/notion"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition shadow-lg shadow-gray-900/10 text-base"
            >
              <NotionIcon />
              Get started free
            </Link>
            <span className="text-sm text-gray-400">No credit card required</span>
          </div>
        </div>

        {/* Hero visual — mock Notion board */}
        <div className="animate-fade-up-delay-3 mt-16 md:mt-20 max-w-4xl mx-auto">
          <div className="glass-card rounded-2xl shadow-2xl shadow-gray-200/50 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-3 text-sm text-gray-400 font-medium">Task Board</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {/* To Do column */}
              <div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-300" />
                  To Do
                </div>
                <div className="space-y-2.5">
                  <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-700">Weekly Review</p>
                    <p className="text-xs text-gray-400 mt-1">Every Monday</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 animate-float">
                    <p className="text-sm font-medium text-blue-700">Sprint Planning</p>
                    <p className="text-xs text-blue-400 mt-1">Auto-created today</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-700">Invoice Clients</p>
                    <p className="text-xs text-gray-400 mt-1">1st of month</p>
                  </div>
                </div>
              </div>
              {/* Doing column */}
              <div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  In Progress
                </div>
                <div className="space-y-2.5">
                  <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-700">Content Calendar</p>
                    <p className="text-xs text-gray-400 mt-1">Every Wednesday</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-700">Team Standup</p>
                    <p className="text-xs text-gray-400 mt-1">Daily</p>
                  </div>
                </div>
              </div>
              {/* Done column */}
              <div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  Done
                </div>
                <div className="space-y-2.5">
                  <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 opacity-60">
                    <p className="text-sm font-medium text-gray-700 line-through">Weekly Review</p>
                    <p className="text-xs text-gray-400 mt-1">Completed Mar 3</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-12 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-sm text-gray-400 font-medium mb-6">Trusted by Notion power users</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-gray-300">
            <span className="text-base font-semibold tracking-tight">Freelancers</span>
            <span className="text-base font-semibold tracking-tight">Startups</span>
            <span className="text-base font-semibold tracking-tight">Agencies</span>
            <span className="text-base font-semibold tracking-tight">Product Teams</span>
            <span className="text-base font-semibold tracking-tight">Solopreneurs</span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Three steps. Zero hassle.</h2>
          <p className="text-gray-500 text-lg max-w-lg mx-auto">Connect your workspace, set your schedule, and forget about it.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Connect Notion',
              desc: 'Authorize with one click. We only access the databases you explicitly share.',
              color: 'bg-blue-500',
            },
            {
              step: '02',
              title: 'Create a rule',
              desc: 'Pick a database, choose a frequency — daily, weekly, monthly, or custom cron.',
              color: 'bg-violet-500',
            },
            {
              step: '03',
              title: 'Sit back',
              desc: 'Pages are created automatically on schedule. Use templates for consistent formatting.',
              color: 'bg-emerald-500',
            },
          ].map((item) => (
            <div key={item.step} className="group relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300">
              <div className={`${item.color} w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold mb-5`}>
                {item.step}
              </div>
              <h3 className="text-xl font-semibold mb-2 tracking-tight">{item.title}</h3>
              <p className="text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section className="max-w-6xl mx-auto px-6 pb-24 md:pb-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Everything you need</h2>
          <p className="text-gray-500 text-lg">Built specifically for Notion workflows.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: '📅', title: 'Flexible schedules', desc: 'Daily, weekly, monthly, or any cron expression you want.' },
            { icon: '📄', title: 'Template support', desc: 'Clone an existing page as a template — properties, content, and all.' },
            { icon: '🗂️', title: 'Any database', desc: 'Works with any Notion database — tasks, habits, journals, invoices.' },
            { icon: '⚡', title: 'Auto status', desc: 'Created pages land in your "To Do" column automatically.' },
            { icon: '🔒', title: 'Secure OAuth', desc: 'Official Notion integration. We never store your password.' },
            { icon: '🆓', title: 'Generous free tier', desc: '3 rules free forever. Upgrade only when you need more.' },
          ].map((f) => (
            <div key={f.title} className="flex gap-4 p-6 rounded-2xl hover:bg-gray-50 transition-colors">
              <span className="text-2xl mt-0.5 shrink-0">{f.icon}</span>
              <div>
                <h3 className="font-semibold mb-1 tracking-tight">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 pb-24 md:pb-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Simple pricing</h2>
          <p className="text-gray-500 text-lg">Start free. Upgrade when you&apos;re ready.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <h3 className="text-lg font-semibold mb-1">Free</h3>
            <p className="text-sm text-gray-500 mb-6">Great for getting started</p>
            <div className="mb-8">
              <span className="text-5xl font-bold tracking-tight">$0</span>
              <span className="text-gray-400 ml-1">/mo</span>
            </div>
            <ul className="space-y-3 mb-8">
              {['3 recurring rules', '1 workspace', 'All schedule types', 'Community support'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm">
                  <CheckIcon />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/api/auth/notion"
              className="block w-full py-3 text-center text-sm font-medium bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
            >
              Get started
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-gray-900 text-white rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500 rounded-full blur-[80px] opacity-20" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold">Pro</h3>
                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs font-medium rounded-full">Popular</span>
              </div>
              <p className="text-sm text-gray-400 mb-6">For power users</p>
              <div className="mb-8">
                <span className="text-5xl font-bold tracking-tight">$12</span>
                <span className="text-gray-400 ml-1">/mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['Unlimited recurring rules', 'Multiple workspaces', 'Template support', 'Custom cron schedules', 'Priority support'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-300">
                    <span className="check-icon !bg-blue-500">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/api/auth/notion"
                className="block w-full py-3 text-center text-sm font-medium bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition"
              >
                Start Pro trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-24 md:pb-32">
        <div className="bg-gray-50 rounded-3xl p-12 md:p-16 text-center border border-gray-100">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Stop repeating yourself</h2>
          <p className="text-gray-500 text-lg max-w-md mx-auto mb-8">
            Automate recurring tasks in Notion and get back hours every week.
          </p>
          <Link
            href="/api/auth/notion"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition shadow-lg shadow-gray-900/10 text-base"
          >
            <NotionIcon />
            Get started for free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="RecurringTasks" width={20} height={20} className="rounded" />
            <span className="text-sm text-gray-400">&copy; {new Date().getFullYear()} RecurringTasks</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-gray-600 transition">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-600 transition">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
