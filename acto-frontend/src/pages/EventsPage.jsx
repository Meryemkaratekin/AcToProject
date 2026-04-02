import React from 'react'
import CityInput from '../components/ui/CityInput'
import EventCard from '../components/ui/EventCard'
import { CATEGORIES } from '../data/events'
import { useFilter } from '../hooks/useFilter'
import styles from './EventsPage.module.css'

export default function EventsPage({ user, events, onJoin, onToggleFav, showToast, openLogin }) {
  const { search, setSearch, city, setCity, category, setCategory, sort, setSort, filtered } = useFilter(events)

  return (
    <main>
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div style={{ marginBottom: 28 }}>
          <span className="section-eyebrow">Keşfet</span>
          <h1 className="section-title" style={{ fontSize: 36 }}>
            Tüm Etkinlikler
          </h1>
        </div>

        <div className={styles.filterRow}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>⌕</span>
            <input
              className="form-input"
              style={{ paddingLeft: 34 }}
              placeholder="Etkinlik, şehir, kategori..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <CityInput value={city} onChange={setCity} placeholder="Şehre göre filtrele..." />
          <select className="form-select" style={{ width: 'auto' }} value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="popular">En Popüler</option>
            <option value="soon">En Yakın Tarih</option>
            <option value="filling">Dolmak Üzere</option>
          </select>
        </div>

        <div className="filter-bar">
          {CATEGORIES.map((item) => (
            <button key={item} className={`filter-chip ${category === item ? 'active' : ''}`} onClick={() => setCategory(item)}>
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
          <div className={styles.grid}>
            {filtered.map((ev, index) => (
              <EventCard
                key={ev.id}
                ev={ev}
                user={user}
                onJoin={onJoin}
                onLogin={openLogin}
                onToggleFav={onToggleFav}
                showToast={showToast}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>⌕</div>
            <h3>Etkinlik bulunamadı</h3>
            <p>Farklı bir anahtar kelime veya şehir deneyin.</p>
          </div>
        )}
      </div>
    </main>
  )
}
