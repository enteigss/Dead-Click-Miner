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
    const { searchParams } = new URL(request.url)
    const path = searchParams.get('path')

    if (!path) {
      return NextResponse.json(
        { error: 'Missing required query parameter: path' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Query dead_clicks table filtered by page_path and group by target_selector
    const { data, error } = await supabase
      .from('dead_clicks')
      .select('target_selector')
      .eq('page_path', path)
      .then(({ data: rawData, error }) => {
        if (error || !rawData) return { data: null, error }
        
        // Group by target_selector and count occurrences
        const selectorStats = rawData.reduce((acc: { [key: string]: number }, row) => {
          acc[row.target_selector] = (acc[row.target_selector] || 0) + 1
          return acc
        }, {})
        
        // Convert to array and sort by click_count descending
        const sortedData = Object.entries(selectorStats)
          .map(([target_selector, click_count]) => ({ target_selector, click_count }))
          .sort((a, b) => b.click_count - a.click_count)
        
        return { data: sortedData, error: null }
      })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch selector insights' },
        { status: 500, headers: corsHeaders }
      )
    }

    return NextResponse.json(
      { data, path },
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