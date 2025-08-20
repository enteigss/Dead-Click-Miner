import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: NextRequest) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  try {
    // Query dead_clicks table and group by page_path with count
    const { data, error } = await supabase
      .from('dead_clicks')
      .select('page_path')
      .then(({ data: rawData, error }) => {
        if (error || !rawData) return { data: null, error }
        
        // Group by page_path and count occurrences
        const pageStats = rawData.reduce((acc: { [key: string]: number }, row) => {
          acc[row.page_path] = (acc[row.page_path] || 0) + 1
          return acc
        }, {})
        
        // Convert to array and sort by click_count descending
        const sortedData = Object.entries(pageStats)
          .map(([page_path, click_count]) => ({ page_path, click_count }))
          .sort((a, b) => b.click_count - a.click_count)
        
        return { data: sortedData, error: null }
      })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch page insights' },
        { status: 500, headers: corsHeaders }
      )
    }

    return NextResponse.json(
      { data },
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