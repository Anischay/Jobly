import { NextRequest, NextResponse } from 'next/server';

// ML API endpoints
const ML_API_BASE = process.env.ML_API_BASE || 'http://localhost:8000';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, ...data } = body;

    let endpoint = '';
    switch (action) {
      case 'match':
        endpoint = '/match';
        break;
      case 'analyze':
        endpoint = '/analyze';
        break;
      case 'feedback':
        endpoint = '/feedback';
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    const response = await fetch(`${ML_API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`ML API error: ${response.statusText}`);
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('ML API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    const jobId = searchParams.get('jobId');
    const resumeId = searchParams.get('resumeId');
    const limit = searchParams.get('limit');

    let endpoint = '';
    switch (action) {
      case 'stats':
        endpoint = '/feedback/stats';
        break;
      case 'history':
        endpoint = `/feedback/history?${new URLSearchParams({
          ...(jobId && { job_id: jobId }),
          ...(resumeId && { resume_id: resumeId }),
          ...(limit && { limit }),
        })}`;
        break;
      case 'trends':
        endpoint = '/feedback/trends';
        break;
      case 'suggestions':
        endpoint = '/feedback/suggestions';
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    const response = await fetch(`${ML_API_BASE}${endpoint}`);
    if (!response.ok) {
      throw new Error(`ML API error: ${response.statusText}`);
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('ML API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
