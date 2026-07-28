/* =============================================================================
   Loader — a herd of Lusitano horses at a gallop
   -----------------------------------------------------------------------------
   Drawn as SVG rather than images: the body is one silhouette and each leg is
   its own group, rotated from the shoulder or hip. That gives a real gait at
   any size, with nothing extra to download.

   The horses run in three ranks at different scales, speeds and opacities,
   which reads as depth rather than a row.
   ========================================================================== */

(() => {
    const loader = document.getElementById('loader');
    if (!loader) return;

    /* -------------------------------------------------------------------------
       One horse, facing right, viewBox 0 0 140 100.

       The outline is traced the way you'd draw one: tail base → croup →
       back → withers → crest of the neck → poll → face → muzzle → under the
       jaw → throat → chest → belly → flank → back to the tail.
       ---------------------------------------------------------------------- */
    const horse = () => `
<svg class="horse" viewBox="0 0 140 100" aria-hidden="true">
  <g class="horse-rig">

    <!-- off-side legs first, so they read as being behind the body.
         Each leg carries its own hoof so it rotates with the limb. -->
    <g class="leg leg-oh" style="transform-origin:34px 46px">
      <path d="M28 40 L25 56 Q24 60 28 64 L26 82 L25 88 L31 88 L32 82 L35 64
               Q37 60 34 56 L38 42 Z"/>
      <path class="hoof" d="M24 87 L33 87 L32 93 L23 93 Z"/>
    </g>
    <g class="leg leg-of" style="transform-origin:70px 44px">
      <path d="M65 40 L63 60 L61 78 L60 88 L66 88 L67 78 L70 60 L72 42 Z"/>
      <path class="hoof" d="M59 87 L68 87 L67 93 L58 93 Z"/>
    </g>

    <!-- Tail. The Lusitano carries a full one, and at a gallop it streams. -->
    <path class="tail" d="
      M24 38
      C16 35 9 39 4 47
      C10 44 14 44 17 45
      C11 49 6 55 3 63
      C10 55 16 51 21 50
      C18 55 16 60 15 65
      C20 57 24 51 25 46
      Z"/>

    <!-- Body, neck and head as a single silhouette.
         Traced the way you'd draw one: croup → back → withers → up the
         crest → poll → face → muzzle → under the jaw → throat → chest →
         belly → flank. Keeping the neck a clear diagonal band and the head
         a distinct wedge is what makes it read at small sizes. -->
    <path class="body" d="
      M22 42
      C22 32 30 27 44 26
      C53 25 60 26 64 29
      L92 13
      C96 11 100 11 103 13
      L116 21
      C119 23 119 28 115 29
      L104 27
      C98 26 93 27 89 30
      L73 45
      C71 49 70 53 69 57
      C67 60 63 61 57 61
      C45 62 32 60 26 56
      C22 53 21 47 22 42
      Z"/>

    <!-- The mane. The Lusitano's is long and abundant — it's the feature
         that identifies the breed, so it sits OUTSIDE the neck outline and
         streams backwards at a gallop rather than hugging the crest. -->
    <!-- The mane must sit ON the crest, never wander off it.
         The crest of the neck runs from the withers (64,29) to the poll
         (~96,11). The path below travels the OUTER edge from poll to
         withers, then returns along that exact line — so both ends are
         anchored to the neck and nothing floats free. -->
    <path class="mane" d="
      M96 11
      C88 5 78 7 70 13
      C72 16 71 19 69 21
      C64 17 60 19 57 23
      C60 25 61 27 61 30
      C62 29 63 29 64 29
      L96 11
      Z"/>

    <!-- near-side legs -->
    <g class="leg leg-nh" style="transform-origin:30px 46px">
      <path d="M24 40 L21 56 Q20 60 24 64 L22 84 L21 90 L27 90 L28 84 L31 64
               Q33 60 30 56 L34 42 Z"/>
      <path class="hoof" d="M20 89 L29 89 L28 95 L19 95 Z"/>
    </g>
    <g class="leg leg-nf" style="transform-origin:66px 44px">
      <path d="M61 40 L59 60 L57 80 L56 90 L62 90 L63 80 L66 60 L68 42 Z"/>
      <path class="hoof" d="M55 89 L64 89 L63 95 L54 95 Z"/>
    </g>

  </g>
</svg>`;

    /* --- Three ranks. Further back: smaller, dimmer, slower. --------------- */
    const ranks = [
        { cls: 'rank-back',  count: 4 },
        { cls: 'rank-mid',   count: 3 },
        { cls: 'rank-front', count: 3 }
    ];

    const herd = document.createElement('div');
    herd.className = 'herd';

    ranks.forEach((rank, r) => {
        const row = document.createElement('div');
        row.className = `rank ${rank.cls}`;

        for (let i = 0; i < rank.count; i++) {
            const runner = document.createElement('div');
            runner.className = 'runner';

            // Keep the herd BUNCHED rather than evenly spaced. The starting
            // points sit close together, so they cross the strip as one
            // group — which is how a herd actually moves.
            const spread = 0.17;   // how far apart, as a fraction of the loop
            const along = 0.30 + (i * spread / rank.count) + (r * 0.05);
            runner.style.setProperty('--start', `${-along.toFixed(3)}`);

            // Desynchronise the gait so they don't move as one animal.
            runner.style.setProperty('--phase', `${-((i * 0.13 + r * 0.07) % 0.62).toFixed(3)}s`);

            runner.innerHTML = horse();
            row.appendChild(runner);
        }
        herd.appendChild(row);
    });

    loader.querySelector('.loader-stage').appendChild(herd);

    /* --- Dismiss ---------------------------------------------------------- */
    // Long enough to be seen, short enough not to be in the way.
    const MIN_MS = 1600;
    const started = performance.now();
    let done = false;

    const dismiss = () => {
        if (done) return;
        done = true;
        const wait = Math.max(0, MIN_MS - (performance.now() - started));
        setTimeout(() => {
            loader.classList.add('done');
            document.body.classList.remove('loading');
            setTimeout(() => loader.remove(), 700);
        }, wait);
    };

    if (document.readyState === 'complete') dismiss();
    else window.addEventListener('load', dismiss);

    // Never trap anyone behind the loader if something fails to load.
    setTimeout(dismiss, 5000);
})();
