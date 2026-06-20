document.addEventListener('DOMContentLoaded', () => {

    // --- 0. Smooth Scrolling (Lenis) ---
    if (typeof Lenis !== 'undefined') {
        window.lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time) {
            window.lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // --- 0.1 Ambient Dust Canvas ---
    const canvas = document.getElementById('ambient-dust');
    if(canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
        window.addEventListener('resize', resize);
        resize();
        
        class DustParticle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 0.4 - 0.2;
                this.speedY = Math.random() * -0.4 - 0.1;
                this.opacity = Math.random() * 0.4 + 0.1;
            }
            update() {
                this.x += this.speedX; this.y += this.speedY;
                if (this.y < 0) { this.y = canvas.height; this.x = Math.random() * canvas.width; }
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            }
            draw() {
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
            }
        }
        for (let i = 0; i < 70; i++) particles.push(new DustParticle());
        function animateDust() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animateDust);
        }
        animateDust();
    }

    // --- 1. Intersection Observer for Dreamy Fade-Ins & Animations ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                if(entry.target.classList.contains('bar-anim')) {
                    entry.target.style.width = entry.target.getAttribute('data-width');
                }
                
                if(entry.target.classList.contains('fps-counter')) {
                    const target = +entry.target.getAttribute('data-target');
                    let count = 0;
                    const speed = target / 60;
                    function updateCount() {
                        count += speed;
                        if(count < target) {
                            entry.target.innerText = Math.ceil(count);
                            requestAnimationFrame(updateCount);
                        } else {
                            entry.target.innerText = target;
                        }
                    }
                    updateCount();
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up, .fade-in, .mask-wrap, .bar-anim, .fps-counter').forEach(el => {
        observer.observe(el);
    });

    // --- 2. Navbar Soft Scroll Effect ---
    const nav = document.querySelector('.glass-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // --- 3. Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('.glass-nav').offsetHeight;
                
                if (window.lenis) {
                    window.lenis.scrollTo(targetSection, { offset: -navHeight - 40, duration: 1.5 });
                } else {
                    const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navHeight - 40;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                }
            }
        });
    });

    // --- 4. Custom Cursor Logic ---
    const cursor = document.querySelector('.custom-cursor');
    
    document.addEventListener('mousemove', e => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    const interactiveElements = document.querySelectorAll('a, button, select, .magnetic-btn, .glass-card, [data-magnetic]');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
});

// --- 5. Modrinth-Style Modal Logic ---

function openModal() {
    document.getElementById('downloadModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('downloadModal').classList.remove('show');
    document.body.style.overflow = '';
    
    // Reset selection
    document.getElementById('gameVersionSelect').value = '';
    document.getElementById('loaderSelect').value = '';
    document.getElementById('gameVersionDropdown').querySelector('.selected-text').innerText = 'Choose version...';
    document.getElementById('loaderDropdown').querySelector('.selected-text').innerText = 'Choose loader...';
    document.getElementById('downloadAction').classList.add('hidden');
    
    // Close any open dropdowns
    document.querySelectorAll('.dropdown-options').forEach(opt => opt.classList.remove('show'));
    document.querySelectorAll('.dropdown-selected').forEach(sel => sel.classList.remove('active'));
}

// Custom Dropdown Logic
function toggleDropdown(id) {
    const dropdown = document.getElementById(id);
    const options = dropdown.querySelector('.dropdown-options');
    const selected = dropdown.querySelector('.dropdown-selected');
    
    // Close other dropdowns
    document.querySelectorAll('.custom-dropdown').forEach(d => {
        if (d.id !== id) {
            d.querySelector('.dropdown-options').classList.remove('show');
            d.querySelector('.dropdown-selected').classList.remove('active');
        }
    });

    options.classList.toggle('show');
    selected.classList.toggle('active');
}

function selectOption(dropdownId, value) {
    const dropdown = document.getElementById(dropdownId);
    const input = dropdown.querySelector('input');
    const selectedText = dropdown.querySelector('.selected-text');
    
    input.value = value;
    selectedText.innerText = value.includes('Latest') ? value.split(' ')[0] : value;
    
    // Close dropdown
    dropdown.querySelector('.dropdown-options').classList.remove('show');
    dropdown.querySelector('.dropdown-selected').classList.remove('active');
    
    updateDownloadOptions();
}

// Close dropdowns if clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-dropdown')) {
        document.querySelectorAll('.dropdown-options').forEach(opt => opt.classList.remove('show'));
        document.querySelectorAll('.dropdown-selected').forEach(sel => sel.classList.remove('active'));
    }
});

function updateDownloadOptions() {
    const version = document.getElementById('gameVersionSelect').value;
    const loader = document.getElementById('loaderSelect').value;
    
    if (version && loader) {
        let fileVersion = version;
        let compatRange = version;
        
        if (version.startsWith("1.21")) {
            fileVersion = "1.21";
            compatRange = "1.21 - 1.21.11";
        }
        
        document.getElementById('selectedFileName').innerText = `sodium-charged-1.3.8+${fileVersion}.jar`;
        document.getElementById('compatRange').innerText = compatRange;
        document.getElementById('downloadAction').classList.remove('hidden');
    } else {
        document.getElementById('downloadAction').classList.add('hidden');
    }
}

function triggerDownload() {
    setTimeout(() => {
        closeModal();
    }, 500);
}

// --- 6. Mouse Tracking Glass Glow ---
const trackingCards = document.querySelectorAll('.tracking-card');
document.body.addEventListener('mousemove', e => {
    trackingCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// --- 7. Magnetic Buttons ---
document.querySelectorAll('[data-magnetic]').forEach(element => {
    element.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Intensity of the pull
        const intensity = 0.3;
        
        this.style.transform = `translate(${x * intensity}px, ${y * intensity}px)`;
    });

    element.addEventListener('mouseleave', function() {
        this.style.transform = 'translate(0px, 0px)';
        this.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });
    
    element.addEventListener('mouseenter', function() {
        this.style.transition = 'none';
    });
});

// --- 8. 3D Tilt Physics ---
document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.transition = 'none';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        card.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
    });
});
