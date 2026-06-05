document.addEventListener('DOMContentLoaded', () => {
    /* --- 1. Fake Download Counter --- */
    const counterElement = document.getElementById('downloadsCounter');
    let currentDownloads = 14285;
    
    const formatNumber = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    setInterval(() => {
        if (Math.random() > 0.6) {
            const increment = Math.floor(Math.random() * 4) + 1;
            currentDownloads += increment;
            
            counterElement.style.color = '#93C5FD';
            counterElement.style.transform = 'scale(1.1)';
            counterElement.style.textShadow = '0 0 20px rgba(147, 197, 253, 0.8)';
            
            setTimeout(() => {
                counterElement.innerText = formatNumber(currentDownloads);
            }, 100);

            setTimeout(() => {
                counterElement.style.color = '';
                counterElement.style.transform = 'scale(1)';
                counterElement.style.textShadow = 'none';
            }, 400);
        }
    }, 1500);

    /* --- 2. Smooth Scrolling & Navbar Effect --- */
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    /* --- 3. Scroll Reveal Animations --- */
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    // Add reveal class to cards dynamically
    document.querySelectorAll('.feature-card, .download-box').forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });
});

/* --- 4. Modal & Download Logic --- */
function openModal() {
    document.getElementById('downloadModal').classList.add('show');
}

function closeModal() {
    document.getElementById('downloadModal').classList.remove('show');
    // Reset selection
    document.querySelectorAll('.version-item').forEach(el => el.classList.remove('selected'));
    document.getElementById('downloadAction').classList.add('hidden');
}

function selectVersion(version) {
    // UI Update
    document.querySelectorAll('.version-item').forEach(el => el.classList.remove('selected'));
    event.currentTarget.classList.add('selected');

    // Show download action
    document.getElementById('selectedVerText').innerText = 'Minecraft ' + version;
    document.getElementById('selectedFileName').innerText = 'sodium-charged-1.3.8.jar';
    document.getElementById('downloadAction').classList.remove('hidden');
}

function triggerDownload() {
    // Add a slight delay before closing modal to ensure download starts
    setTimeout(() => {
        closeModal();
    }, 500);
}
