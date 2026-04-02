import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CAT_CLASS, CAT_EMOJI } from '../../data/events'
import styles from './EventCard.module.css'

const DEFAULT_PROGRAM = {
  'MÃ¼zik': [
    { time: '19:00', label: 'Karsilama ve check-in' },
    { time: '19:30', label: 'Ana performans / set' },
    { time: '21:15', label: 'Networking ve kapanis' },
  ],
  Yemek: [
    { time: '11:00', label: 'Toplanma ve tanisma' },
    { time: '11:30', label: 'Tadim rotasi baslangici' },
    { time: '13:00', label: 'Serbest sohbet ve kapanis' },
  ],
  Spor: [
    { time: '08:00', label: 'Isinma ve ekip eslesmesi' },
    { time: '08:20', label: 'Ana aktivite' },
    { time: '09:15', label: 'Soguma ve degerlendirme' },
  ],
  Sanat: [
    { time: '18:30', label: 'Karsilama ve brief' },
    { time: '19:00', label: 'Atolye / performans akisi' },
    { time: '20:30', label: 'Paylasim ve kapanis' },
  ],
  Teknoloji: [
    { time: '10:00', label: 'Acis ve tanisma' },
    { time: '10:20', label: 'Sunum / workshop' },
    { time: '12:00', label: 'Soru cevap ve networking' },
  ],
  'DoÄŸa': [
    { time: '07:30', label: 'Toplanma ve ekipman kontrolu' },
    { time: '08:00', label: 'Rota baslangici' },
    { time: '11:00', label: 'Mola ve donus' },
  ],
  Workshop: [
    { time: '13:00', label: 'Kayit ve materyal dagitimi' },
    { time: '13:30', label: 'Uygulamali oturum' },
    { time: '16:00', label: 'Sunum ve kapanis' },
  ],
}

const COMPLETED_EVENT_IDS = new Set([1, 2])
const RATING_BY_EVENT = {
  1: 4.8,
  2: 4.6,
}

export default function EventCard({
  ev,
  user,
  onLogin,
  onToggleFav,
  onRateEvent,
  showToast,
  index = 0,
}) {
  const navigate = useNavigate()
  const userRating = user?.ratedEvents?.[ev.id] || ev.userRating || 0
  const [rating, setRating] = useState(userRating)
  const joined = user?.joined?.includes(ev.id)
  const fav = !!user?.favoriteEventIds?.includes(ev.id)
  const currentCount = Number(ev.current) || 0
  const totalCount = Number(ev.total) || 1
  const pct = Math.max(0, Math.min(100, Math.round((currentCount / totalCount) * 100)))
  const price = ev.price || 'Teklif sonrasi'
  const title = ev.title || 'Yeni etkinlik'
  const category = ev.category || 'Etkinlik'
  const content = ev.content || ev.description || 'Etkinlik detaylari yakinda paylasilacak.'
  const program =
    Array.isArray(ev.program) && ev.program.length > 0
      ? ev.program
      : DEFAULT_PROGRAM[category] || DEFAULT_PROGRAM.Workshop
  const isCompleted = Boolean(ev.completed) || COMPLETED_EVENT_IDS.has(ev.id)
  const averageRating = ev.averageRating || RATING_BY_EVENT[ev.id] || 4.7
  const location = [ev.district || ev.city, ev.city].filter(Boolean).join(', ')
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
  const canRate = joined && isCompleted
  const initials =
    Array.isArray(ev.initials) && ev.initials.length > 0
      ? ev.initials
      : title
          .split(' ')
          .filter(Boolean)
          .slice(0, 3)
          .map((part) => part[0]?.toUpperCase() || 'A')

  useEffect(() => {
    setRating(userRating)
  }, [userRating])

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
        <p className={styles.content}>{content}</p>

        <div className={styles.progressInfo}>
          <span>
            <strong>{currentCount + (joined ? 1 : 0)}</strong>/{totalCount} katilimci
          </span>
          <span>%{pct}</span>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>

        <div className={styles.programBox}>
          <div className={styles.programHead}>
            <strong>Program akisi</strong>
            <span>{isCompleted ? 'Tamamlandi' : 'Yaklasan akis'}</span>
          </div>

          <div className={styles.programList}>
            {program.map((item) => (
              <div key={`${ev.id}-${item.time}-${item.label}`} className={styles.programItem}>
                <span className={styles.programTime}>{item.time}</span>
                <span className={styles.programLabel}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {isCompleted && (
          <div className={styles.ratingBox}>
            <div className={styles.ratingHead}>
              <strong>Etkinlik puani</strong>
              <span>Ortalama {averageRating.toFixed(1)}/5</span>
            </div>

            <div className={styles.starRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`${styles.starBtn} ${star <= rating ? styles.starBtnActive : ''}`}
                  onClick={() => {
                    if (!canRate) {
                      showToast?.('Puan verme sadece katildigin ve tamamlanan etkinliklerde acilir.')
                      return
                    }
                    setRating(star)
                    onRateEvent?.(ev.id, star)
                    showToast?.(`Puaniniz kaydedildi: ${star}/5`)
                  }}
                  aria-label={`${star} puan ver`}
                >
                  ★
                </button>
              ))}
            </div>

            <p className={styles.ratingText}>
              {rating > 0
                ? `Senin puanin: ${rating}/5`
                : canRate
                  ? 'Etkinlik tamamlandi. Deneyimini puanlayabilirsin.'
                  : 'Puan verme sadece katildigin tamamlanan etkinliklerde acilir.'}
            </p>
          </div>
        )}

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

          <div className={styles.footerActions}>
            <a href={mapsUrl} target="_blank" rel="noreferrer" className={styles.mapLink}>
              Haritada Ac
            </a>
            <button
              type="button"
              className={`${styles.joinBtn} ${joined ? styles.joined : styles.primary}`}
              onClick={handleJoin}
            >
              {joined ? 'Katildin' : 'Ben de Varim'}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
