"use client";

import { useEffect, useState } from "react";
import BlogCard from "@/app/components/BlogCard";
import { BlogPost } from "@/types/blogs";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState("desc");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);  // Track current page
  const postsPerPage = 9;  // Set posts per page

  // Fetch posts from the API
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/journals');
      if (response.ok) {
        const blogs: BlogPost[] = await response.json();
        setPosts(blogs);
      } else {
        console.error("Failed to fetch posts.");
      }
    };

    fetchPosts();
  }, []);

  // Filter and sort posts based on searchQuery, selectedSort, and selectedTags
  useEffect(() => {
    let updatedPosts = [...posts];

    // Search by title
    if (searchQuery) {
      updatedPosts = updatedPosts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      updatedPosts = updatedPosts.filter((post) =>
        post.tags && post.tags.some((tag) => selectedTags.includes(tag))
      );
    }

    // Sort by date
    updatedPosts.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return selectedSort === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredPosts(updatedPosts);
  }, [searchQuery, selectedSort, selectedTags, posts]); // Ensure the dependencies are correct

  // Get posts for the current page
  const currentPosts = filteredPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  // Handle change in search query
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSort(e.target.value);
  };

  // Handle tag selection change
  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedTags((prevTags) =>
      prevTags.includes(value)
        ? prevTags.filter((tag) => tag !== value)
        : [...prevTags, value]
    );
  };

  // Get unique tags for filtering
  const uniqueTags = Array.from(new Set(posts.flatMap((post) => post.tags || [])));

  // Handle "Next Page" click
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // Handle "Previous Page" click
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <div className="flex">
      {/* Left Sidebar Menu */}
      <div className="w-1/4 p-4 bg-gray-100">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>

        {/* Search by Title */}
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by title"
          className="p-2 mb-4 w-full border border-gray-300 rounded-md"
        />

        {/* Sort by Date */}
        <select
          value={selectedSort}
          onChange={handleSortChange}
          className="p-2 mb-4 w-full border border-gray-300 rounded-md"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>

        {/* Filter by Tags */}
        <select
          multiple
          value={selectedTags}
          onChange={handleTagChange}
          className="p-2 mb-4 w-full border border-gray-300 rounded-md"
        >
          {uniqueTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      {/* Main Content Area */}
      <div className="w-3/4 p-4">
        <h2 className="text-2xl font-semibold mb-4">Journals</h2>

        {/* Display the filtered blog posts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-white rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPosts.length < postsPerPage}
            className="px-4 py-2 bg-gray-300 text-white rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
