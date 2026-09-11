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
5. `/inicio` — tres pastillas grandes (Dosis / Síntomas GI / Peso), no un scroll de tres formularios. Sin copy de estado de ánimo. Widgets de `GET /v1/me/checkin-summary` (última dosis, adherencia 7d, último peso) cuando hay datos.
6. `/check-in/dosis`, `/check-in/sintomas`, `/check-in/peso` — formularios separados (menos de 60s). GI **no** se envía en el POST de dosis.
7. Disclaimer Iris + empty states humanos. Cuerpo ≥16px; muted `#78716C`. Ante GI ≥8: copy de urgencia (contactar clínica; la app no diagnostica).

Las rutas `/ficha-minima` y `/paciente/ficha-minima` redirigen a `/ficha` (el prototipo Lovable `/paciente/ficha-minima` era 404; aquí la ficha es must).

**Fuera de alcance:** UI de `compartir_con_equipo`, `fotos_media`, estado de ánimo, consejos médicos, auto-titración.

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

Alineado a **`mvp-glp1-api`** Épica 1–3 en `main` + contrato Épica 4 de [API PR #8](https://github.com/leopecom1/mvp-glp1-api/pull/8) (merge preferido antes de producción):

| Método | Ruta | Estado |
| --- | --- | --- |
| `POST` | `/v1/invites/accept` | `{ token, consents: [{ consentType: "tratamiento_datos" }] }` — sin `consentVersionId` |
| `GET` | `/v1/consent-versions?locale=es&current=1&consentType=tratamiento_datos` | Título/cuerpo; si falla, seed Iris |
| `GET` / `PATCH` | `/v1/me/patient-profile` | GET hidrata nombre/teléfono. PATCH solo `fullName` / `phoneE164`. Identity lock 403. |
| `GET` | `/v1/orgs/:orgId` | Nombre de clínica en solo lectura (tras accept) |
| `GET` | `/v1/orgs/:orgId/onboarding-status` | Cliente listo; no se llama desde la PWA paciente |
| `GET` | `/v1/me/medication-plan` | Prefill de `dosisMg` + `medicationPlanId` (Épica 3) |
| `POST` / `GET` | `/v1/me/dose-logs` | `{ medicationPlanId, aplicada, dosisMg?, motivoOmision?, notaPaciente?, loggedAt? }`. UI: fecha/hora → `loggedAt`; sitio de inyección opcional → `notaPaciente`. `motivoOmision` si `aplicada=false`. |
| `POST` / `GET` | `/v1/me/symptom-logs` | Escalas GI 0–10: `nauseas`, `vomito`, `diarrea`, `estrenimiento`, `dolorAbdominal`. Sin mood / fotos / saciedad. |
| `POST` / `GET` | `/v1/me/weight-logs` | `{ pesoKg, loggedAt? }`. UI fecha de medición → `loggedAt`. |
| `GET` | `/v1/me/checkin-summary` | Última dosis, adherencia 7d, último peso (home) |

Si `NEXT_PUBLIC_API_BASE_URL` falta o es placeholder, los check-ins usan un almacén local (`sessionStorage`) para que la UI se pueda revisar.

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
| `/inicio` | Home con 3 pastillas + resumen de check-in |
| `/check-in/dosis` | Formulario de dosis (aplicada/omitida) |
| `/check-in/sintomas` | Formulario GI (pastilla aparte) |
| `/check-in/peso` | Formulario de peso |

## Deploy post-merge

Prep only: `vercel.json` is in the repo. **Do not publish a public preview from this PR.** Hosting is host-agnostic — Leonardo chooses **Vercel or Coolify** after merge.

Required env vars (same as [`.env.example`](.env.example)):

| Variable | Notes |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL. Placeholder → stub session. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key. Never `service_role`. |
| `NEXT_PUBLIC_API_BASE_URL` | Nest API origin (no trailing slash). |
| `NEXT_PUBLIC_DEFAULT_CLINIC_NAME` | Optional. Fallback if the invite link has no `?clinica=`. |

### Vercel (after merge + project link)

```bash
npm install
npx vercel link          # once, in this repo
npx vercel env add       # set the four vars above for Production
npx vercel --prod        # only when Leo asks to publish
```

Framework: Next.js (`vercel.json`). Build: `npm run build`. Start is the Vercel Next preset (no custom output dir).

### Coolify

Nixpacks Next defaults are enough: detect Next.js → `npm install` / `npm run build` → `npm start` (`next start`), bind `PORT`.

Or a Dockerfile: Node 20+, `npm ci`, `npm run build`, `CMD ["npm", "start"]`, expose `3000` and honor `PORT`. Set the same env vars in the Coolify application. No public URL from this PR.
