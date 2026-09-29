import { useEffect, useRef, type ReactNode } from 'react'

interface ModalProps {
  label: string
  onClose?: () => void
  children: ReactNode
  /** Breite des Inhalts, als Tailwind-Klasse */
  width?: string
  /** Oben verankern statt mittig, damit sich der Inhalt beim Blättern nicht verschiebt */
  top?: boolean
}

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'

/** Zugänglicher Dialog: Escape schließt, der Fokus bleibt im Dialog */
export function Modal({ label, onClose, children, width = 'max-w-3xl', top = false }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const root = ref.current
    const first = root?.querySelector<HTMLElement>('[data-autofocus]:not([disabled])') ?? root?.querySelector<HTMLElement>(FOCUSABLE)
    first?.focus({ preventScroll: true })
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        e.stopPropagation()
        onClose()
      }
      if (e.key !== 'Tab' || !root) return
      const items = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (items.length === 0) return
      const [head, tail] = [items[0], items[items.length - 1]]
      if (e.shiftKey && document.activeElement === head) {
        e.preventDefault()
        tail.focus()
      } else if (!e.shiftKey && document.activeElement === tail) {
        e.preventDefault()
        head.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      previous?.focus?.({ preventScroll: true })
    }
  }, [onClose])

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 ${top ? 'bg-black/90 pt-0 pb-6' : 'bg-black/75 py-6 sm:py-10'}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.()
      }}
    >
      <div ref={ref} role="dialog" aria-modal="true" aria-label={label} className={`relative w-full ${top ? '' : 'my-auto'} ${width}`}>
        {children}
      </div>
    </div>
  )
}
