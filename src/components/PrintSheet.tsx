import { getProfession, getIdeology } from '../game/data/professions'
import { MISSIONS } from '../game/data/missions'
import { TOTAL_WEEKS, WEEKS } from '../game/data/weeks'
import { useGame } from '../store/GameStore'
import { getCard } from '../game/data/cards'
import { quoted } from '../game/data/group'

const QUESTIONS = [
  'Welche Entscheidung ist dir im Spiel am schwersten gefallen? Warum?',
  'Die Zeitung berichtete über die Lager und die Verhaftungen. Warum haben trotzdem so wenige Menschen widersprochen?',
  'Was bedeutet es heute, nicht wegzusehen, wenn andere ausgegrenzt werden?',
]

const END_TITLE = { kapitelende: 'Das erste Kapitel überstanden', moral: 'Die Gruppe ist zerbrochen', verhaftet: 'Verhaftet' }

/**
 * Das Abschlussblatt für den Unterricht. Es ist nur beim Drucken sichtbar
 * und bewusst schlicht gehalten: schwarz auf weiß, gut lesbar, sparsam mit Toner.
 */
export function PrintSheet() {
  const { members, decisions, history, supporters, moral, endReason, profession, ideology, sourceAnswers, cards, groupName, motto } = useGame()
  const answers = Object.values(sourceAnswers)
  const heroes = cards.map((id) => getCard(id)?.name).filter(Boolean)
  const leader = members.find((m) => m.isLeader)
  const results = history.flatMap((h) => h.results)

  return (
    <section className="print-sheet" aria-hidden>
      <header style={{ borderBottom: '2px solid #000', paddingBottom: '6mm', marginBottom: '6mm' }}>
        <p style={{ fontSize: '9pt', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Gegen den Strom. Berlin 1933</p>
        <h1 style={{ fontSize: '22pt', fontWeight: 700, margin: '2mm 0' }}>Abschlussblatt</h1>
        <p style={{ fontSize: '11pt' }}>
          Name: ______________________ &nbsp; Klasse: ________ &nbsp; Datum: ______________
        </p>
      </header>

      <h2 style={h2}>Meine Spielfigur</h2>
      <p style={p}>
        {leader?.name}, {leader ? getProfession(profession).label[leader.avatar.gender] : ''}, {getIdeology(ideology).label.toLowerCase()}.
        {' '}Ergebnis: <strong>{endReason ? END_TITLE[endReason] : 'noch nicht beendet'}</strong> nach {history.length} von{' '}
        {TOTAL_WEEKS} Wochen (beide Kapitel). Unterstützer: {supporters}. Moral zuletzt: {moral} %. Gelungene Aufträge: {results.filter((r) => r.outcome === 'gelungen').length} von {results.length}.
      </p>

      <h2 style={h2}>Quellen und Vorbilder</h2>
      <p style={p}>
        Quellenaufgaben richtig beantwortet: {answers.filter(Boolean).length} von {answers.length}. Entdeckte Vorbilder:{' '}
        {heroes.length ? heroes.join(', ') : 'noch keine'}.
      </p>
      <p style={p}>Welches Vorbild hat dich am meisten beeindruckt? Warum? ______________________________________________</p>

      <h2 style={h2}>Meine Widerstandsgruppe: {quoted(groupName)}</h2>
      <p style={p}>Leitspruch: „{motto}“</p>
      <p style={p}>
        {members
          .filter((m) => !m.isLeader)
          .map((m) => `${m.name}, Deckname ${m.codename ?? 'unbekannt'} (${m.beruf}${m.status === 'verhaftet' ? ', verhaftet' : m.status === 'ausgewandert' ? ', ausgewandert' : ''})`)
          .join('; ')}
      </p>

      <h2 style={h2}>Meine Entscheidungen</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9.5pt' }}>
        <thead>
          <tr>
            <th style={th}>Woche</th>
            <th style={th}>Situation</th>
            <th style={th}>Meine Wahl</th>
            <th style={th}>Was geschah</th>
          </tr>
        </thead>
        <tbody>
          {decisions.map((d, i) => (
            <tr key={i}>
              <td style={td}>{WEEKS[d.weekIndex].calendar.day}. {WEEKS[d.weekIndex].calendar.month}</td>
              <td style={td}>
                {d.title}
                {d.companion ? ` (${d.companion})` : ''}
              </td>
              <td style={td}>{d.choice.replace(/[„“]/g, '')}</td>
              <td style={td}>{d.result}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={h2}>Unsere Einsätze</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9.5pt' }}>
        <tbody>
          {history.map((h) => (
            <tr key={h.weekIndex}>
              <td style={{ ...td, width: '22%' }}>{WEEKS[h.weekIndex].dateLabel}</td>
              <td style={td}>
                {h.results.length === 0
                  ? 'Die Gruppe hat stillgehalten.'
                  : h.results
                      .map((r) => `${MISSIONS[r.type].title}: ${r.detected ? 'entdeckt' : r.outcome}`)
                      .join('; ')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ ...h2, breakBefore: 'page' }}>Zum Nachdenken</h2>
      {QUESTIONS.map((q, i) => (
        <div key={q} style={{ marginBottom: '6mm' }}>
          <p style={{ ...p, fontWeight: 700 }}>
            {i + 1}. {q}
          </p>
          {[0, 1, 2, 3].map((l) => (
            <div key={l} style={{ borderBottom: '1px solid #777', height: '8mm' }} />
          ))}
        </div>
      ))}

      <p style={{ fontSize: '8.5pt', marginTop: '8mm', borderTop: '1px solid #000', paddingTop: '2mm' }}>
        Die Menschen in diesem Spiel sind erfunden. Die Ereignisse, von denen die Zeitung berichtet, haben sich wirklich zugetragen.
      </p>
    </section>
  )
}

const h2 = { fontSize: '13pt', fontWeight: 700, margin: '6mm 0 2mm', borderBottom: '1px solid #000' } as const
const p = { fontSize: '10.5pt', lineHeight: 1.45, margin: '0 0 2mm' } as const
const th = { textAlign: 'left', borderBottom: '1.5px solid #000', padding: '1.5mm 2mm', verticalAlign: 'bottom' } as const
const td = { borderBottom: '1px solid #bbb', padding: '1.5mm 2mm', verticalAlign: 'top' } as const
