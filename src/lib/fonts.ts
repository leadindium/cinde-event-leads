import localFont from 'next/font/local';

/**
 * Gotham — fuente corporativa de CINDE.
 * Licencia propietaria del cliente. Los .ttf NO se commitean
 * (ver .gitignore: /public/fonts/*.ttf), pero sí están en el repo
 * del cliente y se distribuyen por canal seguro.
 *
 * Pesos cargados (los 4 que existen en el repo del cliente):
 *   - 300 Light
 *   - 400 Book (default body)
 *   - 500 Medium
 *   - 700 Bold
 */
export const gothamFont = localFont({
  src: [
    { path: '../../public/fonts/GothamLight.ttf', weight: '300', style: 'normal' },
    { path: '../../public/fonts/GothamBook.ttf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/GothamMedium.ttf', weight: '500', style: 'normal' },
    { path: '../../public/fonts/GothamBold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-gotham',
  display: 'swap',
  fallback: [
    'system-ui',
    '-apple-system',
    'Segoe UI',
    'Roboto',
    'Helvetica',
    'Arial',
    'sans-serif',
  ],
});
