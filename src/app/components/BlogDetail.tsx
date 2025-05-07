// app/components/BlogDetail.tsx
import Image from 'next/image';
import Link from 'next/link';
import Markdown from 'react-markdown';
import { BlogPost } from '@/types/blogs';

interface BlogDetailProps {
  post: BlogPost;
  content: string;
}

export default function BlogDetail({ post, content }: BlogDetailProps) {
  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm">
        <Link href="/blogs" className="text-gray-500 hover:text-gray-700">
          Blogs
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link
          href={`/blogs/${post.category}`}
          className="text-gray-500 hover:text-gray-700 capitalize"
        >
          {post.category.replace(/-/g, ' ')}
        </Link>
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

      {/* Published date */}
      <div className="mb-6 text-gray-500">
        Published on {new Date(post.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>

      {/* Cover image */}
      {post.coverImage && (
        <div className="relative h-72 md:h-96 mb-8 overflow-hidden rounded-lg">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <Markdown>{content}</Markdown>
      </div>
    </article>
  );
}