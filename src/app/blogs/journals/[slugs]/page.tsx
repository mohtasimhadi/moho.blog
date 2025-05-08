"use client";
import { useParams } from 'next/navigation';
import { NotionPage } from '@/app/components/notionRenderer';
import { useEffect, useState } from 'react';

export default function NotionPageWrapper() {
  const { slugs } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slugs) {
      setError('Missing page ID');
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/notion/${slugs}`, { 
          signal,
          cache: 'force-cache'
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to load page');
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [slugs]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return (
    <div className="p-4 text-red-500">
      <h2 className="text-xl font-bold mb-2">Error loading page</h2>
      <p>{error}</p>
      {error.includes('Invalid Notion page ID format') && (
        <p className="mt-2">Please check that the URL is correct.</p>
      )}
    </div>
  );
  if (!data) return <div className="p-4">Page not found</div>;

  return (
    <div className="notion-container">
      <NotionPage recordMap={data} rootPageId={slugs as string} />
    </div>
  );
}