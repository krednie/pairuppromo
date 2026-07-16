import { neon } from "@neondatabase/serverless"

type SignupPayload = {
  name?: unknown
  phone?: unknown
  website?: unknown
}

const jsonHeaders = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
}

function json(body: object, status: number) {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders })
}

function cleanName(value: unknown) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : ""
}

function cleanPhone(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "")
  return digits.length === 10 ? "91" + digits : digits
}

export default {
  async fetch(request: Request) {
    if (request.method !== "POST") {
      return json({ ok: false, error: "Method not allowed." }, 405)
    }

    const contentLength = Number(request.headers.get("content-length") ?? 0)
    if (contentLength > 2048) {
      return json({ ok: false, error: "Request is too large." }, 413)
    }

    let payload: SignupPayload
    try {
      payload = await request.json() as SignupPayload
    } catch {
      return json({ ok: false, error: "Invalid request." }, 400)
    }

    if (payload.website) {
      return json({ ok: true }, 200)
    }

    const name = cleanName(payload.name)
    const phone = cleanPhone(payload.phone)
    const phoneNormalized = normalizePhone(phone)

    if (name.length < 2 || name.length > 80) {
      return json({ ok: false, error: "Enter a valid name." }, 400)
    }

    if (phoneNormalized.length < 8 || phoneNormalized.length > 15) {
      return json({ ok: false, error: "Enter a valid phone number." }, 400)
    }

    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      console.error("Signup persistence is missing DATABASE_URL.")
      return json({ ok: false, error: "Signup is temporarily unavailable." }, 503)
    }

    try {
      const sql = neon(databaseUrl)
      await sql.query(
        [
          "INSERT INTO pairup_signups (name, phone, phone_normalized, source)",
          "VALUES ($1, $2, $3, 'prelaunch')",
          "ON CONFLICT (phone_normalized) DO UPDATE",
          "SET name = EXCLUDED.name, phone = EXCLUDED.phone, updated_at = NOW()",
        ].join(" "),
        [name, phone, phoneNormalized],
      )
      return json({ ok: true }, 200)
    } catch (error) {
      console.error(
        "Signup persistence failed:",
        error instanceof Error ? error.message : "Unknown database error",
      )
      return json({ ok: false, error: "Could not save your profile. Try again." }, 500)
    }
  },
}
