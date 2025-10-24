// /app/api/security/guard-login/route.ts
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
        { error: "Captcha invalide.", debug: check.raw }, // debug temporaire
        { status: 400 }
      );
    }

    if (isBlockedDomain(email)) {
      return NextResponse.json(
        { error: "Connexion interdite pour ce domaine." },
        { status: 403 }
      );
    }

    const admin = supabaseAdmin();
    await admin.from("auth_ip_log").insert({ email, ip, action: "login" });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Erreur serveur" },
      { status: 500 }
    );
  }
}
