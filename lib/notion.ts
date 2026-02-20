import { Client } from '@notionhq/client';
import { NotionDatabase, NotionPage } from './types';

export function createNotionClient(accessToken: string) {
  return new Client({ auth: accessToken });
}

export async function getUserDatabases(accessToken: string): Promise<NotionDatabase[]> {
  const notion = createNotionClient(accessToken);
  
  try {
    const response = await notion.search({
      filter: { property: 'object', value: 'database' } as any,
      page_size: 100,
    });

    return response.results
      .filter((item: any) => item.object === 'database')
      .map((db: any) => ({
        id: db.id,
        name: db.title?.[0]?.plain_text || 'Untitled',
        url: db.url,
      }));
  } catch (error) {
    console.error('Error fetching databases:', error);
    throw error;
  }
}

export async function getDatabase(accessToken: string, databaseId: string) {
  const notion = createNotionClient(accessToken);
  
  try {
    const database = await notion.databases.retrieve({ database_id: databaseId });
    return database;
  } catch (error) {
    console.error('Error fetching database:', error);
    throw error;
  }
}

export async function queryDatabase(accessToken: string, databaseId: string) {
  const notion = createNotionClient(accessToken);
  
  try {
    const response = await (notion.databases as any).query({ database_id: databaseId });
    return response.results;
  } catch (error) {
    console.error('Error querying database:', error);
    throw error;
  }
}

export async function getPage(accessToken: string, pageId: string): Promise<NotionPage> {
  const notion = createNotionClient(accessToken);
  
  try {
    const page: any = await notion.pages.retrieve({ page_id: pageId });
    
    return {
      id: page.id,
      title: extractTitle(page.properties),
      url: page.url,
      properties: page.properties,
    };
  } catch (error) {
    console.error('Error fetching page:', error);
    throw error;
  }
}

export async function createPage(
  accessToken: string,
  databaseId: string,
  properties: Record<string, any>,
  templatePageId?: string
): Promise<string> {
  const notion = createNotionClient(accessToken);
  
  try {
    let pageProperties = properties;

    // If template page is provided, fetch its properties
    if (templatePageId) {
      const templatePage = await getPage(accessToken, templatePageId);
      // Merge template properties with new properties (new properties override template)
      pageProperties = { ...templatePage.properties, ...properties };
    }

    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: pageProperties,
    });

    return response.id;
  } catch (error) {
    console.error('Error creating page:', error);
    throw error;
  }
}

function extractTitle(properties: Record<string, any>): string {
  // Find the title property
  for (const key in properties) {
    if (properties[key].type === 'title') {
      return properties[key].title?.[0]?.plain_text || 'Untitled';
    }
  }
  return 'Untitled';
}

export async function duplicatePageToDatabase(
  accessToken: string,
  templatePageId: string,
  targetDatabaseId: string
): Promise<string> {
  const notion = createNotionClient(accessToken);
  
  try {
    // Get the template page
    const templatePage: any = await notion.pages.retrieve({ page_id: templatePageId });
    
    // Create a new page with the same properties
    const response = await notion.pages.create({
      parent: { database_id: targetDatabaseId },
      properties: templatePage.properties,
    });

    return response.id;
  } catch (error) {
    console.error('Error duplicating page:', error);
    throw error;
  }
}
