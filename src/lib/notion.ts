import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { BlogPost } from '@/types/blogs';

export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export const n2m = new NotionToMarkdown({ notionClient: notion });

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

export const getPage = async (pageId: string) => {
  const response = await notion.pages.retrieve({ page_id: pageId });
  return response;
};

export const getPageContent = async (pageId: string) => {
  const mdblocks = await n2m.pageToMarkdown(pageId);
  const mdString = n2m.toMarkdownString(mdblocks);
  return mdString.parent;
};

export const transformPost = (
  post: any,
  category: BlogPost["category"]
): BlogPost => {
  let coverImageUrl: string | undefined;

  if (post.cover?.type === "file" && post.cover.file?.url) {
    coverImageUrl = post.cover.file.url;
  } else if (post.cover?.type === "external" && post.cover.external?.url) {
    coverImageUrl = post.cover.external.url;
  }

  return {
    id: post.id,
    title: post.properties.Name?.title[0]?.plain_text || "Untitled",
    date: post.properties.date?.date?.start || new Date().toISOString(),
    category,
    tags: post.properties.Tags?.multi_select?.map((tag: any) => tag.name),
    coverImage: coverImageUrl,
    url: post.url,
  };
};

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

    return [...typistBlogs, ...journalBlogs, ...poetryBlogs];
  } catch (error) {
    console.error('Error fetching all posts:', error);
    return [];
  }
};

export const getPostByCategoryAndId = async (category: string, id: string): Promise<BlogPost | null> => {
  try {
    const page = await getPage(id);
    if (!page) {
      return null;
    }
    return transformPost(page, category as BlogPost['category']);
  } catch (error) {
    console.error(`Error fetching post by category ${category} and ID ${id}:`, error);
    return null;
  }
};