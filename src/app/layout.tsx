import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "the Moho Blog",
  description: "Journal of Mohtasim Hadi Rafi",
  icons: {
    icon: "/imgs/people/self.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        <Navbar />
        <div className="mt-[120px]">{children}</div>
        <Footer />
      </body>
    </html>
  );
}