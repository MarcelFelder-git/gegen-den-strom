import { L, type Txt } from "../text";
import type { Effects, Inventory, Mission, MissionResult } from "../types";
import { MISSIONS } from "./missions";
import { canAfford } from "../logic";

/**
 * Jede Woche ein kleines Ziel. Wer es schafft, bekommt eine Belohnung im Wochenbericht.
 * Die Ziele lenken den Blick darauf, worum es im Widerstand ging: anderen beistehen,
 * vorsichtig sein, Menschen erreichen.
 */
export interface WeekGoal {
  id: string;
  text: Txt;
  reward: Effects;
  rewardText: Txt;
  met: (r: { results: MissionResult[]; helpedDelta: number }) => boolean;
}

const helfen: WeekGoal = {
  id: "helfen",
  text: L(
    "Helft in dieser Woche mindestens einem Menschen, der verfolgt wird.",
    "Helft in dieser Woche mindestens einem verfolgten oder bedrängten Menschen.",
  ),
  reward: { moral: 5 },
  rewardText: L(
    "Ihr habt nicht weggesehen. Das gibt allen Kraft.",
    "Ihr habt nicht weggesehen. Das stärkt den Zusammenhalt der Gruppe.",
  ),
  met: (r) => r.helpedDelta > 0,
};

const unentdeckt: WeekGoal = {
  id: "unentdeckt",
  text: L(
    "Schafft einen Auftrag, ohne dass euch jemand sieht.",
    "Führt mindestens einen Auftrag erfolgreich aus, ohne entdeckt zu werden.",
  ),
  reward: { supporters: 2 },
  rewardText: L(
    "Niemand hat euch gesehen. Zwei Menschen wollen jetzt mitmachen.",
    "Eure Vorsicht zahlt sich aus: Zwei neue Unterstützer vertrauen euch.",
  ),
  met: (r) => r.results.some((x) => x.outcome === "gelungen" && !x.detected),
};

const vorsichtig: WeekGoal = {
  id: "vorsichtig",
  text: L(
    "Kommt diese Woche ohne Verhaftung durch.",
    "Kommt durch diese Woche, ohne dass jemand aus der Gruppe verhaftet wird.",
  ),
  reward: { moral: 4 },
  rewardText: L(
    "Alle sind noch da. Ihr passt gut aufeinander auf.",
    "Alle sind noch da. Eure Regeln haben euch geschützt.",
  ),
  met: (r) =>
    r.results.length > 0 && r.results.every((x) => x.arrested.length === 0),
};

/**
 * Geplante Ziele über die 18 Wochen beider Kapitel. „Helfen“ erst ab Woche 3 (Index 2):
 * Vorher gibt es noch keinen Auftrag, der Verfolgten hilft.
 */
const ORDER: WeekGoal[] = [
  unentdeckt,
  vorsichtig,
  helfen,
  unentdeckt,
  helfen,
  helfen,
  vorsichtig,
  helfen,
  unentdeckt,
  helfen,
  helfen,
  helfen,
  unentdeckt,
  helfen,
  vorsichtig,
  helfen,
  helfen,
  helfen,
];

const GOALS: Record<string, WeekGoal> = { helfen, unentdeckt, vorsichtig };

/** Das geplante Ziel einer Woche, ohne Rücksicht auf die Lage der Gruppe */
export function weekGoal(weekIndex: number): WeekGoal {
  return ORDER[weekIndex] ?? helfen;
}

/** Das Ziel, das in dieser Woche gilt. Ältere Spielstände ohne gespeichertes Ziel bekommen das geplante. */
export function goalById(id: string | undefined, weekIndex: number): WeekGoal {
  return (id && GOALS[id]) || weekGoal(weekIndex);
}

/**
 * Ein Ziel muss erreichbar sein. Gibt es in dieser Woche keinen bezahlbaren Auftrag, der
 * Verfolgten hilft, gilt stattdessen „unbemerkt“: Spenden sammeln kostet nichts und gibt es jede Woche.
 */
export function chooseGoal(
  weekIndex: number,
  missions: Mission[],
  kasse: number,
  inventory: Inventory,
): WeekGoal {
  const planned = weekGoal(weekIndex);
  if (planned.id !== "helfen") return planned;
  const canHelp = missions.some(
    (m) => MISSIONS[m.type].solidarity && canAfford(MISSIONS[m.type], kasse, inventory),
  );
  return canHelp ? planned : unentdeckt;
}
