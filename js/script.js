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
                strings: ["SOC Analyst", "Threat Detection Engineer", "Cybersecurity Specialist", "Incident Response Analyst"],
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
    
    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = this.querySelector('[name="name"]').value;
            const email = this.querySelector('[name="email"]').value;
            const subject = this.querySelector('[name="subject"]').value;
            const message = this.querySelector('[name="message"]').value;
            
            // Here you would normally send the data to a server
            // For now, let's just log it to the console
            console.log('Form submitted with:', { name, email, subject, message });
            
            // Show success message
            alert('Thank you for your message! I will get back to you soon.');
            
            // Reset form
            this.reset();
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
