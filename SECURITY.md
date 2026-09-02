# Security Policy

## Reporting a vulnerability

If you discover a security vulnerability in Mai, please report it **privately**:

- Email: **stupakantonsergeevich@yandex.kz**

Please **do not** open a public GitHub issue for security reports. Include a description
of the issue, steps to reproduce, and the affected version if known. You will get a
response as soon as possible.

## Security model

- Mai is a **local desktop application** (Tauri v2). All user data (courses, resources,
  progress) lives in a local SQLite database inside the OS app-data directory. Nothing
  is sent to remote servers by the app itself.
- The backend runs a local **HTTP server (Axum)** for external integrations (e.g. AI
  agents). It binds to `127.0.0.1` on the first free port starting at `3000`, has
  **no authentication**, and exposes an OpenAPI/Swagger UI at `/docs`. It is designed
  for use on the local machine only — do not expose it to untrusted networks.
- The webview applies a restrictive **Content Security Policy** in release builds
  (inline scripts are blocked; external connections are limited to the Tauri IPC).
