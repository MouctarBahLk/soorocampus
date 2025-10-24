// /lib/security.ts
export const BLOCKED_DOMAINS = new Set<string>([
    "moneysquad.org",
    "tempmail.com",
    "guerrillamail.com",
    "mailinator.com",
    "10minutemail.com",
    "yopmail.com",
    "trashmail.com",
    "fakeinbox.com",
    "getnada.com",
    "sharklasers.com",
  ]);
  
  export function getEmailDomain(email: string) {
    const [, domain = ""] = String(email).toLowerCase().split("@");
    return domain.trim();
  }
  
  export function isBlockedDomain(email: string) {
    return BLOCKED_DOMAINS.has(getEmailDomain(email));
  }
  
  export function getClientIpFromHeaders(headers: Headers) {
    const xff = headers.get("x-forwarded-for");
    if (xff) return xff.split(",")[0].trim();
    const real = headers.get("x-real-ip");
    if (real) return real.trim();
    return "0.0.0.0";
  }
  