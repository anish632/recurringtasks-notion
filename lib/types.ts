export interface User {
  id: string;
  notion_access_token: string;
  notion_bot_id: string;
  notion_workspace_id: string;
  notion_workspace_name: string;
  email?: string;
  created_at: Date;
  subscription_tier: 'free' | 'pro' | 'team';
}

export interface RecurringRule {
  id: string;
  user_id: string;
  database_id: string;
  database_name: string;
  template_page_id?: string;
  schedule_type: 'daily' | 'weekly' | 'monthly' | 'custom';
  schedule_value: string; // cron expression or simplified format
  next_run: Date;
  last_run?: Date;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface TaskHistory {
  id: string;
  rule_id: string;
  page_id: string;
  created_at: Date;
  status: 'success' | 'failed';
  error_message?: string;
}

export interface NotionDatabase {
  id: string;
  name: string;
  url: string;
}

export interface NotionPage {
  id: string;
  title: string;
  url: string;
  properties: Record<string, any>;
}
