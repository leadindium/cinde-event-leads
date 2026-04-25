# CINDE Lead Capture — Life Sciences Forum 2026

App de captura de leads para el equipo de CINDE durante ferias y eventos del sector Life Sciences. Permite escanear QR de asistentes, capturar datos manualmente, calificar y categorizar leads, enviar documentos PDF y exportar la información para seguimiento post-evento.

Construida sobre el **CINDE Design System** ("soft glass on gradient") con stack moderno alineado al resto de productos del cliente.

---

## Stack

| Capa       | Tech                                                           | Versión                |
| ---------- | -------------------------------------------------------------- | ---------------------- |
| Framework  | Next.js (App Router)                                           | 15.x                   |
| UI         | React                                                          | 19.x                   |
| Estilos    | Tailwind CSS                                                   | 4.x                    |
| Tipografía | Gotham (local font, propietaria)                               | Light/Book/Medium/Bold |
| Iconos     | FontAwesome Pro (regular/solid/light)                          | 7.x                    |
| State      | Zustand + persist middleware                                   | 5.x                    |
| Forms      | react-hook-form + Zod                                          | 7.x / 3.x              |
| QR Scanner | html5-qrcode (dynamic import)                                  | 2.x                    |
| Export     | PapaParse + FileSaver                                          | –                      |
| Tooling    | Prettier (+ tailwind plugin), ESLint flat config, react-doctor | –                      |

> **Stack alineado** con `client-cinde-admin` y `client-cinde-events` para máxima reutilización de componentes y patrones del Design System.

---

## Quick start

### 1. Clonar e instalar

```bash
git clone git@github.com:leadindium/cinde-event-leads.git
cd cinde-event-leads

# El token de FontAwesome Pro vive en .env (gitignored).
# Pídeselo al lead técnico de CINDE y créalo:
cat > .env <<EOF
FONTAWESOME_NPM_AUTH_TOKEN=<tu-token-aquí>
EOF

# Exporta para que npm lo lea (vía .npmrc)
export FONTAWESOME_NPM_AUTH_TOKEN=$(grep -E '^FONTAWESOME_NPM_AUTH_TOKEN=' .env | cut -d= -f2)
npm install
```

### 2. Fuentes Gotham

Las fuentes corporativas viven en `public/fonts/` (commiteadas al repo, mismo patrón que `client-cinde-events`):

```
public/fonts/GothamLight.ttf
public/fonts/GothamBook.ttf
public/fonts/GothamMedium.ttf
public/fonts/GothamBold.ttf
```

Si abrimos el repo a terceros, hay que removerlas y rotarlas a almacenamiento privado.

### 3. Levantar el dev server

```bash
npm run dev
# → http://localhost:5173
```

> **Node**: el proyecto está validado con Node 22.x. `react-doctor` requiere Node ≥22.12.

---

## Scripts

| Comando                | Descripción                                       |
| ---------------------- | ------------------------------------------------- |
| `npm run dev`          | Dev server con HMR (puerto 5173)                  |
| `npm run build`        | Build de producción                               |
| `npm start`            | Servir el build de producción                     |
| `npm run lint`         | ESLint con la config de Next.js + Prettier        |
| `npm run format`       | Formatea todo el repo con Prettier                |
| `npm run format:check` | Verifica formato sin escribir                     |
| `npm run typecheck`    | TypeScript `--noEmit`                             |
| `npm run doctor`       | Audit de performance React (necesita Node ≥22.12) |

---

## Arquitectura

```
.
├─ public/
│  └─ fonts/               → Gotham TTFs (propietarias, commiteadas)
│
├─ src/
│  ├─ app/                 → Next.js App Router
│  │  ├─ layout.tsx        → Providers raíz (Toast, SideModal, Gotham, FA)
│  │  ├─ page.tsx          → Redirect → /lead-capture
│  │  ├─ globals.css       → Tokens del DS + .table + .input-group + .switch
│  │  └─ (main)/
│  │     ├─ layout.tsx     → App shell: gradient + sidebar + main + bottom nav
│  │     └─ lead-capture/
│  │        ├─ page.tsx                       → Dashboard
│  │        ├─ leads/[id]/page.tsx            → Lead detail
│  │        ├─ scan/page.tsx                  → QR scanner (client-only)
│  │        ├─ manual/page.tsx                → Manual entry form
│  │        └─ settings/page.tsx              → Settings (tags, docs, staff)
│  │
│  ├─ components/
│  │  ├─ ds/               → Design System portado de cinde-design-system
│  │  │   ├─ BtnBlue.tsx, BtnWhite.tsx, BtnGray.tsx, BtnIcon.tsx,
│  │  │   ├─ BtnText.tsx, BtnClose.tsx, BtnNew.tsx, BtnSearch.tsx,
│  │  │   ├─ BtnDropdown.tsx, ContainerWhite.tsx, ContentCard.tsx,
│  │  │   ├─ Label.tsx, LabelStatus.tsx, StatusSelect.tsx,
│  │  │   ├─ Pagination.tsx,
│  │  │   ├─ ToastProvider.tsx, SideModalProvider.tsx, SideModal.tsx
│  │  │
│  │  └─ app/              → Componentes específicos de la app
│  │      ├─ Sidebar.tsx, MobileNav.tsx, PageHeader.tsx,
│  │      ├─ StatsCards.tsx, LeadsTable.tsx, LeadDetail.tsx,
│  │      ├─ ManualEntryForm.tsx, SettingsPage.tsx, QRScanner.tsx,
│  │      ├─ Avatar.tsx, StarRating.tsx, StatusSelector.tsx,
│  │      ├─ TagPicker.tsx, DocumentPicker.tsx, PhotoGrid.tsx,
│  │      └─ ExportMenu.tsx
│  │
│  ├─ features/
│  │  └─ leads/            → Modelo de dominio
│  │      ├─ types.ts                        → Lead, Status, Document, Photo, Config
│  │      ├─ store.ts                        → Zustand store con persist
│  │      └─ mock-data.ts                    → 16 leads de ejemplo
│  │
│  └─ lib/                 → Utilidades sin estado
│      ├─ fonts.ts         → Configuración de Gotham (next/font/local)
│      ├─ fa-config.ts     → Setup global de FontAwesome
│      ├─ icons.ts         → Registry centralizado de iconos FA Pro
│      ├─ helpers.ts       → Avatares, tiempo relativo, formato
│      ├─ vcard.ts         → Generación y descarga de .vcf
│      ├─ csv-export.ts    → Exportación a CSV (PapaParse + FileSaver)
│      └─ share.ts         → Web Share API con fallback a clipboard
│
├─ .env                    → Token de FontAwesome (gitignored)
├─ .npmrc                  → Registry de FontAwesome Pro (lee ${FONTAWESOME_NPM_AUTH_TOKEN})
├─ .prettierrc.json        → Prettier + tailwind plugin
├─ eslint.config.mjs       → ESLint flat config (Next + Prettier)
├─ next.config.ts          → Optimización de imports FA Pro
├─ postcss.config.mjs      → Tailwind CSS v4
└─ tsconfig.json           → Strict TS + path alias `@/*`
```

---

## Pantallas

### `/lead-capture` — Dashboard

- 4 KPIs (`<ContentCard>`): total, today, avg rating, docs sent
- Tabla `.table` del DS con búsqueda, filtros (BtnDropdown), orden y paginación
- Layout responsive: tabla desktop / cards mobile
- Action buttons en columna final (eye, paper-plane)

### `/lead-capture/leads/[id]` — Lead detail

- Header card: avatar grande, contacto clickeable (mailto/tel), metadata
- Quick actions horizontales: notes, send doc, photo, share, save contact
- Secciones unificadas en un solo card con dividers: Status (StatusSelect), Rating (StarRating editable), Tags (TagPicker), Notes (auto-save 500ms debounce), Documents (DocumentPicker), Photos (PhotoGrid + lightbox)
- Footer actions: vCard download, Share API, Delete con confirmación

### `/lead-capture/scan` — QR Scanner

- Cliente-only (`dynamic({ ssr: false })`) por dependencia de `window`
- `Html5Qrcode` con cámara trasera
- Detecta JSON o URL query params
- Detección de duplicados por `attendeeId` o `email`
- Haptic feedback al escanear
- "Simulate scan" para desarrollo sin cámara

### `/lead-capture/manual` — Manual entry

- Formulario con `react-hook-form` + Zod schema
- Patrón `.input-group` del DS (label-left, input-right, dividers)
- Star rating + tag toggle inline
- Validación en submit, error state con `.error` class

### `/lead-capture/settings`

- Custom tags: CRUD inline
- Documents library: upload PDF, listar con BtnIcon (view, delete)
- Staff members: lista del equipo en el evento

---

## Design System

El proyecto consume el **[CINDE Design System](https://github.com/leadindium/cinde-design-system)** que define la firma visual transversal a todos los productos del cliente.

### Reglas duras (no romper)

- **Gradiente de fondo siempre visible** (`#C9D6FF → #E9E4F0`, 90deg). Nunca color sólido en el shell.
- **Containers translúcidos**: `bg-white/80`. Nunca `bg-white` opaco en el shell.
- **Azul de marca** `#007AFF` para CTAs (`<BtnBlue>`). `#1D89FF` en hover.
- **Tipografía Gotham** en 3-4 pesos (300/400/500/700). Sin oblique.
- **FontAwesome Pro** — nunca emojis, nunca SVG inline si existe el equivalente FA.
- **Body 14px** en inputs/selects/textareas/tablas.
- **Un CTA primario** por contexto visual.
- **Sólo light mode** — no `dark:` variants.

### Tokens

- Colores y gradient: `src/app/globals.css`
- Spacing/radius/shadow: ver [`cinde-design-system/tokens/spacing-radius-shadow.md`](https://github.com/leadindium/cinde-design-system)
- Patrones: app-shell, page-header, data-list, side-modal

---

## Estado actual y roadmap

Esta v2 está **lista para integrar con backend**. Lo que falta para producción:

- [ ] Backend API (Supabase / serverless de CINDE) con Postgres para leads
- [ ] Autenticación de usuarios (NextAuth) con cuentas del equipo CINDE
- [ ] Multi-tenant: cada empresa expositora tiene su propio set de tags/docs
- [ ] Envío real de documentos por correo (SendGrid / Resend)
- [ ] Persistencia real de fotos (S3 / R2) — actualmente sólo object URLs en memoria
- [ ] PWA con service worker para uso offline en booth con mala señal
- [ ] Sincronización offline-first cuando recupere conexión
- [ ] Tests: Vitest para unit + Playwright para E2E
- [ ] Storybook para los componentes del DS portados aquí
- [ ] Telemetría (Posthog) para entender qué usan más en feria
- [ ] Importación bulk de catálogo de asistentes pre-evento (para validar QR)

---

## Notas de migración (v1 → v2)

La v1 era un prototipo Vite + Tailwind 3 + Lucide para validar y cotizar. La v2 (esta) es la base del proyecto formal. Cambios principales:

- **Vite → Next.js 15 App Router**: SSR, file-based routing, server components donde aplica, mejor tree-shaking de FA con `optimizePackageImports`
- **React Router → Next routing**: rutas anidadas con `(main)` group para shell compartido
- **Lucide → FontAwesome Pro**: alineado al DS de CINDE (regular/solid/light)
- **Inter → Gotham local**: tipografía corporativa via `next/font/local`
- **CSS-in-Tailwind ad-hoc → tokens del DS**: clase `.table`, `.input-group`, `.switch` reusables
- **useState forms → react-hook-form + Zod**: validación robusta y mejor DX
- **State sin persistir → Zustand persist middleware**: sobrevive a refresh
- **Sidebar custom → patrón del DS**: pills, secciones, footer de usuario
- **Cards individuales → ContainerWhite + ContentCard**: estética soft-glass
- **Toast custom → ToastProvider del DS**: variants success/error/info/warning
- **Prettier + plugin de Tailwind** → orden consistente de clases
- **ESLint flat config** + `eslint-config-prettier`

---

## Licencia

Proyecto privado de CINDE. Todos los derechos reservados. Las fuentes Gotham y los iconos FontAwesome Pro son propietarios y están licenciados al cliente — no redistribuir.
