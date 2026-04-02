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
              Yapay Zeka Destekli Sosyal Deneyim Ekosistemi.<br />
              Niyet beyan et, deneyimi birlikte yarat.
            </p>
          </div>
          <div className={styles.col}>
            <h4>Platform</h4>
            <NavLink to="/events">Etkinlikler</NavLink>
            <NavLink to="/how">Nasıl Çalışır</NavLink>
            <NavLink to="/create">Oluştur</NavLink>
            <a>ACTO Plus</a>
          </div>
          <div className={styles.col}>
            <h4>Şirket</h4>
            <a>Hakkımızda</a>
            <a>Blog</a>
            <a>Kariyer</a>
            <a>Basın</a>
          </div>
          <div className={styles.col}>
            <h4>Destek</h4>
            <a>Yardım Merkezi</a>
            <a>İletişim</a>
            <a>Gizlilik Politikası</a>
            <a>Kullanım Şartları</a>
          </div>
        </div>

        <div className={styles.bottom}>
          <span className={styles.copy}>© 2025 ACTO Platform — Tüm hakları saklıdır.</span>
          <span className={styles.tech}>⚛️ React + Vite + React Router</span>
        </div>
      </div>
    </footer>
  )
}
