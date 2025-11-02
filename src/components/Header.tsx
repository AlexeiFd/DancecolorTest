import React, { useEffect, useRef, useState } from 'react'
import Menu from './Menu'
import styles from '../styles/Header.module.scss'

export default function Header() {
    const [open, setOpen] = useState(false)
    const [openServices, setOpenServices] = useState(false)
    const prevBodyPaddingRef = useRef<string | null>(null)
    const prevBodyOverflowRef = useRef<string | null>(null)
    const burgerRef = useRef<HTMLButtonElement | null>(null)

    useEffect(() => {
        // warm-up burger on mount to create layers / prevent first-frame layout work
        const btn = burgerRef.current
        if (!btn) return
        btn.classList.add(styles.warmUp)
        void btn.offsetHeight
        requestAnimationFrame(() => btn.classList.remove(styles.warmUp))
    }, [])

    function getScrollbarWidth() {
        return window.innerWidth - document.documentElement.clientWidth
    }

    function toggleMenu() {
        // если откроем -> подготовим body синхронно (чтобы не было сдвига/прыжка)
        if (!open) {
            prevBodyPaddingRef.current = document.body.style.paddingRight || ''
            prevBodyOverflowRef.current = document.body.style.overflow || ''
            const sb = getScrollbarWidth()
            if (sb > 0) document.body.style.paddingRight = `${sb}px`
            document.body.style.overflow = 'hidden'
        } else {
            // закрываем — сразу восстанавливаем
            document.body.style.overflow = prevBodyOverflowRef.current || ''
            document.body.style.paddingRight = prevBodyPaddingRef.current || ''
        }

        // теперь меняем state — Menu тоже имеет свои эффекты, но мы уже заранее компенсировали
        setOpen(v => !v)
        if (open) setOpenServices(false)
    }

    return (
        <>
            <header className={styles.siteHeader}>
                <div className={styles.container}>
                    <div className={styles.leftWrap}>
                        <div className={styles.logoText}>ЛОГОТИП</div>
                    </div>

                    <nav className={styles.navDesktop} aria-label="Main navigation">
                        <a className={styles.navItem} href="#">
                            <img src="/assets/icon-services.svg" alt="услуги" className={styles.navLogoItem} />
                            УСЛУГИ
                        </a>
                        <a className={styles.navItem} href="#">ЭКСКУРСИИ</a>
                        <a className={styles.navItem} href="#">НОВОСТИ</a>
                        <a className={styles.navItem} href="#">О ЦЕНТРЕ</a>
                        <a className={styles.navItem} href="#">КОНТАКТЫ</a>
                        <div className={styles.burgerContainer}>
                            <button
                                ref={burgerRef}
                                className={`${styles.burger} ${open ? styles.open : ''}`}
                                aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
                                aria-expanded={open}
                                onClick={toggleMenu}
                                type="button"
                            >
                                <span className={styles.line} />
                                <span className={styles.line} />
                                <span className={styles.line} />
                            </button>
                        </div>
                    </nav>
                </div>
            </header>

            <Menu
                isOpen={open}
                openServices={openServices}
                setOpenServices={setOpenServices}
                onClose={() => {
                    // при закрытии восстановим body синхронно (на случай если Menu эффект не успеет)
                    document.body.style.overflow = prevBodyOverflowRef.current || ''
                    document.body.style.paddingRight = prevBodyPaddingRef.current || ''
                    setOpen(false)
                    setOpenServices(false)
                }}
            />
        </>
    )
}
