"use client";

import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";

export default function OnWriting() {
  const [writingData, setWritingData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/data/writing.json")
      .then((res) => res.json())
      .then((data) => setWritingData(data))
      .catch((err) => console.error("Error fetching writing data:", err));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll(".blog-section");
      let currentSection = "";
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          currentSection = section.id;
        }
      });
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getAllTags = () => {
    const tags = new Set<string>();
    Object.values(writingData?.on_writing || {}).forEach((group: any) => {
      if (Array.isArray(group)) {
        group.forEach((book: any) => {
          (book.tags || []).forEach((tag: string) => tags.add(tag));
        });
      }
    });
    return Array.from(tags);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filterBooks = (books: any[]) => {
    return books.filter((book) => {
      const matchesSearch = book.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesTags =
        selectedTags.length === 0 ||
        (book.tags || []).some((tag: string) => selectedTags.includes(tag));
      return matchesSearch && matchesTags;
    });
  };

  if (!writingData)
    return <p className="text-center mt-10 text-lg">Loading...</p>;

  const allTags = getAllTags();

  return (
    <div className="max-w-7xl mx-auto pt-1 px-4 md:px-6">
      {/* Mobile Filter Button */}
      <div className="md:hidden text-right mt-4">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="px-4 py-2 rounded bg-gray-900 text-white font-medium"
        >
          Open Navigation
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mt-6">
        {/* Sidebar (Desktop) */}
        <aside className="hidden md:block w-72 bg-white border border-gray-200 rounded p-5 border-1 sticky top-6 h-fit">
          <SidebarContent
            data={writingData}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            allTags={allTags}
            selectedTags={selectedTags}
            toggleTag={toggleTag}
            activeSection={activeSection}
          />
        </aside>

        {/* Sidebar (Mobile Drawer) */}
        <Transition show={isMobileMenuOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 md:hidden"
            onClose={setIsMobileMenuOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-30" />
            </Transition.Child>

            <div className="fixed inset-0 flex justify-center items-start p-4">
              <Transition.Child
                as={Fragment}
                enter="transition-transform ease-out duration-300"
                enterFrom="translate-y-10 opacity-0"
                enterTo="translate-y-0 opacity-100"
                leave="transition-transform ease-in duration-200"
                leaveFrom="translate-y-0 opacity-100"
                leaveTo="translate-y-10 opacity-0"
              >
                <Dialog.Panel className="w-full max-w-sm bg-white p-6 rounded border-1">
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title className="text-lg font-bold">
                      Jump to Section
                    </Dialog.Title>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-gray-500 text-xl"
                    >
                      ×
                    </button>
                  </div>
                  <SidebarContent
                    data={writingData}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    allTags={allTags}
                    selectedTags={selectedTags}
                    toggleTag={toggleTag}
                    activeSection={activeSection}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>

        {/* Main Content */}
        <div className="w-full md:w-3/4">
          {Object.entries(writingData.on_writing).map(
            ([category, books]: [string, any]) => {
              const filtered = filterBooks(books);
              if (filtered.length === 0) return null;

              return (
                <div
                  key={category}
                  id={category.replace(/\s+/g, "-")}
                  className="blog-section mb-12"
                >
                  <h2 className="text-2xl font-bold text-[#0C2340] mb-4">
                    {category}
                  </h2>
                  <div className="grid md:grid-cols-4 gap-6">
                    {filtered.map((book: any, index: number) => (
                      <BookCard key={index} book={book} />
                    ))}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}

function SidebarContent({
  data,
  searchTerm,
  setSearchTerm,
  allTags,
  selectedTags,
  toggleTag,
  activeSection,
}: {
  data: any;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  allTags: string[];
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  activeSection: string | null;
}) {
  return (
    <>
      <input
        type="text"
        placeholder="Search by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-6 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-300"
      />

      <ul className="space-y-2 mb-6">
        {Object.keys(data.on_writing).map((subCategory) => (
          <li key={subCategory}>
            <a
              href={`#${subCategory.replace(/\s+/g, "-")}`}
              className={`block px-3 py-2 rounded text-base font-bold ${
                activeSection === subCategory.replace(/\s+/g, "-")
                  ? "bg-gray-900 text-white"
                  : "hover:bg-gray-300"
              }`}
            >
              {subCategory}
            </a>
          </li>
        ))}
      </ul>

      <div className="space-y-2">
        <h3 className="font-medium text-gray-700">🏷️ Tags</h3>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag, idx) => (
            <label
              key={idx}
              className={`px-3 py-1 border rounded text-sm cursor-pointer transition ${
                selectedTags.includes(tag)
                  ? "bg-orange-100 border-orange-400 text-orange-700"
                  : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedTags.includes(tag)}
                onChange={() => toggleTag(tag)}
                className="hidden"
              />
              {tag}
            </label>
          ))}
        </div>
      </div>
    </>
  );
}

function BookCard({ book }: { book: any }) {
  return (
    <div className="bg-white border-1 rounded p-2 flex flex-col items-center text-center border-gray-500">
      <Image
        src={book.cover}
        alt={book.title}
        width={150}
        height={200}
        className="rounded object-cover mb-2"
      />
      <h3 className="text-lg font-semibold">{book.title}</h3>
      <p className="text-sm text-gray-600">{book.details}</p>
      <p className="text-sm text-gray-500">📅 Published: {book.year}</p>
      <p className="text-sm text-gray-500">🏢 Publisher: {book.publisher}</p>
      {book.goodreads && (
        <Link
          href={book.goodreads}
          target="_blank"
          className="mt-3 text-[#0C2340] font-semibold hover:underline"
        >
          📖 View on Goodreads
        </Link>
      )}
    </div>
  );
}
