import './style.css';

/**
 * [프로젝트 추가 안내]
 * 기본 프로젝트 카드는 index.html의 #project-list에 포함되어 있습니다.
 * 추후 새로운 수업·연구 프로젝트를 손쉽게 추가하고 싶다면
 * 아래 ADDITIONAL_PROJECTS 배열에 객체를 추가하거나 index.html의 카드를 복사해 주세요.
 */
const ADDITIONAL_PROJECTS = [
  // 예시 (주석을 해제하여 바로 카드를 추가할 수 있습니다):
  // {
  //   title: '[프로젝트명을 입력해 주세요.]',
  //   description: '[수업 또는 연구 프로젝트의 내용을 입력해 주세요.]',
  //   status: '[진행 상태를 입력해 주세요.]',
  //   keywords: ['생성형 AI', '디자인 교육', '미래역량'],
  //   accent: 'accent-mint', // 'accent-lavender' | 'accent-mint' | 'accent-pink'
  // },
];

const KEYWORD_CLASS_MAP = [
  'keyword-lavender',
  'keyword-mint',
  'keyword-pink',
];

/**
 * 추가 프로젝트 데이터 렌더링
 */
function renderAdditionalProjects() {
  const projectList = document.querySelector('#project-list');
  if (!projectList || ADDITIONAL_PROJECTS.length === 0) return;

  ADDITIONAL_PROJECTS.forEach((project) => {
    const article = document.createElement('article');
    const accentClass = project.accent || 'accent-lavender';
    article.className = `glass-card project-card ${accentClass} reveal`;
    article.tabIndex = 0;

    const keywordsHtml = (project.keywords || [])
      .map((kw, idx) => {
        const chipClass = KEYWORD_CLASS_MAP[idx % KEYWORD_CLASS_MAP.length];
        return `<span class="keyword-chip ${chipClass}">${kw}</span>`;
      })
      .join('');

    article.innerHTML = `
      <div class="project-card-header">
        <span class="project-status-badge">
          <span class="status-label">진행 상태</span>
          <span class="status-value placeholder-text">${project.status}</span>
        </span>
      </div>
      <h3 class="project-title placeholder-text">${project.title}</h3>
      <p class="project-description placeholder-text">${project.description}</p>
      <div class="project-keywords" aria-label="핵심 키워드">
        ${keywordsHtml}
      </div>
    `;

    projectList.appendChild(article);
  });
}

/**
 * 모바일 메뉴 열기/닫기 및 접근성 제어
 */
function setupMobileNav() {
  const navToggle = document.querySelector('#nav-toggle');
  const primaryNav = document.querySelector('#primary-nav');

  if (!navToggle || !primaryNav) return;

  const closeMenu = () => {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', '메뉴 열기');
    primaryNav.classList.remove('is-open');
  };

  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeMenu();
    } else {
      navToggle.setAttribute('aria-expanded', 'true');
      navToggle.setAttribute('aria-label', '메뉴 닫기');
      primaryNav.classList.add('is-open');
    }
  });

  // 메뉴 항목 클릭 시 모바일 메뉴 닫기
  primaryNav.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Escape 키 입력 시 모바일 메뉴 닫기
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && primaryNav.classList.contains('is-open')) {
      closeMenu();
      navToggle.focus();
    }
  });
}

/**
 * 부드러운 내부 스크롤 이동 (동작 줄이기 설정 존중)
 */
function setupSmoothScroll() {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  );

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      event.preventDefault();

      targetElement.scrollIntoView({
        behavior: prefersReducedMotion.matches ? 'auto' : 'smooth',
        block: 'start',
      });

      history.pushState(null, '', targetId);
    });
  });
}

/**
 * 스크롤 시 콘텐츠가 자연스럽게 나타나는 효과 (IntersectionObserver)
 */
function setupScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  );

  if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) {
    revealElements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
}

/**
 * 스크롤 위치에 따른 상단 헤더 스타일 및 활성 메뉴 표시
 */
function setupScrollSpy() {
  const header = document.querySelector('.site-header');
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.primary-nav .nav-link');

  const updateHeaderState = () => {
    if (!header) return;
    if (window.scrollY > 16) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', updateHeaderState, { passive: true });
  updateHeaderState();

  if (!('IntersectionObserver' in window)) return;

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const activeId = `#${entry.target.id}`;
          navLinks.forEach((link) => {
            const isMatch = link.getAttribute('href') === activeId;
            link.classList.toggle('active', isMatch);
            if (isMatch) {
              link.setAttribute('aria-current', 'location');
            } else {
              link.removeAttribute('aria-current');
            }
          });
        }
      });
    },
    {
      rootMargin: '-35% 0px -55% 0px',
      threshold: 0,
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

/**
 * 초기화 실행
 */
function init() {
  renderAdditionalProjects();
  setupMobileNav();
  setupSmoothScroll();
  setupScrollReveal();
  setupScrollSpy();
}

init();
