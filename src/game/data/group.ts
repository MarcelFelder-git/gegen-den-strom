/**
 * Alles, was die Widerstandsgruppe ausmacht: Name, Leitspruch, Decknamen und Regeln.
 * Decknamen und die Regel, keine Namen aufzuschreiben, waren im Widerstand üblich.
 */
export const GROUP_NAMES = ['Morgenrot', 'Die Unbeugsamen', 'Nordlicht', 'Freiheitsfunke', 'Die Wachsamen']

export const MOTTOS = [
  'Solidarität ist unser Widerstand.',
  'Wir schweigen nicht.',
  'Freiheit ist stärker als Angst.',
  'Keiner wird vergessen.',
  'Die Wahrheit lässt sich nicht verbrennen.',
]

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
