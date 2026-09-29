/**
 * Alles, was die Widerstandsgruppe ausmacht: Name, Leitspruch, Decknamen und Regeln.
 * Decknamen und die Regel, keine Namen aufzuschreiben, waren im Widerstand üblich.
 */
/**
 * Widerstandsgruppen gaben sich oft harmlose Namen, damit niemand Verdacht schöpfte.
 * Eine Berliner Gruppe, die ab 1938 Verfolgte versteckte, nannte sich „Onkel Emil“.
 */
export const GROUP_NAMES = ['Tante Frieda', 'Kegelverein Gut Holz', 'Die offene Tür']

export const MOTTOS = ['Wir sehen nicht weg.', 'Solidarität ist unser Widerstand.', 'Keiner bleibt allein.']

export const CODENAMES = ['Amsel', 'Fuchs', 'Laterne', 'Kiefer', 'Möwe', 'Spatz', 'Uhrmacher', 'Lerche', 'Dachs', 'Kompass', 'Feder', 'Anker']

export const GROUP_RULES = [
  'Wir helfen denen, die verfolgt werden, auch wenn es uns selbst gut geht.',
  'Jeder hat einen Decknamen. Echte Namen bleiben geheim.',
  'Niemand schreibt Namen oder Adressen auf.',
  'Jeder kennt nur so viel, wie er wissen muss.',
  'Treffpunkte wechseln wir oft.',
  'Wer verhaftet wird, verrät niemanden.',
]

/** Name der Gruppe in Anführungszeichen, wie er überall im Spiel erscheint */
export const quoted = (groupName: string) => `„${groupName}“`
