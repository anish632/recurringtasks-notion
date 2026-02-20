-- RecurringTasks Database Schema
-- Run this in your Supabase SQL editor or PostgreSQL client

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notion_access_token TEXT NOT NULL,
  notion_bot_id TEXT NOT NULL,
  notion_workspace_id TEXT NOT NULL,
  notion_workspace_name TEXT NOT NULL,
  email TEXT,
  subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'team')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recurring rules table
CREATE TABLE IF NOT EXISTS recurring_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  database_id TEXT NOT NULL,
  database_name TEXT NOT NULL,
  template_page_id TEXT,
  schedule_type TEXT NOT NULL CHECK (schedule_type IN ('daily', 'weekly', 'monthly', 'custom')),
  schedule_value TEXT NOT NULL,
  next_run TIMESTAMP WITH TIME ZONE NOT NULL,
  last_run TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task history table
CREATE TABLE IF NOT EXISTS task_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id UUID NOT NULL REFERENCES recurring_rules(id) ON DELETE CASCADE,
  page_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'failed')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_workspace ON users(notion_workspace_id);
CREATE INDEX IF NOT EXISTS idx_rules_user ON recurring_rules(user_id);
CREATE INDEX IF NOT EXISTS idx_rules_active ON recurring_rules(is_active, next_run);
CREATE INDEX IF NOT EXISTS idx_history_rule ON task_history(rule_id);
CREATE INDEX IF NOT EXISTS idx_history_created ON task_history(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_recurring_rules_updated_at
  BEFORE UPDATE ON recurring_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
