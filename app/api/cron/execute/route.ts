import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createPage, duplicatePageToDatabase } from '@/lib/notion';
import { calculateNextRun } from '@/lib/scheduler';

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all active rules with user tokens in a single query
    const dueRules = await db.getActiveRulesWithUsers();

    console.log(`Found ${dueRules.length} rules to execute`);

    const results = await Promise.allSettled(
      dueRules.map(async (rule) => {
        try {
          let pageId: string;

          if (rule.template_page_id) {
            // Duplicate the template page
            pageId = await duplicatePageToDatabase(
              rule.notion_access_token,
              rule.template_page_id,
              rule.database_id
            );
          } else {
            // Create a basic page with title and default status
            const now = new Date();
            const properties: Record<string, any> = {
              Name: {
                title: [
                  {
                    text: {
                      content: `${rule.database_name || 'Task'} - ${now.toLocaleDateString()}`,
                    },
                  },
                ],
              },
              Status: {
                select: { name: 'To Do' },
              },
            };

            pageId = await createPage(
              rule.notion_access_token,
              rule.database_id,
              properties
            );
          }

          // Record success in history
          await db.createTaskHistory({
            rule_id: rule.id,
            page_id: pageId,
            status: 'success',
          });

          // Update rule with next run time
          await db.updateRule(rule.id, {
            last_run: new Date(),
            next_run: calculateNextRun(rule),
          });

          return { ruleId: rule.id, pageId, status: 'success' };
        } catch (error: any) {
          console.error(`Error executing rule ${rule.id}:`, error);

          // Record failure in history
          await db.createTaskHistory({
            rule_id: rule.id,
            page_id: '',
            status: 'failed',
            error_message: error.message,
          });

          return { ruleId: rule.id, status: 'failed', error: error.message };
        }
      })
    );

    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    return NextResponse.json({
      executed: dueRules.length,
      successful,
      failed,
      results: results.map((r) => r.status === 'fulfilled' ? r.value : { error: 'failed' }),
    });
  } catch (error) {
    console.error('Cron execution error:', error);
    return NextResponse.json(
      { error: 'Failed to execute scheduled tasks' },
      { status: 500 }
    );
  }
}
