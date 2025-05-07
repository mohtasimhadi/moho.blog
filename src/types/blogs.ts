// src/types/blogs.ts
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  url: string;
  category: "the-typist" | "journals" | "poetries";
  tags?: string[];
  coverImage?: string;
}