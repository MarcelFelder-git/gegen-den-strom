import { WEEKS } from './weeks'

export type ChapterId = 1 | 2

export interface Chapter {
  id: ChapterId
  title: string
  years: string
  /** erste und letzte Woche als Index in WEEKS */
  first: number
  last: number
}

export const CHAPTERS: Record<ChapterId, Chapter> = {
  1: { id: 1, title: 'Kapitel 1. Das Jahr 1933', years: '1933', first: 0, last: 9 },
  2: { id: 2, title: 'Kapitel 2. 1936 bis 1938', years: '1936 bis 1938', first: 10, last: WEEKS.length - 1 },
}

export function chapterOf(weekIndex: number): Chapter {
  return weekIndex >= CHAPTERS[2].first ? CHAPTERS[2] : CHAPTERS[1]
}

export function weeksInChapter(ch: Chapter): number {
  return ch.last - ch.first + 1
}

/** Woche innerhalb des Kapitels, ab 1 gezählt */
export function weekInChapter(weekIndex: number): number {
  return weekIndex - chapterOf(weekIndex).first + 1
}

export function yearOf(weekIndex: number): number {
  return WEEKS[weekIndex]?.calendar.year ?? 1933
}
