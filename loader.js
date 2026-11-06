/* =============================================================================
   Loader  -  a Ribeira at dusk, drawn as it loads
   -----------------------------------------------------------------------------
   The logo (the stone H, the bridge, the Douro) rises first, the name is set
   letter by letter, and a row of Ribeira houses grows along the bottom while
   their windows light up one by one. When the page is ready the whole curtain
   leaves as a wave of azulejo tiles.

   Everything is drawn here or in CSS: nothing extra to download except the
   logo mark the site already uses.
   ========================================================================== */

(() => {
    const loader = document.getElementById('loader');
    if (!loader) return;

    /* The intro is a first impression, not a toll gate. Once it has been seen
       in this session, every page after it opens straight onto the work --
       which is what someone reading three devlog entries in a row wants. */
    let seen = false;
    try { seen = sessionStorage.getItem('hl-seen') === '1'; } catch (e) { /* private mode */ }

    if (seen) {
        loader.remove();
        document.body.classList.remove('loading');
        return;
    }

    /* --- Layers, back to front: tiles, glow, houses, logo, name ------------ */
    const tiles = document.createElement('div');
    tiles.className = 'loader-tiles';
    tiles.setAttribute('aria-hidden', 'true');

    // The tile size aims for about 120px, so the wipe feels the same on a
    // phone and on a wide monitor.
    const cols = Math.max(5, Math.ceil(window.innerWidth / 120));
    const rows = Math.max(5, Math.ceil(window.innerHeight / 120));
    tiles.style.setProperty('--cols', cols);
    tiles.style.setProperty('--rows', rows);
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const t = document.createElement('i');
            // Distance from the centre decides when each tile leaves, so the
            // wipe opens outwards from the logo.
            const dx = (x + 0.5) / cols - 0.5;
            const dy = (y + 0.5) / rows - 0.5;
            t.style.setProperty('--out', `${Math.round(Math.hypot(dx, dy) * 520)}ms`);
            tiles.appendChild(t);
        }
    }
    loader.prepend(tiles);

    const glow = document.createElement('div');
    glow.className = 'loader-glow';
    glow.setAttribute('aria-hidden', 'true');
    loader.appendChild(glow);

    /* --- The Ribeira ------------------------------------------------------
       Houses of different widths and heights, each with a coloured facade, a
       roof and a few windows. The sequence is fixed (a small seeded random),
       so the skyline is the same every time it is seen. */
    const palette = ['#d9a441', '#c8553d', '#2f7f79', '#e8c547', '#2a6592', '#e6d6be', '#b9604a', '#5c8f5a'];
    let seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

    const W = 720, H = 150, GROUND = 120;
    let x = -10, i = 0, houses = '', lit = '';
    while (x < W + 10) {
        const w = 38 + Math.floor(rnd() * 34);
        const h = 34 + Math.floor(rnd() * 56);
        const color = palette[Math.floor(rnd() * palette.length)];
        const top = GROUND - h;
        const delay = (i * 0.045).toFixed(2);
        // Roof: a low pitched cap, darker than the facade.
        houses += `<g class="house" style="--d:${delay}s">`
            + `<rect x="${x}" y="${top}" width="${w}" height="${h}" fill="${color}"/>`
            + `<path d="M${x - 2} ${top} L${x + w / 2} ${top - 9} L${x + w + 2} ${top} Z" fill="#7a2f26"/>`;
        // Windows in a grid, some of them lit.
        const wc = Math.max(2, Math.floor(w / 15));
        const wr = Math.max(2, Math.floor(h / 20));
        for (let r = 0; r < wr; r++) {
            for (let c = 0; c < wc; c++) {
                const wx = x + 6 + c * ((w - 12) / wc) + ((w - 12) / wc - 7) / 2;
                const wy = top + 8 + r * 17;
                if (wy + 11 > GROUND - 3) continue;
                const on = rnd() > 0.35;
                houses += `<rect x="${wx.toFixed(1)}" y="${wy}" width="7" height="11" fill="#141a2b"/>`;
                if (on) {
                    const t = (1.0 + rnd() * 1.4).toFixed(2);
                    lit += `<rect class="win" x="${wx.toFixed(1)}" y="${wy}" width="7" height="11" style="--t:${t}s"/>`;
                }
            }
        }
        houses += '</g>';
        x += w + 2;
        i++;
    }

    const stage = loader.querySelector('.loader-stage');
    stage.innerHTML = `<svg class="skyline" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" aria-hidden="true">`
        + `<g class="town">${houses}<g class="lights">${lit}</g></g>`
        + `<g class="mirror" transform="translate(0 ${GROUND * 2}) scale(1 -1)">${houses}</g>`
        + `<rect x="0" y="${GROUND}" width="${W}" height="${H - GROUND}" class="river"/>`
        + `<g class="waves">`
        + [0, 1, 2].map(n => `<path d="M0 ${GROUND + 8 + n * 8} q 30 -5 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0"`
            + ` style="--w:${n}"/>`).join('')
        + `</g></svg>`;

    /* --- The mark and the name --------------------------------------------- */
    const name = loader.querySelector('.loader-name');
    if (name) {
        name.setAttribute('aria-label', 'Hordalusa');
        name.innerHTML = [...'HORDALUSA']
            .map((ch, n) => `<span aria-hidden="true" style="--i:${n}">${ch}</span>`)
            .join('');

        const mark = document.createElement('img');
        mark.className = 'loader-mark';
        mark.src = 'brand/logo-mark.png';
        mark.alt = '';
        mark.width = 130;
        mark.height = 128;
        name.before(mark);

        const tag = document.createElement('div');
        tag.className = 'loader-tag';
        tag.textContent = 'Project Porto';
        loader.appendChild(tag);
    }

    /* --- Dismiss -----------------------------------------------------------
       Deliberately NOT waiting on window.load. That event waits for every
       image on the page, and the renders here run to a couple of megabytes --
       which would turn the intro into a download progress bar.

       The page is readable as soon as the document is parsed; the images
       arrive behind it, in their own time, into space already reserved by
       their width/height attributes. So the curtain lifts on DOMContentLoaded
       once the intro has had time to play, and the hold is fixed.

       Anyone who has already seen it this session skips it entirely.
       ---------------------------------------------------------------------- */
    const SEEN = 'hl-seen';
    const MIN_MS = 2200;
    const started = performance.now();
    let done = false;

    const dismiss = () => {
        if (done) return;
        done = true;
        const wait = Math.max(0, MIN_MS - (performance.now() - started));
        setTimeout(() => {
            loader.classList.add('leaving');
            // The content fades first, then the tiles leave, outwards.
            setTimeout(() => {
                loader.classList.add('done');
                document.body.classList.remove('loading');
                try { sessionStorage.setItem(SEEN, '1'); } catch (e) { /* private mode */ }
                setTimeout(() => loader.remove(), 1300);
            }, 380);
        }, wait);
    };

    if (document.readyState !== 'loading') dismiss();
    else document.addEventListener('DOMContentLoaded', dismiss);

    // Never trap anyone behind the loader if a script above us throws.
    setTimeout(dismiss, 4000);
})();
