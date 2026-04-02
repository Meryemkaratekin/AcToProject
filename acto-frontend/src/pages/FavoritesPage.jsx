import React from "react";
import { useNavigate } from "react-router-dom";
import EventCard from "../components/ui/EventCard";
import styles from "./EventsPage.module.css";

export default function FavoritesPage({
  user,
  events,
  onJoin,
  showToast,
  openLogin,
  onToggleFav,
}) {
  const navigate = useNavigate();
  const favorites = events.filter((ev) => ev.fav);

  return (
    <main>
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div style={{ marginBottom: 28 }}>
          <span className="section-eyebrow">Favoriler</span>
          <h1 className="section-title" style={{ fontSize: 36 }}>
            Beğendiğin Etkinlikler
          </h1>
          <p style={{ marginTop: 10, color: "var(--txt2)", maxWidth: 620 }}>
            Favoriler sayfasında kaydettiğin etkinlikleri takip edebilir, onlara
            tekrar göz atabilir ve katılım için hızlıca ilerleyebilirsin.
          </p>
        </div>

        {!user ? (
          <div className={styles.empty} style={{ padding: "56px 24px" }}>
            <div className={styles.emptyIcon}>💜</div>
            <h3>Favorilere erişmek için giriş yapmalısın</h3>
            <p>
              Etkinlikleri beğenmek ve favori listeni kaydetmek için önce bir
              hesap oluştur veya giriş yap.
            </p>
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 20,
                flexWrap: "wrap",
              }}
            >
              <button className="btn-amber" onClick={openLogin}>
                Giriş Yap
              </button>
              <button className="btn-ghost" onClick={() => navigate("/")}>
                Ana Sayfaya Dön
              </button>
            </div>
          </div>
        ) : favorites.length > 0 ? (
          <div className={styles.grid}>
            {favorites.map((ev, index) => (
              <EventCard
                key={ev.id}
                ev={ev}
                user={user}
                onJoin={onJoin}
                onLogin={openLogin}
                onToggleFav={onToggleFav}
                showToast={showToast}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>✨</div>
            <h3>Henüz favori etkinliğin yok</h3>
            <p>
              Beğendiğin bir etkinliği favorilere eklemek için kalp ikonuna
              tıkla.
            </p>
            <button className="btn-amber" onClick={() => navigate("/events")}>
              Etkinliklere Git
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
