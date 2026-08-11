document.addEventListener('DOMContentLoaded', () => {

    /* --- Reveal on scroll -------------------------------------------------- */
    const items = document.querySelectorAll('.rise');

    if ('IntersectionObserver' in window && items.length) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e, i) => {
                if (!e.isIntersecting) return;
                // A small stagger so grouped items don't all snap in at once.
                e.target.style.transitionDelay = `${Math.min(i * 70, 280)}ms`;
                e.target.classList.add('in');
                io.unobserve(e.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

        items.forEach(el => io.observe(el));
    } else {
        items.forEach(el => el.classList.add('in'));
    }

    /* --- Mobile menu ------------------------------------------------------- */
    const btn = document.querySelector('.menu-btn');
    const menu = document.querySelector('.menu');

    if (btn && menu) {
        const setOpen = (open) => {
            menu.classList.toggle('open', open);
            btn.setAttribute('aria-expanded', open ? 'true' : 'false');
            btn.textContent = open ? 'Close' : 'Menu';
            document.body.style.overflow = open ? 'hidden' : '';
        };

        btn.addEventListener('click', () => setOpen(!menu.classList.contains('open')));
        menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') setOpen(false);
        });
    }

    /* --- Devlog filter ----------------------------------------------------- */
    const filter = document.querySelector('.log-filter');

    if (filter) {
        const logs = document.querySelectorAll('.log[data-track]');

        filter.addEventListener('click', (e) => {
            const hit = e.target.closest('button[data-filter]');
            if (!hit) return;

            const want = hit.dataset.filter;

            filter.querySelectorAll('button').forEach(b => {
                b.setAttribute('aria-pressed', b === hit ? 'true' : 'false');
            });

            logs.forEach(log => {
                log.hidden = want !== 'all' && log.dataset.track !== want;
            });
        });
    }

    /* --- Mark the current page -------------------------------------------- */
    const here = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.menu a').forEach(a => {
        const href = a.getAttribute('href');
        if (href && href.split('#')[0] === here) a.setAttribute('aria-current', 'page');
    });
});
