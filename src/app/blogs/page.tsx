import { getDatabase, transformPost } from "@/lib/notion";
import BlogCard from "../components/BlogCard";
import { BlogPost } from "@/types/blogs";

export default async function BlogPage() {
  const [typistPosts, journalPosts, poetryPosts] = await Promise.all([
    getDatabase(process.env.NOTION_TYPIST_DB_ID!),
    getDatabase(process.env.NOTION_JOURNALS_DB_ID!),
    getDatabase(process.env.NOTION_POETRIES_DB_ID!),
  ]);

  const typistBlogs = typistPosts.map((post) =>
    transformPost(post, "the-typist")
  );
  const journalBlogs = journalPosts.map((post) =>
    transformPost(post, "journals")
  );
  const poetryBlogs = poetryPosts.map((post) =>
    transformPost(post, "poetries")
  );

  // Sort each category separately
  const sortByDate = (a: BlogPost, b: BlogPost) =>
    new Date(b.date).getTime() - new Date(a.date).getTime();

  typistBlogs.sort(sortByDate);
  journalBlogs.sort(sortByDate);
  poetryBlogs.sort(sortByDate);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="md:w-3/4 p-4">
        <div className="mb-8 bg-gray-50 p-4">
          <h2 className="text-2xl font-semibold mb-4">The Typist</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {typistBlogs.slice(0, 3).map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        <div className="mb-8 p-4">
          <h2 className="text-2xl font-semibold mb-4">Journals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {journalBlogs.slice(0, 3).map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>

      <div className="md:w-1/4 p-4">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Poetries</h2>
          <div className="grid grid-cols-1 gap-6">
            {poetryBlogs.slice(0, 3).map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
