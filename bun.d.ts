declare module 'bun' {
  interface Env {
    SUPABASE_URL: string
    SUPABASE_SERVICE_ROLE_KEY: string
  }
}
