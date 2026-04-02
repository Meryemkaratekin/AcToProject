import React, { useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CityInput from '../components/ui/CityInput'
import { CATEGORIES, CAT_CLASS } from '../data/events'
import styles from './CreatePage.module.css'

function parseProgram(value) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [time, ...labelParts] = line.split('|')
      return {
        time: (time || '').trim() || 'Saat',
        label: labelParts.join('|').trim() || line,
      }
    })
    .slice(0, 8)
}

export default function CreatePage({ user, showToast, addEvent }) {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const fileInputId = useId()
  const [type, setType] = useState('event')
  const [selectedFileName, setSelectedFileName] = useState('')
  const [form, setForm] = useState({
    title: '',
    category: 'MÃ¼zik',
    city: '',
    district: '',
    date: '',
    total: 20,
    description: '',
    content: '',
    img: '',
    threshold: 5,
    trainerOffer: '',
    price: '',
    programText: '19:00 | Karsilama\n19:30 | Ana oturum\n21:00 | Kapanis',
  })

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))
  const previewProgram = parseProgram(form.programText)

  function handleImageUpload(event) {
    const file = event.target.files?.[0]
    if (!file) return

    setSelectedFileName(file.name)
    const reader = new FileReader()
    reader.onload = () => set('img', reader.result)
    reader.onerror = () => showToast('Gorsel yuklenirken bir hata olustu.')
    reader.readAsDataURL(file)
  }

  function handleSubmit() {
    if (!form.title || !form.city || !form.date || !form.description || !form.content) {
      showToast('Lutfen zorunlu alanlari eksiksiz doldurun.')
      return
    }

    if (previewProgram.length === 0) {
      showToast('Program akisi icin en az bir satir eklemelisin.')
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
      content: form.content,
      program: previewProgram,
      threshold: parseInt(form.threshold, 10) || 5,
      ownerEmail: user.email,
      trainerOffer: form.trainerOffer,
      price: form.price || 'Teklif sonrasi',
    }

    addEvent(newEvent)
    showToast(`"${form.title}" basariyla olusturuldu.`)
    navigate('/profile')
  }

  return (
    <main>
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div className={styles.header}>
          <span className="section-eyebrow">Demand-Driven Marketplace</span>
          <h1 className={styles.title}>Yeni sosyal deneyim talebi olustur</h1>
          <p className={styles.sub}>
            Talep esigini, guven katmanini, icerigi, program akisini ve odeme modelini tek akista tanimla.
          </p>
        </div>

        <div className={styles.typeRow}>
          {[
            ['event', 'Topluluk Etkinligi'],
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
                <label className="form-label">Talep Basligi *</label>
                <input className="form-input" placeholder="Orn. Gun Dogumu Yoga Bulusmasi" value={form.title} onChange={(event) => set('title', event.target.value)} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Kategori</label>
                  <select className="form-select" value={form.category} onChange={(event) => set('category', event.target.value)}>
                    {CATEGORIES.filter((item) => item !== 'TÃ¼mÃ¼').map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Maks. Katilimci</label>
                  <input className="form-input" type="number" min="2" max="500" value={form.total} onChange={(event) => set('total', event.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Kisa Aciklama *</label>
                <textarea className="form-textarea" placeholder="Deneyimin hedefini ve kisaca ne oldugunu anlat..." value={form.description} onChange={(event) => set('description', event.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Etkinlik Icerigi *</label>
                <textarea className="form-textarea" placeholder="Katilimci tam olarak ne deneyimleyecek, kimler icin uygun, hangi detaylar onemli..." value={form.content} onChange={(event) => set('content', event.target.value)} />
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}><span className={styles.step}>2</span>Lokasyon ve Program</h3>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Sehir *</label>
                  <CityInput value={form.city} onChange={(value) => set('city', value)} placeholder="Sehir sec..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Ilce / Semt</label>
                  <input className="form-input" placeholder="Kadikoy, Cankaya..." value={form.district} onChange={(event) => set('district', event.target.value)} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Talep Esigi</label>
                  <input className="form-input" type="number" min="2" max="50" value={form.threshold} onChange={(event) => set('threshold', event.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Tarih *</label>
                  <input className="form-input" type="date" value={form.date} onChange={(event) => set('date', event.target.value)} style={{ colorScheme: 'light' }} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Program Akisi *</label>
                <textarea
                  className={`form-textarea ${styles.programInput}`}
                  placeholder={'19:00 | Karsilama\n19:30 | Ana oturum\n21:00 | Kapanis'}
                  value={form.programText}
                  onChange={(event) => set('programText', event.target.value)}
                />
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}><span className={styles.step}>3</span>Odeme ve Gorsel</h3>
              <div className={styles.paymentFlow}>
                <div className={styles.paymentStepCard}>
                  <strong>1. Rezervasyon</strong>
                  <span>Katilimci yerini ayirir.</span>
                </div>
                <div className={styles.paymentStepCard}>
                  <strong>2. Escrow Korumasi</strong>
                  <span>Odeme guvenli sekilde sistemde tutulur.</span>
                </div>
                <div className={styles.paymentStepCard}>
                  <strong>3. Onayli Aktarim</strong>
                  <span>Etkinlik sonrasi saglayiciya aktarilir.</span>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Egitmen / Atolye Notu</label>
                  <input className="form-input" placeholder="Onayli egitmen teklifi bekleniyor..." value={form.trainerOffer} onChange={(event) => set('trainerOffer', event.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Tahmini Kisi Basi Ucret</label>
                  <input className="form-input" placeholder="650 TL" value={form.price} onChange={(event) => set('price', event.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Talep Gorseli</label>
                <label htmlFor={fileInputId} className={styles.uploadZone}>
                  <div className={styles.uploadIcon}>+</div>
                  <div className={styles.uploadTxt}>{selectedFileName || 'Etkinlik fotografi yukle'}</div>
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
                <label className="form-label">Istersen URL ile de gorsel ekleyebilirsin</label>
                <input className="form-input" placeholder="https://..." value={typeof form.img === 'string' && form.img.startsWith('http') ? form.img : ''} onChange={(event) => set('img', event.target.value)} />
              </div>
            </div>

            <button className="btn-amber" style={{ width: '100%', padding: 15, fontSize: 15, fontWeight: 700, borderRadius: 'var(--r)' }} onClick={handleSubmit}>
              Guvenli Talep Olustur
            </button>
          </div>

          <div>
            <div className={styles.preview}>
              <h3 className={styles.previewTitle}>Canli Onizleme</h3>
              <div className={styles.previewImg}>
                {form.img ? <img src={form.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 28, color: 'var(--amber)' }}>ACTO</span>}
              </div>
              <span className={`${CAT_CLASS[form.category] || ''}`} style={{ padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', display: 'inline-block', marginBottom: 10 }}>
                {form.category}
              </span>
              <div className={styles.previewName}>{form.title || 'Talep Basligi...'}</div>
              <div className={styles.previewLoc}>{[form.district, form.city].filter(Boolean).join(', ') || 'Lokasyon...'}</div>
              <div className={styles.previewRow}><span>Katilimci</span><span>1 / {form.total}</span></div>
              <div className={styles.previewRow}><span>Aktiflesme Esigi</span><span>{form.threshold} kisi</span></div>
              <div className={styles.previewRow}><span>Escrow</span><span>{form.price || 'Teklif sonrasi'}</span></div>
              <div className="progress-bar" style={{ marginTop: 10 }}>
                <div className="progress-fill" style={{ width: `${Math.min((1 / (parseInt(form.threshold, 10) || 5)) * 100, 100)}%` }} />
              </div>
              <div style={{ marginTop: 10, fontSize: 12, color: 'var(--txt2)', lineHeight: 1.6 }}>
                Bu talep, esik doldugunda profesyonel marketplace akisina alinacak ve guvenli odeme korumasi acilacak.
              </div>
              <div className={styles.previewContent}>
                <strong>Icerik</strong>
                <p>{form.content || 'Etkinlik icerigi burada gorunecek.'}</p>
              </div>
              <div className={styles.previewProgram}>
                <strong>Program Akisi</strong>
                <div className={styles.previewProgramList}>
                  {previewProgram.map((item, index) => (
                    <div key={`${item.time}-${index}`} className={styles.previewProgramItem}>
                      <span>{item.time}</span>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
