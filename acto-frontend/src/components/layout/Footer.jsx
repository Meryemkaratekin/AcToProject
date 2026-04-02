import React from 'react'
import { NavLink } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <div className={styles.logo}>ACTO</div>
            <p className={styles.tagline}>
              Yapay Zeka Destekli Sosyal Deneyim Ekosistemi.
              <br />
              Niyet beyan et, deneyimi birlikte yarat.
            </p>
            <p className={styles.statusNote}>
              Backend kismi gelistiriliyor.
              <br />
              Backend is currently under development.
            </p>
          </div>

          <div className={styles.col}>
            <h4>Platform</h4>
            <NavLink to="/events">Etkinlikler</NavLink>
            <NavLink to="/how">Nasil Calisir</NavLink>
            <NavLink to="/create">Olustur</NavLink>
            <a>ACTO Plus</a>
          </div>

          <div className={styles.col}>
            <h4>Sirket</h4>
            <a>Hakkimizda</a>
            <a>Blog</a>
            <a>Kariyer</a>
            <a>Basin</a>
          </div>

          <div className={styles.col}>
            <h4>Destek</h4>
            <a>Yardim Merkezi</a>
            <a>Iletisim</a>
            <a href="mailto:meryemkaratekin40@gmail.com">meryemkaratekin40@gmail.com</a>
            <a>Gizlilik Politikasi</a>
            <a>Kullanim Sartlari</a>
          </div>
        </div>

        <div className={styles.bottom}>
          <span className={styles.copy}>© 2025 ACTO Platform • Tum haklari saklidir.</span>
          <span className={styles.tech}>React + Vite + React Router</span>
        </div>
      </div>
    </footer>
  )
}
