// Matrix Rain Animation
function initMatrixRain() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Characters for matrix rain (mix of Latin and Japanese)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,./<>?~アイウエオカキクケコサシスセソタチツテト';
    
    // Font settings
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    
    // Rain drops
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
    }
    
    // Draw the rain
    function drawMatrix() {
        // Semi-transparent black to create fade effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Set the text style
        ctx.font = `${fontSize}px monospace`;
        
        for (let i = 0; i < drops.length; i++) {
            // Random character
            const text = chars[Math.floor(Math.random() * chars.length)];
            
            // Different colors based on position - more navy blue at the center
            const centerX = canvas.width / 2;
            const distFromCenter = Math.abs(i * fontSize - centerX) / centerX;
            
            if (distFromCenter < 0.3) {
                // More navy blue in center area
                ctx.fillStyle = '#0000aa'; // Dark navy blue
            } else if (Math.random() > 0.98) {
                // Occasional white characters
                ctx.fillStyle = '#ffffff';
            } else if (Math.random() > 0.95) {
                // Some lighter navy blue
                ctx.fillStyle = '#2233aa';
            } else {
                // Default navy blue
                ctx.fillStyle = '#000080';
            }
            
            // Draw the character
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            ctx.fillText(text, x, y);
            
            // Reset when off the bottom of screen
            if (y > canvas.height && Math.random() > 0.98) {
                drops[i] = 0;
            }
            
            // Move rain drops down
            drops[i] += 0.5 + Math.random() * 0.5;
        }
    }
    
    // Animation interval
    const matrixInterval = setInterval(drawMatrix, 50);
    
    // Return interval for cleanup
    return matrixInterval;
}

// Preloader Animation
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Matrix rain
    const matrixInterval = initMatrixRain();
    
    // Add typing effect to preloader title
    const preloaderTitle = document.querySelector('.preloader-title');
    if (preloaderTitle) {
        const titleText = "GNANI'S PORTFOLIO";
        preloaderTitle.textContent = '';
        
        let charIndex = 0;
        const typeInterval = setInterval(() => {
            if (charIndex < titleText.length) {
                preloaderTitle.textContent += titleText.charAt(charIndex);
                charIndex++;
            } else {
                clearInterval(typeInterval);
            }
        }, 100);
    }
    
    // Handle window resize for Matrix rain
    window.addEventListener('resize', function() {
        const canvas = document.getElementById('matrix-canvas');
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    });
    
    // Simple loader - hide after animation completes
    setTimeout(function() {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            
            // Add a listener to remove preloader from DOM after fade out
            preloader.addEventListener('transitionend', function(e) {
                if (e.propertyName === 'opacity') {
                    this.style.display = 'none';
                    
                    // Clear matrix interval when preloader is hidden
                    if (matrixInterval) {
                        clearInterval(matrixInterval);
                    }
                }
            });
        }
    }, 3000); // 3 seconds to show preloader
    
    // Initialize Typed.js for Hero Section
    if (typeof Typed !== 'undefined') {
        const typedElement = document.querySelector('.typing');
        if (typedElement) {
            new Typed('.typing', {
                strings: ["Cybersecurity Specialist", "SOC Analyst", "Threat Detection Engineer", "Incident Response Analyst"],
                typeSpeed: 80,
                backSpeed: 50,
                backDelay: 1500,
                loop: true,
                showCursor: true,
                cursorChar: '|'
            });
        }
    }
    
    // AOS animation initialization (if you're using AOS library)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true
        });
    }
    
    
    // Interactive Liquid Distortion & Refraction Water Wave (One-Time per Hover)
    function initHeroWave() {
        const heroSection = document.getElementById('hero');
        const waveCanvas = document.getElementById('hero-wave-canvas');
        const heroContent = document.querySelector('.hero-content');
        const liquidDisplacement = document.getElementById('liquidDisplacement');
        const liquidTurbulence = document.getElementById('liquidTurbulence');
        const heroProfileImgContainer = document.getElementById('heroProfileImgContainer') || document.querySelector('.hero-img');
        const heroProfileImg = document.getElementById('heroProfileImg') || (heroProfileImgContainer ? heroProfileImgContainer.querySelector('img') : null);

        if (!heroSection || !waveCanvas || !heroProfileImg) return;

        const ctx = waveCanvas.getContext('2d');
        let width = 0;
        let height = 0;
        let dpr = window.devicePixelRatio || 1;
        let wave = null;
        let waveFiredOnThisHover = false;
        let animationFrameId = null;

        function resizeCanvas() {
            const rect = heroSection.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
            dpr = window.devicePixelRatio || 1;
            waveCanvas.width = width * dpr;
            waveCanvas.height = height * dpr;
            waveCanvas.style.width = width + 'px';
            waveCanvas.style.height = height + 'px';
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        function getImageCenter() {
            const heroRect = heroSection.getBoundingClientRect();
            const imgRect = heroProfileImg.getBoundingClientRect();
            return {
                x: (imgRect.left + imgRect.width / 2) - heroRect.left,
                y: (imgRect.top + imgRect.height / 2) - heroRect.top,
                radius: Math.min(imgRect.width, imgRect.height) / 2
            };
        }

        // Real Liquid Water Refraction Wave (Gaussian fluid swell + refraction)
        class LiquidWaterWave {
            constructor(originX, originY, startRadius) {
                this.x = originX;
                this.y = originY;
                this.radius = startRadius;

                const d1 = Math.hypot(originX, originY);
                const d2 = Math.hypot(width - originX, originY);
                const d3 = Math.hypot(originX, height - originY);
                const d4 = Math.hypot(width - originX, height - originY);
                this.maxRadius = Math.max(d1, d2, d3, d4) + 180;

                this.speed = 11; // Fluid wave speed
                this.contentBidded = false;
                this.frame = 0;
            }

            update() {
                this.radius += this.speed;
                this.frame++;

                // Refraction distortion timing: ramp up when wave passes content, ramp down as it passes
                if (liquidDisplacement && heroContent) {
                    const progress = Math.min(1, Math.max(0, this.radius / this.maxRadius));
                    // Smooth bell-shaped envelope for liquid refraction: 0 -> peak ~14 -> 0
                    const refractionIntensity = Math.sin(progress * Math.PI);
                    const currentScale = refractionIntensity * 14;

                    liquidDisplacement.setAttribute('scale', currentScale.toFixed(2));

                    if (liquidTurbulence && this.frame % 2 === 0) {
                        const baseFreqX = (0.012 + Math.sin(this.frame * 0.05) * 0.003).toFixed(4);
                        const baseFreqY = (0.022 + Math.cos(this.frame * 0.05) * 0.004).toFixed(4);
                        liquidTurbulence.setAttribute('baseFrequency', `${baseFreqX} ${baseFreqY}`);
                    }

                    if (currentScale > 1.2) {
                        heroContent.classList.add('liquid-refracting');
                    } else {
                        heroContent.classList.remove('liquid-refracting');
                    }
                }

                // Progressive liquid bob on hero elements as the wave crest reaches them
                if (!this.contentBidded && this.radius > (width * 0.35)) {
                    this.contentBidded = true;
                    triggerSequentialElementBobs();
                }

                return (this.radius - 120) < this.maxRadius;
            }

            draw(ctx) {
                const progress = this.radius / this.maxRadius;
                // Soft liquid dissipation curve merging smoothly into the background
                const alpha = Math.max(0, Math.cos(progress * Math.PI * 0.5));
                if (alpha <= 0.005) return;

                ctx.save();

                // 1. Primary Liquid Lens Swell (Continuous smooth fluid gradient - NO outline strokes!)
                const outerR = this.radius + 35;
                const innerR = Math.max(0, this.radius - 85);
                if (outerR > 10) {
                    const swellGrad = ctx.createRadialGradient(this.x, this.y, innerR, this.x, this.y, outerR);
                    swellGrad.addColorStop(0, 'rgba(42, 107, 180, 0)');
                    swellGrad.addColorStop(0.3, `rgba(42, 107, 180, ${alpha * 0.18})`); // deep water trough
                    swellGrad.addColorStop(0.55, `rgba(159, 205, 254, ${alpha * 0.38})`); // water body
                    swellGrad.addColorStop(0.78, `rgba(223, 240, 255, ${alpha * 0.48})`); // liquid crest
                    swellGrad.addColorStop(0.88, `rgba(255, 255, 255, ${alpha * 0.28})`); // specular surface glint
                    swellGrad.addColorStop(1, 'rgba(42, 107, 180, 0)');

                    ctx.beginPath();
                    ctx.arc(this.x, this.y, outerR, 0, Math.PI * 2);
                    ctx.fillStyle = swellGrad;
                    ctx.fill();
                }

                // 2. Secondary Harmonic Ripple (gentle trailing liquid swell)
                if (this.radius > 95) {
                    const trailOuter = this.radius - 40;
                    const trailInner = Math.max(0, this.radius - 130);
                    const trailGrad = ctx.createRadialGradient(this.x, this.y, trailInner, this.x, this.y, trailOuter);
                    trailGrad.addColorStop(0, 'rgba(42, 107, 180, 0)');
                    trailGrad.addColorStop(0.4, `rgba(42, 107, 180, ${alpha * 0.12})`);
                    trailGrad.addColorStop(0.7, `rgba(159, 205, 254, ${alpha * 0.22})`);
                    trailGrad.addColorStop(0.85, `rgba(223, 240, 255, ${alpha * 0.26})`);
                    trailGrad.addColorStop(1, 'rgba(42, 107, 180, 0)');

                    ctx.beginPath();
                    ctx.arc(this.x, this.y, trailOuter, 0, Math.PI * 2);
                    ctx.fillStyle = trailGrad;
                    ctx.fill();
                }

                ctx.restore();
            }
        }

        function triggerSequentialElementBobs() {
            const elements = [
                document.querySelector('.social-icons'),
                document.querySelector('.hero-buttons'),
                document.querySelector('.hero-content p'),
                document.querySelector('.hero-content h2'),
                document.querySelector('.hero-content h1')
            ].filter(Boolean);

            elements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('water-bob');
                    setTimeout(() => {
                        el.classList.remove('water-bob');
                    }, 850);
                }, index * 90);
            });
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            if (wave) {
                const alive = wave.update();
                if (alive) {
                    wave.draw(ctx);
                    animationFrameId = requestAnimationFrame(animate);
                } else {
                    wave = null;
                    ctx.clearRect(0, 0, width, height);
                    if (liquidDisplacement) liquidDisplacement.setAttribute('scale', '0');
                    if (heroContent) heroContent.classList.remove('liquid-refracting');
                    heroSection.classList.remove('hero-wave-active');
                    animationFrameId = null;
                }
            } else {
                ctx.clearRect(0, 0, width, height);
                animationFrameId = null;
            }
        }

        // Sends the liquid water refraction wave EXACTLY ONE TIME on hover
        function triggerSingleLiquidWave() {
            if (waveFiredOnThisHover) return;
            waveFiredOnThisHover = true;

            const center = getImageCenter();
            wave = new LiquidWaterWave(center.x, center.y, center.radius * 0.95);

            heroSection.classList.add('hero-wave-active');

            if (!animationFrameId) {
                animate();
            }
        }

        function resetHoverTrigger() {
            waveFiredOnThisHover = false;
        }

        const targetEl = heroProfileImgContainer || heroProfileImg;

        // One-time per hover
        targetEl.addEventListener('mouseenter', triggerSingleLiquidWave);
        targetEl.addEventListener('mouseleave', resetHoverTrigger);

        // Touch support
        targetEl.addEventListener('touchstart', function() {
            triggerSingleLiquidWave();
        }, { passive: true });

        targetEl.addEventListener('touchend', function() {
            setTimeout(resetHoverTrigger, 800);
        }, { passive: true });
    }

    // Initialize Hero Wave
    initHeroWave();

    // Mobile Menu Toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileNavToggle && navMenu) {
        mobileNavToggle.addEventListener('click', function(e) {
            e.preventDefault();
            navMenu.classList.toggle('active');
            navMenu.classList.toggle('d-none');
            this.classList.toggle('active');
            
            // Toggle between menu and close icon
            const icon = this.querySelector('i');
            if (icon) {
                if (icon.classList.contains('fa-bars')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
            
            // Log for debugging
            console.log('Mobile menu toggled', {
                active: navMenu.classList.contains('active'),
                dNone: navMenu.classList.contains('d-none')
            });
        });
        
        // Close mobile menu when clicking on a nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Close mobile menu if open on mobile devices
                if (window.innerWidth < 768) {
                    navMenu.classList.remove('active');
                    navMenu.classList.add('d-none');
                    mobileNavToggle.classList.remove('active');
                    
                    // Reset icon to bars
                    const icon = mobileNavToggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Smooth scroll with offset for header
                    window.scrollTo({
                        top: targetElement.offsetTop - 70,
                        behavior: 'smooth'
                    });
                    
                    // Update active nav link
                    document.querySelectorAll('.nav-link').forEach(navLink => {
                        navLink.classList.remove('active');
                    });
                    this.classList.add('active');
                }
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (window.innerWidth < 768 && 
                navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                e.target !== mobileNavToggle) {
                
                navMenu.classList.remove('active');
                navMenu.classList.add('d-none');
                mobileNavToggle.classList.remove('active');
                
                // Reset icon to bars
                const icon = mobileNavToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }
    
    // Project Filtering
    const projectFilterButtons = document.querySelectorAll('.project-filters button');
    if (projectFilterButtons.length > 0) {
        projectFilterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active button
                projectFilterButtons.forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                document.querySelectorAll('.project-item').forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Contact Form Submission with FormSubmit.co and direct inbox delivery
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const TARGET_EMAIL = 'gnanaprakash2956@gmail.com';

        function getISTTimestamp() {
            const now = new Date();
            const dateStr = now.toLocaleDateString('en-IN', {
                timeZone: 'Asia/Kolkata',
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            const timeStr = now.toLocaleTimeString('en-IN', {
                timeZone: 'Asia/Kolkata',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
            return `${dateStr} ${timeStr} (IST)`;
        }
        const submitBtn = document.getElementById('contactSubmitBtn');
        const submitBtnText = document.getElementById('submitBtnText');
        const formFeedback = document.getElementById('formFeedback');
        const directMailtoBtn = document.getElementById('directMailtoBtn');

        const nameInput = contactForm.querySelector('[name="name"]');
        const emailInput = contactForm.querySelector('[name="email"]');
        const subjectInput = contactForm.querySelector('[name="subject"]');
        const messageInput = contactForm.querySelector('[name="message"]');

        function updateMailto() {
            if (!directMailtoBtn) return;
            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const subject = subjectInput && subjectInput.value.trim() ? subjectInput.value.trim() : 'SOC Analyst Portfolio Inquiry';
            const message = messageInput ? messageInput.value.trim() : '';
            const istTime = getISTTimestamp();
            const body = `${message}\n\n---\nFrom: ${name || 'Website Visitor'}\nEmail: ${email || 'Not provided'}\nSubmitted at: ${istTime}`;
            directMailtoBtn.href = `mailto:${TARGET_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        }

        if (nameInput) nameInput.addEventListener('input', updateMailto);
        if (emailInput) emailInput.addEventListener('input', updateMailto);
        if (subjectInput) subjectInput.addEventListener('input', updateMailto);
        if (messageInput) messageInput.addEventListener('input', updateMailto);

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const subject = subjectInput ? subjectInput.value.trim() : 'Portfolio Contact';
            const message = messageInput ? messageInput.value.trim() : '';

            if (!name || !email || !message) {
                if (formFeedback) {
                    formFeedback.style.display = 'block';
                    formFeedback.innerHTML = '<div class="alert alert-warning mb-0"><i class="fas fa-exclamation-triangle me-2"></i>Please fill in all required fields.</div>';
                }
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                if (formFeedback) {
                    formFeedback.style.display = 'block';
                    formFeedback.innerHTML = '<div class="alert alert-warning mb-0"><i class="fas fa-exclamation-circle me-2"></i>Please enter a valid email address.</div>';
                }
                return;
            }

            // Disable button and show sending spinner
            if (submitBtn) {
                submitBtn.disabled = true;
                if (submitBtnText) submitBtnText.textContent = 'Sending...';
                const icon = submitBtn.querySelector('i');
                if (icon) icon.className = 'fas fa-spinner fa-spin me-2';
            }
            if (formFeedback) formFeedback.style.display = 'none';
            const istTime = getISTTimestamp();
            const istInput = document.getElementById('submittedAtIST');
            if (istInput) istInput.value = istTime;

            try {
                const response = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        subject: subject,
                        message: message,
                        "Submitted at (IST)": istTime,
                        "Timezone": "India Standard Time (IST, UTC+05:30)",
                        _subject: `[SOC Portfolio] ${subject} - from ${name} [${istTime}]`,
                        _template: 'table',
                        _captcha: 'false'
                    })
                });

                const data = await response.json();

                if (response.ok && (data.success === 'true' || data.success === true)) {
                    if (formFeedback) {
                        formFeedback.style.display = 'block';
                        formFeedback.innerHTML = `<div class="alert alert-success mb-0"><i class="fas fa-check-circle me-2"></i><strong>Thank you, ${name}!</strong> Your message has been sent directly to ${TARGET_EMAIL} at <strong>${istTime}</strong>. I will get back to you shortly.</div>`;
                    }
                    contactForm.reset();
                    updateMailto();
                } else {
                    throw new Error(data.message || 'Submission error');
                }
            } catch (err) {
                console.warn('Direct delivery fallback:', err);
                const mailtoUrl = `mailto:${TARGET_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message + '\n\n---\nFrom: ' + name + '\nEmail: ' + email)}`;
                if (formFeedback) {
                    formFeedback.style.display = 'block';
                    formFeedback.innerHTML = `<div class="alert alert-info mb-0"><i class="fas fa-info-circle me-2"></i>Notice: Direct delivery encountered a network block. <a href="${mailtoUrl}" class="alert-link text-decoration-underline fw-bold">Click here to send directly via your mail client</a>.</div>`;
                }
                window.location.href = mailtoUrl;
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    if (submitBtnText) submitBtnText.textContent = 'Send Message';
                    const icon = submitBtn.querySelector('i');
                    if (icon) icon.className = 'fas fa-paper-plane me-2';
                }
            }
        });
    }
});

// Sticky Header Effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Update active nav link on scroll
        let currentSection = '';
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = '#' + section.getAttribute('id');
            }
        });
        
        if (currentSection) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === currentSection) {
                    link.classList.add('active');
                }
            });
        }
    }
});
// Copy Query Helper for Detection Query Library
function copyQuery(btn, codeId) {
    const el = document.getElementById(codeId);
    if (!el) return;
    navigator.clipboard.writeText(el.innerText).then(() => {
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check me-1"></i> Copied!';
        setTimeout(() => { btn.innerHTML = orig; }, 2000);
    }).catch(err => {
        console.error('Copy failed:', err);
    });
}
window.copyQuery = copyQuery;

// Certificate Modal Image Loader
document.addEventListener('DOMContentLoaded', function() {
    const certModal = document.getElementById('certificateModal');
    if (certModal) {
        certModal.addEventListener('show.bs.modal', function(event) {
            const button = event.relatedTarget;
            if (button) {
                const certSrc = button.getAttribute('data-certificate');
                const modalImg = certModal.querySelector('#modalCertificateImage');
                if (modalImg && certSrc) {
                    modalImg.src = certSrc;
                }
            }
        });
    }
});
