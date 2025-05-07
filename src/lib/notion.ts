import { Client } from '@notionhq/client'
import { PageObjectResponse, GetPageResponse } from '@notionhq/client/build/src/api-endpoints'

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

export const getDatabase = async (databaseId: string) => {
  const response = await notion.databases.query({
    database_id: databaseId,
    sorts: [
      {
        property: 'date',
        direction: 'descending',
      },
    ],
  })
  return response.results
}

export const getNotionPage = async (pageId: string): Promise<PageObjectResponse| GetPageResponse | null> => {
  try {
    const response = await notion.pages.retrieve({ page_id: pageId });
    return response;
  } catch (error) {
    console.error('Error fetching Notion page:', error);
    return null;
  }
};