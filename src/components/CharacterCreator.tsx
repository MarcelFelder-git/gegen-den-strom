import { useMemo, useState, type ComponentProps, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight, Check, Dices, PenLine } from 'lucide-react'
import s from '../styles/period.module.css'
import { Avatar } from './Avatar'
import { StampButton } from './ui/StampButton'
import { StatPips } from './ui/StatPips'
import {
  IDEOLOGIES,
  PROFESSIONS,
  STAT_LABELS,
  STAT_ORDER,
  getIdeology,
  getProfession,
  leaderStats,
} from '../game/data/professions'
import type {
  AvatarConfig,
  AvatarDetail,
  Clothing,
  FaceShape,
  Gender,
  HairTone,
  Headwear,
  IdeologyKey,
  ProfessionKey,
  StatKey,
} from '../game/types'
import { useGame } from '../store/GameStore'
import { useUi } from '../store/UiStore'
import { CHAPTERS } from '../game/data/chapters'
import { CODENAMES, FIRST_NAMES, GROUP_NAMES, GROUP_RULES, MORE_GROUP_NAMES, MOTTOS } from '../game/data/group'
import { COMPANIONS } from '../game/data/companions'
import { companionName } from '../game/names'
import { resolve } from '../game/text'
import { DIFFICULTIES } from '../game/difficulty'

const FACE_LABELS: Record<FaceShape, string> = { oval: 'Oval', rund: 'Rund', kantig: 'Kantig', schmal: 'Schmal' }
const HEADWEAR_LABELS: Record<Headwear, string> = {
  schiebermuetze: 'Schiebermütze',
  fedora: 'Filzhut',
  kurz: 'Kurzes Haar',
  zoepfe: 'Zöpfe',
  welle: 'Wasserwelle',
  glocke: 'Glockenhut',
}
const HAIR_TONE_LABELS: Record<HairTone, string> = { dunkel: 'Dunkel', hell: 'Blond', rot: 'Rot', grau: 'Ergraut' }
const CLOTHING_LABELS: Record<Clothing, string> = {
  arbeiterjacke: 'Arbeiterjacke',
  trenchcoat: 'Trenchcoat',
  weste: 'Weste und Krawatte',
  kleid: 'Kleid mit Kragen',
}
const DETAIL_LABELS: Record<AvatarDetail, string> = {
  sommersprossen: 'Sommersprossen',
  schal: 'Schal',
  schnurrbart: 'Schnurrbart',
  ohrringe: 'Ohrringe',
}
const DETAIL_BY_GENDER: Record<Gender, AvatarDetail[]> = {
  m: ['sommersprossen', 'schal', 'schnurrbart'],
  w: ['sommersprossen', 'schal', 'ohrringe'],
}
const HEADWEAR_BY_GENDER: Record<Gender, Headwear[]> = {
  m: ['schiebermuetze', 'fedora', 'kurz'],
  w: ['zoepfe', 'welle', 'glocke', 'kurz', 'fedora'],
}
const CLOTHING_BY_GENDER: Record<Gender, Clothing[]> = {
  m: ['arbeiterjacke', 'trenchcoat', 'weste'],
  w: ['kleid', 'trenchcoat', 'arbeiterjacke'],
}
const DEFAULT_AVATAR: Record<Gender, AvatarConfig> = {
  m: { gender: 'm', face: 'kantig', headwear: 'schiebermuetze', hairTone: 'dunkel', glasses: false, clothing: 'arbeiterjacke' },
  w: { gender: 'w', face: 'oval', headwear: 'welle', hairTone: 'dunkel', glasses: false, clothing: 'kleid' },
}

const NAME_PATTERN = /^[A-Za-zÄÖÜäöüß][A-Za-zÄÖÜäöüß\- ]{1,19}$/

export function CharacterCreator({ onBack }: { onBack: () => void }) {
  const startGame = useGame((g) => g.startGame)
  const startChapter = useUi((u) => u.startChapter)
  const level = useUi((u) => u.draftLevel)
  const professions = resolve(PROFESSIONS, level)
  const ideologies = resolve(IDEOLOGIES, level)
  const later = startChapter === 2
  const [avatar, setAvatar] = useState<AvatarConfig>(DEFAULT_AVATAR.m)
  const [name, setName] = useState('')
  const [profession, setProfession] = useState<ProfessionKey>('arbeiter')
  const [ideology, setIdeology] = useState<IdeologyKey>('sozialdemokratisch')
  const [touched, setTouched] = useState(false)
  const [groupName, setGroupName] = useState(GROUP_NAMES[0])
  const [motto, setMotto] = useState(MOTTOS[0])
  const [codename, setCodename] = useState(CODENAMES[0])
  const [team, setTeam] = useState<string[]>([])
  // Drei Schritte statt einer langen Seite: du, deine Gefährten, eure Gruppe
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const groupValid = groupName.trim().length >= 2 && groupName.trim().length <= 30
  const codenameValid = NAME_PATTERN.test(codename.trim())

  const gender = avatar.gender
  const stats = useMemo(() => leaderStats(profession, ideology), [profession, ideology])
  const prof = resolve(getProfession(profession), level)
  const ideo = resolve(getIdeology(ideology), level)
  const nameValid = NAME_PATTERN.test(name.trim())

  const setGender = (g: Gender) => {
    if (g === gender) return
    // Nur Besonderheiten behalten, die es für das neue Geschlecht gibt
    const details = (avatar.details ?? []).filter((d) => DETAIL_BY_GENDER[g].includes(d))
    setAvatar({ ...DEFAULT_AVATAR[g], face: avatar.face, glasses: avatar.glasses, hairTone: avatar.hairTone, details })
    // Ein ausgewürfelter Vorname passt nicht mehr: neu würfeln. Einen selbst getippten Namen nie ändern.
    if (FIRST_NAMES[gender].includes(name.trim())) setName(shuffle(FIRST_NAMES[g], ''))
  }

  /** Eine Besonderheit an- oder abwählen */
  const toggleDetail = (d: AvatarDetail) => {
    const cur = avatar.details ?? []
    patch({ details: cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d] })
  }

  // Wer genauso heißt wie du, kommt trotzdem mit, aber unter einem anderen Vornamen. Sonst wüsste niemand, wer gemeint ist.
  const toggleCompanion = (companion: string) =>
    setTeam((cur) => (cur.includes(companion) ? cur.filter((x) => x !== companion) : cur.length >= 3 ? cur : [...cur, companion]))
  const activeTeam = team

  const patch = (p: Partial<AvatarConfig>) => setAvatar((a) => ({ ...a, ...p }))

  const missingByStep: Record<1 | 2 | 3, string[]> = {
    1: [!nameValid && 'deinen Vornamen'].filter(Boolean) as string[],
    2: [activeTeam.length !== 3 && 'drei Gefährten'].filter(Boolean) as string[],
    3: [!groupValid && 'einen Namen für die Gruppe', !codenameValid && 'einen Decknamen'].filter(
      Boolean,
    ) as string[],
  }
  const missing = missingByStep[step]
  const [tried, setTried] = useState(0)

  const goStep = (to: 1 | 2 | 3) => {
    setStep(to)
    setTried(0)
    window.scrollTo({ top: 0 })
  }
  const forward = () => {
    setTouched(true)
    setTried(step)
    if (missing.length > 0) return
    if (step < 3) return goStep((step + 1) as 2 | 3)
    submit()
  }
  const back = () => (step === 1 ? onBack() : goStep((step - 1) as 1 | 2))

  const submit = () => {
    if (Object.values(missingByStep).some((m) => m.length > 0)) return
    startGame(
      { level, name: name.trim(), avatar, profession, ideology, groupName: groupName.trim(), motto: motto.trim(), codename: codename.trim(), companions: activeTeam },
      later ? CHAPTERS[2].first : 0,
    )
  }

  return (
    <main className="min-h-dvh px-4 py-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <button onClick={back} className={`${s.typewriter} tap-area mb-4 inline-flex items-center gap-2 text-sm text-fog hover:text-paper`}>
          <ArrowLeft size={16} aria-hidden /> {step === 1 ? 'Zurück zur Vorgeschichte' : `Zurück zu Schritt ${step - 1}`}
        </button>

        <div className={`${s.paper} relative px-5 py-7 sm:px-10 sm:py-10`}>
          <header className="border-b-2 border-ink pb-5">
            <p className={`${s.typewriter} text-sm tracking-[0.15em] text-slate uppercase`}>{later ? 'Berlin, im März 1936' : 'Berlin, im Januar 1933'}</p>
            <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">{STEP_TITLES[step]}</h1>
            <p className="mt-2 max-w-2xl font-serif text-lg italic text-sepia">
              {step === 1
                ? level === 'leicht'
                  ? 'Du bist ein ganz normaler Mensch in Berlin. Dir geht es gut. Niemand verfolgt dich. Aber du willst nicht wegsehen.'
                  : 'Du gehörst nicht zu denen, die das Regime verfolgt. Du könntest dich heraushalten. Schreib auf, wer du bist, und dann wirf das Blatt ins Feuer.'
                : step === 2
                  ? 'Drei Menschen gehen mit dir in den Widerstand. Du entscheidest, wem du vertraust.'
                  : 'Eine Gruppe braucht einen Namen, einen Leitspruch und Regeln, an die sich alle halten.'}
            </p>
            <ol className="mt-4 flex flex-wrap gap-2" aria-label={`Schritt ${step} von 3`}>
              {([1, 2, 3] as const).map((n) => (
                <li
                  key={n}
                  aria-current={n === step ? 'step' : undefined}
                  className={`${s.typewriter} flex items-center gap-2 border-2 px-3 py-1.5 text-sm font-bold ${
                    n === step ? 'border-ink bg-ink text-paper' : n < step ? 'border-ink/60 text-ink' : 'border-ink/25 text-slate'
                  }`}
                >
                  <span className="grid h-5 w-5 place-items-center rounded-full border border-current text-xs">{n < step ? <Check size={12} aria-hidden /> : n}</span>
                  {STEP_LABELS[n]}
                </li>
              ))}
            </ol>
            <p className={`${s.typewriter} mt-3 inline-block border border-ink px-2 py-1 text-xs font-bold tracking-[0.1em] uppercase`}>
              Stufe: {DIFFICULTIES[level].label}
            </p>
            <span
              className={`${s.rubber} absolute top-6 right-5 hidden text-crimson sm:inline-block`}
              style={{ transform: 'rotate(8deg)' }}
            >
              Vertraulich
            </span>
          </header>

          <div className="mt-8 grid gap-10 lg:grid-cols-[300px_1fr]">
            {/* Lichtbild und Übersicht. Auf schmalen Bildschirmen nur in Schritt 1, damit später die Auswahl oben steht */}
            <aside className={`lg:sticky lg:top-6 lg:self-start ${step > 1 ? 'max-lg:hidden' : ''}`}>
              <figure className="mx-auto w-fit -rotate-1 border border-ink/40 bg-paper-dark p-3 shadow-[4px_6px_0_rgba(28,28,30,0.25)]">
                <Avatar config={avatar} size={220} title={`Porträt von ${name || 'dir'}`} />
                <figcaption className={`${s.typewriter} mt-2 text-center text-lg font-bold`}>{name.trim() || '...'}</figcaption>
                <p className={`${s.typewriter} text-center text-sm text-slate`}>
                  {prof.label[gender]}, {ideo.label.toLowerCase()}
                </p>
              </figure>
              <dl className="mx-auto mt-6 max-w-[300px] space-y-2">
                {STAT_ORDER.map((k) => (
                  <div key={k} className="flex items-center justify-between gap-3">
                    <dt className={`${s.typewriter} text-sm`}>{STAT_LABELS[k]}</dt>
                    <dd>
                      <StatPips value={stats[k]} label={STAT_LABELS[k]} />
                    </dd>
                  </div>
                ))}
              </dl>
              <p className={`${s.typewriter} mx-auto mt-4 max-w-[300px] border-t border-dashed border-slate pt-3 text-sm text-slate`}>
                Kasse zu Beginn: {prof.startKasse} Reichsmark
                <br />
                Unterstützer: {ideo.startSupporters}
                <br />
                Fahndungsdruck: {ideo.startHeat === 0 ? 'keiner' : `${ideo.startHeat} von 100`}
              </p>
            </aside>

            <div className="space-y-10">
              {step === 1 && (
                <>
                  <Section numeral="I" title="Person">
                    <Field label="Geschlecht">
                      <ChipGroup label="Geschlecht">
                        {(['m', 'w'] as Gender[]).map((g) => (
                          <Chip key={g} checked={gender === g} onClick={() => setGender(g)} className="px-5 py-3">
                            {g === 'm' ? 'Männlich' : 'Weiblich'}
                          </Chip>
                        ))}
                      </ChipGroup>
                    </Field>
                    <Field label="Vorname" htmlFor="leader-name">
                      <TextField
                        id="leader-name"
                        value={name}
                        maxLength={20}
                        autoCapitalize="words"
                        placeholder="Dein Vorname"
                        onShuffle={() => setName(shuffle(FIRST_NAMES[gender], name))}
                        shuffleLabel="Einen Vornamen auswürfeln"
                        onChange={(e) => setName(e.target.value)}
                        onBlur={() => name && setTouched(true)}
                        aria-invalid={touched && !nameValid}
                        aria-describedby="name-hint"
                        className="max-w-sm text-2xl"
                      />
                      <p id="name-hint" className={`${s.typewriter} mt-2 text-sm ${touched && !nameValid ? 'text-crimson' : 'text-slate'}`}>
                        {touched && !nameValid
                          ? 'Bitte einen Vornamen aus zwei bis zwanzig Buchstaben eintragen.'
                          : 'Du spielst eine Person aus Berlin im Jahr 1933. Nimm deinen eigenen Vornamen, denk dir einen aus oder würfle. Ein Vorname genügt, Nachnamen verraten zu viel.'}
                      </p>
                    </Field>
                  </Section>

                  <Section numeral="II" title="Aussehen">
                    <Field label="Gesichtsform">
                      <ChipGroup label="Gesichtsform">
                        {(Object.keys(FACE_LABELS) as FaceShape[]).map((f) => (
                          <PreviewChip key={f} checked={avatar.face === f} onClick={() => patch({ face: f })} config={{ ...avatar, face: f }}>
                            {FACE_LABELS[f]}
                          </PreviewChip>
                        ))}
                      </ChipGroup>
                    </Field>
                    <Field label="Haar und Kopfbedeckung">
                      <ChipGroup label="Haar und Kopfbedeckung">
                        {HEADWEAR_BY_GENDER[gender].map((h) => (
                          <PreviewChip key={h} checked={avatar.headwear === h} onClick={() => patch({ headwear: h })} config={{ ...avatar, headwear: h }}>
                            {HEADWEAR_LABELS[h]}
                          </PreviewChip>
                        ))}
                      </ChipGroup>
                    </Field>
                    <div className="grid gap-8 sm:grid-cols-2">
                      <Field label="Haarfarbe">
                        <ChipGroup label="Haarfarbe">
                          {(Object.keys(HAIR_TONE_LABELS) as HairTone[]).map((t) => (
                            <Chip key={t} checked={avatar.hairTone === t} onClick={() => patch({ hairTone: t })} className="px-4 py-2.5">
                              {HAIR_TONE_LABELS[t]}
                            </Chip>
                          ))}
                        </ChipGroup>
                      </Field>
                      <Field label="Brille">
                        <ChipGroup label="Brille">
                          {[false, true].map((g) => (
                            <Chip key={String(g)} checked={avatar.glasses === g} onClick={() => patch({ glasses: g })} className="px-4 py-2.5">
                              {g ? 'Nickelbrille' : 'Ohne Brille'}
                            </Chip>
                          ))}
                        </ChipGroup>
                      </Field>
                    </div>
                    <Field label="Besonderheiten">
                      <p className={`${s.typewriter} -mt-1 mb-2 text-sm text-slate`}>Tippe an, was dazukommen soll. Noch einmal tippen nimmt es wieder weg.</p>
                      <div role="group" aria-label="Besonderheiten" className="flex flex-wrap gap-3">
                        {DETAIL_BY_GENDER[gender].map((d) => {
                          const on = !!avatar.details?.includes(d)
                          return (
                            <PreviewChip
                              key={d}
                              toggle
                              checked={on}
                              onClick={() => toggleDetail(d)}
                              config={{ ...avatar, details: on ? avatar.details : [...(avatar.details ?? []), d] }}
                            >
                              {DETAIL_LABELS[d]}
                            </PreviewChip>
                          )
                        })}
                      </div>
                    </Field>
                    <Field label="Kleidung">
                      <ChipGroup label="Kleidung">
                        {CLOTHING_BY_GENDER[gender].map((c) => (
                          <PreviewChip key={c} checked={avatar.clothing === c} onClick={() => patch({ clothing: c })} config={{ ...avatar, clothing: c }}>
                            {CLOTHING_LABELS[c]}
                          </PreviewChip>
                        ))}
                      </ChipGroup>
                    </Field>
                  </Section>

                  <Section numeral="III" title="Beruf">
                    <ChipGroup label="Beruf" className="grid gap-3 sm:grid-cols-2">
                      {professions.map((p) => (
                        <Chip key={p.key} checked={profession === p.key} onClick={() => setProfession(p.key)} className="p-4">
                          <span className="block font-serif text-xl font-bold">{p.label[gender]}</span>
                          <span className="mt-1 block font-serif text-base leading-snug">{p.text}</span>
                          <span className="mt-2 block text-sm font-bold text-crimson">Vorteil: {p.bonusLabel}</span>
                        </Chip>
                      ))}
                    </ChipGroup>
                  </Section>

                  <Section numeral="IV" title="Gesinnung">
                    <ChipGroup label="Gesinnung" className="grid gap-3 sm:grid-cols-2">
                      {ideologies.map((i) => (
                        <Chip key={i.key} checked={ideology === i.key} onClick={() => setIdeology(i.key)} className="p-4">
                          <span className="block font-serif text-xl font-bold">{i.label}</span>
                          <span className="mt-1 block font-serif text-base leading-snug">{i.text}</span>
                          <span className="mt-2 block text-sm font-bold text-crimson">{i.bonusLabel}</span>
                        </Chip>
                      ))}
                    </ChipGroup>
                  </Section>

                </>
              )}

              {step === 2 && (
                <Section numeral="V" title="Deine Gefährten">
                  <p className="max-w-2xl font-serif text-lg leading-relaxed">
                    {later
                      ? 'Seit drei Jahren trefft ihr euch heimlich. Wer ist mit dir im Widerstand? Wähle drei Menschen.'
                      : 'Allein kannst du wenig tun. Wem vertraust du genug, um mit ihm oder ihr Widerstand zu leisten? Wähle drei Menschen. Jeder kann etwas anderes gut.'}
                  </p>
                  <p className={`${s.typewriter} text-sm font-bold ${touched && activeTeam.length !== 3 ? 'text-crimson' : 'text-slate'}`} role="status">
                    {activeTeam.length} von 3 gewählt{activeTeam.length === 3 && '. Zum Tauschen tippe eine gewählte Person noch einmal an.'}
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" role="group" aria-label="Gefährten wählen">
                    {COMPANIONS.map((c) => {
                      const picked = team.includes(c.name)
                      const shown = companionName(c.name, name)
                      const full = !picked && team.length >= 3
                      return (
                        <button
                          key={c.name}
                          onClick={() => toggleCompanion(c.name)}
                          aria-pressed={picked}
                          aria-disabled={full || undefined}
                          className={`${s.chip} relative flex gap-3 p-3 text-left ${full ? 'cursor-default border-dashed !bg-paper-dark text-slate shadow-none' : ''}`}
                        >
                          <span className={`shrink-0 ${full ? 'grayscale opacity-60' : ''}`}>
                            <Avatar config={c.avatar} size={64} title="" />
                          </span>
                          <span className="min-w-0">
                            <span className="block font-serif text-lg leading-tight font-bold">{shown}</span>
                            <span className="block font-type text-xs text-slate">{c.beruf}</span>
                            <span className="mt-1 block font-serif text-[15px] leading-snug">{resolve(c.bio, level)}</span>
                            <span className="mt-1 block font-type text-xs font-bold text-crimson">
                              Stark in: {STAT_LABELS[bestStat(c.stats)]}
                            </span>
                            {shown !== c.name && (
                              <span className="mt-0.5 block font-type text-xs text-slate">
                                Heißt eigentlich {c.name.split(' ')[0]}, so wie du. In der Gruppe nennen alle {c.avatar.gender === 'w' ? 'sie' : 'ihn'}{' '}
                                {shown.split(' ')[0]}.
                              </span>
                            )}
                          </span>
                          {picked && (
                            <span className="absolute top-2 right-2 grid h-6 w-6 place-items-center bg-crimson text-paper" aria-hidden>
                              <Check size={15} />
                            </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </Section>

              )}

              {step === 3 && (
                <Section numeral="VI" title="Eure Widerstandsgruppe">
                  <p className="max-w-2xl font-serif text-lg leading-relaxed">
                    {later
                      ? 'Ihr seid eine Widerstandsgruppe: Menschen, die nicht mitmachen, sondern für andere einstehen.'
                      : 'Euch selbst droht erst einmal nichts. Gerade deshalb könnt ihr denen helfen, die verfolgt werden. Gebt euch einen Namen, den nur ihr kennt.'}
                  </p>
                  <div className="max-w-2xl border-l-4 border-crimson bg-paper-dark px-4 py-3">
                    <p className={`${s.typewriter} text-xs font-bold tracking-[0.15em] uppercase`}>Eure Regeln</p>
                    <ol className="mt-1 list-decimal space-y-0.5 pl-5 font-serif text-[16px] leading-snug">
                      {GROUP_RULES.map((rule, i) => (
                        <li key={rule} className={i === 0 ? 'font-bold' : ''}>
                          {rule}
                        </li>
                      ))}
                    </ol>
                  </div>
                  <Field label="Name der Gruppe" htmlFor="group-name">
                    <p className="mb-3 max-w-2xl font-serif text-base text-sepia">
                      Echte Gruppen gaben sich oft harmlose Namen, damit niemand Verdacht schöpfte. Eine Berliner Gruppe, die ab 1938
                      Verfolgte versteckte, nannte sich „Onkel Emil“.
                    </p>
                    <TextField
                      id="group-name"
                      value={groupName}
                      maxLength={30}
                      placeholder="Name eurer Gruppe"
                      onShuffle={() => setGroupName(shuffle([...GROUP_NAMES, ...MORE_GROUP_NAMES], groupName))}
                      shuffleLabel="Einen Gruppennamen auswürfeln"
                      onChange={(e) => setGroupName(e.target.value)}
                      aria-invalid={!groupValid}
                      className="max-w-md text-2xl"
                    />
                    <p className={`${s.typewriter} mt-2 text-sm text-slate`}>Denkt euch einen eigenen Namen aus. Wenn euch nichts einfällt, würfelt einen.</p>
                  </Field>
                  <Field label="Euer Leitspruch">
                    {/* Nur Auswahl, kein freies Feld: Alle Sprüche auf einen Blick, ein Tipp genügt */}
                    <ChipGroup label="Euer Leitspruch" className="grid max-w-3xl gap-3 sm:grid-cols-2">
                      {MOTTOS.map((m) => (
                        <Chip key={m} checked={motto === m} onClick={() => setMotto(m)} className="px-4 py-3 text-left font-serif text-xl italic">
                          „{m.replace(/\.$/, '')}“
                        </Chip>
                      ))}
                    </ChipGroup>
                  </Field>
                  <Field label="Dein Deckname" htmlFor="codename">
                    <p className="mb-3 max-w-2xl font-serif text-base text-sepia">
                      Im Widerstand benutzte man falsche Namen. Wer verhaftet wurde, konnte so die echten Namen der anderen nicht verraten.
                      Am besten ein Wort, das nichts über dich verrät.
                    </p>
                    <TextField
                      id="codename"
                      value={codename}
                      maxLength={20}
                      autoCapitalize="words"
                      placeholder="Dein Deckname"
                      onShuffle={() => setCodename(shuffle(CODENAMES, codename))}
                      shuffleLabel="Einen Decknamen auswürfeln"
                      onChange={(e) => setCodename(e.target.value)}
                      aria-invalid={!codenameValid}
                      className="max-w-xs text-xl"
                    />
                    <p className={`${s.typewriter} mt-2 text-sm text-slate`}>Denk dir einen eigenen aus. Wenn dir nichts einfällt, würfle einen.</p>
                  </Field>
                </Section>

              )}

              <div className="flex flex-col items-start gap-3 border-t-2 border-ink pt-6 sm:flex-row sm:items-center sm:justify-between">
                {step === 3 ? (
                  <p className="max-w-md font-serif text-base italic text-sepia">
                    {later
                      ? 'Seit drei Jahren arbeitet deine kleine Gruppe im Verborgenen. Drei Gefährten sind geblieben.'
                      : 'Drei Gefährten warten schon in deiner Küche. Ab heute bist du für sie verantwortlich.'}
                  </p>
                ) : (
                  <StampButton variant="quiet" onClick={back}>
                    <ArrowLeft size={16} aria-hidden /> Zurück
                  </StampButton>
                )}
                <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:items-end">
                  <StampButton variant="ink" onClick={forward} className="w-full text-base sm:w-auto">
                    {step === 1 ? (
                      <>
                        Weiter zu deinen Gefährten <ArrowRight size={16} aria-hidden />
                      </>
                    ) : step === 2 ? (
                      <>
                        Weiter zu eurer Gruppe <ArrowRight size={16} aria-hidden />
                      </>
                    ) : later ? (
                      'Weiter im Widerstand'
                    ) : (
                      'Die Gruppe gründen'
                    )}
                  </StampButton>
                  {tried === step && missing.length > 0 && (
                    <p className={`${s.typewriter} text-sm font-bold text-crimson`} role="alert">
                      Es fehlt noch: {missing.join(', ')}.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

const STEP_TITLES = { 1: 'Wer bist du?', 2: 'Wer ist mit dir?', 3: 'Eure Gruppe' } as const
const STEP_LABELS = { 1: 'Du', 2: 'Deine Gefährten', 3: 'Eure Gruppe' } as const

/**
 * Ein Eingabefeld, das auch auf dem Tablet sofort als beschreibbar erkennbar ist:
 * heller Kasten, Stift-Symbol, Tippen setzt den Cursor. Der Würfel hilft, wenn einem nichts einfällt.
 */
function TextField({
  className = '',
  onShuffle,
  shuffleLabel,
  ...props
}: ComponentProps<'input'> & { onShuffle?: () => void; shuffleLabel?: string }) {
  return (
    <div className={`flex w-full items-stretch gap-2 ${className}`}>
      <label className="group flex min-w-0 flex-1 cursor-text items-center gap-2 border-2 border-dashed border-ink/50 bg-paper px-3 focus-within:border-solid focus-within:border-crimson">
        <input
          autoComplete="off"
          {...props}
          className={`${s.typewriter} min-w-0 flex-1 bg-transparent py-2.5 font-bold outline-none placeholder:font-normal placeholder:text-slate/60`}
        />
        <PenLine size={18} className="shrink-0 text-slate group-focus-within:text-crimson" aria-hidden />
      </label>
      {onShuffle && (
        <button type="button" onClick={onShuffle} title={shuffleLabel} aria-label={shuffleLabel} className={`${s.chip} grid w-12 shrink-0 place-items-center`}>
          <Dices size={22} aria-hidden />
        </button>
      )}
    </div>
  )
}

/** Zieht einen Vorschlag, der sich vom aktuellen unterscheidet */
function shuffle(options: string[], current: string): string {
  const pool = options.filter((o) => o !== current.trim())
  return pool[Math.floor(Math.random() * pool.length)] ?? current
}

/** Worin eine Person am stärksten ist */
function bestStat(stats: Record<StatKey, number>): StatKey {
  return STAT_ORDER.reduce((best, k) => (stats[k] > stats[best] ? k : best), STAT_ORDER[0])
}

function Section({ numeral, title, children }: { numeral: string; title: string; children: ReactNode }) {
  return (
    <section className="space-y-6">
      <h2 className="flex items-baseline gap-3 border-b border-ink/40 pb-1 font-serif text-2xl font-bold">
        <span className={`${s.typewriter} text-base text-crimson`}>{numeral}.</span>
        {title}
      </h2>
      {children}
    </section>
  )
}

function Field({ label, htmlFor, children }: { label: string; htmlFor?: string; children: ReactNode }) {
  return (
    <div>
      {htmlFor ? (
        <label htmlFor={htmlFor} className={`${s.typewriter} mb-2 block text-sm font-bold tracking-[0.12em] text-slate uppercase`}>
          {label}
        </label>
      ) : (
        <p className={`${s.typewriter} mb-2 text-sm font-bold tracking-[0.12em] text-slate uppercase`} aria-hidden>
          {label}
        </p>
      )}
      {children}
    </div>
  )
}

function ChipGroup({ label, className = 'flex flex-wrap gap-3', children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <div role="radiogroup" aria-label={label} className={className}>
      {children}
    </div>
  )
}

function Chip({
  checked,
  onClick,
  className = '',
  children,
}: {
  checked: boolean
  onClick: () => void
  className?: string
  children: ReactNode
}) {
  return (
    <button role="radio" aria-checked={checked} onClick={onClick} className={`${s.chip} ${className}`}>
      {children}
    </button>
  )
}

function PreviewChip({
  checked,
  onClick,
  config,
  toggle = false,
  children,
}: {
  checked: boolean
  onClick: () => void
  config: AvatarConfig
  /** An- und abwählbar statt einer Auswahl aus mehreren */
  toggle?: boolean
  children: ReactNode
}) {
  const inner = (
    <>
      <Avatar config={config} size={72} title="" />
      <span className="text-center text-[13px] leading-tight break-words hyphens-auto">{children}</span>
    </>
  )
  if (toggle) {
    return (
      <button aria-pressed={checked} onClick={onClick} className={`${s.chip} relative flex w-[124px] flex-col items-center gap-1.5 p-2`}>
        {inner}
        {checked && (
          <span className="absolute top-1.5 right-1.5 grid h-5 w-5 place-items-center bg-crimson text-paper" aria-hidden>
            <Check size={13} />
          </span>
        )}
      </button>
    )
  }
  return (
    <Chip checked={checked} onClick={onClick} className="flex w-[124px] flex-col items-center gap-1.5 p-2">
      {inner}
    </Chip>
  )
}
