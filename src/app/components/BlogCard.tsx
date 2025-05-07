// src/app/components/BlogCard.tsx
import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/types/blogs";

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <div className="overflow-hidden">
      {/* <Link href={`/blogs/${post.category}/${post.id}`}> */}
      <Link href={post.url}>
        {post.coverImage && (
          <div className="relative h-48">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}
        <div className="p-4 pl-0">
          <div className="flex justify-between items-start">
            <span className="text-sm text-gray-500 capitalize">
              {post.category}
            </span>
            <time className="text-sm text-gray-400">
              {new Date(post.date).toLocaleDateString()}
            </time>
          </div>
          <h3 className="text-xl font-semibold mt-1">{post.title}</h3>
          {post.tags && post.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
