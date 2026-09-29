/**
 * Echte Fotos mit Bildnachweis. Alle Dateien liegen unter public/fotos und stammen
 * von Wikimedia Commons, überwiegend aus dem Bundesarchiv. Die Lizenzen erlauben die Nutzung
 * mit Namensnennung (CC BY-SA 3.0 de, CC BY 3.0, CC BY 4.0) oder die Bilder sind gemeinfrei.
 */
export interface Photo {
  src: string
  alt: string
  caption: string
  credit: string
  license: string
  url: string
  /** Querformatige Dokumente wie Plakate werden ganz gezeigt statt beschnitten */
  fit?: 'contain'
}

const f = (file: string) => `./fotos/${file}`

export const PHOTOS = {
  ossietzky: {
    src: f('ossietzky.jpg'),
    alt: 'Carl von Ossietzky in Häftlingskleidung',
    caption: 'Carl von Ossietzky als Häftling im KZ Esterwegen, 1935. Das Foto entstand im Lager, er konnte sich nicht aussuchen, ob er fotografiert wird',
    credit: 'Bundesarchiv, Bild 183-93516-0010 / Walter Sohst, Heiner Kurzbein',
    license: 'CC BY-SA 3.0 de',
    url: 'https://commons.wikimedia.org/wiki/File:Bundesarchiv_Bild_183-93516-0010,_Carl_von_Ossietzky_(cropped).jpg',
  },
  kollwitz: {
    src: f('kollwitz.jpg'),
    alt: 'Käthe Kollwitz, Porträt',
    caption: 'Käthe Kollwitz, 1927',
    credit: 'Hugo Erfurth',
    license: 'gemeinfrei',
    url: 'https://commons.wikimedia.org/wiki/File:K%C3%A4the_Kollwitz_by_Hugo_Erfurth,_1927.jpg',
  },
  litten: {
    src: f('litten-tafel.jpg'),
    alt: 'Gedenktafel für Hans Litten mit einer Zeichnung seines Gesichts',
    caption: 'Gedenktafel in der Littenstraße, Berlin-Mitte. Die Zeichnung fertigte ein Mithäftling im KZ Lichtenburg.',
    credit: 'OTFW, Berlin',
    license: 'CC BY-SA 3.0',
    url: 'https://commons.wikimedia.org/wiki/File:Gedenktafel_Littenstr_9_(Mitte)_Hans_Litten.jpg',
  },
  muehsam: {
    src: f('muehsam.jpg'),
    alt: 'Erich Mühsam, Porträt',
    caption: 'Erich Mühsam, 1928',
    credit: 'Bundesarchiv, Bild 146-1981-003-08',
    license: 'CC BY-SA 3.0 de',
    url: 'https://commons.wikimedia.org/wiki/File:Bundesarchiv_Bild_146-1981-003-08,_Erich_M%C3%BChsam.jpg',
  },
  wels: {
    src: f('wels.jpg'),
    alt: 'Otto Wels, Porträt',
    caption: 'Otto Wels',
    credit: 'Bain News Service, Library of Congress',
    license: 'gemeinfrei',
    url: 'https://commons.wikimedia.org/wiki/File:Otto_Wels.jpg',
  },
  bonhoeffer: {
    src: f('bonhoeffer.jpg'),
    alt: 'Dietrich Bonhoeffer, Porträt',
    caption: 'Dietrich Bonhoeffer, 1939',
    credit: 'Bundesarchiv, Bild 146-1987-074-16',
    license: 'CC BY-SA 3.0 de',
    url: 'https://commons.wikimedia.org/wiki/File:Bundesarchiv_Bild_146-1987-074-16,_Dietrich_Bonhoeffer.jpg',
  },
  schulzeBoysen: {
    src: f('schulze-boysen.jpg'),
    alt: 'Harro Schulze-Boysen, Porträt',
    caption: 'Harro Schulze-Boysen, 1935',
    credit: 'Gedenkstätte Deutscher Widerstand',
    license: 'gemeinfrei',
    url: 'https://commons.wikimedia.org/wiki/File:Harro_Schulze-Boysen_(1935).jpg',
  },
  seelenbinder: {
    src: f('seelenbinder.jpg'),
    alt: 'Werner Seelenbinder, Porträt',
    caption: 'Werner Seelenbinder, um 1935',
    credit: 'unbekannt',
    license: 'gemeinfrei',
    url: 'https://commons.wikimedia.org/wiki/File:WernerSeelenbinder_1930-42.jpg',
  },
  baum: {
    src: f('baum.jpg'),
    alt: 'Herbert Baum, gezeichnetes Porträt',
    caption: 'Herbert Baum, Porträtzeichnung',
    credit: 'Bundesarchiv, Bild 183-32713-0001',
    license: 'CC BY-SA 3.0 de',
    url: 'https://commons.wikimedia.org/wiki/File:Bundesarchiv_Bild_183-32713-0001,_Herbert_Baum.jpg',
  },
  niemoeller: {
    src: f('niemoeller.jpg'),
    alt: 'Martin Niemöller, Porträt',
    caption: 'Martin Niemöller, 1952',
    credit: 'J. D. Noske / Anefo, Nationaal Archief',
    license: 'CC0',
    url: 'https://commons.wikimedia.org/wiki/File:Martin_Niem%C3%B6ller_(1952).jpg',
  },
  schmitz: {
    src: f('schmitz-tafel.jpg'),
    alt: 'Gedenktafel für Elisabeth Schmitz',
    caption: 'Gedenktafel in der Auguststraße 82, Berlin-Mitte',
    credit: 'OTFW, Berlin',
    license: 'CC BY-SA 3.0',
    url: 'https://commons.wikimedia.org/wiki/File:Gedenktafel_Auguststr_82_(Mitte)_Elisabeth_Schmitz.jpg',
  },
  roteHilfe: {
    src: f('rotehilfe-plakat.jpg'),
    alt: 'Plakat: Öffentliche Versammlung der Roten Hilfe, Thema: Die Rote Hilfe und ihre Aufgaben',
    caption: 'Plakat der Roten Hilfe in Villingen, 1931. Ab 1933 war die Rote Hilfe verboten und arbeitete heimlich weiter',
    credit: 'Landesarchiv Baden-Württemberg, Staatsarchiv Freiburg W 110-1 Nr. 0365',
    license: 'CC BY 4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Rote_Hilfe,_Ortsgruppe_Villingen-_Die_Rote_Hilfe_und_ihre_Aufgaben_-_LABW_-_Staatsarchiv_Freiburg_W_110-1_Nr._0365.jpeg',
    fit: 'contain',
  },
  neueSynagoge: {
    src: f('neue-synagoge.jpg'),
    alt: 'Die Neue Synagoge in der Oranienburger Straße mit ihrer goldenen Kuppel',
    caption: 'Die Neue Synagoge in der Oranienburger Straße, 2005',
    credit: 'Andreas Praefcke',
    license: 'CC BY 3.0',
    url: 'https://commons.wikimedia.org/wiki/File:Berlin_Neue_Synagoge_2005.jpg',
  },
  revolution1918: {
    src: f('1918-revolution.jpg'),
    alt: 'Revolutionäre Soldaten mit einer Fahne fahren in einem Auto durch das Brandenburger Tor',
    caption: 'Revolution am Brandenburger Tor, 9. November 1918',
    credit: 'Bundesarchiv, Bild 183-B0527-0001-810',
    license: 'CC BY-SA 3.0 de',
    url: 'https://commons.wikimedia.org/wiki/File:Bundesarchiv_Bild_183-B0527-0001-810,_Berlin,_Brandenburger_Tor,_Novemberrevolution.jpg',
  },
  putsch1923: {
    src: f('1923-hitlerputsch.jpg'),
    alt: 'Putschisten mit Stahlhelmen und Hakenkreuz-Armbinden auf einem Lastwagen am Marienplatz',
    caption: 'Hitlerputsch in München, Marienplatz, 9. November 1923',
    credit: 'Bundesarchiv, Bild 119-1486',
    license: 'CC BY-SA 3.0 de',
    url: 'https://commons.wikimedia.org/wiki/File:Bundesarchiv_Bild_119-1486,_Hitler-Putsch,_M%C3%BCnchen,_Marienplatz.jpg',
  },
  waermehalle1931: {
    src: f('1931-waermehalle.jpg'),
    alt: 'Arme Menschen essen Suppe an einem langen Tisch',
    caption: 'Mittagessen in einer Wärmehalle in Berlin-Neukölln, Januar 1931',
    credit: 'Bundesarchiv, Bild 102-11020',
    license: 'CC BY-SA 3.0 de',
    url: 'https://commons.wikimedia.org/wiki/File:Bundesarchiv_Bild_102-11020,_Berlin-Neuk%C3%B6lln,_Mittagessen_in_einer_W%C3%A4rmehalle.jpg',
  },
  aufmarsch1930: {
    src: f('1930-sa-aufmarsch.jpg'),
    alt: 'Hitler grüßt von einem Auto aus marschierende SA-Männer, daneben eine Hakenkreuzfahne',
    caption: 'Hitler bei einem Aufmarsch der SA in Weimar, Oktober 1930',
    credit: 'Bundesarchiv, Bild 102-10541 / Georg Pahl',
    license: 'CC BY-SA 3.0 de',
    url: 'https://commons.wikimedia.org/wiki/File:Bundesarchiv_Bild_102-10541,_Weimar,_Aufmarsch_der_Nationalsozialisten.jpg',
  },
  kempner: {
    src: f('kempner.jpg'),
    alt: 'Robert Kempner, Porträt',
    caption: 'Robert Kempner, 1940 im Exil in den USA',
    credit: 'US-Einbürgerungsunterlagen',
    license: 'gemeinfrei',
    url: 'https://commons.wikimedia.org/wiki/File:Dr._Robert_M.W._Kempner.jpg',
  },
  wahl1932: {
    src: f('1932-wahlplakate.jpg'),
    alt: 'Zwei Menschen lesen Wahlplakate an einer Litfaßsäule',
    caption: 'Wahlplakate an einer Berliner Litfaßsäule vor der Wahl am 31. Juli 1932',
    credit: 'Bundesarchiv, B 145 Bild-P046288',
    license: 'CC BY-SA 3.0 de',
    url: 'https://commons.wikimedia.org/wiki/File:Bundesarchiv_B_145_Bild-P046288,_Berlin,_Wahlplakate_an_einer_Litfa%C3%9Fs%C3%A4ule.jpg',
  },
  kabinett1933: {
    src: f('1933-kabinett.jpg'),
    alt: 'Die Minister der Regierung Hitler sitzen und stehen in einem Raum',
    caption: 'Das Kabinett Hitler nach seiner ersten Sitzung, 30. Januar 1933',
    credit: 'Bundesarchiv, Bild 102-15348',
    license: 'CC BY-SA 3.0 de',
    url: 'https://commons.wikimedia.org/wiki/File:Bundesarchiv_Bild_102-15348,_Reichskabinett_Adolf_Hitler.jpg',
  },
} satisfies Record<string, Photo>

export type PhotoId = keyof typeof PHOTOS

export const ALL_PHOTOS: Photo[] = Object.values(PHOTOS)
