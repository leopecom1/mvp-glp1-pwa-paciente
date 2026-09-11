# mvp-glp1-pwa-paciente

PWA paciente del MVP GLP-1/GIP (Kodevant).

**Design System A — Warm Clinical Cream** (cerrado por Leonardo).  
App real: Next.js App Router + Cursor / Claude Code. Lovable solo como prototipo visual.

- Prototipo (no es el producto): https://demo-ui-glp1-a.lovable.app/paciente
- API: https://github.com/leopecom1/mvp-glp1-api
- Web médico (misma familia visual): https://github.com/leopecom1/mvp-glp1-web-medico

## Qué incluye este scaffold

Flujo vertical 1, copy en español (orden fijo):

1. Entrada con `?token=` (después del magic link / OTP de Supabase).
2. `/aceptar` y `/consentimiento` — «Unirte a [Clínica]» + gate de **Tratamiento de datos de salud**. El id técnico `tratamiento_datos` no se muestra al paciente.
3. `POST /v1/invites/accept` `{ token, consents: [{ consentType: "tratamiento_datos" }] }` (solo `consentType` en el body). El CTA permanece deshabilitado hasta el checkbox.
4. **Ficha mínima (obligatoria)** `/ficha` — nombre, apellido, teléfono?, idioma `es`. Tras el accept, el API crea `patient_profile` con `medicoResponsableMembershipId` + `sedeId` copiados del invite. Esos campos **no** se editan: clínica en solo lectura (nombre humano) o se omiten; nunca UUID / snake_case. `PATCH` solo demografía.
5. `/inicio` — tres pastillas grandes (Dosis / Síntomas GI / Peso), no un scroll de tres formularios. Sin copy de estado de ánimo.
6. Disclaimer Iris + empty states humanos en accept e inicio. Cuerpo ≥16px; muted `#78716C`.

Las rutas `/ficha-minima` y `/paciente/ficha-minima` redirigen a `/ficha` (el prototipo Lovable `/paciente/ficha-minima` era 404; aquí la ficha es must).

**Fuera de alcance:** UI de `compartir_con_equipo` o `fotos_media`, consejos médicos, dosificación.

## Cómo correrlo

```bash
cp .env.example .env.local
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

Walkthrough local (sin API ni Supabase reales):

```
http://localhost:3000/aceptar?token=demo-invite-token-1234&clinica=Clínica%20Demo
```

El token de invite debe tener **al menos 16 caracteres** (contrato del API). Con placeholders de env, la app usa una sesión stub y completa accept/ficha en `sessionStorage` para que las pantallas funcionen.

```bash
npm run build
npm start
```

## Variables de entorno

| Variable | Uso |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Proyecto Supabase (OTP / magic link). Placeholder → sesión stub. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key pública. Nunca `service_role` en el cliente. |
| `NEXT_PUBLIC_API_BASE_URL` | Base del Nest API (p. ej. `http://localhost:4000` si la PWA usa :3000). |
| `NEXT_PUBLIC_DEFAULT_CLINIC_NAME` | Nombre si el deep link no trae `?clinica=`. |

Auth: el API exige `Authorization: Bearer <access_token>` de la sesión Supabase. Este repo **no** implementa OTP; solo consume la sesión (o el stub).

## Cliente API

Alineado a **`mvp-glp1-api` main** (Épica 1 + Épica 2, PR #5 y follow-up):

| Método | Ruta | Estado |
| --- | --- | --- |
| `POST` | `/v1/invites/accept` | `{ token, consents: [{ consentType: "tratamiento_datos" }] }` — sin `consentVersionId` |
| `GET` | `/v1/consent-versions?locale=es&current=1&consentType=tratamiento_datos` | Título/cuerpo; si falla, seed Iris |
| `GET` / `PATCH` | `/v1/me/patient-profile` | GET hidrata nombre/teléfono. PATCH solo `fullName` / `phoneE164`. Identity lock 403. |
| `GET` | `/v1/orgs/:orgId` | Nombre de clínica en solo lectura (tras accept) |
| `GET` | `/v1/orgs/:orgId/onboarding-status` | Cliente listo; no se llama desde la PWA paciente |

Errores de accept:

- **401** → pedir que abran el enlace del correo.
- **Token inválido / vencido** → pedir a la clínica una nueva invitación.
- **Consentimiento faltante** → hay que aceptar `tratamiento_datos`.

Tras un accept real, el cliente llama `refreshSession()` para leer el JWT con `app_metadata`.

## Design System A — Warm Clinical Cream

Tokens en `src/app/globals.css` (`:root`). No inventar otra paleta.

- Canvas crema `#F8F3EB`, superficie `#FFFCFA`, CTA índigo `#4865FF`.
- **Fraunces** solo en H1–H2; **Geist** en UI/cuerpo ≥16px.
- `tabular-nums` en identificadores clínicos.
- Targets táctiles ≥44px, más aire que un dashboard denso.
- Cards `20px` + `--shadow-warm`. Light-first. Mobile-first (`max-width: 430px`).

PWA: `src/app/manifest.ts` + `public/sw.js` (patrón next-pwa / Next App Router: manifest + service worker). El SW se registra en producción.

## Rutas

| Ruta | Pantalla |
| --- | --- |
| `/` | Redirige a accept / ficha / inicio según el estado local |
| `/aceptar` | Unirte + gate `tratamiento_datos` |
| `/consentimiento` | Misma gate (ruta dedicada) |
| `/ficha` | Ficha mínima (también `/ficha-minima`, `/paciente/ficha-minima`) |
| `/inicio` | Home con 3 pastillas |
| `/check-in/dosis` `/sintomas` `/peso` | Stubs de check-in |
