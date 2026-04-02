import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CityInput from "../components/ui/CityInput";
import EventCard from "../components/ui/EventCard";
import { CATEGORIES } from "../data/events";
import { useFilter } from "../hooks/useFilter";
import styles from "./HomePage.module.css";

const HERO_POINTS = [
  {
    label: "Demand-first",
    text: "İnsanlar etkinlik açmadan önce aynı niyette kümelenir.",
  },
  {
    label: "Trust layer",
    text: "Doğrulama ve davranış geçmişi güvenli katılım zemini kurar.",
  },
  {
    label: "Escrow flow",
    text: "Ödeme etkinlik tamamlanana kadar güvenli katmanda korunur.",
  },
];

const INVESTOR_METRICS = [
  { value: "12.8K", label: "aktif kullanıcı" },
  { value: "94%", label: "eşleşme başarısı" },
  { value: "72 sa", label: "ortalama aktivasyon" },
  { value: "4.8/5", label: "güven skoru" },
];

const TESTIMONIALS = [
  {
    name: "Zeynep Akalın",
    role: "Yoga eğitmeni",
    quote:
      "ACTO ile etkinlik duyurmak yerine hazır talep havuzuna ulaşıyorum. Bu fark operasyon yükünü ciddi biçimde azalttı.",
  },
  {
    name: "Mert Kaya",
    role: "Koşu topluluğu üyesi",
    quote:
      "İlk kez tanımadığım insanlarla bir etkinliğe bu kadar rahat kayıt oldum. Güven hissi doğru kurulmuş.",
  },
  {
    name: "Ayşe Yılmaz",
    role: "Pilates antrenörü",
    quote:
      "İstenilen taleplerin hızlı şekilde toplandığını görmek çok motivasyonlu. Müşteri tekrarı %85 oranında arttı.",
  },
  {
    name: "Erhan Demir",
    role: "Dış spor rehberi",
    quote:
      "Güvenli ödeme sistemi sayesinde hem ben hem katılımcılar rahat ediyoruz. Hiç sorun yaşamadım.",
  },
  {
    name: "Nida Kılıç",
    role: "Tiyatro oyuncusu",
    quote:
      "Workshop düzenlemek hiç bu kadar kolay olmamıştı. ACTO'yla her şey otomatik hale geldi.",
  },
  {
    name: "Faruk Gündüz",
    role: "Muaythai antrenörü",
    quote:
      "Talep odaklı sistem öğrenci kalitesini artırdı. Daha katılımcı, daha canlı sınıflar.",
  },
  {
    name: "Selin Özkan",
    role: "Dans eğitmeni",
    quote:
      "Platform harika, ama daha da iyisi - müşateriler kendi aralarında iletişime geçebiliyor.",
  },
  {
    name: "Kerem Şahin",
    role: "Bilgisayar öğretmeni",
    quote:
      "Kodlama kurslarıma katılım 3 kat arttı. Kaliteli öğrenci tabanı oluştu.",
  },
  {
    name: "Özlem Türk",
    role: "Beslenme koçu",
    quote:
      "Saatlik ücretlendirme sorunları çözüldü. Herkes kazanıyor, herkes mutlu.",
  },
  {
    name: "Güray Akman",
    role: "Futsal antrenörü",
    quote:
      "Takım oluşturma artık dakikalar alıyor değil haftalar. En büyük avantajı bu.",
  },
  {
    name: "Filiz Başaran",
    role: "Yoga & meditasyon",
    quote:
      "Topluluk duygusu bu ortamda gerçek. Sadece sınıf değil, arkadaş grupları oluşuyor.",
  },
  {
    name: "İbrahim Kaplan",
    role: "Satranç öğretmeni",
    quote:
      "Turnuvalar organize etmek çok hızlandı. Sistem harika organize ediyor.",
  },
  {
    name: "Melis Aydın",
    role: "Ressam & sanatçı",
    quote:
      "Atölye duyurularıma o kadar cevap geldi ki bazen seçmek durumunda kaldım!",
  },
  {
    name: "Serkan Yavaş",
    role: "Tennis antrenörü",
    quote:
      "Dinamik fiyatlandırma sayesinde slotları her zaman dolu. Ciro da düşünüyorum.",
  },
  {
    name: "Nuray Kaynak",
    role: "Resepsiyon & yoga",
    quote:
      "Her gün neredeyse yeni bir etkinlik oluşturabiliyorum. Sistemin hızı beni şok etti.",
  },
  {
    name: "Cem Duman",
    role: "Fitnes koçu",
    quote:
      "Grup oluşturmak organizasyon sürecini %70 kısalttı. Şimdi konten üretimine odaklanıyorum.",
  },
  {
    name: "Nilüfer Güz",
    role: "Tercüman & dil öğretmeni",
    quote:
      "Uluslararası katılımcılar rahatça bulabiliyorum. Çok iyi bir feature.",
  },
  {
    name: "Duran Polat",
    role: "Sporcu & antrenör",
    quote:
      "Antrenman grubu kurmaktan geri kalmıyorum. Rekabetçililik arttığında herkes kazanıyor.",
  },
  {
    name: "Pembe Yıldız",
    role: "Zumba eğitmeni",
    quote:
      "Müzik ve eğlence ortamında ACTO harika işliyor. Öğrenci memnuniyeti arttı.",
  },
  {
    name: "Ahmet Kayali",
    role: "Pilates & rehab",
    quote:
      "Kişisel sağlık verilerine güvenli erişim sağlıyor. Profesyonel bir araç olmuş.",
  },
];

export default function HomePage({
  user,
  events,
  blogPosts,
  onJoin,
  onToggleFav,
  onRateEvent,
  showToast,
  openLogin,
  openRegister,
}) {
  const navigate = useNavigate();
  const { search, setSearch, city, setCity, category, setCategory, filtered } =
    useFilter(events);
  const [waitlist, setWaitlist] = useState({ name: "", email: "" });
  const [proofVisible, setProofVisible] = useState(false);
  const [isMobileCards, setIsMobileCards] = useState(false);
  const [visibleEventCount, setVisibleEventCount] = useState(2);
  const [visibleBlogCount, setVisibleBlogCount] = useState(3);
  const [desktopEventPage, setDesktopEventPage] = useState(0);
  const [desktopBlogPage, setDesktopBlogPage] = useState(0);
  const proofRef = useRef(null);

  const featuredEvents = filtered.slice(0, 6);
  const featuredBlogs = blogPosts;
  const desktopEventPages = Math.max(1, Math.ceil(featuredEvents.length / 3));
  const desktopBlogPages = Math.max(1, Math.ceil(featuredBlogs.length / 6));
  const visibleEvents = isMobileCards
    ? featuredEvents.slice(0, visibleEventCount)
    : featuredEvents.slice(desktopEventPage * 3, desktopEventPage * 3 + 3);
  const visibleBlogs = isMobileCards
    ? featuredBlogs.slice(0, visibleBlogCount)
    : featuredBlogs.slice(desktopBlogPage * 6, desktopBlogPage * 6 + 6);

  function handleWaitlistSubmit(event) {
    event.preventDefault();
    showToast?.("Demo talebiniz alındı");
    setWaitlist({ name: "", email: "" });
  }

  useEffect(() => {
    if (!proofRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setProofVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.24 },
    );

    observer.observe(proofRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const sync = () => {
      const mobile = media.matches;
      setIsMobileCards(mobile);
      setVisibleEventCount(mobile ? 2 : Math.min(featuredEvents.length || 3, 3));
      setVisibleBlogCount(mobile ? 3 : featuredBlogs.length || 3);
    };

    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [featuredBlogs.length, featuredEvents.length]);

  useEffect(() => {
    setDesktopEventPage(0);
    setDesktopBlogPage(0);
    setVisibleEventCount(2);
    setVisibleBlogCount(3);
  }, [search, city, category, featuredEvents.length, featuredBlogs.length]);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <span className={styles.kicker}>Demand-driven social platform</span>
            <h1 className={styles.title}>
              Talebi topla.
              <br />
              Doğru insanlarla
              <br />
              güvenli deneyim kur.
            </h1>
            <p className={styles.sub}>
              ACTO, klasik etkinlik listeleme mantığını tersine çevirir.
              Kullanıcı niyetini bırakır, sistem benzer talepleri kümeler ve
              güvenli katılım akışını otomatik olarak hazırlar.
            </p>

            <div className={styles.heroActions}>
              {user ? (
                <button
                  className={`btn-amber ${styles.primaryCta}`}
                  onClick={() => navigate("/create")}
                >
                  Talep Oluştur
                </button>
              ) : (
                <button
                  className={`btn-amber ${styles.primaryCta}`}
                  onClick={openRegister}
                >
                  Ücretsiz Başla
                </button>
              )}

              <button
                className={`btn-ghost ${styles.secondaryCta}`}
                onClick={() => navigate("/events")}
              >
                Etkinliklere Bak
              </button>
            </div>

            <div className={styles.metricRow}>
              {INVESTOR_METRICS.map((item) => (
                <div key={item.label} className={styles.metricTile}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.heroPanel}>
            <div className={styles.panelTop}>
              <span className={styles.panelEyebrow}>AI Demand Engine</span>
              <span className={styles.panelStatus}>live</span>
            </div>
            <div className={styles.panelMain}>
              <h2>Hazır kümeler, doğrulanmış profil, güvenli ödeme.</h2>
              <p>
                Tek bir ekranda niyet toplama, güven skoru ve escrow destekli
                katılım akışı.
              </p>
            </div>
            <div className={styles.pointList}>
              {HERO_POINTS.map((item) => (
                <div key={item.label} className={styles.pointCard}>
                  <span>{item.label}</span>
                  <strong>{item.text}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.proofSection}>
        <div
          ref={proofRef}
          className={`container ${styles.proofInner} ${proofVisible ? styles.proofVisible : ""}`}
        >
          <div className={styles.proofText}>
            <span className="section-eyebrow">🏙️ Neden Çalışıyor?</span>
            <h2 className={styles.sectionTitle}>
              İnsan odaklı akış, daha iyi sonuçlar.
            </h2>
            <p>
              İnsanlar önce topluluğu bulur, sonra organizasyon şekillenir. Bu
              da daha dolu gruplar, daha güçlü güven ve daha az iptal anlamına
              gelir.
            </p>
          </div>

          <div className={styles.testimonialCarousel}>
            <div className={styles.testimonialScroll}>
              {[...TESTIMONIALS, ...TESTIMONIALS].map((item, index) => (
                <article
                  key={`${item.name}-${index}`}
                  className={styles.testimonialCard}
                >
                  <span className={styles.testimonialLine} />
                  <p>{item.quote}</p>
                  <strong>{item.name}</strong>
                  <span>{item.role}</span>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.eventsSection}>
        <div className="container">
          <div className={styles.sectionHeadRow}>
            <div>
              <span className="section-eyebrow">Öne çıkan etkinlikler</span>
              <h2 className={styles.sectionTitle}>Bu hafta vitrindeki buluşmalar</h2>
            </div>
            <button className="btn-ghost" onClick={() => navigate("/events")}>
              Tümünü Gör
            </button>
          </div>

          <div className={styles.searchInner}>
            <div className={styles.searchBar}>
              <input
                className="form-input"
                placeholder="Spor, hobi, workshop..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <CityInput
                value={city}
                onChange={setCity}
                placeholder="Şehir seç..."
              />
              <select
                className="form-select"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="">Kategori</option>
                {CATEGORIES.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <button className="btn-amber">Ara</button>
            </div>
          </div>

          <div className={styles.eventCarousel}>
            {visibleEvents.map((ev, index) => (
              <EventCard
                key={ev.id}
                ev={ev}
                user={user}
                onJoin={onJoin}
                onLogin={openLogin}
                onToggleFav={onToggleFav}
                onRateEvent={onRateEvent}
                showToast={showToast}
                index={index}
              />
            ))}
          </div>
          {!isMobileCards && desktopEventPages > 1 && (
            <div className={styles.desktopPager}>
              <button
                type="button"
                className={styles.desktopPagerBtn}
                onClick={() => setDesktopEventPage((current) => Math.max(current - 1, 0))}
                disabled={desktopEventPage === 0}
              >
                ←
              </button>
              <span className={styles.desktopPagerLabel}>
                {desktopEventPage + 1} / {desktopEventPages}
              </span>
              <button
                type="button"
                className={styles.desktopPagerBtn}
                onClick={() =>
                  setDesktopEventPage((current) =>
                    Math.min(current + 1, desktopEventPages - 1),
                  )
                }
                disabled={desktopEventPage === desktopEventPages - 1}
              >
                →
              </button>
            </div>
          )}
          {isMobileCards && visibleEventCount < featuredEvents.length && (
            <button
              type="button"
              className={styles.mobileLoadMore}
              onClick={() =>
                setVisibleEventCount((current) =>
                  Math.min(current + 2, featuredEvents.length),
                )
              }
            >
              <span>Asagi in</span>
              <span className={styles.mobileLoadMoreIcon}>↓</span>
            </button>
          )}
        </div>
      </section>

      <section className={styles.blogSection}>
        <div className="container">
          <div className={styles.sectionHeadRow}>
            <div>
              <span className="section-eyebrow">✨ Topluluk Yazıları</span>
              <h2 className={styles.sectionTitle}>
                İlham veren deneyimler, sayısal yolculuklar
              </h2>
            </div>
            {user && (
              <button
                className="btn-ghost"
                onClick={() => navigate("/profile")}
              >
                Profilde Yaz
              </button>
            )}
          </div>

          <div className={styles.storyList}>
            {visibleBlogs.map((post) => (
              <article key={post.id} className={styles.storyRow}>
                <div className={styles.storyImageWrap}>
                  <img
                    src={post.image}
                    alt={post.title}
                    className={styles.storyImage}
                  />
                </div>

                <div className={styles.storyContent}>
                  <div className={styles.storyMeta}>
                    <span className={styles.blogCategory}>
                      {post.category || "Topluluk"}
                    </span>
                    <span className={styles.storyAuthor}>
                      {post.authorName}
                    </span>
                    {post.rating && (
                      <span className={styles.blogRating}>
                        ⭐ {post.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                  <h3 className={styles.storyTitle}>{post.title}</h3>
                  <p className={styles.storySummary}>{post.summary}</p>
                  <div className={styles.storyFooter}>
                    <span>{post.source || "ACTO Community"}</span>
                    {post.url ? (
                      <a
                        href={post.url}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.blogLink}
                      >
                        Yazıya Git →
                      </a>
                    ) : (
                      <span className={styles.blogLink}>Profil yazısı</span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
          {!isMobileCards && desktopBlogPages > 1 && (
            <div className={styles.desktopPager}>
              <button
                type="button"
                className={styles.desktopPagerBtn}
                onClick={() => setDesktopBlogPage((current) => Math.max(current - 1, 0))}
                disabled={desktopBlogPage === 0}
              >
                ←
              </button>
              <span className={styles.desktopPagerLabel}>
                {desktopBlogPage + 1} / {desktopBlogPages}
              </span>
              <button
                type="button"
                className={styles.desktopPagerBtn}
                onClick={() =>
                  setDesktopBlogPage((current) =>
                    Math.min(current + 1, desktopBlogPages - 1),
                  )
                }
                disabled={desktopBlogPage === desktopBlogPages - 1}
              >
                →
              </button>
            </div>
          )}
          {isMobileCards && visibleBlogCount < featuredBlogs.length && (
            <button
              type="button"
              className={styles.mobileLoadMore}
              onClick={() =>
                setVisibleBlogCount((current) =>
                  Math.min(current + 3, featuredBlogs.length),
                )
              }
            >
              <span>Diger yazilari goster</span>
              <span className={styles.mobileLoadMoreIcon}>↓</span>
            </button>
          )}
        </div>
      </section>

      <section className={styles.waitlistSection}>
        <div className={`container ${styles.waitlistWrap}`}>
          <div className={styles.waitlistCopy}>
            <span className="section-eyebrow">Demo / Waitlist</span>
            <h2 className={styles.sectionTitle}>
              Yatırımcı, partner veya eğitmen olarak ACTO ile iletişime geç.
            </h2>
            <p>
              Ürün akışını, güven katmanını ve demand-engine mantığını paylaşmak
              için demo talebi bırakın.
            </p>
          </div>

          <form className={styles.waitlistForm} onSubmit={handleWaitlistSubmit}>
            <input
              className="form-input"
              placeholder="Ad Soyad"
              value={waitlist.name}
              onChange={(event) =>
                setWaitlist((prev) => ({ ...prev, name: event.target.value }))
              }
              required
            />
            <input
              className="form-input"
              type="email"
              placeholder="E-posta adresi"
              value={waitlist.email}
              onChange={(event) =>
                setWaitlist((prev) => ({ ...prev, email: event.target.value }))
              }
              required
            />
            <button className="btn-amber" type="submit">
              Demo Talebi Gönder
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
