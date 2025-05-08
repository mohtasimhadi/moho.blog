import { NextResponse } from 'next/server';
import { getDatabase, transformPost } from "@/lib/notion";
import { BlogPost } from "@/types/blogs";

export async function GET() {
  try {
    const posts = await getDatabase(process.env.NOTION_PATENTS_DB_ID!);
    const blogs = posts.map((post) =>
      transformPost(post, "journals")
    );

    // Sort blogs by date
    blogs.sort((a: BlogPost, b: BlogPost) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json(blogs);
  } catch (error) {
    return NextResponse.error();
  }
}
