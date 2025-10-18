/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_KEY: string
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_ENVIRONMENT: string
  readonly VITE_DIADATA_API_URL: string
  readonly VITE_VPN_MAINTENANCE_MODE: string
  readonly VITE_ENABLE_2FA: string
  readonly VITE_ENABLE_GOOGLE_AUTH: string
  readonly VITE_DEV_MODE: string
  readonly VITE_ENABLE_DEBUG_LOGS: string
  readonly VITE_SESSION_TIMEOUT: string
  readonly VITE_REFRESH_TOKEN_INTERVAL: string
  readonly VITE_WS_URL: string
  readonly VITE_ANALYTICS_ENABLED: string
  readonly VITE_ERROR_TRACKING_ENABLED: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 