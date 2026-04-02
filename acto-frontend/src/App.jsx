import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Toast from './components/ui/Toast'
import AuthModal from './components/ui/AuthModal'
import HomePage from './pages/HomePage'
import EventsPage from './pages/EventsPage'
import HowPage from './pages/HowPage'
import ProfilePage from './pages/ProfilePage'
import CreatePage from './pages/CreatePage'
import JoinEventPage from './pages/JoinEventPage'
import NotFoundPage from './pages/NotFoundPage'
import { EVENTS_DATA } from './data/events'
import { BLOG_POSTS } from './data/blogs'

const USERS_STORAGE_KEY = 'acto-users'
const SESSION_STORAGE_KEY = 'acto-session-user'

export default function App() {
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]')
    } catch {
      return []
    }
  })
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY) || 'null')
    } catch {
      return null
    }
  })
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState(null)
  const [events, setEvents] = useState(EVENTS_DATA)
  const communityBlogs = [
    ...registeredUsers.flatMap((entry) =>
      (entry.blogPosts || []).map((post) => ({
        ...post,
        authorName: entry.name,
        authorPhoto: entry.photo || '',
      }))
    ),
    ...BLOG_POSTS.map((post) => ({
      ...post,
      authorName: post.source,
      authorPhoto: '',
    })),
  ].sort((a, b) => Number(b.id) - Number(a.id))

  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(registeredUsers))
  }, [registeredUsers])

  useEffect(() => {
    if (user) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user))
      return
    }
    localStorage.removeItem(SESSION_STORAGE_KEY)
  }, [user])

  const showToast = (msg) => setToast(msg)
  const openLogin = () => setModal('login')
  const openRegister = () => setModal('register')

  function syncCurrentUser(updater) {
    setUser((prev) => {
      if (!prev) return prev
      const nextUser = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }

      setRegisteredUsers((currentUsers) =>
        currentUsers.map((entry) =>
          entry.email === prev.email
            ? {
                ...entry,
                ...nextUser,
                password: entry.password,
              }
            : entry
        )
      )

      return nextUser
    })
  }

  function handleAuth(userData, mode, password) {
    if (mode === 'login') {
      const existingUser = registeredUsers.find(
        (entry) =>
          entry.email.toLowerCase() === userData.email.toLowerCase() && entry.password === password
      )

      if (!existingUser) {
        showToast('Bu bilgilerle kayıtlı bir hesap bulunamadı.')
        return
      }

      const sessionUser = { ...existingUser }
      delete sessionUser.password
      setUser(sessionUser)
      showToast(`Hoş geldin, ${sessionUser.name}!`)
      setModal(null)
      return
    }

    const alreadyExists = registeredUsers.some(
      (entry) => entry.email.toLowerCase() === userData.email.toLowerCase()
    )

    if (alreadyExists) {
      showToast('Bu e-posta ile zaten bir hesap oluşturulmuş.')
      return
    }

    const nextUser = { ...userData, password, blogPosts: [], following: 0 }
    setRegisteredUsers((prev) => [...prev, nextUser])

    const sessionUser = { ...nextUser }
    delete sessionUser.password
    setUser(sessionUser)
    showToast(`Aramıza hoş geldin, ${sessionUser.name}!`)
    setModal(null)
  }

  function handleLogout() {
    setUser(null)
    showToast('Çıkış yapıldı. Görüşürüz!')
  }

  function handleJoin(eventId) {
    if (!user) return

    const joined = user.joined || []
    if (!joined.includes(eventId)) {
      syncCurrentUser((prev) => ({
        ...prev,
        joined: [...joined, eventId],
        karma: Math.min((prev?.karma || 0) + 15, 1000),
      }))
      setEvents((prev) =>
        prev.map((event) => (event.id === eventId ? { ...event, current: event.current + 1 } : event))
      )
    }
  }

  function handleToggleFav(eventId) {
    if (!user) return

    const favorites = user.favoriteEventIds || []
    const nextFavorites = favorites.includes(eventId)
      ? favorites.filter((id) => id !== eventId)
      : [...favorites, eventId]

    syncCurrentUser((prev) => ({ ...prev, favoriteEventIds: nextFavorites }))
  }

  function handleRateEvent(eventId, rating) {
    if (!user) return

    syncCurrentUser((prev) => ({
      ...prev,
      ratedEvents: {
        ...(prev.ratedEvents || {}),
        [eventId]: rating,
      },
    }))

    setEvents((prev) =>
      prev.map((event) => {
        if (event.id !== eventId) return event

        const ratedBy = {
          ...(event.ratedBy || {}),
          [user.email]: rating,
        }
        const ratings = Object.values(ratedBy).map(Number).filter(Boolean)
        const averageRating = ratings.length
          ? ratings.reduce((sum, value) => sum + value, 0) / ratings.length
          : rating

        return {
          ...event,
          ratedBy,
          averageRating,
        }
      })
    )
  }

  function addEvent(newEvent) {
    setEvents((prev) => [newEvent, ...prev])
    syncCurrentUser((prev) =>
      prev
        ? {
            ...prev,
            createdEventIds: [...(prev.createdEventIds || []), newEvent.id],
          }
        : prev
    )
  }

  const sharedProps = {
    user,
    blogPosts: communityBlogs,
    showToast,
    openLogin,
    openRegister,
    onToggleFav: handleToggleFav,
    onRateEvent: handleRateEvent,
  }

  return (
    <>
      <Navbar
        user={user}
        openLogin={openLogin}
        openRegister={openRegister}
        onLogout={handleLogout}
      />

      <Routes>
        <Route path="/" element={<HomePage {...sharedProps} events={events} onJoin={handleJoin} />} />
        <Route path="/events" element={<EventsPage {...sharedProps} events={events} onJoin={handleJoin} />} />
        <Route
          path="/events/:eventId/join"
          element={
            user ? (
              <JoinEventPage user={user} events={events} onJoin={handleJoin} showToast={showToast} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="/how" element={<HowPage />} />
        <Route
          path="/profile"
          element={
            user ? (
              <ProfilePage
                user={user}
                onUpdateUser={syncCurrentUser}
                onRateEvent={handleRateEvent}
                showToast={showToast}
                events={events}
                blogPosts={communityBlogs}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/create"
          element={
            user ? (
              <CreatePage user={user} showToast={showToast} addEvent={addEvent} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Footer />

      {modal && (
        <AuthModal
          mode={modal}
          onClose={() => setModal(null)}
          onSuccess={handleAuth}
          showToast={showToast}
        />
      )}

      {toast && <Toast msg={toast} onHide={() => setToast(null)} />}
    </>
  )
}
