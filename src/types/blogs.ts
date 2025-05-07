export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  category: "the-typist" | "journals" | "poetries";
  tags?: string[];
  coverImage?: string;
}