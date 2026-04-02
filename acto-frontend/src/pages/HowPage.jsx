import React from 'react'
import styles from './HowPage.module.css'

const STEPS = [
  {
    n: '01',
    icon: '◎',
    title: 'Niyetini tanımla',
    desc: 'Konum, ilgi alanı ve deneyim tipi seçerek sadece talebini belirtirsin. Organizasyon yükünü sisteme bırakırsın.',
  },
  {
    n: '02',
    icon: '✦',
    title: 'AI kümelenmesi başlar',
    desc: 'Demand-driven clustering motoru, benzer niyetleri davranışsal sinyaller ve lokasyon yakınlığı ile bir araya getirir.',
  },
  {
    n: '03',
    icon: '✓',
    title: 'Güven katmanı devreye girer',
    desc: 'Telefon doğrulaması, kimlik bilgisi ve trust score ile grup içindeki güven seviyesi yükseltilir.',
  },
  {
    n: '04',
    icon: '◆',
    title: 'Marketplace teklif verir',
    desc: 'Onaylı eğitmenler ve atölye sahipleri aktif gruplara profesyonel deneyim teklifleri gönderir.',
  },
  {
    n: '05',
    icon: '◌',
    title: 'Escrow ödeme açılır',
    desc: 'Ödeme etkinlik gerçekleşene kadar korumalı tutulur; iptal ve güven süreçleri daha profesyonel yürütülür.',
  },
  {
    n: '06',
    icon: '▲',
    title: 'Deneyim ve itibar kazan',
    desc: 'Katılımın tamamlandığında puanın güncellenir, profilin sosyal kimliğe dönüşür ve yeni tekliflerde daha görünür hale gelir.',
  },
]

const FAQS = [
  {
    q: 'ACTO neden klasik etkinlik platformlarından farklı?',
    a: 'Çünkü burada başlangıç noktası arz değil, taleptir. Kullanıcı etkinlik avlamak yerine niyet belirtir; sistem onun etrafında değer üretir.',
  },
  {
    q: 'Trust Score nasıl yükseliyor?',
    a: 'Doğrulama, etkinlik tamamlama, iptal davranışı ve topluluk geribildirimleri 0-1000 arası puanı etkiler.',
  },
  {
    q: 'Marketplace ve escrow neden önemli?',
    a: 'Hazır kümelere profesyonel teklif verilmesini ve ödeme güvenliğinin kullanıcı ile eğitmen için şeffaf şekilde korunmasını sağlar.',
  },
  {
    q: 'Kayıt olmayan kullanıcı giriş yapabilir mi?',
    a: 'Hayır. Sistem yalnızca kayıtlı ve doğrulama sürecine girmiş hesapların giriş yapmasına izin verir.',
  },
]

export default function HowPage() {
  return (
    <main>
      <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
        <div className={styles.header}>
          <span className="section-eyebrow">Nasıl Çalışır</span>
          <h1 className={styles.title}>ACTO: Yapay zeka destekli sosyal deneyim ekosistemi</h1>
          <p className={styles.sub}>
            Talebi güce, deneyimi güvene dönüştüren akış; akıllı kümelenme, dijital kimlik ve profesyonel marketplace katmanları üzerine kurulur.
          </p>
        </div>

        <div className={styles.stepsGrid}>
          {STEPS.map((step) => (
            <div key={step.n} className={styles.stepCard}>
              <div className={styles.stepNum}>ADIM {step.n}</div>
              <div className={styles.stepIcon}>{step.icon}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>

        <div className={styles.faqSection}>
          <h2 className={styles.faqTitle}>Sık Sorulan Sorular</h2>
          <div className={styles.faqList}>
            {FAQS.map((item, index) => (
              <div key={index} className={styles.faqItem}>
                <h4 className={styles.faqQ}>{item.q}</h4>
                <p className={styles.faqA}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
