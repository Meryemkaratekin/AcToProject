import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

export default function Navbar({ user, openLogin, openRegister, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className={`${styles.nav} ${scrolled ? styles.elevated : ""}`}>
      <div className={styles.inner}>
        <NavLink to="/" className={styles.logo} onClick={closeMobileMenu}>
          <span>A</span>CTO
        </NavLink>

        <nav className={styles.links}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.linkActive : ""}`
            }
            end
          >
            Ana Sayfa
          </NavLink>
          <NavLink
            to="/events"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.linkActive : ""}`
            }
          >
            Etkinlikler
          </NavLink>
          <NavLink
            to="/how"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.linkActive : ""}`
            }
          >
            Nasıl Çalışır
          </NavLink>
          {user && (
            <NavLink
              to="/create"
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.linkActive : ""}`
              }
            >
              Marketplace
            </NavLink>
          )}
        </nav>

        <button
          className={styles.hamburger}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>

        <div className={styles.end}>
          {user ? (
            <div className={styles.userArea}>
              <NavLink to="/create" className={styles.createBtn}>
                + Talep Aç
              </NavLink>
              <div
                className={styles.avatarWrap}
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              >
                <div className={styles.avatar}>
                  {user.photo ? <img src={user.photo} alt="" /> : user.name[0]}
                </div>
                {userDropdownOpen && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropUser}>
                      <div className={styles.dropName}>{user.name}</div>
                      <div className={styles.dropEmail}>{user.email}</div>
                    </div>
                    <div className={styles.dropDivider} />
                    <NavLink
                      to="/profile"
                      className={styles.dropItem}
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      Profilim
                    </NavLink>
                    <NavLink
                      to="/create"
                      className={styles.dropItem}
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      Yeni Talep Oluştur
                    </NavLink>
                    <div className={styles.dropDivider} />
                    <button
                      type="button"
                      className={styles.dropLogout}
                      onClick={() => {
                        onLogout();
                        setUserDropdownOpen(false);
                      }}
                    >
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <button
                className="btn-ghost"
                style={{ padding: "8px 18px", fontSize: 13 }}
                onClick={openLogin}
              >
                Giriş Yap
              </button>
              <button
                className="btn-amber"
                style={{ padding: "9px 22px", fontSize: 13 }}
                onClick={openRegister}
              >
                Ücretsiz Başla
              </button>
            </>
          )}
        </div>

        {mobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <NavLink
              to="/"
              className={styles.mobileLink}
              onClick={closeMobileMenu}
            >
              Ana Sayfa
            </NavLink>
            <NavLink
              to="/events"
              className={styles.mobileLink}
              onClick={closeMobileMenu}
            >
              Etkinlikler
            </NavLink>
            <NavLink
              to="/how"
              className={styles.mobileLink}
              onClick={closeMobileMenu}
            >
              Nasıl Çalışır
            </NavLink>
            {user && (
              <>
                <NavLink
                  to="/create"
                  className={styles.mobileLink}
                  onClick={closeMobileMenu}
                >
                  Marketplace
                </NavLink>
                <div className={styles.mobileDivider} />
                <NavLink
                  to="/create"
                  className={`${styles.mobileLink} ${styles.mobileAuthPrimary}`}
                  onClick={closeMobileMenu}
                >
                  + Talep Aç
                </NavLink>
                <NavLink
                  to="/profile"
                  className={styles.mobileLink}
                  onClick={closeMobileMenu}
                >
                  Profilim
                </NavLink>
                <button
                  type="button"
                  className={`${styles.mobileLink} ${styles.mobileLogout}`}
                  onClick={() => {
                    closeMobileMenu();
                    onLogout();
                  }}
                >
                  Çıkış Yap
                </button>
              </>
            )}
            {!user && (
              <>
                <div className={styles.mobileDivider} />
                <button
                  className={`${styles.mobileLink} ${styles.mobileAuth}`}
                  onClick={() => {
                    closeMobileMenu();
                    openLogin();
                  }}
                >
                  Giriş Yap
                </button>
                <button
                  className={`${styles.mobileLink} ${styles.mobileAuthPrimary}`}
                  onClick={() => {
                    closeMobileMenu();
                    openRegister();
                  }}
                >
                  Ücretsiz Başla
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
