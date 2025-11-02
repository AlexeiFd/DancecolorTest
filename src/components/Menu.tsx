import React, { useEffect, useRef } from 'react'
import styles from '../styles/Menu.module.scss'

type Props = {
    isOpen: boolean
    openServices: boolean
    setOpenServices: (v: boolean) => void
    onClose: () => void
}

export default function Menu({ isOpen, openServices, setOpenServices, onClose }: Props) {
    const rootRef = useRef<HTMLDivElement | null>(null)
    const timerRef = useRef<number | null>(null)
    const prevBodyPaddingRef = useRef<string | null>(null)
    const prevBodyOverflowRef = useRef<string | null>(null)

    useEffect(() => {
        const el = rootRef.current
        if (!el) return

        el.classList.add(styles.warmUp)
        void el.offsetHeight

        requestAnimationFrame(() => {
            el.classList.remove(styles.warmUp)
        })

        const preloadImg = document.createElement('link')
        preloadImg.rel = 'preload'
        preloadImg.as = 'image'
        preloadImg.href = '/assets/blur.png'
        document.head.appendChild(preloadImg)

        return () => {
            if (preloadImg.parentNode) preloadImg.parentNode.removeChild(preloadImg)
        }
    }, [])

    useEffect(() => {
        const el = rootRef.current
        if (!el) return

        function getScrollbarWidth() {
            return window.innerWidth - document.documentElement.clientWidth
        }

        if (isOpen) {
            prevBodyPaddingRef.current = document.body.style.paddingRight || ''
            prevBodyOverflowRef.current = document.body.style.overflow || ''

            const sb = getScrollbarWidth()
            if (sb > 0) {
                document.body.style.paddingRight = `${sb}px`
            }
            document.body.style.overflow = 'hidden'

            el.classList.add(styles.hideScrollbar)

            if (timerRef.current) {
                window.clearTimeout(timerRef.current)
                timerRef.current = null
            }

            timerRef.current = window.setTimeout(() => {
                el.classList.remove(styles.hideScrollbar)
                el.classList.add(styles.ready)
                timerRef.current = null
            }, 1000)
        } else {
            if (timerRef.current) {
                window.clearTimeout(timerRef.current)
                timerRef.current = null
            }
            el.classList.remove(styles.ready)
            el.classList.remove(styles.hideScrollbar)
            document.body.style.overflow = prevBodyOverflowRef.current || ''
            document.body.style.paddingRight = prevBodyPaddingRef.current || ''
        }

        return () => {
            if (timerRef.current) {
                window.clearTimeout(timerRef.current)
                timerRef.current = null
            }
            document.body.style.overflow = prevBodyOverflowRef.current || ''
            document.body.style.paddingRight = prevBodyPaddingRef.current || ''
            if (el) {
                el.classList.remove(styles.hideScrollbar)
                el.classList.remove(styles.ready)
            }
        }
    }, [isOpen])

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape' && isOpen) onClose()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [isOpen, onClose])

    const servicesItems = [
        'Аренда павильонов и студий',
        'Аренда светового оборудования',
        'Декорации и сценография',
        'Монтаж видео и звука',
        'Выдача программ',
        'Дата-центр',
        'Реклама в центре',
    ]

    return (
        <div
            id="menu"
            ref={rootRef}
            className={`${styles.fullscreenMenu} ${isOpen ? styles.open : ''}`}
            role="dialog"
            aria-hidden={!isOpen}
            aria-modal={isOpen}
        >
            <div className={styles.menuInner}>
                <div className={styles.leftCol}>
                    <nav className={styles.leftNav} aria-label="Main">
                        <div className={styles.leftServiceBlock}>
                            <button
                                className={`${styles.leftItem} ${openServices ? styles.leftItemActive : ''}`}
                                onClick={() => setOpenServices(!openServices)}
                                aria-expanded={openServices}
                                type="button"
                            >
                                <span>Услуги</span>
                                <img src="/assets/icon-arrow.svg" alt="Подробнее" className={`${styles.servicesArrow} ${openServices ? styles.rot : ''}`} />
                            </button>

                            <ul className={`${styles.nestedServices} ${openServices ? styles.open : ''}`} aria-hidden={!openServices}>
                                {servicesItems.map(s => (
                                    <li key={s} className={styles.nestedItem}>
                                        <button className={styles.nestedBtn} onClick={() => { }}>
                                            {s}
                                        </button>
                                    </li>
                                ))}
                                <div className={styles.dividingLine}></div>
                            </ul>
                        </div>

                        <button className={styles.leftItem} type="button">Экскурсии</button>
                        <button className={styles.leftItem} type="button">О центре</button>
                        <button className={styles.leftItem} type="button">Новости</button>
                        <button className={styles.leftItem} type="button">Контакты</button>
                    </nav>
                </div>

                <div className={styles.splitter} />

                <div className={styles.rightCol}>
                    <div className={styles.rightInner}>
                        <ul className={`${styles.servicesList} ${openServices ? styles.open : ''}`} aria-hidden={!openServices}>
                            {servicesItems.map(t => (
                                <li key={t} className={styles.serviceItem}>
                                    <button className={styles.serviceBtn} onClick={() => { }}>
                                        {t}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <button className={styles.closeBtn} onClick={onClose} aria-label="Закрыть меню" type="button">
                    <img src="/assets/icon-cross.svg" alt="close" />
                </button>
            </div>

            <footer className={styles.menuFooter}>
                <div className={styles.footerInner}>
                    <div className={styles.addr}>Москва, ул. Ленина, 12</div>

                    <a className={styles.phone} href="tel:+79998888888">
                        <span className={styles.phoneIcon} aria-hidden>
                            <img src="/assets/icon-phone.svg" alt="phone" />
                        </span>
                        <span>8 (999) 888-88-88</span>
                    </a>

                    <a className={styles.email} href="mailto:8888@center.ru">
                        <span className={styles.emailIcon} aria-hidden>
                            <img src="/assets/icon-mail.svg" alt="email" />
                        </span>
                        <span>8888@center.ru</span>
                    </a>
                </div>
            </footer>
            <div className={styles.backgroundBlur}>
                <img src="/assets/blur.png" alt="blur" />
            </div>
        </div>
    )
}
