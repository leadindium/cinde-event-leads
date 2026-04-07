# CINDE Lead Capture — Life Sciences Forum 2026

Prototype de captura de leads para el equipo de CINDE en ferias y eventos del sector Life Sciences. Permite escanear QR de asistentes, capturar datos de contacto, calificar leads, enviar documentos y exportar la informacion para seguimiento post-evento.

## Tech Stack

| Capa | Tecnologia |
|------|-----------|
| Framework | React 19 + TypeScript |
| Build | Vite 5 |
| Estilos | Tailwind CSS 4 |
| Estado | Zustand |
| Routing | React Router 7 |
| Iconos | Lucide React |
| QR Scanner | html5-qrcode |
| Export CSV | PapaParse + FileSaver |

## Quick Start

```bash
# Requiere Node.js >= 18
npm install
npm run dev
```

La app abre en `http://localhost:5173`. Incluye 16 leads de ejemplo para probar todas las funcionalidades.

## Scripts

| Comando | Descripcion |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Build de produccion (TypeScript check + Vite) |
| `npm run preview` | Preview del build de produccion |
| `npm run lint` | Linting con ESLint |

## Estructura del Proyecto

```
src/
  App.tsx                          # Layout, routing, navegacion
  main.tsx                         # Entry point
  index.css                        # Tailwind + brand tokens de CINDE

  features/lead-capture/
    types/
      index.ts                     # Lead, CompanyConfig, StaffMember, etc.

    store/
      useLeadStore.ts              # Estado global con Zustand (leads + config)

    components/
      LeadDashboard.tsx            # Vista principal: stats + tabla de leads
      StatsCards.tsx                # Tarjetas de metricas (total, hoy, rating, docs)
      LeadsTable.tsx               # Tabla/lista con busqueda, filtros y orden
      LeadDetail.tsx               # Detalle de lead con acciones rapidas
      QRScanner.tsx                # Escaner QR con camara + boton de simulacion
      ManualEntryForm.tsx          # Formulario de ingreso manual
      SettingsPage.tsx             # Config: tags, documentos, staff
      StatusSelector.tsx           # Selector de estado (New/Contacted/Qualified/Not Interested)
      StarRating.tsx               # Rating de 1-5 estrellas
      TagPicker.tsx                # Selector de tags con add/remove
      DocumentPicker.tsx           # Envio de documentos al lead
      PhotoGrid.tsx                # Grid de fotos con captura y lightbox
      FloatingActions.tsx          # FABs: Scan QR + Manual Entry
      ExportMenu.tsx               # Menu de exportacion CSV
      Toast.tsx                    # Sistema de notificaciones toast

    utils/
      mock-data.ts                 # 16 leads de ejemplo + config de empresa
      helpers.ts                   # Avatares, colores, tiempo relativo, constantes
      csv-export.ts                # Exportacion a CSV via PapaParse
      vcard.ts                     # Generacion y descarga de vCards (.vcf)
      share.ts                     # Web Share API con fallback a clipboard
```

## Pantallas

### Dashboard (`/lead-capture`)
Vista principal con 4 tarjetas de metricas y tabla de leads. Incluye busqueda por nombre/empresa/email, filtros por estado, ordenamiento por fecha/rating/nombre. Layout responsivo: tabla en desktop, cards en mobile.

### Lead Detail (`/lead-capture/leads/:id`)
Detalle completo del lead con:
- Informacion de contacto con links directos a email/telefono
- Acciones rapidas: Add Notes, Send Doc, Add Photo, Share, Save Contact
- Status, Rating, Tags, Notes, Documents y Photos en un contenedor unificado
- Notas con auto-guardado (debounce 500ms)
- Exportar como vCard o compartir via Web Share API
- Eliminar con confirmacion

### QR Scanner (`/lead-capture/scan`)
Scanner de codigos QR con la camara del dispositivo. Soporta datos en formato JSON o URL query params. Incluye:
- Deteccion de duplicados por attendeeId o email
- Feedback haptico al escanear
- Boton "Simulate Scan" para desarrollo sin camara

### Manual Entry (`/lead-capture/manual`)
Formulario completo con validacion para agregar leads manualmente. Campos: nombre, email, telefono, pais, empresa, cargo, notas, rating y tags.

### Settings (`/lead-capture/settings`)
Configuracion de la empresa:
- **Custom Tags**: CRUD de etiquetas personalizadas
- **Documents Library**: Subir PDFs y gestionar documentos disponibles para envio
- **Staff Members**: Lista del equipo en el evento

## Modelo de Datos

```typescript
interface Lead {
  id: string;
  attendeeId: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  country: string;
  notes: string;
  rating: number;          // 0-5
  tags: string[];
  status: LeadStatus;      // 'new' | 'contacted' | 'qualified' | 'not_interested'
  photos: Photo[];
  documentsSent: Document[];
  capturedAt: string;      // ISO timestamp
  capturedBy: string;
  updatedAt: string;
}
```

## Brand Tokens

Los colores de CINDE estan definidos como CSS custom properties via Tailwind:

| Token | Hex | Uso |
|-------|-----|-----|
| `primary` | `#003DA5` | Acciones principales, links, sidebar activo |
| `secondary` | `#0095C8` | Links de contacto, status "Contacted" |
| `accent` | `#CE0F69` | Iconos de documentos, highlights |
| `warm` | `#EA7600` | Rating stars, badges de alerta |

Tipografia: **Inter** (Google Fonts), pesos 300-700.

## Responsividad

- **Desktop** (>1024px): Sidebar fijo + contenido principal con tabla completa
- **Mobile** (<1024px): Bottom navigation + card list en vez de tabla, quick actions con scroll horizontal

## Estado Actual

Este es un **prototipo funcional** con datos mock. Para produccion se necesitaria:

- [ ] Backend API (Supabase, Firebase, o custom)
- [ ] Autenticacion de usuarios
- [ ] Persistencia real de datos
- [ ] Envio real de documentos por email
- [ ] Sincronizacion offline
- [ ] PWA con service worker para uso sin conexion
- [ ] Tests unitarios y de integracion

## Licencia

Proyecto privado de CINDE. Todos los derechos reservados.
