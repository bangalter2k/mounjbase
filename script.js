// Script para a landing page otimizada - Mobile First

document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect - simplificado para evitar bugs
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            header.style.padding = '8px 0';
        } else {
            header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            header.style.padding = '12px 0';
        }
        
        lastScrollY = currentScrollY;
    });

    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animação simples de entrada para cards (sem parallax)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Aplicar animação aos cards
    const animatedElements = document.querySelectorAll('.benefit-card, .product-card, .testimonial-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Otimização para touch devices
    if ('ontouchstart' in window) {
        // Adicionar classe para dispositivos touch
        document.body.classList.add('touch-device');
        
        // Melhorar responsividade dos botões em dispositivos touch
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });
            
            btn.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }

    // Prevenção de zoom acidental em inputs (iOS)
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            if (window.innerWidth < 768) {
                document.querySelector('meta[name="viewport"]').setAttribute('content', 
                    'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
            }
        });
        
        input.addEventListener('blur', function() {
            document.querySelector('meta[name="viewport"]').setAttribute('content', 
                'width=device-width, initial-scale=1.0');
        });
    });

    // Lazy loading para imagens (performance mobile)
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    images.forEach(img => {
        if (img.dataset.src) {
            imageObserver.observe(img);
        }
    });

    // Otimização do botão flutuante do WhatsApp
    const whatsappFloat = document.querySelector('.whatsapp-float');
    if (whatsappFloat) {
        let isVisible = true;
        let hideTimeout;

        window.addEventListener('scroll', function() {
            if (hideTimeout) {
                clearTimeout(hideTimeout);
            }

            if (!isVisible) {
                whatsappFloat.style.opacity = '1';
                whatsappFloat.style.transform = 'scale(1)';
                isVisible = true;
            }

            hideTimeout = setTimeout(() => {
                // Manter sempre visível em mobile para melhor conversão
                if (window.innerWidth >= 768) {
                    whatsappFloat.style.opacity = '0.8';
                }
            }, 3000);
        });
    }

    // Analytics de cliques nos botões (para otimização de conversão)
    const ctaButtons = document.querySelectorAll('.btn');
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Aqui você pode adicionar tracking de conversão
            console.log('CTA clicked:', this.textContent.trim());
        });
    });
});

// Função para otimizar performance em dispositivos móveis
function optimizeForMobile() {
    // Reduzir animações em dispositivos com pouca bateria
    if ('getBattery' in navigator) {
        navigator.getBattery().then(function(battery) {
            if (battery.level < 0.2) {
                document.body.classList.add('low-battery');
                // Desabilitar animações desnecessárias
                const style = document.createElement('style');
                style.textContent = `
                    .low-battery * {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                `;
                document.head.appendChild(style);
            }
        });
    }
}

// Executar otimizações
optimizeForMobile();

