import { neon } from "@neondatabase/serverless"
import { isBadgeId } from "../shared/badges"

type SignupPayload = {
  name?: unknown
  phone?: unknown
  badge?: unknown
  referralCode?: unknown
  website?: unknown
}

type SignupRow = {
  id: string | number
  referral_code: string
}

const jsonHeaders = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
}

function json(body: object, status: number, headers?: HeadersInit) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...jsonHeaders, ...headers },
  })
}

function cleanName(value: unknown) {
  return typeof value === "string"
    ? value.trim().replace(/[\u0000-\u001f\u007f]/g, "").replace(/\s+/g, " ")
    : ""
}

function cleanPhone(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "")
  return digits.length === 10 ? "91" + digits : digits
}

function cleanReferralCode(value: unknown) {
  return typeof value === "string" ? value.trim().toUpperCase() : ""
}

function createReferralCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  const random = crypto.getRandomValues(new Uint8Array(8))
  return "PU" + Array.from(random, (value) => alphabet[value % alphabet.length]).join("")
}

function isReferralCodeCollision(error: unknown) {
  if (!error || typeof error !== "object") return false
  const candidate = error as { code?: unknown; constraint?: unknown; message?: unknown }
  return candidate.code === "23505" && (
    candidate.constraint === "pairup_signups_referral_code_key" ||
    String(candidate.message ?? "").includes("referral_code")
  )
}

export default {
  async fetch(request: Request) {
    if (request.method !== "POST") {
      return json({ ok: false, error: "Method not allowed." }, 405, { Allow: "POST" })
    }

    const contentType = request.headers.get("content-type") ?? ""
    if (!/^application\/json(?:\s*;|$)/i.test(contentType)) {
      return json({ ok: false, error: "Content type must be application/json." }, 415)
    }

    const origin = request.headers.get("origin")
    if (origin && origin !== new URL(request.url).origin) {
      return json({ ok: false, error: "Request origin is not allowed." }, 403)
    }

    const contentLength = Number(request.headers.get("content-length") ?? 0)
    if (Number.isFinite(contentLength) && contentLength > 2048) {
      return json({ ok: false, error: "Request is too large." }, 413)
    }

    let payload: SignupPayload
    try {
      const body = await request.text()
      if (new TextEncoder().encode(body).byteLength > 2048) {
        return json({ ok: false, error: "Request is too large." }, 413)
      }
      payload = JSON.parse(body) as SignupPayload
    } catch {
      return json({ ok: false, error: "Invalid request." }, 400)
    }

    if (payload.website) {
      return json({ ok: true }, 200)
    }

    const name = cleanName(payload.name)
    const phone = cleanPhone(payload.phone)
    const phoneNormalized = normalizePhone(phone)
    const badge = payload.badge
    const enteredReferralCode = cleanReferralCode(payload.referralCode)

    if (name.length < 2 || name.length > 80) {
      return json({ ok: false, error: "Enter a valid name." }, 400)
    }

    if (phoneNormalized.length < 8 || phoneNormalized.length > 15) {
      return json({ ok: false, error: "Enter a valid phone number." }, 400)
    }

    if (!/^[+()\-\s0-9]+$/.test(phone) || !isBadgeId(badge)) {
      return json({ ok: false, error: "Choose a valid founding charm." }, 400)
    }

    if (enteredReferralCode && !/^[A-Z0-9]{6,16}$/.test(enteredReferralCode)) {
      return json({ ok: false, error: "Enter a valid referral code." }, 400)
    }

    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      console.error("Signup persistence is missing DATABASE_URL.")
      return json({ ok: false, error: "Signup is temporarily unavailable." }, 503)
    }

    try {
      const sql = neon(databaseUrl)
      let referrerId: string | number | null = null

      if (enteredReferralCode) {
        const referrerResult = await sql.query(
          "SELECT id, phone_normalized FROM pairup_signups WHERE referral_code = $1 LIMIT 1",
          [enteredReferralCode],
        )
        const referrer = referrerResult[0] as { id: string | number; phone_normalized: string } | undefined
        if (!referrer || referrer.phone_normalized === phoneNormalized) {
          return json({ ok: false, error: "Enter a valid referral code." }, 400)
        }
        referrerId = referrer.id
      }

      let signup: SignupRow | undefined
      for (let attempt = 0; attempt < 4; attempt += 1) {
        try {
          const signupResult = await sql.query(
            [
              "INSERT INTO pairup_signups",
              "(name, phone, phone_normalized, badge, referral_code, referred_by_id, source)",
              "VALUES ($1, $2, $3, $4, $5, $6, 'prelaunch')",
              "ON CONFLICT (phone_normalized) DO UPDATE SET",
              "name = EXCLUDED.name, phone = EXCLUDED.phone, badge = EXCLUDED.badge,",
              "referral_code = COALESCE(pairup_signups.referral_code, EXCLUDED.referral_code),",
              "referred_by_id = COALESCE(pairup_signups.referred_by_id, EXCLUDED.referred_by_id),",
              "updated_at = NOW()",
              "RETURNING id, referral_code",
            ].join(" "),
            [name, phone, phoneNormalized, badge, createReferralCode(), referrerId],
          )
          signup = signupResult[0] as SignupRow | undefined
          break
        } catch (error) {
          if (attempt < 3 && isReferralCodeCollision(error)) continue
          throw error
        }
      }

      if (!signup) throw new Error("Signup did not return a referral code.")

      const countResult = await sql.query(
        "SELECT COUNT(*)::int AS count FROM pairup_signups WHERE referred_by_id = $1",
        [signup.id],
      )
      const referralCount = Number((countResult[0] as { count?: number } | undefined)?.count ?? 0)
      return json({ ok: true, referralCode: signup.referral_code, referralCount }, 200)
    } catch (error) {
      console.error(
        "Signup persistence failed:",
        error instanceof Error ? error.message : "Unknown database error",
      )
      return json({ ok: false, error: "Could not save your profile. Try again." }, 500)
    }
  },
}
