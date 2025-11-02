import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/fonts.scss';
import './styles/main.module.scss'
import './styles/global.scss';

(function servicesOpenObserver() {
    const containers = document.querySelectorAll('.menuInner');
    containers.forEach(menuInner => {
        const check = () => {
            const hasOpen = !!menuInner.querySelector('.servicesList.open, .nestedServices.open, .servicesList[aria-hidden="false"], .nestedServices[aria-hidden="false"]');
            menuInner.classList.toggle('services-open', !!hasOpen);
        };
        check();
        const mo = new MutationObserver(check);
        mo.observe(menuInner, { subtree: true, attributes: true, attributeFilter: ['class', 'aria-hidden'] });
    });
})();

createRoot(document.getElementById('root')!).render(<App />)

