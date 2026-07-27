/* ───────────────────────────────────────────────
    PRELOADER & ASSET LOADING BARRIER ENGINE
    Handles SVG progress ring animations, async asset loading,
    and user-gesture game loop initiation.
─────────────────────────────────────────────── */

(function () {
    const overlay = document.getElementById('loading-overlay');
    const svgCircle = document.querySelector('#loading-svg-ring circle');
    const percentEl = document.getElementById('loading-percent');
    const labelEl = document.getElementById('loading-label');
    const startBtn = document.getElementById('btn-start-game');

    if (!overlay || !svgCircle || !startBtn) return;

    // Circumference of SVG circle with r=54 -> 2 * PI * 54 ≈ 339.29
    const RADIUS = 54;
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

    svgCircle.style.strokeDasharray = `${CIRCUMFERENCE} ${CIRCUMFERENCE}`;
    svgCircle.style.strokeDashoffset = CIRCUMFERENCE;

    let currentProgress = 0;
    let targetProgress = 0;
    let isFullyLoaded = false;

    function setProgress(percent, statusText) {
        targetProgress = Math.min(Math.max(percent, 0), 100);
        if (statusText) {
            labelEl.textContent = statusText;
        }
    }

    // Smoothly step progress animation towards target
    function updateProgressUI() {
        if (currentProgress < targetProgress) {
            currentProgress += Math.max((targetProgress - currentProgress) * 0.1, 0.5);
            if (currentProgress > targetProgress) currentProgress = targetProgress;

            const offset = CIRCUMFERENCE - (currentProgress / 100) * CIRCUMFERENCE;
            svgCircle.style.strokeDashoffset = offset;
            percentEl.textContent = `${Math.round(currentProgress)}%`;
        }

        if (currentProgress >= 100 && !isFullyLoaded) {
            isFullyLoaded = true;
            onLoadingComplete();
        } else {
            requestAnimationFrame(updateProgressUI);
        }
    }

    function onLoadingComplete() {
        labelEl.textContent = "SYSTEM READY";
        percentEl.style.display = 'none';

        // Reveal circular start button inside ring
        startBtn.classList.add('ready');
    }

    // Start simulated/async loader gate
    requestAnimationFrame(updateProgressUI);

    // Simulate multi-wasm and asset load stages
    setTimeout(() => setProgress(25, "Loading Wasm Cores..."), 100);
    setTimeout(() => setProgress(55, "Compiling GPU Shaders..."), 400);
    setTimeout(() => setProgress(85, "Generating Grass Landscape..."), 700);
    setTimeout(() => setProgress(100, "Initialization Complete"), 1000);

    // User action trigger: Start Game & Unlock Audio / Loop
    startBtn.addEventListener('click', function () {
        if (!isFullyLoaded) return;

        // Unlock Web Audio Context cleanly on user gesture
        if (typeof initAudio === 'function') {
            initAudio();
        }

        // Fade out preloader overlay
        overlay.classList.add('fade-out');

        setTimeout(() => {
            overlay.style.display = 'none';
            // Start main game loop
            if (typeof startGameLoop === 'function') {
                startGameLoop();
            } else if (typeof animate === 'function') {
                animate();
            }
        }, 600);
    });

    window.WasmPreloader = {
        setProgress: setProgress
    };
})();
