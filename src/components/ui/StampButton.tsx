import type { ComponentProps } from 'react'
import s from '../../styles/period.module.css'

type Variant = 'paper' | 'ink' | 'blood' | 'quiet'

const VARIANTS: Record<Variant, string> = {
  paper: s.stamp,
  ink: s.stampInk,
  blood: s.stampBlood,
  quiet: s.stampQuiet,
}

interface StampButtonProps extends ComponentProps<'button'> {
  variant?: Variant
}

/** Knopf im Stil einer gestempelten Karteikarte */
export function StampButton({ variant = 'paper', className = '', type = 'button', ...rest }: StampButtonProps) {
  return <button type={type} className={`${VARIANTS[variant]} ${className}`} {...rest} />
}
