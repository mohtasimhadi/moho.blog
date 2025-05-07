// app/blogs/[category]/[id]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPageContent, getPostByCategoryAndId } from '@/lib/notion';
import BlogDetail from '@/app/components/BlogDetail';

// Define the types for route params
type Props = {
  params: {
    category: string;
    id: string;
  };
};

// Generate metadata for the page
export async function generateMetadata({ 
  params 
}: { 
  params: { category: string; id: string } 
}): Promise<Metadata> {
  const category = params.category;
  const id = params.id;
  
  const post = await getPostByCategoryAndId(category, id);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: `${post.title} - ${post.category}`,
    openGraph: {
      title: post.title,
      description: `${post.title} - ${post.category}`,
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
  };
}

// We're not pre-generating all paths to work with your existing structure
// This allows the system to handle all requests dynamically
// and works with your existing /blogs/page.tsx

export default async function BlogPost({ 
  params 
}: { 
  params: { category: string; id: string } 
}) {
  const category = params.category;
  const id = params.id;
  
  // Validate the category
  if (!['the-typist', 'journals', 'poetries'].includes(category)) {
    notFound();
  }
  
  // Fetch the post
  const post = await getPostByCategoryAndId(category, id);
  
  // If post not found, return 404
  if (!post) {
    notFound();
  }
  
  // Fetch the content
  const content = await getPageContent(id);

  // Use the shared BlogDetail component
  return <BlogDetail post={post} content={content} />;
}