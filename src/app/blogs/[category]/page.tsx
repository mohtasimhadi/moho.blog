// app/blogs/[category]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDatabase } from '@/lib/notion';
import BlogCard from '@/app/components/BlogCard';
import { transformPost } from '@/lib/notion';
import { BlogPost } from '@/types/blogs';

// Generate metadata for the page
export async function generateMetadata({ 
  params 
}: { 
  params: { category: string } 
}): Promise<Metadata> {
  const category = params.category;
  
  // Validate the category
  if (!['the-typist', 'journals', 'poetries'].includes(category)) {
    return {
      title: 'Category Not Found',
    };
  }
  
  const formattedCategory = category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return {
    title: `${formattedCategory} | Blog`,
    description: `Read all ${formattedCategory} posts`,
  };
}

export default async function CategoryPage({ 
  params 
}: { 
  params: { category: string } 
}) {
  const category = params.category;
  
  // Validate the category
  if (!['the-typist', 'journals', 'poetries'].includes(category)) {
    notFound();
  }
  
  // Determine which database to query based on the category
  let databaseId: string;
  switch (category) {
    case 'the-typist':
      databaseId = process.env.NOTION_TYPIST_DB_ID!;
      break;
    case 'journals':
      databaseId = process.env.NOTION_JOURNALS_DB_ID!;
      break;
    case 'poetries':
      databaseId = process.env.NOTION_POETRIES_DB_ID!;
      break;
    default:
      notFound();
  }
  
  // Fetch the posts
  const posts = await getDatabase(databaseId);
  
  // Format the category name for display (handling both dashes and no dashes)
  const formattedCategory = category
    .split(/[-_\s]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  // Transform the posts
  const blogPosts = posts.map((post) => 
    transformPost(post, category as BlogPost['category'])
  );
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">{formattedCategory}</h1>
      
      {blogPosts.length === 0 ? (
        <p className="text-gray-500">No posts found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}