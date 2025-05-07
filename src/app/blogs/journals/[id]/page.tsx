// app/blog/[category]/[id]/page.tsx
import { Client, isFullPage, isFullDatabase } from '@notionhq/client';
import { PageObjectResponse, PartialPageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { NotionToMarkdown } from 'notion-to-md';
import { BlogPost } from '@/types/blogs';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { cache } from 'react';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const n2m = new NotionToMarkdown({ notionClient: notion });

// Helper type for typed page properties
type NotionPageProperties = PageObjectResponse['properties'];
type NotionTitleProperty = Extract<NotionPageProperties[string], { type: 'title' }>;
type NotionDateProperty = Extract<NotionPageProperties[string], { type: 'date' }>;
type NotionMultiSelectProperty = Extract<NotionPageProperties[string], { type: 'multi_select' }>;

// Cache the data fetching
const getPageData = cache(async (id: string) => {
  try {
    const page = await notion.pages.retrieve({ page_id: id });
    
    if (!isFullPage(page)) {
      throw new Error('Partial page response received');
    }

    const mdblocks = await n2m.pageToMarkdown(id);
    return { page, mdblocks };
  } catch (error) {
    console.error('Error fetching page data:', error);
    return null;
  }
});

export async function generateMetadata({
  params,
}: {
  params: { category: string; id: string };
}): Promise<Metadata> {
  const data = await getPageData(params.id);
  if (!data || !isFullPage(data.page)) return {};
  
  const titleProperty = data.page.properties.Name as NotionTitleProperty | undefined;
  const title = titleProperty?.title[0]?.plain_text || 'Untitled';
  
  return {
    title: `${title} | ${params.category}`,
    description: `Read this ${params.category} post: ${title}`,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { category: string; id: string };
}) {
  const data = await getPageData(params.id);
  if (!data || !isFullPage(data.page)) notFound();

  const { page, mdblocks } = data;
  const mdString = n2m.toMarkdownString(mdblocks);

  const transformPost = (post: PageObjectResponse): BlogPost => {
    // Type-safe property access
    const titleProperty = post.properties.Name as NotionTitleProperty | undefined;
    const dateProperty = post.properties.date as NotionDateProperty | undefined;
    const tagsProperty = post.properties.Tags as NotionMultiSelectProperty | undefined;

    let coverImageUrl: string | undefined;

    if (post.cover?.type === 'file' && post.cover.file?.url) {
      coverImageUrl = post.cover.file.url;
    } else if (post.cover?.type === 'external' && post.cover.external?.url) {
      coverImageUrl = post.cover.external.url;
    }

    return {
      id: post.id,
      title: titleProperty?.title[0]?.plain_text || 'Untitled',
      slug: post.id,
      date: dateProperty?.date?.start || new Date().toISOString(),
      category: params.category as BlogPost['category'],
      tags: tagsProperty?.multi_select?.map((tag) => tag.name),
      coverImage: coverImageUrl,
    };
  };

  const post = transformPost(page);

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <article className="prose prose-lg dark:prose-invert max-w-none">
        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        {/* Post Header */}
        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-sm font-medium px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full capitalize">
              {post.category}
            </span>
            {post.tags?.map((tag) => (
              <span
                key={tag}
                className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
          <time className="text-gray-500 dark:text-gray-400">
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </header>

        {/* Post Content */}
        <div
          className="mt-8"
          dangerouslySetInnerHTML={{ __html: mdString.parent }}
        />
      </article>
    </div>
  );
}

export async function generateStaticParams() {
  const databases = [
    { id: process.env.NOTION_TYPIST_DB_ID!, category: 'the-typist' },
    { id: process.env.NOTION_JOURNALS_DB_ID!, category: 'journals' },
    { id: process.env.NOTION_POETRIES_DB_ID!, category: 'poetries' },
  ];

  const allPosts: { category: string; id: string }[] = [];

  for (const db of databases) {
    try {
      const response = await notion.databases.query({
        database_id: db.id,
      });

      for (const page of response.results) {
        if (isFullPage(page)) {
          allPosts.push({
            category: db.category,
            id: page.id,
          });
        }
      }
    } catch (error) {
      console.error(`Error fetching posts from ${db.category}:`, error);
    }
  }

  return allPosts;
}