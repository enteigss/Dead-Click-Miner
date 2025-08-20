import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

interface ClickData {
  store_url: string
  page_path: string
  target_selector: string
  click_x: number
  click_y: number
}

export async function POST(request: NextRequest) {
  console.log("Post request received.")
  
  // Add CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  try {
    const body: ClickData = await request.json()
    
    // Basic validation
    if (!body.store_url || !body.page_path || !body.target_selector) {
      return NextResponse.json(
        { error: 'Missing required fields: store_url, page_path, target_selector' },
        { status: 400, headers: corsHeaders }
      )
    }

    if (typeof body.store_url !== 'string' || typeof body.page_path !== 'string' || typeof body.target_selector !== 'string') {
      return NextResponse.json(
        { error: 'store_url, page_path, and target_selector must be strings' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Validate coordinates (optional but must be valid if provided)
    if (body.click_x !== undefined && (typeof body.click_x !== 'number' || body.click_x < 0 || body.click_x > 1)) {
      return NextResponse.json(
        { error: 'click_x must be a number between 0 and 1' },
        { status: 400, headers: corsHeaders }
      )
    }

    if (body.click_y !== undefined && (typeof body.click_y !== 'number' || body.click_y < 0 || body.click_y > 1)) {
      return NextResponse.json(
        { error: 'click_y must be a number between 0 and 1' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Insert click data into database
    const { data, error } = await supabase
      .from('dead_clicks')
      .insert([
        {
          store_url: body.store_url.trim(),
          page_path: body.page_path.trim(),
          target_selector: body.target_selector.trim(),
          click_x: body.click_x,
          click_y: body.click_y,
          created_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save click data' },
        { status: 500, headers: corsHeaders }
      )
    }

    return NextResponse.json(
      { success: true, data },
      { status: 201, headers: corsHeaders }
    )

  } catch (error) {
    console.error('Request error:', error)
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400, headers: corsHeaders }
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}