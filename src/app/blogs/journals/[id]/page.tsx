// app/blog/[category]/[id]/page.tsx
import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { BlogPost } from '@/types/blogs';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

export default async function BlogPostPage({
  params,
}: {
  params: { category: string; id: string };
}) {
  // Fetch the page content from Notion
  const page = await notion.pages.retrieve({ page_id: params.id });
  
  // Fetch the blocks and convert to markdown
  const mdblocks = await n2m.pageToMarkdown(params.id);
  const mdString = n2m.toMarkdownString(mdblocks);

  // Transform the post data (similar to your listing page)
  const transformPost = (post: any): BlogPost => {
    let coverImageUrl: string | undefined;

    if (post.cover?.type === 'file' && post.cover.file?.url) {
      coverImageUrl = post.cover.file.url;
    } else if (post.cover?.type === 'external' && post.cover.external?.url) {
      coverImageUrl = post.cover.external.url;
    }

    return {
      id: post.id,
      title: post.properties.Name?.title[0]?.plain_text || 'Untitled',
      slug: post.id,
      date: post.properties.date?.date?.start || new Date().toISOString(),
      category: params.category as BlogPost['category'],
      tags: post.properties.Tags?.multi_select?.map((tag: any) => tag.name),
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
            />
          </div>
        )}

        {/* Post Header */}
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-4">
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

// Generate static paths (optional - for SSG)
export async function generateStaticParams() {
  const databases = [
    process.env.NOTION_TYPIST_DB_ID!,
    process.env.NOTION_JOURNALS_DB_ID!,
    process.env.NOTION_POETRIES_DB_ID!,
  ];

  const categories = ['the-typist', 'journals', 'poetries'];
  const allPosts = [];

  for (let i = 0; i < databases.length; i++) {
    const response = await notion.databases.query({
      database_id: databases[i],
    });
    const posts = response.results.map((post) => ({
      id: post.id,
      category: categories[i],
    }));
    allPosts.push(...posts);
  }

  return allPosts.map((post) => ({
    category: post.category,
    id: post.id,
  }));
}