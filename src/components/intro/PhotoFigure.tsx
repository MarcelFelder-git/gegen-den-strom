import type { Photo } from '../../game/data/photos'
import c from './intro.module.css'

/** Ein echtes Foto mit Bildunterschrift und Quellenangabe */
export function PhotoFigure({ photo, className = '', ratio = 'aspect-[4/3]' }: { photo: Photo; className?: string; ratio?: string }) {
  return (
    <figure className={`m-0 ${className}`}>
      <div className={`${c.photo} ${ratio}`}>
        <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
      </div>
      <figcaption className="mt-2 font-serif text-sm leading-snug text-paper/85 italic">
        {photo.caption}
        <span className="mt-0.5 block font-type text-[13px] text-fog not-italic">
          Foto: {photo.credit}, {photo.license}
        </span>
      </figcaption>
    </figure>
  )
}
