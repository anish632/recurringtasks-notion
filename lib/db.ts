import { Pool } from 'pg';
import { User, RecurringRule, TaskHistory } from './types';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export const db = {
  // Users
  async createUser(userData: Omit<User, 'id' | 'created_at'>): Promise<User> {
    // Upsert: if workspace already connected, update the token
    const { rows } = await pool.query(
      `INSERT INTO users (notion_access_token, notion_bot_id, notion_workspace_id, notion_workspace_name, subscription_tier)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (notion_workspace_id) DO UPDATE SET
         notion_access_token = EXCLUDED.notion_access_token,
         notion_bot_id = EXCLUDED.notion_bot_id,
         notion_workspace_name = EXCLUDED.notion_workspace_name
       RETURNING *`,
      [
        userData.notion_access_token,
        userData.notion_bot_id,
        userData.notion_workspace_id,
        userData.notion_workspace_name,
        userData.subscription_tier || 'free',
      ]
    );
    return rows[0];
  },

  async getUserById(id: string): Promise<User | null> {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return rows[0] || null;
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const setClauses: string[] = [];
    const values: any[] = [];
    let i = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (key !== 'id' && key !== 'created_at') {
        setClauses.push(`${key} = $${i}`);
        values.push(value);
        i++;
      }
    }
    values.push(id);

    const { rows } = await pool.query(
      `UPDATE users SET ${setClauses.join(', ')} WHERE id = $${i} RETURNING *`,
      values
    );
    return rows[0];
  },

  // Recurring Rules
  async createRule(rule: Omit<RecurringRule, 'id' | 'created_at' | 'updated_at'>): Promise<RecurringRule> {
    const { rows } = await pool.query(
      `INSERT INTO recurring_rules (user_id, database_id, database_name, template_page_id, schedule_type, schedule_value, next_run, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        rule.user_id,
        rule.database_id,
        rule.database_name,
        rule.template_page_id || null,
        rule.schedule_type,
        rule.schedule_value,
        rule.next_run,
        rule.is_active ?? true,
      ]
    );
    return rows[0];
  },

  async getRulesByUserId(userId: string): Promise<RecurringRule[]> {
    const { rows } = await pool.query(
      'SELECT * FROM recurring_rules WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  },

  async getActiveRules(): Promise<RecurringRule[]> {
    const { rows } = await pool.query(
      'SELECT * FROM recurring_rules WHERE is_active = true AND next_run <= NOW()'
    );
    return rows;
  },

  async updateRule(id: string, updates: Partial<RecurringRule>): Promise<RecurringRule> {
    const setClauses: string[] = [];
    const values: any[] = [];
    let i = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (key !== 'id' && key !== 'created_at') {
        setClauses.push(`${key} = $${i}`);
        values.push(value instanceof Date ? value.toISOString() : value);
        i++;
      }
    }
    setClauses.push(`updated_at = NOW()`);
    values.push(id);

    const { rows } = await pool.query(
      `UPDATE recurring_rules SET ${setClauses.join(', ')} WHERE id = $${i} RETURNING *`,
      values
    );
    return rows[0];
  },

  async deleteRule(id: string): Promise<void> {
    await pool.query('DELETE FROM recurring_rules WHERE id = $1', [id]);
  },

  // Task History
  async createTaskHistory(history: Omit<TaskHistory, 'id' | 'created_at'>): Promise<TaskHistory> {
    const { rows } = await pool.query(
      `INSERT INTO task_history (rule_id, page_id, status, error_message)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [history.rule_id, history.page_id, history.status, history.error_message || null]
    );
    return rows[0];
  },

  async getTaskHistory(ruleId: string, limit: number = 50): Promise<TaskHistory[]> {
    const { rows } = await pool.query(
      'SELECT * FROM task_history WHERE rule_id = $1 ORDER BY created_at DESC LIMIT $2',
      [ruleId, limit]
    );
    return rows;
  },
};
