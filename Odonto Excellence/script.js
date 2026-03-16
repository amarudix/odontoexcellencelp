/**
 * ODONTO EXCELLENCE – script.js
 * Autor: Amaru Marketing & Design
 * ---------------------------------------------------------------
 * Responsabilidades:
 * 1. Menu hambúrguer (mobile)
 * 2. Navbar — adicionar classe .scrolled ao rolar
 * 3. Fechar barra de urgência
 * 4. Animações de scroll com IntersectionObserver
 * 5. Delay nas animações via data-delay
 * 6. Highlight do link ativo no menu
 * 7. Botão WhatsApp flutuante — mostrar após 3s
 */

/* ---------------------------------------------------------------
   Espera o DOM estar carregado
--------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------------
     1. REFERÊNCIAS AOS ELEMENTOS
  --------------------------------------------------------------- */
  const navbar      = document.getElementById('navbar');
  const navToggle   = document.getElementById('navToggle');
  const navLinks    = document.getElementById('navLinks');
  const urgencyBar  = document.getElementById('urgencyBar');
  const urgencyClose= document.getElementById('urgencyClose');
  const wfFloat     = document.getElementById('wfFloat');
  const allNavLinks = document.querySelectorAll('.nav-link');
  const sections    = document.querySelectorAll('section[id]');
  const animEls     = document.querySelectorAll('[data-animate]');

  /* ---------------------------------------------------------------
     2. MENU HAMBURGER (MOBILE)
  --------------------------------------------------------------- */
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Fecha o menu ao clicar em qualquer link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Fecha ao clicar fora do menu
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------------------------------------------------------------
     3. NAVBAR — CLASSE .scrolled AO ROLAR
  --------------------------------------------------------------- */
  const updateNavbar = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar(); // executa ao carregar

  /* ---------------------------------------------------------------
     4. FECHAR BARRA DE URGÊNCIA
  --------------------------------------------------------------- */
  if (urgencyClose && urgencyBar) {
    urgencyClose.addEventListener('click', () => {
      urgencyBar.style.maxHeight = urgencyBar.scrollHeight + 'px';
      urgencyBar.style.overflow  = 'hidden';
      urgencyBar.style.transition = 'max-height .4s ease, padding .4s ease, opacity .3s ease';

      requestAnimationFrame(() => {
        urgencyBar.style.maxHeight = '0';
        urgencyBar.style.paddingTop    = '0';
        urgencyBar.style.paddingBottom = '0';
        urgencyBar.style.opacity   = '0';
      });

      setTimeout(() => urgencyBar.remove(), 420);
    });
  }

  /* ---------------------------------------------------------------
     5. ANIMAÇÕES DE SCROLL (IntersectionObserver)
     Adiciona a classe .is-visible quando o elemento entra na tela,
     respeitando o delay definido em data-delay (em ms).
  --------------------------------------------------------------- */

  // Aplica delay inline antes do observer rodar
  animEls.forEach(el => {
    const delay = el.dataset.delay;
    if (delay) {
      el.style.transitionDelay = parseInt(delay, 10) + 'ms';
    }
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // dispara apenas 1 vez
          }
        });
      },
      {
        threshold: 0.12,   // 12% visível já dispara
        rootMargin: '0px 0px -48px 0px' // inicia um pouco antes do fim
      }
    );

    animEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: exibe tudo imediatamente em browsers antigos
    animEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------------------------------------------------------------
     6. LINK ATIVO NO MENU — destaca a seção atual durante o scroll
  --------------------------------------------------------------- */
  const updateActiveLink = () => {
    let current = '';
    const offset = navbar.offsetHeight + 20;

    sections.forEach(section => {
      const top = section.offsetTop - offset;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    allNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  /* ---------------------------------------------------------------
     7. BOTÃO WHATSAPP FLUTUANTE
     Começa invisível e aparece suavemente após 3 segundos
  --------------------------------------------------------------- */
  if (wfFloat) {
    // Começa oculto via CSS inline
    wfFloat.style.opacity    = '0';
    wfFloat.style.transform  = 'scale(0.7)';
    wfFloat.style.transition = 'opacity .5s ease, transform .5s ease';

    setTimeout(() => {
      wfFloat.style.opacity   = '1';
      wfFloat.style.transform = 'scale(1)';
    }, 3000); // aparece após 3 segundos
  }

  /* ---------------------------------------------------------------
     8. SMOOTH SCROLL para links internos (fallback para browsers
     que não suportam scroll-behavior CSS nativo)
  --------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navH = navbar ? navbar.offsetHeight : 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navH - 8;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

  /* ---------------------------------------------------------------
     9. TRACKING DE CLIQUES NOS BOTÕES CTA (CRO)
     Log no console — pronto para integrar com Google Analytics / Meta Pixel
  --------------------------------------------------------------- */
  document.querySelectorAll('.btn-primary, .btn-white, .wf-float').forEach(btn => {
    btn.addEventListener('click', () => {
      const label = btn.textContent.trim().replace(/\s+/g, ' ').substring(0, 60);
      const section = btn.closest('section')?.id || 'unknown';

      // Descomente e adapte para seu sistema de analytics:
      // gtag('event', 'cta_click', { event_category: 'CTA', event_label: label, section });
      // fbq('track', 'Lead');

      console.info(`[CTA Click] Seção: ${section} | Texto: "${label}"`);
    });
  });

  /* ---------------------------------------------------------------
     10. CONTADORES ANIMADOS NAS ESTATÍSTICAS DO HERO
     Anima os números ao entrar na tela.
  --------------------------------------------------------------- */
  const counterEls = document.querySelectorAll('.stat-item strong');

  const parseCounter = (text) => {
    const clean = text.replace(/[^\d]/g, '');
    return parseInt(clean, 10) || 0;
  };

  const formatCounter = (original, val) => {
    if (original.startsWith('+')) return `+${val.toLocaleString('pt-BR')}`;
    if (original.endsWith('%')) return `${val}%`;
    if (original.endsWith('+')) return `${val}+`;
    return val.toLocaleString('pt-BR');
  };

  const animateCounter = (el) => {
    const original  = el.textContent.trim();
    const target    = parseCounter(original);
    const duration  = 1800;
    const startTime = performance.now();

    if (target === 0) return;

    const step = (now) => {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing out-quad para desacelerar no final
      const eased    = 1 - (1 - progress) * (1 - progress);
      const current  = Math.round(eased * target);

      el.textContent = formatCounter(original, current);

      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counterEls.forEach(el => counterObserver.observe(el));
  }

  /* ---------------------------------------------------------------
     11. EFEITO PARALLAX SUAVE NO HERO (apenas desktop)
  --------------------------------------------------------------- */
  const heroShapes = document.querySelectorAll('.hero-shape');

  if (window.matchMedia('(min-width: 1024px)').matches && heroShapes.length) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      heroShapes.forEach((shape, i) => {
        const factor = i === 0 ? 0.3 : 0.15;
        shape.style.transform = `translateY(${scrollY * factor}px)`;
      });
    }, { passive: true });
  }

}); // fim DOMContentLoaded
