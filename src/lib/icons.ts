/**
 * Icon registry centralizado. Toda la app importa desde aquí.
 *
 * Convención del CINDE Design System:
 *   - Pro Regular  → body / nav / forms / tablas
 *   - Pro Solid    → énfasis (rating fill, status dots, dismiss, success/error)
 *   - Pro Light    → solo pagination chevrons (más sutil)
 */

// ── Pro Regular (default body) ────────────────────────
export {
  faQrcode,
  faPenToSquare,
  faPaperPlane,
  faEye,
  faImage,
  faCamera,
  faShareNodes,
  faAddressCard,
  faTrashCan,
  faChevronDown,
  faChevronUp,
  faMagnifyingGlass,
  faGear,
  faPlus,
  faFilter,
  faArrowUp,
  faArrowDown,
  faCloudArrowDown,
  faFileLines,
  faNoteSticky,
  faEnvelope,
  faPhone,
  faLocationDot,
  faClock,
  faUser,
  faUsers,
  faUserPlus,
  faUserGroup,
  faTag,
  faBars,
  faRightFromBracket,
  faBuilding,
  faFloppyDisk,
  faAngleLeft,
  faBolt,
} from '@fortawesome/pro-regular-svg-icons';

// ── Pro Solid (énfasis / estados) ─────────────────────
export {
  faStar,
  faXmark,
  faCheck,
  faCircleCheck,
  faCircleXmark,
  faExclamation,
} from '@fortawesome/pro-solid-svg-icons';

// ── Pro Light (pagination, chevrons sutiles) ──────────
export { faChevronLeft, faChevronRight } from '@fortawesome/pro-light-svg-icons';
