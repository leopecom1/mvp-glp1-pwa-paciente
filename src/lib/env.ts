function readPublic(name: string): string {
  return (process.env[name] ?? "").trim();
}

export function getApiBaseUrl(): string {
  return readPublic("NEXT_PUBLIC_API_BASE_URL").replace(/\/$/, "");
}

export function getSupabaseUrl(): string {
  return readPublic("NEXT_PUBLIC_SUPABASE_URL");
}

export function getSupabaseAnonKey(): string {
  return readPublic("NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export function getDefaultClinicName(): string {
  return readPublic("NEXT_PUBLIC_DEFAULT_CLINIC_NAME") || "tu clínica";
}

export function isPlaceholder(value: string): boolean {
  if (!value) return true;
  return (
    value.includes("your-project") ||
    value.includes("your-anon-key") ||
    value.includes("example.com")
  );
}

export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  return Boolean(url && key && !isPlaceholder(url) && !isPlaceholder(key));
}

export function isApiConfigured(): boolean {
  const url = getApiBaseUrl();
  return Boolean(url && !isPlaceholder(url));
}
