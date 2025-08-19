import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

interface ClickData {
  store_url: string
  page_path: string
  target_selector: string
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
        { error: 'All fields must be strings' },
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