import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

interface ElementStat {
  selector: string;
  click_count: number;
}

interface ClickPosition {
  x: number;
  y: number;
  selector: string;
}

interface PreviewResponse {
  element_stats: ElementStat[];
  click_positions: ClickPosition[];
  page_path: string;
}

export async function GET(request: NextRequest) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  try {
    const { searchParams } = new URL(request.url)
    const path = searchParams.get('path')

    if (!path) {
      return NextResponse.json(
        { error: 'Missing required query parameter: path' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Get all dead clicks for this page
    const { data: rawClicks, error } = await supabase
      .from('dead_clicks')
      .select('target_selector, click_x, click_y')
      .eq('page_path', path)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch preview data' },
        { status: 500, headers: corsHeaders }
      )
    }

    if (!rawClicks) {
      return NextResponse.json(
        { error: 'No data found' },
        { status: 404, headers: corsHeaders }
      )
    }

    // Process data for element stats (group by selector and count)
    const selectorCounts: { [key: string]: number } = {}
    const clickPositions: ClickPosition[] = []

    rawClicks.forEach(click => {
      // Count clicks per selector
      selectorCounts[click.target_selector] = (selectorCounts[click.target_selector] || 0) + 1

      // Collect click positions (only if coordinates exist)
      if (click.click_x !== null && click.click_y !== null) {
        clickPositions.push({
          x: click.click_x,
          y: click.click_y,
          selector: click.target_selector
        })
      }
    })

    // Convert selector counts to array format
    const elementStats: ElementStat[] = Object.entries(selectorCounts)
      .map(([selector, count]) => ({
        selector,
        click_count: count
      }))
      .sort((a, b) => b.click_count - a.click_count) // Sort by count descending

    const response: PreviewResponse = {
      element_stats: elementStats,
      click_positions: clickPositions,
      page_path: path
    }

    return NextResponse.json(
      response,
      { status: 200, headers: corsHeaders }
    )

  } catch (error) {
    console.error('Request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}