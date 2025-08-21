'use client';

import { useState, useEffect } from 'react';
import { Page, Card, ResourceList, Text, Badge } from '@shopify/polaris';
import Link from 'next/link';

interface PageInsight {
  page_path: string;
  click_count: number;
}

export default function Home() {
  const [pages, setPages] = useState<PageInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPageInsights();
  }, []);

  const fetchPageInsights = async () => {
    try {
      const response = await fetch('/api/insights/pages');
      if (!response.ok) {
        throw new Error('Failed to fetch page insights');
      }
      const result = await response.json();
      setPages(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = (item: PageInsight) => {
    const { page_path, click_count } = item;
    
    const handleItemClick = () => {
      // Click handled by Link component inside
    };
    
    return (
      <ResourceList.Item
        id={page_path}
        accessibilityLabel={`View details for ${page_path}`}
        onClick={handleItemClick}
      >
        <Link href={`/insights/${encodeURIComponent(page_path)}?path=${encodeURIComponent(page_path)}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Text variant="bodyMd" as="p">
              {page_path}
            </Text>
            <Badge tone="attention">
              {`${click_count} dead clicks`}
            </Badge>
          </div>
        </Link>
      </ResourceList.Item>
    );
  };

  return (
    <Page title="Dead Click Miner">
      <Card>
        <ResourceList
          resourceName={{ singular: 'page', plural: 'pages' }}
          items={pages}
          renderItem={renderItem}
          loading={loading}
          emptyState={
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <Text variant="headingMd" as="h3">
                No dead clicks found
              </Text>
              <Text variant="bodyMd" as="p" tone="subdued">
                {error ? error : 'Start tracking dead clicks to see insights here.'}
              </Text>
            </div>
          }
        />
      </Card>
    </Page>
  );
}
