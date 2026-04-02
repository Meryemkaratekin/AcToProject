import React, { useEffect, useRef, useState } from 'react'
import { CITIES, CITIES_DATA } from '../../data/cities'
import styles from './CityInput.module.css'

export default function CityInput({
  value,
  onChange,
  placeholder = 'Sehir ara...',
}) {
  const [q, setQ] = useState(value || '')
  const [open, setOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState(null)
  const ref = useRef(null)

  const filteredCities =
    q.length > 0
      ? CITIES.filter((city) => city.toLowerCase().includes(q.toLowerCase()))
      : CITIES

  const districts = selectedCity ? CITIES_DATA[selectedCity] || [] : []

  useEffect(() => {
    setQ(value || '')
  }, [value])

  useEffect(() => {
    const handler = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function handleSelectCity(city) {
    setSelectedCity(city)
    setQ(city)
    setOpen(true)
    onChange(city)
  }

  function handleSelectDistrict(district) {
    const fullLocation = `${selectedCity}, ${district}`
    setQ(fullLocation)
    onChange(fullLocation)
    setOpen(false)
  }

  function toggleOpen() {
    setOpen((prev) => !prev)
  }

  return (
    <div ref={ref} className={styles.wrap}>
      <div className={styles.control}>
        <input
          className="form-input"
          placeholder={placeholder}
          value={q}
          autoComplete="off"
          onChange={(event) => {
            const val = event.target.value
            setQ(val)
            setOpen(true)
            if (!val.includes(',')) {
              setSelectedCity(null)
              onChange(val)
            }
          }}
          onFocus={() => setOpen(true)}
        />
        <button type="button" className={styles.toggle} onClick={toggleOpen} aria-label="Sehir sec">
          {open ? '▲' : '▼'}
        </button>
      </div>

      {open && (filteredCities.length > 0 || selectedCity) && (
        <ul className={styles.list}>
          {filteredCities.length > 0 && (
            <>
              <li className={styles.groupTitle}>Sehirler</li>
              {filteredCities.map((city) => (
                <li
                  key={city}
                  className={`${styles.item} ${selectedCity === city ? styles.active : ''}`}
                  onClick={() => handleSelectCity(city)}
                >
                  <span className={styles.icon}>•</span> {city}
                </li>
              ))}
            </>
          )}
          {selectedCity && districts.length > 0 && (
            <>
              <li className={styles.groupTitle}>{selectedCity} Ilceleri</li>
              {districts.map((district) => (
                <li key={district} className={styles.item} onClick={() => handleSelectDistrict(district)}>
                  <span className={styles.icon}>→</span> {district}
                </li>
              ))}
            </>
          )}
        </ul>
      )}
    </div>
  )
}
