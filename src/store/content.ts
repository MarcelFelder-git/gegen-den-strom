import { useCallback } from 'react'
import { MISSIONS } from '../game/data/missions'
import { WEEKS } from '../game/data/weeks'
import { resolve, t, type Level, type Txt } from '../game/text'
import { difficultyOf } from '../game/difficulty'
import { useGame } from './GameStore'

/** Die Schwierigkeitsstufe des laufenden Spiels */
export const useLevel = (): Level => useGame((g) => g.level)

export const useDifficulty = () => difficultyOf(useLevel())

/** Löst zweistufige Texte in der Stufe des laufenden Spiels auf */
export function useR() {
  const level = useLevel()
  return useCallback(<T,>(value: T) => resolve(value, level), [level])
}

/** Ein einzelner Text in der Stufe des laufenden Spiels */
export function useT() {
  const level = useLevel()
  return useCallback((value: Txt) => t(value, level), [level])
}

/** Alle Aufträge mit Texten in der gewählten Stufe */
export const useMissions = () => resolve(MISSIONS, useLevel())

/** Alle Wochen mit Texten in der gewählten Stufe */
export const useWeeks = () => resolve(WEEKS, useLevel())
