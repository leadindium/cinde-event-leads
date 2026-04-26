/**
 * Lista de países (ISO-3166 short names en inglés).
 *
 * `PINNED_COUNTRIES` van arriba del select porque son los dos casos más
 * comunes en eventos de CINDE (CR es local, US el principal mercado destino).
 * `OTHER_COUNTRIES` va en orden alfabético, excluyendo los pinned.
 *
 * El componente que las renderiza usa <optgroup> para separarlas
 * visualmente (más accesible que un separador con dashes y evita
 * conflictos de "value vacío" en el <select>).
 */
export const PINNED_COUNTRIES = ['Costa Rica', 'United States'] as const;

export const OTHER_COUNTRIES = [
  'Argentina',
  'Australia',
  'Austria',
  'Belgium',
  'Bolivia',
  'Brazil',
  'Canada',
  'Chile',
  'China',
  'Colombia',
  'Cuba',
  'Czech Republic',
  'Denmark',
  'Dominican Republic',
  'Ecuador',
  'El Salvador',
  'Finland',
  'France',
  'Germany',
  'Greece',
  'Guatemala',
  'Honduras',
  'Hungary',
  'India',
  'Indonesia',
  'Ireland',
  'Israel',
  'Italy',
  'Japan',
  'Mexico',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Norway',
  'Panama',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Puerto Rico',
  'Singapore',
  'South Africa',
  'South Korea',
  'Spain',
  'Sweden',
  'Switzerland',
  'Taiwan',
  'Thailand',
  'Türkiye',
  'United Arab Emirates',
  'United Kingdom',
  'Uruguay',
  'Venezuela',
  'Vietnam',
] as const;
