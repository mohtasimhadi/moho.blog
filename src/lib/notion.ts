// lib/notion.ts
import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { BlogPost } from '@/types/blogs';

// Initialize the Notion client
export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Initialize the NotionToMarkdown converter
export const n2m = new NotionToMarkdown({ notionClient: notion });

// Get all entries from a Notion database
export const getDatabase = async (databaseId: string) => {
  const response = await notion.databases.query({
    database_id: databaseId,
    sorts: [
      {
        property: 'date',
        direction: 'descending',
      },
    ],
  });
  return response.results;
};

// Get a specific page by its ID
export const getPage = async (pageId: string) => {
  const response = await notion.pages.retrieve({ page_id: pageId });
  return response;
};

// Get the Markdown content of a page
export const getPageContent = async (pageId: string) => {
  const mdblocks = await n2m.pageToMarkdown(pageId);
  const mdString = n2m.toMarkdownString(mdblocks);
  return mdString.parent;
};

// Transform a Notion page to our BlogPost format
export const transformPost = (
  post: any,
  category: BlogPost['category']
): BlogPost => {
  let coverImageUrl: string | undefined;

  if (post.cover?.type === 'file' && post.cover.file?.url) {
    coverImageUrl = post.cover.file.url;
  } else if (post.cover?.type === 'external' && post.cover.external?.url) {
    coverImageUrl = post.cover.external.url;
  }

  return {
    id: post.id,
    title: post.properties.Name?.title[0]?.plain_text || 'Untitled',
    slug: post.id, // Using ID as slug for now
    date: post.properties.date?.date?.start || new Date().toISOString(),
    category,
    tags: post.properties.Tags?.multi_select?.map((tag: any) => tag.name),
    coverImage: coverImageUrl,
  };
};

// Get all blog posts from all categories
// This is used by your existing /blogs page
export const getAllPosts = async (): Promise<BlogPost[]> => {
  try {
    const [typistPosts, journalPosts, poetryPosts] = await Promise.all([
      getDatabase(process.env.NOTION_TYPIST_DB_ID!),
      getDatabase(process.env.NOTION_JOURNALS_DB_ID!),
      getDatabase(process.env.NOTION_POETRIES_DB_ID!),
    ]);

    const typistBlogs = typistPosts.map((post) => transformPost(post, 'the-typist'));
    const journalBlogs = journalPosts.map((post) => transformPost(post, 'journals'));
    const poetryBlogs = poetryPosts.map((post) => transformPost(post, 'poetries'));

    // Combine all posts
    return [...typistBlogs, ...journalBlogs, ...poetryBlogs];
  } catch (error) {
    console.error('Error fetching all posts:', error);
    return [];
  }
};

// Get a single post by category and ID
export const getPostByCategoryAndId = async (category: string, id: string): Promise<BlogPost | null> => {
  try {
    // Get the page directly by ID
    const page = await getPage(id);
    
    // Check if the page exists
    if (!page) {
      return null;
    }
    
    // Transform it to our BlogPost format
    // Use the provided category to ensure consistency with URL
    return transformPost(page, category as BlogPost['category']);
  } catch (error) {
    console.error(`Error fetching post by category ${category} and ID ${id}:`, error);
    return null;
  }
};