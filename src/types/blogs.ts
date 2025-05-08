// src/types/blogs.ts
export interface BlogPost {
  id: string;
  title: string;
  date: string;
  url: string;
  category: "featured" | "journals" | "news" | "notes" | "patents" | "poetries" | "presentations" | "projects" | "publications" | "the-typist";
  tags?: string[];
  coverImage?: string;
}