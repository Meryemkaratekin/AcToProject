import React, { useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import styles from './JoinEventPage.module.css'

const INITIAL_FORM = {
  fullName: '',
  email: '',
  phone: '',
  note: '',
  cardHolder: '',
  cardNumber: '',
  expiryMonth: '',
  expiryYear: '',
  cvv: '',
  escrowAccepted: false,
  termsAccepted: false,
}

function validateName(value) {
  const normalized = value.trim().replace(/\s+/g, ' ')
  const parts = normalized.split(' ').filter(Boolean)
  if (parts.length < 2) return 'Ad Soyad alanini eksiksiz doldurun.'
  if (parts.some((part) => part.length < 2)) return 'Ad ve soyad en az 2 karakter olmali.'
  return ''
}

function validateEmail(value) {
  if (!value.trim()) return 'E-posta alani zorunludur.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Gecerli bir e-posta adresi girin.'
  return ''
}

function validatePhone(value) {
  if (!value.trim()) return 'Telefon alani zorunludur.'
  if (!/^0\d{10}$/.test(value)) return 'Telefon 05385450392 formatinda olmali.'
  return ''
}

function validateCardHolder(value) {
  return validateName(value)
}

function validateCardNumber(value) {
  if (!value.trim()) return 'Kart numarasi zorunludur.'
  if (value.replace(/\s/g, '').length !== 16) return 'Kart numarasi 16 haneli olmali.'
  return ''
}

function validateExpiryMonth(value) {
  if (!value) return 'Ay secmelisiniz.'
  return ''
}

function validateExpiryYear(value) {
  if (!value) return 'Yil secmelisiniz.'
  return ''
}

function validateCvv(value) {
  if (!value.trim()) return 'CVV zorunludur.'
  if (!/^\d{3}$/.test(value)) return 'CVV 3 haneli olmali.'
  return ''
}

export default function JoinEventPage({ user, events, onJoin, showToast }) {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(() => ({
    ...INITIAL_FORM,
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  }))
  const [errors, setErrors] = useState({})

  const event = useMemo(
    () => events.find((entry) => String(entry.id) === String(eventId)),
    [eventId, events]
  )

  if (!event) {
    return <Navigate to="/events" replace />
  }

  const alreadyJoined = user?.joined?.includes(event.id)
  const currentCount = Number(event.current) || 0
  const totalCount = Number(event.total) || 1
  const pct = Math.max(0, Math.min(100, Math.round((currentCount / totalCount) * 100)))

  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  function validateParticipant() {
    const nextErrors = {
      fullName: validateName(form.fullName),
      email: validateEmail(form.email),
      phone: validatePhone(form.phone),
    }

    setErrors((prev) => ({ ...prev, ...nextErrors }))
    return !Object.values(nextErrors).some(Boolean)
  }

  function goToReview() {
    const participantOk = validateParticipant()
    const paymentErrors = {
      cardHolder: validateCardHolder(form.cardHolder),
      cardNumber: validateCardNumber(form.cardNumber),
      expiryMonth: validateExpiryMonth(form.expiryMonth),
      expiryYear: validateExpiryYear(form.expiryYear),
      cvv: validateCvv(form.cvv),
    }

    setErrors((prev) => ({ ...prev, ...paymentErrors }))

    if (!participantOk || Object.values(paymentErrors).some(Boolean)) {
      showToast?.('Lutfen zorunlu alanlari dogru formatta doldurun.')
      return
    }
    setStep(2)
  }

  function completeJoin() {
    const nextErrors = {
      escrowAccepted: form.escrowAccepted ? '' : 'Escrow onayini vermelisiniz.',
      termsAccepted: form.termsAccepted ? '' : 'Kosullari kabul etmelisiniz.',
    }

    setErrors((prev) => ({ ...prev, ...nextErrors }))

    if (Object.values(nextErrors).some(Boolean)) {
      showToast?.('Devam etmek icin onay kutularini isaretleyin.')
      return
    }

    onJoin?.(event.id)
    showToast?.(`"${event.title}" icin kaydin alindi.`)
    setStep(3)
  }

  return (
    <main>
      <div className={`container ${styles.page}`}>
        <div className={styles.header}>
          <div>
            <span className="section-eyebrow">Etkinlik Kaydi</span>
            <h1 className={styles.title}>Ben de varim akisini guvenli kayit sayfasinda tamamla</h1>
            <p className={styles.sub}>
              Bilgilerinizi dogru formatta girin, escrow kosullarini onaylayin ve etkinlige tek sayfada katilin.
            </p>
          </div>
          <button type="button" className="btn-ghost" onClick={() => navigate('/events')}>
            Etkinliklere Don
          </button>
        </div>

        <div className={styles.layout}>
          <section className={styles.formPanel}>
            <div className={styles.steps}>
              {['Bilgiler', 'Onay', 'Tamamlandi'].map((label, index) => (
                <div
                  key={label}
                  className={`${styles.stepItem} ${step >= index + 1 ? styles.stepItemActive : ''}`}
                >
                  <span>{index + 1}</span>
                  <strong>{label}</strong>
                </div>
              ))}
            </div>

            {step === 1 && (
              <div className={styles.block}>
                <h2 className={styles.blockTitle}>Katilimci bilgileri</h2>
                <p className={styles.blockSub}>Ad Soyad, e-posta ve telefon alanlarini eksiksiz doldurun.</p>

                <div className={styles.field}>
                  <label className="form-label">Ad Soyad</label>
                  <input
                    className={`${styles.input} ${errors.fullName ? styles.inputError : ''}`}
                    value={form.fullName}
                    onChange={(event) => setField('fullName', event.target.value)}
                    placeholder="Ad Soyad"
                  />
                  {errors.fullName && <small className={styles.error}>{errors.fullName}</small>}
                </div>

                <div className={styles.field}>
                  <label className="form-label">E-posta</label>
                  <input
                    className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                    value={form.email}
                    onChange={(event) => setField('email', event.target.value.trim())}
                    placeholder="ornek@mail.com"
                    type="email"
                  />
                  {errors.email && <small className={styles.error}>{errors.email}</small>}
                </div>

                <div className={styles.field}>
                  <label className="form-label">Telefon</label>
                  <input
                    className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                    value={form.phone}
                    onChange={(event) => setField('phone', event.target.value.replace(/\D/g, '').slice(0, 11))}
                    placeholder="05385450392"
                    inputMode="numeric"
                  />
                  {errors.phone && <small className={styles.error}>{errors.phone}</small>}
                </div>

                <div className={styles.field}>
                  <label className="form-label">Not</label>
                  <textarea
                    className={styles.textarea}
                    value={form.note}
                    onChange={(event) => setField('note', event.target.value)}
                    placeholder="Organizatore iletmek istediginiz kisa not"
                  />
                </div>

                <div className={styles.cardSection}>
                  <div className={styles.cardSectionHead}>
                    <strong>Kart bilgileri</strong>
                    <span>Kayit oncesi odeme guvenligi icin zorunlu</span>
                  </div>

                  <div className={styles.field}>
                    <label className="form-label">Kart Uzerindeki Ad Soyad</label>
                    <input
                      className={`${styles.input} ${errors.cardHolder ? styles.inputError : ''}`}
                      value={form.cardHolder}
                      onChange={(event) => setField('cardHolder', event.target.value)}
                      placeholder="Ad Soyad"
                    />
                    {errors.cardHolder && <small className={styles.error}>{errors.cardHolder}</small>}
                  </div>

                  <div className={styles.field}>
                    <label className="form-label">Kart Numarasi</label>
                    <input
                      className={`${styles.input} ${errors.cardNumber ? styles.inputError : ''}`}
                      value={form.cardNumber}
                      onChange={(event) =>
                        setField(
                          'cardNumber',
                          event.target.value
                            .replace(/\D/g, '')
                            .slice(0, 16)
                            .replace(/(.{4})/g, '$1 ')
                            .trim()
                        )
                      }
                      placeholder="1234 5678 9012 3456"
                      inputMode="numeric"
                    />
                    {errors.cardNumber && <small className={styles.error}>{errors.cardNumber}</small>}
                  </div>

                  <div className={styles.inlineFields}>
                    <div className={styles.field}>
                      <label className="form-label">Ay</label>
                      <select
                        className={`${styles.input} ${errors.expiryMonth ? styles.inputError : ''}`}
                        value={form.expiryMonth}
                        onChange={(event) => setField('expiryMonth', event.target.value)}
                      >
                        <option value="">Ay</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
                          <option key={month} value={String(month).padStart(2, '0')}>
                            {String(month).padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                      {errors.expiryMonth && <small className={styles.error}>{errors.expiryMonth}</small>}
                    </div>

                    <div className={styles.field}>
                      <label className="form-label">Yil</label>
                      <select
                        className={`${styles.input} ${errors.expiryYear ? styles.inputError : ''}`}
                        value={form.expiryYear}
                        onChange={(event) => setField('expiryYear', event.target.value)}
                      >
                        <option value="">Yil</option>
                        {[2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033].map((year) => (
                          <option key={year} value={String(year)}>
                            {year}
                          </option>
                        ))}
                      </select>
                      {errors.expiryYear && <small className={styles.error}>{errors.expiryYear}</small>}
                    </div>

                    <div className={styles.field}>
                      <label className="form-label">CVV</label>
                      <input
                        className={`${styles.input} ${errors.cvv ? styles.inputError : ''}`}
                        value={form.cvv}
                        onChange={(event) => setField('cvv', event.target.value.replace(/\D/g, '').slice(0, 3))}
                        placeholder="123"
                        inputMode="numeric"
                      />
                      {errors.cvv && <small className={styles.error}>{errors.cvv}</small>}
                    </div>
                  </div>
                </div>

                <button type="button" className={`btn-amber ${styles.primaryAction}`} onClick={goToReview}>
                  Onay adimina gec
                </button>
              </div>
            )}

            {step === 2 && (
              <div className={styles.block}>
                <h2 className={styles.blockTitle}>Kayit ve odeme onayi</h2>
                <p className={styles.blockSub}>Asagidaki iki onayi vermeden kayit tamamlanmaz.</p>

                <div className={styles.reviewCard}>
                  <div className={styles.reviewRow}>
                    <span>Katilimci</span>
                    <strong>{form.fullName}</strong>
                  </div>
                  <div className={styles.reviewRow}>
                    <span>E-posta</span>
                    <strong>{form.email}</strong>
                  </div>
                  <div className={styles.reviewRow}>
                    <span>Telefon</span>
                    <strong>{form.phone}</strong>
                  </div>
                  <div className={styles.reviewRow}>
                    <span>Kart</span>
                    <strong>**** **** **** {form.cardNumber.replace(/\s/g, '').slice(-4)}</strong>
                  </div>
                </div>

                <label className={styles.checkRow}>
                  <input
                    type="checkbox"
                    checked={form.escrowAccepted}
                    onChange={(event) => setField('escrowAccepted', event.target.checked)}
                  />
                  <span>Escrow korumasinin etkinlik tamamlanana kadar odemeyi tutacagini kabul ediyorum.</span>
                </label>
                {errors.escrowAccepted && <small className={styles.error}>{errors.escrowAccepted}</small>}

                <label className={styles.checkRow}>
                  <input
                    type="checkbox"
                    checked={form.termsAccepted}
                    onChange={(event) => setField('termsAccepted', event.target.checked)}
                  />
                  <span>Katilim ve iptal kosullarini okudum, kayit akisini onayliyorum.</span>
                </label>
                {errors.termsAccepted && <small className={styles.error}>{errors.termsAccepted}</small>}

                <div className={styles.actionRow}>
                  <button type="button" className="btn-ghost" onClick={() => setStep(1)}>
                    Geri
                  </button>
                  <button type="button" className={`btn-amber ${styles.primaryAction}`} onClick={completeJoin}>
                    Kaydi tamamla
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className={styles.block}>
                <h2 className={styles.blockTitle}>Kaydiniz alindi</h2>
                <p className={styles.blockSub}>
                  Etkinlik sahibi onayi ve escrow sureci baslatildi. Isterseniz simdi profilinize donebilirsiniz.
                </p>

                <div className={styles.successBox}>
                  <strong>{event.title}</strong>
                  <span>{event.date}</span>
                  <span>{[event.district || event.city, event.city].filter(Boolean).join(', ')}</span>
                </div>

                <div className={styles.actionRow}>
                  <button type="button" className="btn-ghost" onClick={() => navigate('/events')}>
                    Etkinliklere don
                  </button>
                  <button type="button" className={`btn-amber ${styles.primaryAction}`} onClick={() => navigate('/profile')}>
                    Profile git
                  </button>
                </div>
              </div>
            )}
          </section>

          <aside className={styles.summaryPanel}>
            <div className={styles.summaryImage}>
              {event.img ? <img src={event.img} alt={event.title} className={styles.image} /> : <span>ACTO</span>}
            </div>

            <div className={styles.summaryBody}>
              <span className={styles.summaryBadge}>{event.category}</span>
              <h3 className={styles.summaryTitle}>{event.title}</h3>
              <p className={styles.summaryMeta}>📍 {[event.district || event.city, event.city].filter(Boolean).join(', ')}</p>
              <p className={styles.summaryMeta}>🗓 {event.date}</p>

              <div className={styles.summaryStats}>
                <div className={styles.stat}>
                  <span>Doluluk</span>
                  <strong>%{pct}</strong>
                </div>
                <div className={styles.stat}>
                  <span>Katilim</span>
                  <strong>
                    {currentCount}
                    /{totalCount}
                  </strong>
                </div>
                <div className={styles.stat}>
                  <span>Odeme</span>
                  <strong>{event.price || 'Teklif sonrasi'}</strong>
                </div>
              </div>

              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${pct}%` }} />
              </div>

              <div className={styles.safeBox}>
                <strong>Guvenli kayit</strong>
                <p>
                  Bu akista eksik alan birakilamaz. Ad Soyad, e-posta ve telefon bilgileri dogrulanmis formatta girilmelidir.
                </p>
              </div>

              {alreadyJoined && <div className={styles.joinedBadge}>Bu etkinlige zaten katildiniz.</div>}
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
