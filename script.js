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
    
    
    // True Physics-Based WebGL Water Surface Ripple Simulation (One-Time per Hover)
    function initHeroWave() {
        const heroSection = document.getElementById('hero');
        const waveCanvas = document.getElementById('hero-wave-canvas');
        const heroProfileImgContainer = document.getElementById('heroProfileImgContainer') || document.querySelector('.hero-img');
        const heroProfileImg = document.getElementById('heroProfileImg') || (heroProfileImgContainer ? heroProfileImgContainer.querySelector('img') : null);

        if (!heroSection || !waveCanvas || !heroProfileImg) return;

        let gl = null;
        try {
            gl = waveCanvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: true }) ||
                 waveCanvas.getContext('experimental-webgl', { alpha: true, premultipliedAlpha: false });
        } catch (e) {
            gl = null;
        }

        if (!gl) {
            console.warn('WebGL not supported, water simulation skipped');
            return;
        }

        const vsSource = `
            attribute vec2 a_position;
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
            }
        `;

        const fsSource = `
            precision highp float;
            uniform vec2 u_resolution;
            uniform vec2 u_origin;
            uniform float u_time;
            uniform float u_duration;

            vec3 getBgColor(vec2 uv) {
                // Background gradient from #2a6bb4 (top-left) to #9fcdfe (bottom-right)
                float t = clamp((uv.x + (1.0 - uv.y)) * 0.5, 0.0, 1.0);
                vec3 col1 = vec3(0.165, 0.420, 0.706); // #2a6bb4
                vec3 col2 = vec3(0.624, 0.804, 0.996); // #9fcdfe
                return mix(col1, col2, t);
            }

            void main() {
                vec2 st = gl_FragCoord.xy;
                vec2 uv = st / u_resolution;

                if (u_time <= 0.0 || u_time >= u_duration) {
                    gl_FragColor = vec4(0.0);
                    return;
                }

                float dist = length(st - u_origin);
                float speed = 750.0; // px/second wave propagation
                float r0 = u_time * speed;

                float packetWidth = 140.0;
                float diff = dist - r0;

                // Outside wavefront packet: completely transparent
                if (abs(diff) > packetWidth) {
                    gl_FragColor = vec4(0.0);
                    return;
                }

                // Smooth time decay: begins clear at droplet, gracefully dissipates
                float life = clamp(1.0 - (u_time / u_duration), 0.0, 1.0);
                float timeAlpha = life * life;

                // Continuous Gaussian envelope across the ripple packet
                float env = exp(-(diff * diff) / (2.0 * 45.0 * 45.0));

                // Harmonic liquid ripples: wavelength ~ 46px
                float k = 6.2831853 / 46.0;
                float height = env * cos(k * diff) * timeAlpha;

                // Exact analytic surface derivative for razor-smooth liquid normals
                float dEnv = -(diff / 2025.0) * env;
                float dHeight = (dEnv * cos(k * diff) - env * k * sin(k * diff)) * timeAlpha;

                vec2 dir = (dist > 0.001) ? normalize(st - u_origin) : vec2(0.0, 1.0);
                vec2 grad = dir * dHeight;

                // 3D Liquid surface normal
                vec3 normal = normalize(vec3(-grad.x * 24.0, -grad.y * 24.0, 1.0));

                // Snell's Law optical refraction offset on the background
                vec2 refrOffset = normal.xy * (16.0 / u_resolution);
                vec3 refrColor = getBgColor(uv + refrOffset);

                // Blinn-Phong specular sunlight reflection
                vec3 lightDir = normalize(vec3(-0.4, 0.6, 0.9));
                float spec = pow(max(0.0, dot(normal, lightDir)), 32.0);
                vec3 specColor = vec3(1.0, 1.0, 1.0) * spec * 0.8 * timeAlpha;

                // Ambient wave translucency
                float waveStrength = clamp(abs(height) * 4.2 + spec * 1.1, 0.0, 1.0) * life;

                gl_FragColor = vec4(refrColor + specColor, waveStrength);
            }
        `;

        function createShader(gl, type, source) {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error('Shader compile error:', gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        }

        const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
        const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
        if (!vs || !fs) return;

        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program link error:', gl.getProgramInfoLog(program));
            return;
        }

        gl.useProgram(program);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1,
             1, -1,
            -1,  1,
            -1,  1,
             1, -1,
             1,  1
        ]), gl.STATIC_DRAW);

        const posAttr = gl.getAttribLocation(program, 'a_position');
        gl.enableVertexAttribArray(posAttr);
        gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

        const uRes = gl.getUniformLocation(program, 'u_resolution');
        const uOrigin = gl.getUniformLocation(program, 'u_origin');
        const uTime = gl.getUniformLocation(program, 'u_time');
        const uDur = gl.getUniformLocation(program, 'u_duration');

        let width = 0;
        let height = 0;
        let dpr = window.devicePixelRatio || 1;
        const DURATION = 2.4; // 2.4 seconds to sweep across the entire page

        function resizeCanvas() {
            const rect = heroSection.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
            dpr = window.devicePixelRatio || 1;
            waveCanvas.width = width * dpr;
            waveCanvas.height = height * dpr;
            waveCanvas.style.width = width + 'px';
            waveCanvas.style.height = height + 'px';
            gl.viewport(0, 0, waveCanvas.width, waveCanvas.height);
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        let startTime = 0;
        let animationFrameId = null;
        let waveOrigin = { x: 0, y: 0 };
        let waveFiredOnThisHover = false;

        function getImageCenter() {
            const heroRect = heroSection.getBoundingClientRect();
            const imgRect = heroProfileImg.getBoundingClientRect();
            // WebGL Y coordinate is from bottom (0) to top
            return {
                x: ((imgRect.left + imgRect.width / 2) - heroRect.left) * dpr,
                y: (heroRect.height - ((imgRect.top + imgRect.height / 2) - heroRect.top)) * dpr
            };
        }

        function renderFrame(now) {
            const elapsed = (now - startTime) / 1000.0;

            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            if (elapsed < DURATION) {
                gl.useProgram(program);
                gl.uniform2f(uRes, waveCanvas.width, waveCanvas.height);
                gl.uniform2f(uOrigin, waveOrigin.x, waveOrigin.y);
                gl.uniform1f(uTime, elapsed);
                gl.uniform1f(uDur, DURATION);

                gl.drawArrays(gl.TRIANGLES, 0, 6);
                animationFrameId = requestAnimationFrame(renderFrame);
            } else {
                gl.clearColor(0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT);
                animationFrameId = null;
                heroSection.classList.remove('hero-wave-active');
            }
        }

        function triggerSingleWaterWave() {
            if (waveFiredOnThisHover) return;
            waveFiredOnThisHover = true;

            resizeCanvas();
            waveOrigin = getImageCenter();
            startTime = performance.now();

            heroSection.classList.add('hero-wave-active');

            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(renderFrame);
        }

        function resetHoverTrigger() {
            waveFiredOnThisHover = false;
        }

        const targetEl = heroProfileImgContainer || heroProfileImg;

        // One-time per hover
        targetEl.addEventListener('mouseenter', triggerSingleWaterWave);
        targetEl.addEventListener('mouseleave', resetHoverTrigger);

        // Mobile touch support
        targetEl.addEventListener('touchstart', function() {
            triggerSingleWaterWave();
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
