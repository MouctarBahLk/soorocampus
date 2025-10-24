// /app/api/security/guard-signup/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getClientIpFromHeaders, isBlockedDomain } from "@/lib/security";
import { verifyHCaptchaDetailed } from "@/lib/verify-captcha";

export async function POST(req: Request) {
  try {
    const { email, captchaToken } = await req.json();
    const ip = getClientIpFromHeaders(req.headers);

    if (!email) {
      return NextResponse.json({ error: "Email manquant." }, { status: 400 });
    }

    // Captcha (obligatoire si HCAPTCHA_SECRET est défini)
    const check = await verifyHCaptchaDetailed(captchaToken);
    if (!check.success) {
      return NextResponse.json(
        { error: "Captcha invalide.", debug: check.raw }, // ⚠️ debug temporaire
        { status: 400 }
      );
    }

    // Blocage domaines
    if (isBlockedDomain(email)) {
      return NextResponse.json({ error: "Domaine email non autorisé." }, { status: 403 });
    }

    // Soft anti-abus: 5 inscriptions / heure / IP
    const admin = supabaseAdmin();
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const recent = await admin
      .from("auth_ip_log")
      .select("id", { count: "exact", head: true })
      .eq("action", "signup")
      .eq("ip", ip)
      .gte("created_at", oneHourAgo);

    if ((recent.count ?? 0) > 5) {
      return NextResponse.json({ error: "Trop de tentatives depuis cette IP." }, { status: 429 });
    }

    // Log
    await admin.from("auth_ip_log").insert({ email, ip, action: "signup" });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Erreur serveur" }, { status: 500 });
  }
}
