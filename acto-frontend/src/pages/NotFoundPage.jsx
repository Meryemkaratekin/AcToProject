import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NotFoundPage.module.css";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.iconWrap}>
            <span className={styles.icon}>🔍</span>
          </div>

          <h1 className={styles.title}>404</h1>
          <p className={styles.subtitle}>Bu sayfa bulunamadı</p>
          <p className={styles.description}>
            Aradığınız sayfa silinmiş, taşınmış veya hiç var olmamış olabilir.
            Ana sayfaya dönüp baştan başlayabilirsiniz.
          </p>

          <div className={styles.actions}>
            <button className="btn-amber" onClick={() => navigate("/")}>
              Ana Sayfaya Dön
            </button>
            <button className="btn-ghost" onClick={() => navigate("/events")}>
              Etkinliklere Git
            </button>
          </div>

          <div className={styles.decoration}>
            <div className={styles.circle} />
          </div>
        </div>
      </div>
    </main>
  );
}
