'use client';

import { useEffect, useState } from 'react';
import { RecurringRule, NotionDatabase } from '@/lib/types';
import { generateScheduleDescription } from '@/lib/scheduler';

export default function Dashboard() {
  const [rules, setRules] = useState<RecurringRule[]>([]);
  const [databases, setDatabases] = useState<NotionDatabase[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRule, setNewRule] = useState({
    database_id: '',
    database_name: '',
    schedule_type: 'daily' as 'daily' | 'weekly' | 'monthly' | 'custom',
    schedule_value: '1',
  });

  useEffect(() => {
    fetchRules();
    fetchDatabases();
  }, []);

  const fetchRules = async () => {
    try {
      const res = await fetch('/api/rules');
      const data = await res.json();
      setRules(data.rules || []);
    } catch (error) {
      console.error('Error fetching rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDatabases = async () => {
    try {
      const res = await fetch('/api/databases');
      const data = await res.json();
      setDatabases(data.databases || []);
    } catch (error) {
      console.error('Error fetching databases:', error);
    }
  };

  const createRule = async () => {
    try {
      const res = await fetch('/api/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRule),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to create rule');
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
    } catch (error) {
      console.error('Error creating rule:', error);
      alert('Failed to create rule');
    }
  };

  const toggleRule = async (ruleId: string, isActive: boolean) => {
    try {
      await fetch(`/api/rules/${ruleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !isActive }),
      });
      await fetchRules();
    } catch (error) {
      console.error('Error toggling rule:', error);
    }
  };

  const deleteRule = async (ruleId: string) => {
    if (!confirm('Are you sure you want to delete this rule?')) return;

    try {
      await fetch(`/api/rules/${ruleId}`, { method: 'DELETE' });
      await fetchRules();
    } catch (error) {
      console.error('Error deleting rule:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">RecurringTasks Dashboard</h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              + New Rule
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {rules.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-semibold mb-2">No recurring rules yet</h2>
            <p className="text-gray-600 mb-6">
              Create your first rule to start automating tasks in Notion
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create Your First Rule
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{rule.database_name}</h3>
                    <p className="text-gray-600 mb-2">
                      {generateScheduleDescription(rule)}
                    </p>
                    <div className="text-sm text-gray-500">
                      Next run: {new Date(rule.next_run).toLocaleString()}
                    </div>
                    {rule.last_run && (
                      <div className="text-sm text-gray-500">
                        Last run: {new Date(rule.last_run).toLocaleString()}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleRule(rule.id, rule.is_active)}
                      className={`px-3 py-1 rounded ${
                        rule.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {rule.is_active ? 'Active' : 'Paused'}
                    </button>
                    <button
                      onClick={() => deleteRule(rule.id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                    >
                      Delete
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6">Create Recurring Rule</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Database</label>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <label className="block text-sm font-medium mb-2">Schedule Type</label>
                <select
                  value={newRule.schedule_type}
                  onChange={(e) =>
                    setNewRule({
                      ...newRule,
                      schedule_type: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="custom">Custom (Cron)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {newRule.schedule_type === 'custom' ? 'Cron Expression' : 'Interval'}
                </label>
                <input
                  type="text"
                  value={newRule.schedule_value}
                  onChange={(e) =>
                    setNewRule({ ...newRule, schedule_value: e.target.value })
                  }
                  placeholder={
                    newRule.schedule_type === 'custom'
                      ? '0 9 * * 1 (Every Monday at 9am)'
                      : '1'
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={createRule}
                disabled={!newRule.database_id || !newRule.schedule_value}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Rule
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
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
