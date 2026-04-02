import React, { useRef, useState } from 'react'
import { INTERESTS_LIST, BADGES, SAMPLE_ACTIVITIES, SAMPLE_GROUPS } from '../data/profile'
import styles from './ProfilePage.module.css'

const TABS = ['Aktiviteler', 'Etkinliklerim', 'Favoriler', 'Yazılarım', 'Gruplar', 'Rozetler']

export default function ProfilePage({ user, onUpdateUser, showToast, events }) {
  const fileInputRef = useRef(null)
  const [tab, setTab] = useState('Aktiviteler')
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: user.name,
    bio: user.bio || '',
    interests: user.interests || [],
    photo: user.photo || '',
  })
  const [blogForm, setBlogForm] = useState({
    title: '',
    category: 'Topluluk',
    summary: '',
    image: '',
  })

  const createdEvents = events.filter((event) => user.createdEventIds?.includes(event.id))
  const favoriteEvents = events.filter((event) => user.favoriteEventIds?.includes(event.id))
  const ownBlogs = (user.blogPosts || []).slice().sort((a, b) => Number(b.id) - Number(a.id))
  const stats = [
    [String(user.joined?.length || 0), 'Katılım'],
    [String(createdEvents.length), 'Oluşturulan'],
    [String(user.followers ?? 128), 'Takipçi'],
    [String(user.following ?? 0), 'Takipte'],
  ]

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))
  const setBlog = (key, value) => setBlogForm((prev) => ({ ...prev, [key]: value }))

  function handlePhotoUpload(event) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => set('photo', reader.result)
    reader.readAsDataURL(file)
  }

  function saveProfile() {
    onUpdateUser({ ...user, ...form })
    setEditing(false)
    showToast('Profil güncellendi.')
  }

  function toggleInterest(interest) {
    const current = form.interests
    set(
      'interests',
      current.includes(interest) ? current.filter((item) => item !== interest) : [...current, interest]
    )
  }

  function publishBlog() {
    if (!blogForm.title.trim() || !blogForm.summary.trim()) {
      showToast('Blog yazısı için başlık ve özet alanını doldurun.')
      return
    }

    const nextPost = {
      id: Date.now(),
      source: 'ACTO Community',
      title: blogForm.title.trim(),
      summary: blogForm.summary.trim(),
      category: blogForm.category.trim() || 'Topluluk',
      image:
        blogForm.image.trim() ||
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      url: '',
    }

    onUpdateUser((prev) => ({
      ...prev,
      blogPosts: [nextPost, ...(prev.blogPosts || [])],
    }))
    setBlogForm({ title: '', category: 'Topluluk', summary: '', image: '' })
    setTab('Yazılarım')
    showToast('Blog yazın yayınlandı.')
  }

  return (
    <main>
      <div className={styles.cover} />

      <div className={`container ${styles.inner}`}>
        <div className={styles.topRow}>
          <div>
            <div className={styles.avatarWrap}>
              <div className={styles.avatar}>{user.photo ? <img src={user.photo} alt="" /> : user.name[0]}</div>
              <div className={styles.verified}>✓</div>
              <div className={styles.proBadge}>Altın Tik Adayı</div>
            </div>
            <h1 className={styles.name}>{user.name}</h1>
            <p className={styles.handle}>@{user.name.toLowerCase().replace(/\s/g, '.')} • {user.city || 'İstanbul'}</p>
            <p className={styles.bio}>{user.bio || 'Talep odaklı sosyal deneyimlerini ACTO üzerinde organize ediyor.'}</p>
            <div className={styles.identityRow}>
              <span className={styles.identityBlue}>Telefon doğrulandı</span>
              <span className={styles.identityGold}>Profesyonel belge bekleniyor</span>
            </div>
            {user.interests?.length > 0 && (
              <div className={styles.tags}>
                {user.interests.map((interest) => (
                  <span key={interest} className={styles.tag}>
                    {interest}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className={styles.rightCol}>
            <div className={styles.karmaCard}>
              <div className={styles.karmaNum}>{Math.min(user.karma || 120, 1000)}</div>
              <div className={styles.karmaStars}>Trust Score</div>
              <div className={styles.karmaLabel}>0 - 1000 güven puanı</div>
            </div>
            <button className="btn-amber" style={{ width: '100%', padding: 12, fontSize: 13 }} onClick={() => setEditing(true)}>
              Profili Düzenle
            </button>
          </div>
        </div>

        <div className={styles.statsGrid}>
          {stats.map(([number, label]) => (
            <div key={label} className={styles.statCard}>
              <div className={styles.statNum}>{number}</div>
              <div className={styles.statLbl}>{label}</div>
            </div>
          ))}
        </div>

        <div className={styles.tabBar}>
          {TABS.map((item) => (
            <button key={item} className={`${styles.tabBtn} ${tab === item ? styles.tabActive : ''}`} onClick={() => setTab(item)}>
              {item}
            </button>
          ))}
        </div>

        {tab === 'Aktiviteler' && (
          <div className={styles.list}>
            {SAMPLE_ACTIVITIES.map((activity, index) => (
              <div key={index} className={styles.actItem}>
                <div className={styles.actIcon}>{activity.icon}</div>
                <div>
                  <div className={styles.actTitle}>{activity.title}</div>
                  <div className={styles.actSub}>{activity.sub}</div>
                </div>
                <div className={styles.actTime}>{activity.time}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'Etkinliklerim' && (
          <div className={styles.eventsGrid}>
            {createdEvents.length > 0 ? (
              createdEvents.map((event) => (
                <div key={event.id} className={styles.evCard}>
                  <div className={styles.evImg}>
                    {event.img ? <img src={event.img} alt="" /> : <div className={styles.evImgPh}>ACTO</div>}
                  </div>
                  <div className={styles.evBody}>
                    <div className={styles.evTitle}>{event.title}</div>
                    <div className={styles.evLoc}>📍 {event.district}, {event.city}</div>
                    <span className={styles.joinedBadge}>Sahibi sensin</span>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.actItem}>
                <div className={styles.actIcon}>+</div>
                <div>
                  <div className={styles.actTitle}>Henüz oluşturduğun talep yok</div>
                  <div className={styles.actSub}>Create sayfasından ilk etkinliğini fotoğrafıyla birlikte oluşturabilirsin.</div>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'Favoriler' && (
          <div className={styles.eventsGrid}>
            {favoriteEvents.length > 0 ? (
              favoriteEvents.map((event) => (
                <div key={event.id} className={styles.evCard}>
                  <div className={styles.evImg}>
                    {event.img ? <img src={event.img} alt="" /> : <div className={styles.evImgPh}>ACTO</div>}
                  </div>
                  <div className={styles.evBody}>
                    <div className={styles.evTitle}>{event.title}</div>
                    <div className={styles.evLoc}>📍 {event.district}, {event.city}</div>
                    <span className={styles.favoriteBadge}>Favorinde</span>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.actItem}>
                <div className={styles.actIcon}>♥</div>
                <div>
                  <div className={styles.actTitle}>Henüz favori etkinliğin yok</div>
                  <div className={styles.actSub}>Beğendiğin etkinlikler burada toplanacak.</div>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'Yazılarım' && (
          <div className={styles.blogLayout}>
            <div className={styles.blogComposer}>
              <div className={styles.blogComposerTitle}>Yeni blog yazısı oluştur</div>
              <div className="form-group">
                <label className="form-label">Başlık</label>
                <input className="form-input" value={blogForm.title} onChange={(event) => setBlog('title', event.target.value)} placeholder="İlk yürüyüş grubumu nasıl topladım?" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Kategori</label>
                  <input className="form-input" value={blogForm.category} onChange={(event) => setBlog('category', event.target.value)} placeholder="Topluluk" />
                </div>
                <div className="form-group">
                  <label className="form-label">Kapak görseli URL</label>
                  <input className="form-input" value={blogForm.image} onChange={(event) => setBlog('image', event.target.value)} placeholder="https://..." />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Özet / içerik</label>
                <textarea className="form-textarea" value={blogForm.summary} onChange={(event) => setBlog('summary', event.target.value)} placeholder="Deneyimini, önerini veya topluluk içgörünü yaz..." />
              </div>
              <button className="btn-amber" style={{ width: '100%', padding: 13, fontSize: 14, borderRadius: 'var(--rs)' }} onClick={publishBlog}>
                Yazıyı Yayınla
              </button>
            </div>

            <div className={styles.blogList}>
              {ownBlogs.length > 0 ? (
                ownBlogs.map((post) => (
                  <article key={post.id} className={styles.blogPostCard}>
                    <div className={styles.blogPostImage}>
                      <img src={post.image} alt={post.title} />
                    </div>
                    <div className={styles.blogPostBody}>
                      <span className={styles.blogBadge}>{post.category}</span>
                      <div className={styles.blogPostTitle}>{post.title}</div>
                      <p className={styles.blogPostSummary}>{post.summary}</p>
                    </div>
                  </article>
                ))
              ) : (
                <div className={styles.actItem}>
                  <div className={styles.actIcon}>✎</div>
                  <div>
                    <div className={styles.actTitle}>Henüz yayınladığın blog yazısı yok</div>
                    <div className={styles.actSub}>Yazdığın ilk yazı anasayfadaki topluluk yazıları bölümünde de görünecek.</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'Gruplar' && (
          <div className={styles.list}>
            {SAMPLE_GROUPS.map((group, index) => (
              <div key={index} className={styles.actItem}>
                <div className={styles.actIcon}>{group.icon}</div>
                <div>
                  <div className={styles.actTitle}>{group.title}</div>
                  <div className={styles.actSub}>{group.sub}</div>
                </div>
                <span className={`${styles.statusTag} ${group.status === 'Aktif' ? styles.statusActive : ''}`}>{group.status}</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'Rozetler' && (
          <div className={styles.badgesGrid}>
            {BADGES.map((badge, index) => (
              <div key={index} className={`${styles.badgeCard} ${badge.earned ? styles.badgeEarned : ''}`}>
                <div className={styles.badgeIcon} style={{ opacity: badge.earned ? 1 : 0.35 }}>
                  {badge.icon}
                </div>
                <div className={styles.badgeName}>{badge.name}</div>
                <div className={styles.badgeDesc}>{badge.desc}</div>
                {badge.earned && <div className={styles.badgeTag}>Kazanıldı</div>}
              </div>
            ))}
          </div>
        )}
      </div>

      {editing && (
        <div className="overlay" onClick={(event) => event.target.classList.contains('overlay') && setEditing(false)}>
          <div className="modal-box">
            <button type="button" className="modal-close" onClick={() => setEditing(false)}>
              ×
            </button>
            <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 24, fontWeight: 900, marginBottom: 4 }}>
              Profili Düzenle
            </div>
            <p style={{ fontSize: 13, color: 'var(--txt2)', marginBottom: 20 }}>
              Profil fotoğrafını, biyografini ve ilgi alanlarını güncelle.
            </p>

            <div className="form-group">
              <label className="form-label">Profil Fotoğrafı</label>
              <div className={styles.uploadProfile} onClick={() => fileInputRef.current?.click()}>
                {form.photo ? <img src={form.photo} alt="" /> : <span>Fotoğraf Yükle</span>}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
            </div>
            <div className="form-group">
              <label className="form-label">Ad Soyad</label>
              <input className="form-input" value={form.name} onChange={(event) => set('name', event.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Biyografi</label>
              <textarea className="form-textarea" placeholder="Kendini tanıt..." value={form.bio} onChange={(event) => set('bio', event.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">İlgi Alanları</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                {INTERESTS_LIST.map((interest) => (
                  <button
                    type="button"
                    key={interest}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      border: `1px solid ${form.interests.includes(interest) ? 'var(--amber)' : 'var(--border)'}`,
                      background: form.interests.includes(interest) ? 'var(--amber)' : 'transparent',
                      color: form.interests.includes(interest) ? '#fff' : 'var(--txt2)',
                      transition: 'all 0.18s',
                    }}
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
            <button className="btn-amber" style={{ width: '100%', padding: 13, fontSize: 14, borderRadius: 'var(--rs)' }} onClick={saveProfile}>
              Kaydet
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
