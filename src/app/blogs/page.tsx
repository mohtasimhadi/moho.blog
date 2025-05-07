import { getDatabase } from "@/lib/notion";
import BlogCard from "../components/BlogCard";
import { BlogPost } from "@/types/blogs";

export default async function BlogPage() {
  const [typistPosts, journalPosts, poetryPosts] = await Promise.all([
    getDatabase(process.env.NOTION_TYPIST_DB_ID!),
    getDatabase(process.env.NOTION_JOURNALS_DB_ID!),
    getDatabase(process.env.NOTION_POETRIES_DB_ID!),
  ]);

  const transformPost = (
    post: any,
    category: BlogPost["category"]
  ): BlogPost => {
    let coverImageUrl: string | undefined;

    if (post.cover?.type === "file" && post.cover.file?.url) {
      coverImageUrl = post.cover.file.url;
    } else if (post.cover?.type === "external" && post.cover.external?.url) {
      coverImageUrl = post.cover.external.url;
    }

    return {
      id: post.id,
      title: post.properties.Name?.title[0]?.plain_text || "Untitled",
      slug: post.id,
      date: post.properties.date?.date?.start || new Date().toISOString(),
      category,
      tags: post.properties.Tags?.multi_select?.map((tag: any) => tag.name),
      coverImage: coverImageUrl,
    };
  };

  // Transform posts for each category
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
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">The Typist</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {typistBlogs.slice(0, 3).map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        <div className="mb-8">
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
