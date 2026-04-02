import React, { useEffect } from 'react'
import styles from './Toast.module.css'

export default function Toast({ msg, onHide }) {
  useEffect(() => {
    const t = setTimeout(onHide, 3200)
    return () => clearTimeout(t)
  }, [onHide])

  return (
    <div className={styles.toast}>
      <span className={styles.icon}>✨</span>
      <span className={styles.msg}>{msg}</span>
    </div>
  )
}
