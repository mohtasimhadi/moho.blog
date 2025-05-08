"use client"

import BlogCard from "../components/BlogCard";
import { BlogPost } from "@/types/blogs";
import { useEffect, useState } from "react";

export default function Blogs() {
  const [journals, setJournals] = useState<BlogPost[]>([]);
  const [poetries, setPoetries] = useState<BlogPost[]>([]);
  const [typist, setTypist] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchJournals = async () => {
      const response = await fetch('/api/journals');
      if (response.ok) {
        const blogs: BlogPost[] = await response.json();
        setJournals(blogs)
      } else {
        console.error("Failed to fetch journals");
      }
    };
    const fetchPoetries = async () => {
      const response = await fetch('/api/poetries');
      if (response.ok) {
        const blogs: BlogPost[] = await response.json();
        setPoetries(blogs)
      } else {
        console.error("Failed to fetch journals");
      }
    };
    const fetchTypist = async () => {
      const response = await fetch('/api/theTypist');
      if (response.ok) {
        const blogs: BlogPost[] = await response.json();
        setTypist(blogs)
      } else {
        console.error("Failed to fetch journals");
      }
    };
    fetchTypist();
    fetchPoetries();
    fetchJournals();
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="md:w-3/4 p-4">
        <div className="mb-8 bg-gray-50 p-4">
          <h2 className="text-2xl font-semibold mb-4">The Typist</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {typist.slice(0, 3).map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <a href="/blogs/the-typist" className="text-blue-500 hover:underline">
              See more →
            </a>
          </div>
        </div>

        <div className="mb-8 p-4">
          <h2 className="text-2xl font-semibold mb-4">Journals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {journals.slice(0, 3).map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <a href="/blogs/journals" className="text-blue-500 hover:underline">
              See more →
            </a>
          </div>
        </div>
      </div>

      <div className="md:w-1/4 p-4">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Poetries</h2>
          <div className="grid grid-cols-1 gap-6">
            {poetries.slice(0, 8).map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <a href="/blogs/poetries" className="text-blue-500 hover:underline">
              See more →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
