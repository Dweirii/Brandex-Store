import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, type, details } = body as {
      name?: string
      email?: string
      type?: string
      details?: string
    }

    if (!name || !email || !type) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 })
    }

    // Forward to Admin, which owns Resend credentials
    const adminBase =
      process.env.ADMIN_API_URL ||
      (process.env.NEXT_PUBLIC_DOWNLOAD_API_URL ?? "http://localhost:3001")

    const adminRes = await fetch(`${adminBase}/api/privacy-request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, type, details }),
    })

    if (!adminRes.ok) {
      const err = await adminRes.json().catch(() => ({}))
      return NextResponse.json(
        { error: (err as { error?: string }).error || "Failed to submit request." },
        { status: adminRes.status }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[privacy-request] proxy error:", error)
    return NextResponse.json({ error: "Internal server error." }, { status: 500 })
  }
}
