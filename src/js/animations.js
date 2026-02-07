/* Scroll Animation Observer & Ribbon Logic */
document.addEventListener('DOMContentLoaded', () => {
    // 1. General Fade In Observer
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const scrollElements = document.querySelectorAll('.js-scroll-fade');
    scrollElements.forEach(el => observer.observe(el));

    // 2. Heritage Ribbon Logic
    const ribbonWrapper = document.querySelector('.heritage-wrapper');
    const ribbonTrack = document.getElementById('ribbonTrack');

    if (ribbonWrapper && ribbonTrack) {

        // --- MOBILE: ENTRY ANIMATION ONLY ---
        // We use a separate observer to trigger the fade-in on mobile
        if (window.innerWidth < 768) {
            ribbonTrack.classList.add('mobile-hidden'); // Prepare for anim

            const mobileObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('mobile-visible');
                        entry.target.classList.remove('mobile-hidden');
                        mobileObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            mobileObserver.observe(ribbonTrack);
        }

        // --- DESKTOP: STICKY SCROLL ANIMATION ---
        // This listener runs ALWAYS but checks width inside to be safe on resize
        window.addEventListener('scroll', () => {
            if (window.innerWidth < 768) return; // Ignore on Mobile

            const startX = 40;
            const endX = -60;
            const rect = ribbonWrapper.getBoundingClientRect();
            const winHeight = window.innerHeight;
            const wrapperHeight = rect.height;
            const stickyHeight = winHeight;
            const scrollDist = wrapperHeight - stickyHeight;

            let animPercent = 0;
            const pinnedEndPercent = 0.70;

            // PHASE 1: Entry
            if (rect.top > 0 && rect.top <= winHeight) {
                const entryProgress = 1 - (rect.top / winHeight);
                animPercent = entryProgress * 0.20;
            }
            // PHASE 2: Pinned
            else if (rect.top <= 0 && rect.top >= -scrollDist) {
                const scrolled = Math.abs(rect.top);
                const stickyProgress = scrolled / scrollDist;
                const phaseDuration = pinnedEndPercent - 0.20;
                animPercent = 0.20 + (stickyProgress * phaseDuration);
            }
            // PHASE 3: Exit
            else if (rect.top < -scrollDist) {
                const exitDist = Math.abs(rect.top) - scrollDist;
                const exitProgress = Math.min(1, exitDist / winHeight);
                const remaining = 1.0 - pinnedEndPercent;
                animPercent = pinnedEndPercent + (exitProgress * remaining);
            }

            // Interpolate & Apply
            const currentX = startX + (endX - startX) * animPercent;
            ribbonTrack.style.transform = `translateY(-50%) translateX(${currentX}%)`;
        }, { passive: true });
    }

    // 3. Process Timeline
    const processTimeline = document.querySelector('.process-timeline');
    if (processTimeline) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-line');
                    entry.target.querySelectorAll('.process-step').forEach(step => step.classList.add('animate-step'));
                    timelineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        timelineObserver.observe(processTimeline);
    }

    // 4. Number Counters
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const targetText = counter.innerText;
                    const targetValue = parseInt(targetText.replace(/\D/g, ''));
                    const suffix = targetText.replace(/[0-9]/g, '');
                    let startValue = 0;
                    const duration = 2000;
                    const frameDuration = 1000 / 60;
                    const totalFrames = Math.round(duration / frameDuration);
                    const increment = targetValue / totalFrames;
                    let currentFrame = 0;
                    const timer = setInterval(() => {
                        currentFrame++;
                        startValue += increment;
                        if (currentFrame >= totalFrames) {
                            counter.innerText = targetValue + suffix;
                            clearInterval(timer);
                        } else {
                            counter.innerText = Math.floor(startValue) + suffix;
                        }
                    }, frameDuration);
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(counter => counterObserver.observe(counter));
    }
});
