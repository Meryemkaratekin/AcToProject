import React, { useState } from 'react'
import CityInput from './CityInput'
import { INTERESTS_LIST } from '../../data/profile'
import styles from './AuthModal.module.css'

const PHONE_PATTERN = /^05\d{9}$/
const ID_PATTERN = /^\d{11}$/

export default function AuthModal({ mode, onClose, onSuccess, showToast }) {
  const [m, setM] = useState(mode)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    city: '',
    nationalId: '',
    interests: [],
  })

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  function toggleInterest(interest) {
    const current = form.interests
    set(
      'interests',
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    )
  }

  function validateStepOne() {
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      showToast('Lütfen tüm zorunlu alanları doldurun.')
      return false
    }

    if (form.password !== form.confirmPassword) {
      showToast('Şifreler birbiriyle eşleşmiyor.')
      return false
    }

    if (form.password.length < 6) {
      showToast('Şifre en az 6 karakter olmalı.')
      return false
    }

    return true
  }

  function validateRegister() {
    if (!form.city || !form.phone || !form.nationalId) {
      showToast('Şehir, telefon ve kimlik bilgileri zorunludur.')
      return false
    }

    if (!PHONE_PATTERN.test(form.phone)) {
      showToast('Telefon numarası 05385450392 formatında olmalı.')
      return false
    }

    if (!ID_PATTERN.test(form.nationalId)) {
      showToast('Kimlik numarası 11 haneli olmalı.')
      return false
    }

    return true
  }

  function handleSubmit() {
    if (m === 'login') {
      if (!form.email || !form.password) {
        showToast('Lütfen e-posta ve şifre alanlarını doldurun.')
        return
      }

      onSuccess({ email: form.email }, 'login', form.password)
      return
    }

    if (step === 1) {
      if (!validateStepOne()) return
      setStep(2)
      return
    }

    if (!validateRegister()) return

    onSuccess(
      {
        name: form.name,
        email: form.email,
        city: form.city || 'İstanbul',
        interests: form.interests,
        karma: 120,
        joined: [],
        createdEventIds: [],
        followers: 128,
        following: 0,
        phone: form.phone,
        nationalId: form.nationalId,
        verificationLevel: 'blue',
      },
      'register',
      form.password
    )
  }

  function switchMode(newMode) {
    setM(newMode)
    setStep(1)
    setForm({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      city: '',
      nationalId: '',
      interests: [],
    })
  }

  return (
    <div className="overlay" onClick={(event) => event.target.classList.contains('overlay') && onClose()}>
      <div className="modal-box">
        <button type="button" className="modal-close" onClick={onClose}>
          ×
        </button>

        <div className={styles.logo}>ACTO</div>
        <h2 className={styles.title}>
          {m === 'login' ? 'Kayıtlı Hesabınla Giriş Yap' : step === 1 ? 'Yeni Nesil Profilini Oluştur' : 'Güven Katmanını Tamamla'}
        </h2>
        <p className={styles.sub}>
          {m === 'login'
            ? 'Kayıt olmayan kullanıcılar giriş yapamaz. Güvenli erişim için hesabını kullan.'
            : step === 1
              ? 'Talep odaklı sosyal deneyim ekosistemine profesyonel kimliğinle katıl.'
              : 'Telefon, kimlik ve ilgi alanlarıyla profilini daha güvenilir hale getir.'}
        </p>

        {m === 'register' && (
          <div className={styles.steps}>
            <div className={`${styles.step} ${step >= 1 ? styles.stepActive : ''}`}>1</div>
            <div className={styles.stepLine} />
            <div className={`${styles.step} ${step >= 2 ? styles.stepActive : ''}`}>2</div>
          </div>
        )}

        {m === 'register' && step === 2 ? (
          <>
            <div className="form-group">
              <label className="form-label">Şehir</label>
              <CityInput value={form.city} onChange={(value) => set('city', value)} placeholder="Şehir seç..." />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Telefon</label>
                <input
                  className="form-input"
                  placeholder="05385450392"
                  maxLength={11}
                  value={form.phone}
                  onChange={(event) => set('phone', event.target.value.replace(/\D/g, ''))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Kimlik No</label>
                <input
                  className="form-input"
                  placeholder="11 haneli"
                  maxLength={11}
                  value={form.nationalId}
                  onChange={(event) => set('nationalId', event.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>
            <div className={styles.verificationBox}>
              <div>
                <strong>Mavi Tik Doğrulaması</strong>
                <span>Telefon ve kimlik doğrulaması tamamlandığında aktifleşir.</span>
              </div>
              <div className={styles.blueTick}>✓</div>
            </div>
            <div className="form-group">
              <label className="form-label">İlgi Alanların</label>
              <div className={styles.interestGrid}>
                {INTERESTS_LIST.map((interest) => (
                  <button
                    type="button"
                    key={interest}
                    className={`${styles.interestChip} ${form.interests.includes(interest) ? styles.chipSelected : ''}`}
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {m === 'register' && (
              <div className="form-group">
                <label className="form-label">Ad Soyad</label>
                <input
                  className="form-input"
                  placeholder="Adın Soyadın"
                  value={form.name}
                  onChange={(event) => set('name', event.target.value)}
                />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">E-posta</label>
              <input
                className="form-input"
                type="email"
                placeholder="ornek@email.com"
                value={form.email}
                onChange={(event) => set('email', event.target.value)}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Şifre</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(event) => set('password', event.target.value)}
                />
              </div>
              {m === 'register' && (
                <div className="form-group">
                  <label className="form-label">Şifre Tekrar</label>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={(event) => set('confirmPassword', event.target.value)}
                  />
                </div>
              )}
            </div>
          </>
        )}

        <button
          type="button"
          className="btn-amber"
          style={{ width: '100%', padding: '13px', fontSize: '14px', borderRadius: 'var(--rs)', marginTop: 6 }}
          onClick={handleSubmit}
        >
          {m === 'login' ? 'Giriş Yap →' : step === 1 ? 'Devam Et →' : 'Güvenli Hesap Oluştur →'}
        </button>

        <p className={styles.switchTxt}>
          {m === 'login' ? (
            <>
              Hesabın yok mu? <span onClick={() => switchMode('register')}>Kayıt Ol</span>
            </>
          ) : (
            <>
              Zaten hesabın var mı? <span onClick={() => switchMode('login')}>Giriş Yap</span>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
