import '../css/main.css';
import '../css/hero.css';
import '../css/whatsapp.css';
import '../css/value-props.css';
import '../css/ribbon.css';
import '../css/products.css';
import '../css/social-proof.css';
import '../css/process.css';
import '../css/footer.css';
import '../css/loader.css'; // New Preloader CSS
import './animations.js';
import './products.js';

console.log('Threadline website loaded.');

// Preloader Logic
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Minimum wait time to prevent flickering on fast loads
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.remove(); // Remove from DOM after transition
            }, 500);
        }, 500);
    }
});
