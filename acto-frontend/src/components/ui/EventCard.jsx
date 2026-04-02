import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CAT_CLASS, CAT_EMOJI } from '../../data/events'
import styles from './EventCard.module.css'

export default function EventCard({
  ev,
  user,
  onLogin,
  onToggleFav,
  showToast,
  index = 0,
}) {
  const navigate = useNavigate()
  const joined = user?.joined?.includes(ev.id)
  const fav = !!user?.favoriteEventIds?.includes(ev.id)
  const currentCount = Number(ev.current) || 0
  const totalCount = Number(ev.total) || 1
  const pct = Math.max(0, Math.min(100, Math.round((currentCount / totalCount) * 100)))
  const price = ev.price || 'Teklif sonrasi'
  const title = ev.title || 'Yeni etkinlik'
  const category = ev.category || 'Etkinlik'
  const location = [ev.district || ev.city, ev.city].filter(Boolean).join(', ')
  const initials =
    Array.isArray(ev.initials) && ev.initials.length > 0
      ? ev.initials
      : title
          .split(' ')
          .filter(Boolean)
          .slice(0, 3)
          .map((part) => part[0]?.toUpperCase() || 'A')

  function handleJoin() {
    if (!user) {
      onLogin?.()
      return
    }

    if (joined) return
    navigate(`/events/${ev.id}/join`)
  }

  function toggleFav(event) {
    event.stopPropagation()

    if (!user) {
      onLogin?.()
      showToast?.('Favorilere eklemek icin giris yapmalisin.')
      return
    }

    onToggleFav?.(ev.id)
    showToast?.(fav ? 'Favorilerden cikarildi.' : 'Favorilere eklendi.')
  }

  return (
    <article className={styles.card} style={{ animationDelay: `${index * 90}ms` }}>
      <div className={styles.imgWrap}>
        {ev.img ? (
          <img src={ev.img} alt={title} loading="lazy" className={styles.img} />
        ) : (
          <div className={styles.imgPlaceholder}>{CAT_EMOJI[category] || '*'}</div>
        )}

        <span className={`${styles.catBadge} ${CAT_CLASS[category] || ''}`}>{category}</span>

        <button type="button" className={styles.fav} onClick={toggleFav} aria-label="Favori">
          {fav ? '♥' : '♡'}
        </button>
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.loc}>📍 {location}</p>
        <div className={styles.priceBadge}>Escrow: {price}</div>

        <div className={styles.progressInfo}>
          <span>
            <strong>{currentCount + (joined ? 1 : 0)}</strong>/{totalCount} katilimci
          </span>
          <span>%{pct}</span>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>

        <div className={styles.footer}>
          <div className={styles.footerLeft}>
            <div className={styles.avatars}>
              {initials.map((initial, avatarIndex) => (
                <div key={`${initial}-${avatarIndex}`} className={styles.avatar}>
                  {initial}
                </div>
              ))}
            </div>
            <span className={styles.date}>🗓 {ev.date}</span>
          </div>

          <button
            type="button"
            className={`${styles.joinBtn} ${joined ? styles.joined : styles.primary}`}
            onClick={handleJoin}
          >
            {joined ? 'Katildin' : 'Ben de Varim'}
          </button>
        </div>
      </div>
    </article>
  )
}
