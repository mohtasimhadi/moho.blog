import { getDatabase } from '@/lib/notion'
import BlogCard from '../components/BlogCard'
import { BlogPost } from '@/types/blogs'

export default async function BlogPage() {
  const [typistPosts, journalPosts, poetryPosts] = await Promise.all([
    getDatabase(process.env.NOTION_TYPIST_DB_ID!),
    getDatabase(process.env.NOTION_JOURNALS_DB_ID!),
    getDatabase(process.env.NOTION_POETRIES_DB_ID!),
  ])

  const transformPost = (post: any, category: BlogPost['category']): BlogPost => {
    return {
      id: post.id,
      title: post.properties.Name?.title[0]?.plain_text || 'Untitled',
      slug: post.id, // Using Notion page ID as slug
      date: post.properties.date?.date?.start || new Date().toISOString(),
      category,
      tags: post.properties.Tags?.multi_select?.map((tag: any) => tag.name),
      coverImage: post.cover?.file?.url || post.cover?.external?.url,
    }
  }

  const allPosts = [
    ...typistPosts.map((post) => transformPost(post, 'the-typist')),
    ...journalPosts.map((post) => transformPost(post, 'journals')),
    ...poetryPosts.map((post) => transformPost(post, 'poetries')),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allPosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}