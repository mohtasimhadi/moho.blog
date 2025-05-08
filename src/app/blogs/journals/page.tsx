"use client";

import { useEffect, useState } from "react";
import BlogCard from "@/app/components/BlogCard";
import { BlogPost } from "@/types/blogs";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/getPosts');
      if (response.ok) {
        const blogs: BlogPost[] = await response.json();
        setPosts(blogs);
      } else {
        console.error("Failed to fetch posts.");
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="md:w-3/4 p-4">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Journals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
