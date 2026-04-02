import React, { useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CityInput from '../components/ui/CityInput'
import { CATEGORIES, CAT_CLASS } from '../data/events'
import styles from './CreatePage.module.css'

export default function CreatePage({ user, showToast, addEvent }) {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const fileInputId = useId()
  const [type, setType] = useState('event')
  const [selectedFileName, setSelectedFileName] = useState('')
  const [form, setForm] = useState({
    title: '',
    category: 'Müzik',
    city: '',
    district: '',
    date: '',
    total: 20,
    description: '',
    img: '',
    threshold: 5,
    trainerOffer: '',
    price: '',
  })

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  function handleImageUpload(event) {
    const file = event.target.files?.[0]
    if (!file) return

    setSelectedFileName(file.name)
    const reader = new FileReader()
    reader.onload = () => set('img', reader.result)
    reader.onerror = () => showToast('Görsel yüklenirken bir hata oluştu.')
    reader.readAsDataURL(file)
  }

  function handleSubmit() {
    if (!form.title || !form.city || !form.date || !form.description) {
      showToast('Lütfen zorunlu alanları eksiksiz doldurun.')
      return
    }

    const newEvent = {
      id: Date.now(),
      title: form.title,
      category: form.category,
      city: form.city,
      district: form.district || form.city,
      current: 1,
      total: parseInt(form.total, 10) || 20,
      date: form.date,
      img: form.img || '',
      initials: [user.name[0]],
      description: form.description,
      threshold: parseInt(form.threshold, 10) || 5,
      ownerEmail: user.email,
      trainerOffer: form.trainerOffer,
      price: form.price || 'Teklif sonrası',
    }

    addEvent(newEvent)
    showToast(`"${form.title}" başarıyla oluşturuldu.`)
    navigate('/profile')
  }

  return (
    <main>
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div className={styles.header}>
          <span className="section-eyebrow">Demand-Driven Marketplace</span>
          <h1 className={styles.title}>Yeni sosyal deneyim talebi oluştur</h1>
          <p className={styles.sub}>
            Talep eşiğini, güven katmanını, profesyonel ödeme modelini ve etkinlik görselini tek akışta tanımla.
          </p>
        </div>

        <div className={styles.typeRow}>
          {[
            ['event', 'Topluluk Etkinliği'],
            ['workshop', 'Profesyonel Workshop'],
          ].map(([value, label]) => (
            <button key={value} className={`filter-chip ${type === value ? 'active' : ''}`} onClick={() => setType(value)}>
              {label}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          <div className={styles.formCol}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}><span className={styles.step}>1</span>Temel Bilgiler</h3>
              <div className="form-group">
                <label className="form-label">Talep Başlığı *</label>
                <input className="form-input" placeholder="Örn. Gün Doğumu Yoga Buluşması" value={form.title} onChange={(event) => set('title', event.target.value)} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Kategori</label>
                  <select className="form-select" value={form.category} onChange={(event) => set('category', event.target.value)}>
                    {CATEGORIES.filter((item) => item !== 'Tümü').map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Maks. Katılımcı</label>
                  <input className="form-input" type="number" min="2" max="500" value={form.total} onChange={(event) => set('total', event.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Açıklama *</label>
                <textarea className="form-textarea" placeholder="Deneyimin hedefini, beklentisini ve topluluk yapısını anlat..." value={form.description} onChange={(event) => set('description', event.target.value)} />
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}><span className={styles.step}>2</span>Lokasyon ve Eşik</h3>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Şehir *</label>
                  <CityInput value={form.city} onChange={(value) => set('city', value)} placeholder="Şehir seç..." />
                </div>
                <div className="form-group">
                  <label className="form-label">İlçe / Semt</label>
                  <input className="form-input" placeholder="Kadıköy, Çankaya..." value={form.district} onChange={(event) => set('district', event.target.value)} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Talep Eşiği</label>
                  <input className="form-input" type="number" min="2" max="50" value={form.threshold} onChange={(event) => set('threshold', event.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Tarih *</label>
                  <input className="form-input" type="date" value={form.date} onChange={(event) => set('date', event.target.value)} style={{ colorScheme: 'light' }} />
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}><span className={styles.step}>3</span>Ödeme ve Görsel</h3>
              <div className={styles.paymentFlow}>
                <div className={styles.paymentStepCard}>
                  <strong>1. Rezervasyon</strong>
                  <span>Katılımcı yerini ayırır.</span>
                </div>
                <div className={styles.paymentStepCard}>
                  <strong>2. Escrow Koruması</strong>
                  <span>Ödeme güvenli şekilde sistemde tutulur.</span>
                </div>
                <div className={styles.paymentStepCard}>
                  <strong>3. Onaylı Aktarım</strong>
                  <span>Etkinlik sonrası profesyonel sağlayıcıya aktarılır.</span>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Eğitmen / Atölye Notu</label>
                  <input className="form-input" placeholder="Onaylı eğitmen teklifi bekleniyor..." value={form.trainerOffer} onChange={(event) => set('trainerOffer', event.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Tahmini Kişi Başı Ücret</label>
                  <input className="form-input" placeholder="650 TL" value={form.price} onChange={(event) => set('price', event.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Talep Görseli</label>
                <label htmlFor={fileInputId} className={styles.uploadZone}>
                  <div className={styles.uploadIcon}>+</div>
                  <div className={styles.uploadTxt}>{selectedFileName || 'Etkinlik fotoğrafı yükle'}</div>
                </label>
                <input
                  id={fileInputId}
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                />
              </div>
              <div className="form-group">
                <label className="form-label">İstersen URL ile de görsel ekleyebilirsin</label>
                <input className="form-input" placeholder="https://..." value={typeof form.img === 'string' && form.img.startsWith('http') ? form.img : ''} onChange={(event) => set('img', event.target.value)} />
              </div>
            </div>

            <button className="btn-amber" style={{ width: '100%', padding: 15, fontSize: 15, fontWeight: 700, borderRadius: 'var(--r)' }} onClick={handleSubmit}>
              Güvenli Talep Oluştur
            </button>
          </div>

          <div>
            <div className={styles.preview}>
              <h3 className={styles.previewTitle}>Canlı Önizleme</h3>
              <div className={styles.previewImg}>
                {form.img ? <img src={form.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 28, color: 'var(--amber)' }}>ACTO</span>}
              </div>
              <span className={`${CAT_CLASS[form.category] || ''}`} style={{ padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', display: 'inline-block', marginBottom: 10 }}>
                {form.category}
              </span>
              <div className={styles.previewName}>{form.title || 'Talep Başlığı...'}</div>
              <div className={styles.previewLoc}>📍 {[form.district, form.city].filter(Boolean).join(', ') || 'Lokasyon...'}</div>
              <div className={styles.previewRow}><span>Katılımcı</span><span>1 / {form.total}</span></div>
              <div className={styles.previewRow}><span>Aktifleşme Eşiği</span><span>{form.threshold} kişi</span></div>
              <div className={styles.previewRow}><span>Escrow</span><span>{form.price || 'Teklif sonrası'}</span></div>
              <div className="progress-bar" style={{ marginTop: 10 }}>
                <div className="progress-fill" style={{ width: `${Math.min((1 / (parseInt(form.threshold, 10) || 5)) * 100, 100)}%` }} />
              </div>
              <div style={{ marginTop: 10, fontSize: 12, color: 'var(--txt2)', lineHeight: 1.6 }}>
                Bu talep, eşik dolduğunda profesyonel marketplace akışına alınacak ve güvenli ödeme koruması açılacak.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
