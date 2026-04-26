# CINDE Lead Capture — Life Sciences Forum 2026

App de captura de leads para el equipo de CINDE durante ferias y eventos del sector Life Sciences. Permite escanear QR de asistentes, capturar datos manualmente, calificar y categorizar leads, enviar documentos PDF y exportar la información para seguimiento post-evento.

Construida sobre el **CINDE Design System** ("soft glass on gradient") con stack moderno alineado al resto de productos del cliente.

---

## Tabla de contenidos

- [Stack](#stack)
- [Quick start](#quick-start)
- [Scripts](#scripts)
- [Arquitectura](#arquitectura)
- [Pantallas](#pantallas)
- [Design System](#design-system)
- [Convenciones y decisiones técnicas](#convenciones-y-decisiones-técnicas)
- [Cómo extender (recetas comunes)](#cómo-extender-recetas-comunes)
- [Estado actual y roadmap](#estado-actual-y-roadmap)
- [Notas de migración (v1 → v2)](#notas-de-migración-v1--v2)
- [Licencia](#licencia)

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
│  ├─ fonts/                   → Gotham TTFs (propietarias, commiteadas)
│  └─ img/logos/
│     └─ life-sciences.svg     → Logo del LSF 2026 (CINDE)
│
├─ src/
│  ├─ app/                     → Next.js App Router
│  │  ├─ layout.tsx            → Providers raíz (Toast, SideModal, Gotham, FA, StoreHydrator)
│  │  ├─ page.tsx              → Redirect → /lead-capture
│  │  ├─ globals.css           → Tokens del DS + .table + .input-group + .switch
│  │  └─ (main)/
│  │     ├─ layout.tsx         → App shell: gradient + sidebar + main translúcido
│  │     └─ lead-capture/
│  │        ├─ page.tsx                       → Dashboard
│  │        ├─ leads/[id]/page.tsx            → Lead detail
│  │        ├─ scan/page.tsx                  → QR scanner (client-only)
│  │        ├─ manual/page.tsx                → Manual entry form
│  │        └─ settings/page.tsx              → Settings (tags, docs, staff)
│  │
│  ├─ components/
│  │  ├─ ds/                   → Design System portado de cinde-design-system
│  │  │   ├─ BtnBlue, BtnWhite, BtnGray, BtnIcon, BtnText, BtnClose,
│  │  │   ├─ BtnNew, BtnSearch, BtnDropdown,
│  │  │   ├─ ContainerWhite, ContentCard, Label, LabelStatus, StatusSelect,
│  │  │   ├─ Pagination,
│  │  │   └─ ToastProvider, SideModalProvider, SideModal
│  │  │
│  │  └─ app/                  → Componentes específicos de la app
│  │      ├─ Sidebar.tsx, MobileNav.tsx, PageHeader.tsx,
│  │      ├─ StatsCards.tsx, LeadsTable.tsx, ExportMenu.tsx,
│  │      ├─ LeadDetail.tsx, StatusPills.tsx, StatusSelector.tsx,
│  │      ├─ StarRating.tsx, TagPicker.tsx, DocumentPicker.tsx, PhotoGrid.tsx,
│  │      ├─ ManualEntryForm.tsx, SettingsPage.tsx, QRScanner.tsx,
│  │      └─ Avatar.tsx
│  │
│  ├─ features/
│  │  └─ leads/                → Modelo de dominio
│  │      ├─ types.ts          → Lead, Status, Document, Photo, Config, STATUS_LABELS, STATUS_COLORS
│  │      ├─ store.ts          → Zustand store con persist (skipHydration: true)
│  │      ├─ StoreHydrator.tsx → Client component que rehidrata el store en useEffect
│  │      └─ mock-data.ts      → 16 leads de ejemplo
│  │
│  └─ lib/                     → Utilidades sin estado
│      ├─ fonts.ts             → Configuración de Gotham (next/font/local)
│      ├─ fa-config.ts         → Setup global de FontAwesome
│      ├─ icons.ts             → Registry centralizado de iconos FA Pro
│      ├─ helpers.ts           → Avatares, tiempo relativo, formato
│      ├─ countries.ts         → PINNED_COUNTRIES (CR + US) + OTHER_COUNTRIES
│      ├─ vcard.ts             → Generación y descarga de .vcf
│      ├─ csv-export.ts        → Exportación a CSV (PapaParse + FileSaver)
│      └─ share.ts             → Web Share API con fallback a clipboard
│
├─ .env                        → Token de FontAwesome (gitignored)
├─ .npmrc                      → Registry de FontAwesome Pro (lee ${FONTAWESOME_NPM_AUTH_TOKEN})
├─ .prettierrc.json            → Prettier + tailwind plugin
├─ eslint.config.mjs           → ESLint flat config (Next + Prettier)
├─ next.config.ts              → Optimización de imports FA Pro
├─ postcss.config.mjs          → Tailwind CSS v4
└─ tsconfig.json               → Strict TS + path alias `@/*`
```

---

## Pantallas

### `/lead-capture` — Dashboard

- 4 KPIs compactos (`<StatsCards>`): total, today, avg rating, docs sent. Layout horizontal de una fila.
- Tabla `.table` del DS con búsqueda, filtros y orden.
- Toolbar: filtros izquierda (status, sort), búsqueda derecha (input siempre expandido). En mobile, search es full-width.
- Layout responsive: tabla en desktop, lista de cards en mobile.
- Action buttons en columna final (eye, paper-plane).

### `/lead-capture/leads/[id]` — Lead detail

- **Header card**: avatar grande, contacto clickeable (mailto/tel), metadata.
- **`<StatusPills>`** (componente custom): fila de 4 pills con colores semánticos. Vive **fuera** del card de secciones, entre el header y el detalle.
- **Quick actions** (`lg:hidden`): scroll horizontal con notes, send doc, photo, share, save contact. Solo en mobile (en desktop todo está a la vista).
- **Card de secciones unificadas con dividers**: Rating (StarRating editable), Tags (TagPicker), Notes (auto-save 500ms debounce), Documents (DocumentPicker), Photos (PhotoGrid + lightbox).
- **Footer actions**: vCard download, Share API, Delete con confirmación.

### `/lead-capture/scan` — QR Scanner

- Cliente-only (`dynamic({ ssr: false })`) por dependencia de `window`.
- `Html5Qrcode` con cámara trasera.
- Detecta JSON o URL query params.
- Detección de duplicados por `attendeeId` o `email`.
- Haptic feedback al escanear.
- Botón "Simulate scan" para desarrollo sin cámara.

### `/lead-capture/manual` — Manual entry

- Formulario con `react-hook-form` + Zod schema.
- Patrón `.input-group` del DS: en desktop label-left + input-right con divider entre filas; en mobile colapsa a 1 columna full-width.
- **Country como `<select>` con `<optgroup>`**: "Most common" (CR + US) arriba, "All countries" alfabético abajo.
- Star rating + tag toggle inline.
- Validación en submit, error state con clase `.error`.

### `/lead-capture/settings`

- **Custom tags**: CRUD inline (input + Add, pills con remove).
- **Documents library**: upload PDF, listar con BtnIcon (view, delete).
- **Staff members**: lista del equipo en el evento.
- Tres secciones en cards opacos separados (cada una con su propio título grande).

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

## Convenciones y decisiones técnicas

### Anidamiento de containers (importante)

El **`<main>` del shell ya es el container blanco translúcido del DS** (`bg-white/80 rounded-lg shadow-md`). Las páginas hijas **no** se envuelven en otro `<ContainerWhite>` — viven directamente sobre el shell. Sólo se permiten cards opacos internos cuando son **objetos atómicos con propósito visual claro** (ej: header card del lead detail, card de secciones, ContentCards). Si te encuentras anidando 3 niveles de blanco, aplana.

### `StatsCards` no usa `ContentCard`

`<ContentCard>` del DS está pensado para **KPIs hero del dashboard** (revenue, tickets sold) — son grandes, con icono pastel circular, valor en `text-2xl`. Para nuestra fila de stats en `/lead-capture`, esos cards son demasiado prominentes (estos KPIs no son la información primaria). Por eso `StatsCards.tsx` define su propio `<Stat>` compacto: una fila horizontal con icono pequeño + valor + label. Si el equipo de producto pide darles más peso, se puede volver a `<ContentCard>`.

### Status como pills custom (no `StatusSelect`)

`<StatusSelect>` del DS es un `<select>` nativo con dot de color — funciona pero es discreto. Para el lead detail decidimos algo más prominente y visual: `StatusPills.tsx`, una fila de 4 pills semánticos (azul/amarillo/verde/gris) con check en el activo. Es un componente local porque es muy específico al dominio de leads (4 estados fijos). Si surge otro contexto con misma necesidad, vale la pena promover el patrón al DS.

### Hydration del store de Zustand

`useLeadStore` usa `persist` middleware con `skipHydration: true` — no rehidrata automáticamente en el client. La rehidratación la dispara `<StoreHydrator />` (client component) montado en `app/layout.tsx` dentro de un `useEffect`.

**Por qué**: sin esto, el server renderiza con `mockLeads` (initial state) y el cliente, después de hidratar desde `localStorage`, puede tener leads diferentes (eliminados/agregados/editados). Ese mismatch causa errores de hidratación en cualquier componente que dependa de los leads (Avatar, LeadsTable, StatsCards, etc.). Con `skipHydration` el render inicial server + client primer paint coinciden, y la rehidratación ocurre después del mount.

**Si agregas un store nuevo persistido**, sigue el mismo patrón: `skipHydration: true` + un componente hydrator en el layout.

### Forms `.input-group` responsive

La clase `.input-group` (definida en `globals.css`) en desktop es row con label-left + input-right (ancho máximo 320px y 512px respectivamente). En mobile colapsa a `flex-col` con todo full-width — más cómodo en pantallas angostas. Breakpoint: `sm` (640px).

Los inputs dentro de `.input-group` con clase `.input` tienen `bg-gray-50` para diferenciarse del card blanco que los envuelve, y un focus ring blue para feedback claro.

### Country select con `<optgroup>`

Pinned countries (Costa Rica, United States) van en un `<optgroup label="Most common">`, el resto en `<optgroup label="All countries">` ordenados alfabéticamente. Antes intentamos un separador visual con dashes (`──────────`) como `<option disabled>`, pero al tener `value=""` colisionaba con el placeholder default y el browser mostraba el separador como valor seleccionado. **Lección**: para grupos en `<select>`, usa `<optgroup>` siempre — es semántico, accesible y evita conflictos de keys.

### FontAwesome Pro: imports centralizados

Toda la app importa íconos desde `@/lib/icons`. Eso permite:

- Tree-shaking efectivo (con `optimizePackageImports` en `next.config.ts`).
- Un único punto para cambiar Pro Regular ↔ Pro Solid ↔ Pro Light por contexto.
- Si el cliente cambia de licencia o quiere swap a otro pack, se cambia en un solo archivo.

### Stack server vs client

- **Pages** (`app/(main)/.../page.tsx`): server components delgados que sólo importan el componente client correspondiente. Razón: páginas server permiten metadata estática y SSR del layout, pero la interactividad vive en client components (necesarios para Zustand, RHF, etc.).
- **Componentes en `components/app/`**: client components (`'use client'`) porque casi todos consumen el store o tienen estado.
- **Componentes en `components/ds/`**: la mayoría son server-renderable, sólo los que tienen estado interno (BtnSearch, BtnDropdown, ToastProvider, SideModalProvider, SideModal, StatusSelect) llevan `'use client'`.

### Estructura de archivos

- `features/leads/`: domain logic (types, store, mock-data) — todo lo relacionado con la entidad Lead.
- `lib/`: utilities pure (sin estado React, sin lógica de negocio).
- `components/ds/`: design system portado, componentes reutilizables agnósticos al dominio.
- `components/app/`: componentes específicos de esta app, conocen el dominio leads.

Si vas a agregar otra feature (ej: events, analytics), crea `features/<feature>/` con su propio `types.ts` + `store.ts` + `mock-data.ts`, y un namespace de componentes en `components/app/<feature>/` si crece.

---

## Cómo extender (recetas comunes)

### Agregar un campo nuevo al lead

1. Agrégalo a `Lead` en `src/features/leads/types.ts`.
2. Si el campo aparece en el form manual: agrégalo a `schema` (Zod) en `ManualEntryForm.tsx` + un `<Field>` con `register('campo')`.
3. Si necesita estar en el QR JSON, parsealo en `processQRData` de `QRScanner.tsx`.
4. Si va en la tabla del dashboard: agrega `<th>` y `<td>` en `LeadsTable.tsx`.
5. Si va en la vista detalle: agrega un `<Section>` en `LeadDetail.tsx`.
6. Si va en el CSV export: agrega la columna en `csv-export.ts`.
7. Si va en el vCard: agrega el campo en `vcard.ts` (sólo si tiene un campo equivalente en el formato vCard 3.0).
8. Actualiza `mock-data.ts` con el nuevo campo en los 16 leads de ejemplo.

### Agregar una pantalla nueva

1. Crea `src/app/(main)/lead-capture/<ruta>/page.tsx` (server component delgado).
2. Crea `src/components/app/<Componente>.tsx` con la lógica (client component).
3. Si va en el sidebar: agrega un item a `SECTIONS` en `Sidebar.tsx`.
4. Si va en el bottom nav mobile: agrega un item a `ITEMS` en `MobileNav.tsx`.

### Agregar un color de status nuevo

1. Agrégalo al union `LeadStatus` en `types.ts`.
2. Agrega su label en `STATUS_LABELS` y su color en `STATUS_COLORS` (debe ser uno de los soportados por `<Label>`).
3. En `StatusPills.tsx` agrega su entry a `STYLES` y `ORDER`.
4. En `StatusSelector.tsx` (si se sigue usando) agrega la opción.

### Agregar un tag custom (en runtime)

Lo hacen los usuarios desde `/lead-capture/settings` → Custom tags. Internamente: `useLeadStore.addCustomTag(tag)`.

### Cambiar la paleta de avatares

Edita `AVATAR_COLORS` en `src/lib/helpers.ts`. La función `getAvatarColor` hashea el nombre y mapea a un color, así que la asignación es estable por nombre.

### Migrar a FontAwesome Pro v8 (cuando salga)

1. `npm uninstall @fortawesome/pro-regular-svg-icons @fortawesome/pro-solid-svg-icons @fortawesome/pro-light-svg-icons @fortawesome/fontawesome-svg-core @fortawesome/react-fontawesome`
2. `FONTAWESOME_NPM_AUTH_TOKEN=xxx npm install @fortawesome/pro-regular-svg-icons@^8 ...` (todos los packs en sync).
3. Verifica que `src/lib/icons.ts` siga compilando (algunos íconos a veces se renombran entre majors).

### Conectar a backend real

El store `useLeadStore` actualmente vive en localStorage. Cuando llegue el backend:

1. Crea `src/lib/api/` con clients (fetch wrappers) por entidad.
2. Reemplaza la implementación de los métodos del store por calls al API. Mantén la firma para no tocar componentes.
3. Cambia el `persist` middleware por una capa de cache (ej: TanStack Query) o quita el persist y haz refetch al mount.
4. Actualiza `StoreHydrator` para hacer el initial fetch en lugar de rehidratar localStorage.

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
- [ ] Internacionalización (es-CR / en) con `next-intl` — actualmente UI en inglés con copy hardcoded
- [ ] Accesibilidad: pasada con axe + verificación de contraste en pills semánticos

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
- **Sidebar custom → patrón del DS**: pills, secciones, footer de usuario, ahora con logo real del LSF
- **Cards individuales → shell único + cards atómicos con propósito**: sin anidamiento redundante
- **StatusSelect → StatusPills**: prominente, custom, semántico por color
- **Toast custom → ToastProvider del DS**: variants success/error/info/warning
- **Prettier + plugin de Tailwind** → orden consistente de clases
- **ESLint flat config** + `eslint-config-prettier`

---

## Licencia

Proyecto privado de CINDE. Todos los derechos reservados. Las fuentes Gotham, los iconos FontAwesome Pro y el logo del Life Sciences Forum son propietarios y están licenciados al cliente — no redistribuir.
