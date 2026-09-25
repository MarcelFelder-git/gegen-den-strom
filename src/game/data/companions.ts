import type { AvatarConfig, Stats } from '../types'

export interface CompanionTemplate {
  name: string
  beruf: string
  bio: string
  stats: Stats
  avatar: AvatarConfig
}

export const COMPANIONS: CompanionTemplate[] = [
  {
    name: 'Hans Wendt',
    beruf: 'Schriftsetzer',
    bio: 'Setzt seit zwanzig Jahren Buchstaben für eine Arbeiterzeitung. Er hat eine ruhige Hand und kennt jede Druckmaschine.',
    stats: { heimlichkeit: 2, propaganda: 3, empathie: 2, staerke: 3, bildung: 4 },
    avatar: { gender: 'm', face: 'kantig', headwear: 'schiebermuetze', hairTone: 'grau', glasses: true, clothing: 'arbeiterjacke' },
  },
  {
    name: 'Lotte Krause',
    beruf: 'Näherin',
    bio: 'Näht in einer Heimwerkstatt in Kreuzberg. Sie ist klein und flink und fällt niemandem auf.',
    stats: { heimlichkeit: 4, propaganda: 2, empathie: 3, staerke: 2, bildung: 2 },
    avatar: { gender: 'w', face: 'rund', headwear: 'zoepfe', hairTone: 'dunkel', glasses: false, clothing: 'kleid' },
  },
  {
    name: 'Erich Vogt',
    beruf: 'Student',
    bio: 'Studiert an der Friedrich-Wilhelms-Universität. Er schreibt gute Reden und redet manchmal zu laut.',
    stats: { heimlichkeit: 2, propaganda: 4, empathie: 2, staerke: 2, bildung: 4 },
    avatar: { gender: 'm', face: 'schmal', headwear: 'kurz', hairTone: 'hell', glasses: true, clothing: 'weste' },
  },
  {
    name: 'Trude Kowalski',
    beruf: 'Verkäuferin',
    bio: 'Verkauft Strümpfe im Warenhaus am Hermannplatz. Sie kennt halb Neukölln beim Vornamen.',
    stats: { heimlichkeit: 3, propaganda: 3, empathie: 4, staerke: 2, bildung: 2 },
    avatar: { gender: 'w', face: 'oval', headwear: 'welle', hairTone: 'hell', glasses: false, clothing: 'trenchcoat' },
  },
  {
    name: 'Heinrich Schulz',
    beruf: 'Straßenbahnschaffner',
    bio: 'Fährt jeden Tag quer durch die Stadt. Er sieht alles und hört noch mehr.',
    stats: { heimlichkeit: 3, propaganda: 2, empathie: 3, staerke: 4, bildung: 1 },
    avatar: { gender: 'm', face: 'rund', headwear: 'schiebermuetze', hairTone: 'dunkel', glasses: false, clothing: 'trenchcoat' },
  },
  {
    name: 'Ruth Levin',
    beruf: 'Studentin der Medizin',
    bio: 'Will Kinderärztin werden. Als Jüdin weiß sie genau, was ihr unter dieser Regierung droht.',
    stats: { heimlichkeit: 3, propaganda: 2, empathie: 4, staerke: 1, bildung: 4 },
    avatar: { gender: 'w', face: 'schmal', headwear: 'kurz', hairTone: 'dunkel', glasses: true, clothing: 'weste' },
  },
  {
    name: 'Johannes Hartmann',
    beruf: 'Hilfsprediger',
    bio: 'Junger Vikar einer evangelischen Gemeinde. Er predigt Nächstenliebe und meint es ernst.',
    stats: { heimlichkeit: 2, propaganda: 3, empathie: 4, staerke: 2, bildung: 3 },
    avatar: { gender: 'm', face: 'oval', headwear: 'fedora', hairTone: 'hell', glasses: false, clothing: 'trenchcoat' },
  },
  {
    name: 'Anni Neumann',
    beruf: 'Stenotypistin',
    bio: 'Tippt Briefe in einer Anwaltskanzlei. Sie schreibt schneller, als die meisten reden.',
    stats: { heimlichkeit: 4, propaganda: 2, empathie: 2, staerke: 2, bildung: 4 },
    avatar: { gender: 'w', face: 'oval', headwear: 'glocke', hairTone: 'dunkel', glasses: false, clothing: 'kleid' },
  },
  {
    name: 'August Brenner',
    beruf: 'Kohlenträger',
    bio: 'Trägt jeden Tag Zentnersäcke in die Hinterhäuser. Er redet wenig, aber auf ihn ist Verlass.',
    stats: { heimlichkeit: 2, propaganda: 1, empathie: 3, staerke: 5, bildung: 2 },
    avatar: { gender: 'm', face: 'kantig', headwear: 'kurz', hairTone: 'dunkel', glasses: false, clothing: 'arbeiterjacke' },
  },
]
