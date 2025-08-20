'use client';

import { useState, useEffect } from 'react';
import { Page, Card, ResourceList, Text, Badge, Button } from '@shopify/polaris';
import { ArrowLeftIcon } from '@shopify/polaris-icons';
import { useRouter, useSearchParams } from 'next/navigation';

interface SelectorInsight {
  target_selector: string;
  click_count: number;
}

export default function InsightsPage() {
  const [selectors, setSelectors] = useState<SelectorInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagePath, setPagePath] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const STORE_URL = process.env.NEXT_PUBLIC_STORE_URL || 'https://your-store.myshopify.com'

  useEffect(() => {
    const path = searchParams.get('path');
    if (path) {
      setPagePath(path);
      fetchSelectorInsights(path);
    } else {
      setError('No path provided');
      setLoading(false);
    }
  }, [searchParams]);

  const fetchSelectorInsights = async (path: string) => {
    try {
      const response = await fetch(`/api/insights/selectors?path=${encodeURIComponent(path)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch selector insights');
      }
      const result = await response.json();
      setSelectors(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = (item: SelectorInsight) => {
    const { target_selector, click_count } = item;

    const handleTestSelector = () => {
      const testUrl = `${STORE_URL}${pagePath}?highlight_selector=${encodeURIComponent(target_selector)}`;
      window.open(testUrl, '_blank');
    }
    
    return (
      <ResourceList.Item
        id={target_selector}
        accessibilityLabel={`${target_selector} with ${click_count} clicks`}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>
            <Text variant="bodyMd" as="p" fontWeight="medium">
              {target_selector}
            </Text>
            <Text variant="bodySm" as="p" tone="subdued">
              CSS Selector
            </Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Badge tone="critical">
              {click_count} {click_count === 1 ? 'click' : 'clicks'}
            </Badge>
            <Button size="micro" onClick={handleTestSelector}>
              Test Selector
            </Button>
          </div>
        </div>
      </ResourceList.Item>
    );
  };

  const handleBackClick = () => {
    router.push('/');
  };

  const handlePreviewClick = () => {
    const previewUrl = `${STORE_URL}${pagePath}?dead_click_preview=true`;
    window.open(previewUrl, '_blank');
  };

  return (
    <Page
      title={`Dead Clicks: ${pagePath}`}
      backAction={{
        content: 'Back to overview',
        onAction: handleBackClick,
      }}
      secondaryActions={[
        {
          content: 'Preview Mode',
          onAction: handlePreviewClick,
        },
      ]}
    >
      <Card>
        <ResourceList
          resourceName={{ singular: 'selector', plural: 'selectors' }}
          items={selectors}
          renderItem={renderItem}
          loading={loading}
          emptyState={
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <Text variant="headingMd" as="h3">
                No dead clicks found for this page
              </Text>
              <Text variant="bodyMd" as="p" tone="subdued">
                {error ? error : `No dead clicks have been recorded for ${pagePath}.`}
              </Text>
            </div>
          }
        />
      </Card>
    </Page>
  );
}