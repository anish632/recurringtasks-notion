import { createClient } from '@supabase/supabase-js';
import { User, RecurringRule, TaskHistory } from './types';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database helper functions
export const db = {
  // Users
  async createUser(userData: Omit<User, 'id' | 'created_at'>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return data;
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Recurring Rules
  async createRule(rule: Omit<RecurringRule, 'id' | 'created_at' | 'updated_at'>): Promise<RecurringRule> {
    const { data, error } = await supabase
      .from('recurring_rules')
      .insert(rule)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getRulesByUserId(userId: string): Promise<RecurringRule[]> {
    const { data, error } = await supabase
      .from('recurring_rules')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getActiveRules(): Promise<RecurringRule[]> {
    const { data, error } = await supabase
      .from('recurring_rules')
      .select('*')
      .eq('is_active', true)
      .lte('next_run', new Date().toISOString());
    
    if (error) throw error;
    return data || [];
  },

  async updateRule(id: string, updates: Partial<RecurringRule>): Promise<RecurringRule> {
    const { data, error } = await supabase
      .from('recurring_rules')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteRule(id: string): Promise<void> {
    const { error } = await supabase
      .from('recurring_rules')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Task History
  async createTaskHistory(history: Omit<TaskHistory, 'id' | 'created_at'>): Promise<TaskHistory> {
    const { data, error } = await supabase
      .from('task_history')
      .insert(history)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getTaskHistory(ruleId: string, limit: number = 50): Promise<TaskHistory[]> {
    const { data, error } = await supabase
      .from('task_history')
      .select('*')
      .eq('rule_id', ruleId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  },
};
