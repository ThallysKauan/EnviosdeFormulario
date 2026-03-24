import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { z } from 'zod';
import { db } from '@/lib/db';
import { sites, submissions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { sendNotification } from '@/lib/email/resend';

const submissionSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(2).optional(),
  message: z.string().min(1),
}).passthrough(); // Allow extra fields

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get('x-api-key');
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing API Key' }, { status: 401 });
    }

    // 1. Verify Site
    const site = await db.query.sites.findFirst({
      where: eq(sites.apiKey, apiKey),
    });

    if (!site) {
      return NextResponse.json({ error: 'Invalid API Key' }, { status: 403 });
    }

    // 2. Validate Data
    const body = await req.json();
    const validated = submissionSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: 'Invalid Data', details: validated.error.format() }, { status: 400 });
    }

    // 3. CyberSecurity/Validation (Optional FastAPI Proxy logic)
    // Here we could call an external link as requested by the user:
    // const validationResponse = await fetch('YOUR_FASTAPI_LINK', { ... });
    
    // 4. Save to Database
    const [newSubmission] = await db.insert(submissions).values({
      siteId: site.id,
      senderEmail: validated.data.email || null,
      data: body,
      status: 'pending',
    }).returning();

    // 5. Send Email Notification
    try {
      await sendNotification(site.ownerEmail, site.name, body);
      await db.update(submissions)
        .set({ status: 'sent' })
        .where(eq(submissions.id, newSubmission.id));
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      await db.update(submissions)
        .set({ status: 'error', errorMessage: (emailError as Error).message })
        .where(eq(submissions.id, newSubmission.id));
    }

    return NextResponse.json({ success: true, submissionId: newSubmission.id });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// CORS handling
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
    },
  });
}
