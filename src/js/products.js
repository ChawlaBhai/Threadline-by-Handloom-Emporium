export function initMobileProductCarousel() {
    const grid = document.querySelector('.product-grid');
    if (!grid || window.innerWidth >= 768) return;

    // --- INFINITE LOOP SETUP ---
    const originalCards = Array.from(grid.children);
    const cardCount = originalCards.length;

    // We need 3 sets: [Clone Set 1] [Original Set] [Clone Set 2]
    // 3 sets ensures we can scroll left from start and right from end seamlessly.

    // Append Clones (Set 3)
    originalCards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.classList.remove('active-slide');
        clone.setAttribute('aria-hidden', 'true');
        grid.appendChild(clone);
    });

    // Prepend Clones (Set 1)
    originalCards.reverse().forEach(card => {
        const clone = card.cloneNode(true);
        clone.classList.remove('active-slide');
        clone.setAttribute('aria-hidden', 'true');
        grid.insertBefore(clone, grid.firstChild);
    });

    // Wait for layout to settle to calculate widths
    setTimeout(() => {
        const firstCard = grid.children[0];
        if (!firstCard) return;

        // Calculate precise width of ONE set
        const style = window.getComputedStyle(firstCard);
        const margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
        const width = firstCard.offsetWidth;
        const itemWidth = width + margin;
        const singleSetWidth = itemWidth * cardCount;

        // Initial Position: Start of Middle Set (Set 2)
        // We want to center the first item of the middle set if possible, 
        // or just snap to the start of the middle set.
        // Let's align to the start of the middle set + a little buffer if needed.
        // Actually, just setting scrollLeft to singleSetWidth puts us at the start of the 2nd set.

        // HOWEVER: The carousel is centered flex items? No, standard overflow.
        // The padding-left is 0.
        // So scrollLeft = singleSetWidth is correct.

        let currentScroll = singleSetWidth;
        grid.scrollLeft = currentScroll;

        // --- SCROLL MONITORING ---
        let isPaused = false;
        let autoScrollInterval;

        const handleScroll = () => {
            if (grid.scrollLeft <= 50) {
                // Too far left? Jump to end of 2nd set (or start of 3rd set, same visual spot)
                grid.scrollLeft += singleSetWidth;
            } else if (grid.scrollLeft >= (singleSetWidth * 2) - 50) {
                // Too far right? Jump to start of 2nd set
                grid.scrollLeft -= singleSetWidth;
            }
        };

        grid.addEventListener('scroll', handleScroll, { passive: true });

        // --- AUTO SCROLL ---
        const startAutoScroll = () => {
            clearInterval(autoScrollInterval);
            autoScrollInterval = setInterval(() => {
                if (isPaused) return;
                // Scroll by one item width
                grid.scrollBy({ left: itemWidth, behavior: 'smooth' });
            }, 3000);
        };

        const stopAutoScroll = () => {
            clearInterval(autoScrollInterval);
        };

        // --- INTERACTION ---
        grid.addEventListener('touchstart', () => { isPaused = true; stopAutoScroll(); }, { passive: true });
        grid.addEventListener('touchend', () => { isPaused = false; startAutoScroll(); }, { passive: true });

        // --- ACTIVE HIGHLIGHT ---
        // We need a lower threshold or different logic because multiple cards are visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Primitive "active" toggle. 
                    // Better would be finding the center-most card.
                    // But for now, let's just highlight entering cards.
                    // To avoid multiple highlights, we could rely on CSS :focus or just this.
                    entry.target.classList.add('active-slide');

                    // Remove from siblings if we want strict single highlight?
                    // Let's rely on threshold. Higher threshold = needs to be more visible.
                } else {
                    entry.target.classList.remove('active-slide');
                }
            });
        }, { root: grid, threshold: 0.75 }); // Needs to be mostly visible

        Array.from(grid.children).forEach(card => observer.observe(card));

        // Start
        startAutoScroll();

    }, 100);
}

// Initialize
document.addEventListener('DOMContentLoaded', initMobileProductCarousel);
