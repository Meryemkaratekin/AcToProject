import React, { useEffect, useState } from 'react'
import CityInput from '../components/ui/CityInput'
import EventCard from '../components/ui/EventCard'
import { CATEGORIES } from '../data/events'
import { useFilter } from '../hooks/useFilter'
import styles from './EventsPage.module.css'

export default function EventsPage({
  user,
  events,
  onJoin,
  onToggleFav,
  onRateEvent,
  showToast,
  openLogin,
}) {
  const { search, setSearch, city, setCity, category, setCategory, sort, setSort, filtered } =
    useFilter(events)
  const [isMobileCards, setIsMobileCards] = useState(false)
  const [visibleEventCount, setVisibleEventCount] = useState(3)
  const [desktopEventPage, setDesktopEventPage] = useState(0)

  const desktopPageSize = 6
  const desktopEventPages = Math.max(1, Math.ceil(filtered.length / desktopPageSize))
  const visibleEvents = isMobileCards
    ? filtered.slice(0, visibleEventCount)
    : filtered.slice(
        desktopEventPage * desktopPageSize,
        desktopEventPage * desktopPageSize + desktopPageSize,
      )

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)')
    const sync = () => {
      const mobile = media.matches
      setIsMobileCards(mobile)
      setVisibleEventCount(mobile ? 3 : filtered.length || desktopPageSize)
    }

    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [filtered.length])

  useEffect(() => {
    setDesktopEventPage(0)
    setVisibleEventCount(3)
  }, [search, city, category, sort, filtered.length])

  return (
    <main>
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div style={{ marginBottom: 28 }}>
          <span className="section-eyebrow">Kesfet</span>
          <h1 className="section-title" style={{ fontSize: 36 }}>
            Tum Etkinlikler
          </h1>
        </div>

        <div className={styles.filterRow}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>⌕</span>
            <input
              className="form-input"
              style={{ paddingLeft: 34 }}
              placeholder="Etkinlik, sehir, kategori..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <CityInput value={city} onChange={setCity} placeholder="Sehre gore filtrele..." />
          <select
            className="form-select"
            style={{ width: 'auto' }}
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="popular">En Populer</option>
            <option value="soon">En Yakin Tarih</option>
            <option value="filling">Dolmak Uzere</option>
          </select>
        </div>

        <div className="filter-bar">
          {CATEGORIES.map((item) => (
            <button
              key={item}
              className={`filter-chip ${category === item ? 'active' : ''}`}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <p className={styles.resultCount}>
          <strong>{filtered.length}</strong> etkinlik bulundu
          {city && (
            <>
              {' '}
              • <span className={styles.cityTag}>{city}</span>
            </>
          )}
        </p>

        {filtered.length > 0 ? (
          <>
            <div className={styles.grid}>
              {visibleEvents.map((ev, index) => (
                <EventCard
                  key={ev.id}
                  ev={ev}
                  user={user}
                  onJoin={onJoin}
                  onLogin={openLogin}
                  onToggleFav={onToggleFav}
                  onRateEvent={onRateEvent}
                  showToast={showToast}
                  index={index}
                />
              ))}
            </div>

            {!isMobileCards && desktopEventPages > 1 && (
              <div className={styles.desktopPager}>
                <button
                  type="button"
                  className={styles.desktopPagerBtn}
                  onClick={() => setDesktopEventPage((current) => Math.max(current - 1, 0))}
                  disabled={desktopEventPage === 0}
                >
                  ←
                </button>
                <span className={styles.desktopPagerLabel}>
                  {desktopEventPage + 1} / {desktopEventPages}
                </span>
                <button
                  type="button"
                  className={styles.desktopPagerBtn}
                  onClick={() =>
                    setDesktopEventPage((current) =>
                      Math.min(current + 1, desktopEventPages - 1),
                    )
                  }
                  disabled={desktopEventPage === desktopEventPages - 1}
                >
                  →
                </button>
              </div>
            )}

            {isMobileCards && visibleEventCount < filtered.length && (
              <button
                type="button"
                className={styles.mobileLoadMore}
                onClick={() =>
                  setVisibleEventCount((current) => Math.min(current + 3, filtered.length))
                }
              >
                <span>Daha fazla etkinlik goster</span>
                <span className={styles.mobileLoadMoreIcon}>↓</span>
              </button>
            )}
          </>
        ) : (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>⌕</div>
            <h3>Etkinlik bulunamadi</h3>
            <p>Farkli bir anahtar kelime veya sehir deneyin.</p>
          </div>
        )}
      </div>
    </main>
  )
}
