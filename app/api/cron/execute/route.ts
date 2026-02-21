import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createPage, duplicatePageToDatabase } from '@/lib/notion';
import { calculateNextRun } from '@/lib/scheduler';

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    const expectedSecret = process.env.CRON_SECRET || 'dev-secret';
    
    if (authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all active rules that are due to run
    const dueRules = await db.getActiveRules();

    console.log(`Found ${dueRules.length} rules to execute`);

    const results = await Promise.allSettled(
      dueRules.map(async (rule) => {
        try {
          const user = await db.getUserById(rule.user_id);
          if (!user) {
            throw new Error('User not found');
          }

          let pageId: string;

          if (rule.template_page_id) {
            // Duplicate the template page
            pageId = await duplicatePageToDatabase(
              user.notion_access_token,
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
            };

            // Try to set Status to "To Do" if the database has a status property
            try {
              const { getDatabase } = await import('@/lib/notion');
              const dbInfo: any = await getDatabase(user.notion_access_token, rule.database_id);
              const statusProp = Object.entries(dbInfo.properties).find(
                ([, v]: [string, any]) => v.type === 'select' || v.type === 'status'
              );
              if (statusProp) {
                const [propName, propVal]: [string, any] = statusProp;
                const firstOption = propVal.select?.options?.[0]?.name || propVal.status?.options?.[0]?.name;
                if (firstOption) {
                  properties[propName] = propVal.type === 'status'
                    ? { status: { name: firstOption } }
                    : { select: { name: firstOption } };
                }
              }
            } catch {
              // Ignore — just create without status
            }

            pageId = await createPage(
              user.notion_access_token,
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
