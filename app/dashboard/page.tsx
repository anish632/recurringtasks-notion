'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { RecurringRule, NotionDatabase } from '@/lib/types';
import { generateScheduleDescription } from '@/lib/scheduler';

function Toast({ message, type, onDismiss }: { message: string; type: 'success' | 'error'; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${
      type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
    }`}>
      {message}
    </div>
  );
}

export default function Dashboard() {
  const [rules, setRules] = useState<RecurringRule[]>([]);
  const [databases, setDatabases] = useState<NotionDatabase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<string>('free');
  const [upgrading, setUpgrading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [newRule, setNewRule] = useState({
    database_id: '',
    database_name: '',
    schedule_type: 'daily' as 'daily' | 'weekly' | 'monthly' | 'custom',
    schedule_value: '1',
  });

  useEffect(() => {
    fetchUser()
      .then((authed) => {
        if (!authed) return;
        return Promise.all([fetchRules(), fetchDatabases()]);
      })
      .catch(() => setError('Failed to load dashboard data'))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const fetchUser = async (): Promise<boolean> => {
    const res = await fetch('/api/user');
    if (res.status === 401) {
      window.location.href = '/api/auth/notion';
      return false;
    }
    if (!res.ok) throw new Error('Failed to fetch user');
    const data = await res.json();
    setSubscriptionTier(data.subscription_tier || 'free');
    return true;
  };

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const res = await fetch('/api/billing/checkout', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        showToast('Failed to create checkout session', 'error');
        setUpgrading(false);
      }
    } catch {
      showToast('Failed to create checkout session', 'error');
      setUpgrading(false);
    }
  };

  const isFreeTier = subscriptionTier === 'free';
  const atRuleLimit = isFreeTier && rules.length >= 3;

  const fetchRules = async () => {
    const res = await fetch('/api/rules');
    if (!res.ok) throw new Error('Failed to fetch rules');
    const data = await res.json();
    setRules(data.rules || []);
  };

  const fetchDatabases = async () => {
    const res = await fetch('/api/databases');
    if (!res.ok) throw new Error('Failed to fetch databases');
    const data = await res.json();
    setDatabases(data.databases || []);
  };

  const createRule = async () => {
    setCreating(true);
    try {
      const res = await fetch('/api/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRule),
      });

      if (!res.ok) {
        const data = await res.json();
        showToast(data.error || 'Failed to create rule', 'error');
        return;
      }

      await fetchRules();
      setShowCreateModal(false);
      setNewRule({
        database_id: '',
        database_name: '',
        schedule_type: 'daily',
        schedule_value: '1',
      });
      showToast('Rule created successfully', 'success');
    } catch {
      showToast('Failed to create rule', 'error');
    } finally {
      setCreating(false);
    }
  };

  const toggleRule = async (ruleId: string, isActive: boolean) => {
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, is_active: !isActive } : r))
    );
    try {
      const res = await fetch(`/api/rules/${ruleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !isActive }),
      });
      if (!res.ok) {
        setRules((prev) =>
          prev.map((r) => (r.id === ruleId ? { ...r, is_active: isActive } : r))
        );
        showToast('Failed to update rule', 'error');
      }
    } catch {
      setRules((prev) =>
        prev.map((r) => (r.id === ruleId ? { ...r, is_active: isActive } : r))
      );
      showToast('Failed to update rule', 'error');
    }
  };

  const deleteRule = async (ruleId: string) => {
    if (!confirm('Are you sure you want to delete this rule?')) return;

    try {
      const res = await fetch(`/api/rules/${ruleId}`, { method: 'DELETE' });
      if (!res.ok) {
        showToast('Failed to delete rule', 'error');
        return;
      }
      setRules((prev) => prev.filter((r) => r.id !== ruleId));
      showToast('Rule deleted', 'success');
    } catch {
      showToast('Failed to delete rule', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
          <span className="text-sm text-gray-400">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-xl">!</span>
          </div>
          <p className="text-gray-900 font-medium mb-1">Something went wrong</p>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
            }}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200/80">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="RecurringTasks" width={24} height={24} className="rounded" />
              <span className="font-semibold text-sm tracking-tight hidden sm:block">RecurringTasks</span>
            </a>
            <span className="text-gray-200">|</span>
            <span className="text-sm text-gray-500">Dashboard</span>
            <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full ${
              isFreeTier ? 'bg-gray-100 text-gray-500' : 'bg-violet-100 text-violet-700'
            }`}>
              {isFreeTier ? 'Free' : 'Pro'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isFreeTier && (
              <button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="px-3 py-1.5 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition disabled:opacity-50"
              >
                {upgrading ? 'Loading...' : 'Upgrade'}
              </button>
            )}
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition"
            >
              + New Rule
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {atRuleLimit && (
          <div className="mb-6 p-4 bg-violet-50 border border-violet-100 rounded-xl flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-sm text-violet-900">Free plan limit reached</p>
              <p className="text-sm text-violet-600">Upgrade to Pro for unlimited recurring rules.</p>
            </div>
            <button
              onClick={handleUpgrade}
              disabled={upgrading}
              className="px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition disabled:opacity-50 whitespace-nowrap"
            >
              {upgrading ? 'Loading...' : 'Upgrade to Pro'}
            </button>
          </div>
        )}

        {rules.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <span className="text-3xl">📋</span>
            </div>
            <h2 className="text-xl font-semibold mb-2 tracking-tight">No rules yet</h2>
            <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
              Create your first recurring rule to start automating tasks in Notion.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition"
            >
              Create your first rule
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="bg-white p-5 rounded-xl border border-gray-200/80 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1">
                      <h3 className="font-semibold text-sm truncate">{rule.database_name}</h3>
                      <span className={`shrink-0 w-1.5 h-1.5 rounded-full ${
                        rule.is_active ? 'bg-emerald-400' : 'bg-gray-300'
                      }`} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="font-medium text-gray-500">{generateScheduleDescription(rule)}</span>
                      <span>Next: {new Date(rule.next_run).toLocaleDateString()}</span>
                      {rule.last_run && (
                        <span>Last: {new Date(rule.last_run).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => toggleRule(rule.id, rule.is_active)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                        rule.is_active
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {rule.is_active ? 'Active' : 'Paused'}
                    </button>
                    <button
                      onClick={() => deleteRule(rule.id)}
                      className="p-1.5 text-gray-300 hover:text-red-500 transition"
                      title="Delete rule"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-lg font-semibold tracking-tight mb-5">New recurring rule</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Database</label>
                <select
                  value={newRule.database_id}
                  onChange={(e) => {
                    const db = databases.find((d) => d.id === e.target.value);
                    setNewRule({
                      ...newRule,
                      database_id: e.target.value,
                      database_name: db?.name || '',
                    });
                  }}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option value="">Select a database</option>
                  {databases.map((db) => (
                    <option key={db.id} value={db.id}>
                      {db.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Frequency</label>
                <select
                  value={newRule.schedule_type}
                  onChange={(e) =>
                    setNewRule({
                      ...newRule,
                      schedule_type: e.target.value as 'daily' | 'weekly' | 'monthly' | 'custom',
                    })
                  }
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="custom">Custom (Cron)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                  {newRule.schedule_type === 'custom' ? 'Cron expression' : 'Interval'}
                </label>
                <input
                  type="text"
                  value={newRule.schedule_value}
                  onChange={(e) =>
                    setNewRule({ ...newRule, schedule_value: e.target.value })
                  }
                  placeholder={
                    newRule.schedule_type === 'custom'
                      ? '0 9 * * 1 (Mon at 9am)'
                      : '1'
                  }
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div className="flex gap-2.5 mt-6">
              <button
                onClick={createRule}
                disabled={!newRule.database_id || !newRule.schedule_value || creating}
                className="flex-1 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {creating ? 'Creating...' : 'Create rule'}
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                disabled={creating}
                className="px-4 py-2.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-200 transition disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
