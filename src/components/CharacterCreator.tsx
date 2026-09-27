import { useMemo, useState, type ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import s from '../styles/period.module.css'
import { Avatar } from './Avatar'
import { StampButton } from './ui/StampButton'
import { StatPips } from './ui/StatPips'
import {
  IDEOLOGIES,
  NAME_SUGGESTIONS,
  PROFESSIONS,
  STAT_LABELS,
  STAT_ORDER,
  getIdeology,
  getProfession,
  leaderStats,
} from '../game/data/professions'
import type {
  AvatarConfig,
  Clothing,
  FaceShape,
  Gender,
  HairTone,
  Headwear,
  IdeologyKey,
  ProfessionKey,
} from '../game/types'
import { useGame } from '../store/GameStore'
import { useUi } from '../store/UiStore'
import { CHAPTERS } from '../game/data/chapters'
import { CODENAMES, GROUP_NAMES, GROUP_RULES, MOTTOS } from '../game/data/group'
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
const HAIR_TONE_LABELS: Record<HairTone, string> = { dunkel: 'Dunkel', hell: 'Blond', grau: 'Ergraut' }
const CLOTHING_LABELS: Record<Clothing, string> = {
  arbeiterjacke: 'Arbeiterjacke',
  trenchcoat: 'Trenchcoat',
  weste: 'Weste und Krawatte',
  kleid: 'Kleid mit Kragen',
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
  const [name, setName] = useState('Karl')
  const [profession, setProfession] = useState<ProfessionKey>('arbeiter')
  const [ideology, setIdeology] = useState<IdeologyKey>('sozialdemokratisch')
  const [touched, setTouched] = useState(false)
  const [groupName, setGroupName] = useState(GROUP_NAMES[0])
  const [motto, setMotto] = useState(MOTTOS[0])
  const [codename, setCodename] = useState(CODENAMES[0])
  const groupValid = groupName.trim().length >= 2 && groupName.trim().length <= 30

  const gender = avatar.gender
  const stats = useMemo(() => leaderStats(profession, ideology), [profession, ideology])
  const prof = resolve(getProfession(profession), level)
  const ideo = resolve(getIdeology(ideology), level)
  const nameValid = NAME_PATTERN.test(name.trim())

  const setGender = (g: Gender) => {
    if (g === gender) return
    setAvatar({ ...DEFAULT_AVATAR[g], face: avatar.face, glasses: avatar.glasses, hairTone: avatar.hairTone })
    const allDefaults = [...NAME_SUGGESTIONS.m, ...NAME_SUGGESTIONS.w]
    if (!name.trim() || allDefaults.includes(name.trim())) setName(NAME_SUGGESTIONS[g][0])
  }

  const patch = (p: Partial<AvatarConfig>) => setAvatar((a) => ({ ...a, ...p }))

  const submit = () => {
    setTouched(true)
    if (!nameValid || !groupValid) return
    startGame({ level, name: name.trim(), avatar, profession, ideology, groupName: groupName.trim(), motto, codename }, later ? CHAPTERS[2].first : 0)
  }

  return (
    <main className="min-h-dvh px-4 py-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <button onClick={onBack} className={`${s.typewriter} tap-area mb-4 inline-flex items-center gap-2 text-sm text-fog hover:text-paper`}>
          <ArrowLeft size={16} aria-hidden /> Zurück zur Vorgeschichte
        </button>

        <div className={`${s.paper} relative px-5 py-7 sm:px-10 sm:py-10`}>
          <header className="border-b-2 border-ink pb-5">
            <p className={`${s.typewriter} text-sm tracking-[0.25em] text-slate uppercase`}>{later ? 'Berlin, im März 1936' : 'Berlin, im Januar 1933'}</p>
            <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">Wer bist du?</h1>
            <p className="mt-2 max-w-2xl font-serif text-lg italic text-sepia">
              {level === 'leicht'
                ? 'Du bist ein ganz normaler Mensch in Berlin. Dir geht es gut. Niemand verfolgt dich. Aber du willst nicht wegsehen.'
                : 'Du gehörst nicht zu denen, die das Regime verfolgt. Du könntest dich heraushalten. Schreib auf, wer du bist, und dann wirf das Blatt ins Feuer.'}
            </p>
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
            {/* Lichtbild und Übersicht */}
            <aside className="lg:sticky lg:top-6 lg:self-start">
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
                <Field label="Name" htmlFor="leader-name">
                  <input
                    id="leader-name"
                    value={name}
                    maxLength={20}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => setTouched(true)}
                    aria-invalid={touched && !nameValid}
                    aria-describedby="name-hint"
                    className={`${s.typewriter} w-full max-w-sm border-0 border-b-2 border-ink bg-transparent px-1 py-2 text-2xl font-bold outline-none focus:border-crimson`}
                  />
                  <p id="name-hint" className={`${s.typewriter} mt-2 text-sm ${touched && !nameValid ? 'text-crimson' : 'text-slate'}`}>
                    {touched && !nameValid
                      ? 'Bitte einen Vornamen aus zwei bis zwanzig Buchstaben eintragen.'
                      : 'Ein Vorname genügt. Nachnamen verraten zu viel.'}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {NAME_SUGGESTIONS[gender].map((n) => (
                      <button
                        key={n}
                        onClick={() => setName(n)}
                        className={`${s.chip} px-3.5 py-2.5 text-sm`}
                        aria-pressed={name === n}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
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

              <Section numeral="V" title="Eure Widerstandsgruppe">
                <p className="max-w-2xl font-serif text-lg leading-relaxed">
                  {later
                    ? 'Seit drei Jahren trefft ihr euch heimlich. Ihr seid eine Widerstandsgruppe: Menschen, die nicht mitmachen, sondern für andere einstehen.'
                    : 'Du bist nicht allein. Mit drei Gefährten gründest du eine Widerstandsgruppe. Euch selbst droht erst einmal nichts. Gerade deshalb könnt ihr denen helfen, die verfolgt werden. Gebt euch einen Namen, den nur ihr kennt.'}
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
                  <input
                    id="group-name"
                    value={groupName}
                    maxLength={30}
                    onChange={(e) => setGroupName(e.target.value)}
                    aria-invalid={!groupValid}
                    className={`${s.typewriter} w-full max-w-md border-0 border-b-2 border-ink bg-transparent px-1 py-2 text-2xl font-bold outline-none focus:border-crimson`}
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {GROUP_NAMES.map((g) => (
                      <button key={g} onClick={() => setGroupName(g)} className={`${s.chip} px-3.5 py-2.5 text-sm`} aria-pressed={groupName === g}>
                        {g}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Euer Leitspruch">
                  <ChipGroup label="Euer Leitspruch" className="grid gap-2 sm:grid-cols-2">
                    {MOTTOS.map((m) => (
                      <Chip key={m} checked={motto === m} onClick={() => setMotto(m)} className="px-4 py-3 font-serif text-lg">
                        „{m}“
                      </Chip>
                    ))}
                  </ChipGroup>
                </Field>
                <Field label="Dein Deckname">
                  <p className="mb-2 font-serif text-base text-sepia">
                    Im Widerstand benutzte man falsche Namen. Wer verhaftet wurde, konnte so die echten Namen der anderen nicht verraten.
                  </p>
                  <ChipGroup label="Dein Deckname">
                    {CODENAMES.slice(0, 8).map((c) => (
                      <Chip key={c} checked={codename === c} onClick={() => setCodename(c)} className="px-4 py-2.5">
                        {c}
                      </Chip>
                    ))}
                  </ChipGroup>
                </Field>
              </Section>

              <div className="flex flex-col items-start gap-3 border-t-2 border-ink pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-md font-serif text-base italic text-sepia">
                  {later
                    ? 'Seit drei Jahren arbeitet deine kleine Gruppe im Verborgenen. Drei Gefährten sind geblieben.'
                    : 'Drei Gefährten warten schon in deiner Küche. Ab heute bist du für sie verantwortlich.'}
                </p>
                <StampButton variant="ink" onClick={submit} className="w-full text-base sm:w-auto">
                  {later ? 'Weiter im Widerstand' : 'Die Gruppe gründen'}
                </StampButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
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
  children,
}: {
  checked: boolean
  onClick: () => void
  config: AvatarConfig
  children: ReactNode
}) {
  return (
    <Chip checked={checked} onClick={onClick} className="flex w-[124px] flex-col items-center gap-1.5 p-2">
      <Avatar config={config} size={72} title="" />
      <span className="text-center text-[13px] leading-tight break-words hyphens-auto">{children}</span>
    </Chip>
  )
}
