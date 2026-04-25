/**
 * FontAwesome Pro global setup. Importa el CSS y desactiva la
 * inyección automática (Next.js ya hace SSR del style import).
 */
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

config.autoAddCss = false;
