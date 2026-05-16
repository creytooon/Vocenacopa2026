// ════════════════════════════════════════════════════════════════
// PAGES · 4 rotas + mini hash-router + GlobalVideoBackground
// ════════════════════════════════════════════════════════════════

// ─── Mini hash-router ─────────────────────────────────────────────

function _hashToPath(hash) {
  if (!hash || hash === '#' || hash === '#/') return '/';
  return hash.startsWith('#/') ? hash.slice(1) : '/';
}

let _pendingSection = null;

function navigateTo(path, section) {
  if (section) _pendingSection = section;
  window.location.hash = '#' + path;
}

function _consumeSection() {
  const s = _pendingSection;
  _pendingSection = null;
  return s;
}

function useRoute() {
  const [path, setPath] = React.useState(() => _hashToPath(window.location.hash));
  React.useEffect(() => {
    const handler = () => setPath(_hashToPath(window.location.hash));
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);
  return path;
}

const AppLink = ({ to, section, children, className, style, onClick: outerClick, ...rest }) => {
  const handleClick = (e) => {
    e.preventDefault();
    if (outerClick) outerClick(e);
    navigateTo(to, section);
  };
  return (
    <a href={'#' + to} onClick={handleClick} className={className} style={style} {...rest}>
      {children}
    </a>
  );
};

// ─── Hooks de página ──────────────────────────────────────────────

function usePageScroll() {
  React.useEffect(() => {
    const target = _consumeSection();
    if (target) {
      setTimeout(() => {
        const el = document.getElementById(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    } else {
      window.scrollTo(0, 0);
    }
  }, []);
}

function usePageMeta({ title, description }) {
  React.useEffect(() => {
    if (title) document.title = title;
    if (description) {
      const el = document.querySelector('meta[name="description"]');
      if (el) el.setAttribute('content', description);
    }
  }, [title, description]);
}

// ─── Global Video Background ──────────────────────────────────────

const VIDEO_BY_ROUTE = {
  '/':                 'videos/hero-bg',
  '/pacotes':          'videos/hero-bg-alt',
  '/monte-seu-pacote': 'videos/visto-loop',
  '/sobre':            'videos/fans-loop',
  '/visto':            'videos/visto-loop'
};

const GlobalVideoBackground = () => {
  const path = useRoute();
  const src = VIDEO_BY_ROUTE[path] || 'hero-bg';
  const isMobile = !!window.__IS_MOBILE;

  const [activeIdx, setActiveIdx] = React.useState(0);
  const [srcs, setSrcs] = React.useState([src, null]);
  const lastSrc = React.useRef(src);
  // Ref síncrona para evitar stale closure no activeIdx
  const activeIdxRef = React.useRef(0);

  React.useEffect(() => {
    if (src === lastSrc.current) return;
    lastSrc.current = src;

    if (isMobile) {
      setSrcs([src, null]);
      setActiveIdx(0);
      activeIdxRef.current = 0;
      return;
    }

    const inactive = 1 - activeIdxRef.current;
    setSrcs(prev => { const n = [...prev]; n[inactive] = src; return n; });

    const timer = setTimeout(() => {
      activeIdxRef.current = inactive;
      setActiveIdx(inactive);
    }, 100);
    return () => clearTimeout(timer);
  }, [src]);

  return (
    <div className="global-bg" aria-hidden="true">
      {srcs.map((s, i) => s && (
        <div key={i} className={`global-bg-layer${activeIdx === i ? ' active' : ''}`}>
          <VideoBackground
            src={s}
            poster={`${s}-poster.jpg`}
            eager={true}
            overlay={0}
            className="global-bg-video"
          />
        </div>
      ))}
      <div className="global-bg-overlay"></div>
    </div>
  );
};

// ─── PAGE NAV ─────────────────────────────────────────────────────

const PageNav = ({ brand }) => {
  const [cfg, setCfg] = React.useState(() => getSiteConfig());
  React.useEffect(() => {
    const fn = (e) => setCfg(e.detail || getSiteConfig());
    window.addEventListener('site-config-change', fn);
    return () => window.removeEventListener('site-config-change', fn);
  }, []);
  const b = brand || 'VOCÊ NA COPA';
  return (
    <header className="hero-nav">
      <AppLink to="/" className="brand-mark">
        <span className="brand-badge">26</span>
        <span>{b}</span>
      </AppLink>
      <nav className="hero-navlinks">
        <AppLink to="/pacotes">Pacotes</AppLink>
        <AppLink to="/monte-seu-pacote">Monte seu pacote</AppLink>
        <AppLink to="/sobre">Sobre</AppLink>
      </nav>
      <a href={waLink("Olá! Quero saber mais sobre os pacotes da Copa 2026.")}
         target="_blank" rel="noopener" className="nav-cta">
        <span style={{width:6,height:6,borderRadius:'50%',background:'var(--gold)',boxShadow:'0 0 8px var(--gold)'}}></span>
        Atendimento ao vivo
      </a>
    </header>
  );
};

// ─── SUB HERO · banner compacto (usa vídeo global como fundo) ────

const SubHero = ({ eyebrow, title, subtitle, brand }) => (
  <section className="subhero" id="top">
    <div className="hero-overlay"></div>
    <div className="hero-vignette"></div>
    <PageNav brand={brand} />
    <div className="subhero-body">
      {eyebrow && (
        <Reveal>
          <span className="hero-eyebrow">{eyebrow}</span>
        </Reveal>
      )}
      <Reveal delay={100}>
        <h1 className="hero-title">
          <span className="line2">{title}</span>
        </h1>
      </Reveal>
      {subtitle && (
        <Reveal delay={200}>
          <p className="hero-sub">{subtitle}</p>
        </Reveal>
      )}
    </div>
  </section>
);

// ─── PACOTES DESTAQUE ─────────────────────────────────────────────

const PacotesDestaque = ({ installments = 18 }) => {
  useDataVersion();
  const destaques = PACOTES.filter(p => p.tag === 'best').slice(0, 3);
  return (
    <section className="pacotes-section" id="pacotes-destaque">
      <div className="wrap">
        <Reveal as="div" className="section-head">
          <span className="eyebrow"><span className="dot"></span>3 roteiros em destaque · Preço de lançamento</span>
          <h2>Pacotes<br/><span className="gold-grad">mais procurados</span></h2>
          <p className="lede">
            <b style={{color:'var(--ink)'}}>Seis roteiros, dos grupos à final.</b> Preço promocional de lançamento. Personalize no WhatsApp.
          </p>
        </Reveal>
        <div className="pkg-grid">
          {destaques.map((p, i) => (
            <PacoteCard key={p.id} p={p} delay={(i % 3) * 100} installments={installments} />
          ))}
        </div>
        <Reveal as="div" className="destaque-cta-wrap">
          <AppLink to="/pacotes" className="btn btn-gold">
            Ver todos os 6 pacotes
            <Icon name="arrow-right" size={20} />
          </AppLink>
        </Reveal>
      </div>
    </section>
  );
};

// ─── MONTE SEU PACOTE CARD · card de destaque na home ────────────

const MonteSeuPacoteCard = () => (
  <section className="msp-section">
    <div className="wrap">
      <Reveal>
        <a href="#/monte-seu-pacote"
           onClick={(e) => { e.preventDefault(); navigateTo('/monte-seu-pacote'); }}
           className="msp-card">
          <div className="msp-badge">⚡ EXCLUSIVO</div>
          <div className="msp-icon">
            <Icon name="sparkles" size={96} />
          </div>
          <div className="msp-content">
            <span className="eyebrow msp-eyebrow"><span className="dot"></span>PERSONALIZE 100%</span>
            <h2 className="msp-title">Monte seu<br/><span className="gold-grad">pacote</span></h2>
            <p className="msp-sub">Escolha jogos, cidades, hotéis e voos. Cuidamos do visto também.</p>
            <div className="msp-hint">
              <span className="msp-dot"></span>
              Proposta personalizada em até 48h
            </div>
          </div>
          <div className="msp-action">
            <span className="btn btn-gold msp-cta">
              Começar agora
              <Icon name="arrow-right" size={18} />
            </span>
          </div>
        </a>
      </Reveal>
    </div>
  </section>
);

// ─── HOME PAGE ────────────────────────────────────────────────────

const HomePage = ({ brand, headline2, subline, installments, heroVariant }) => {
  usePageMeta({
    title: 'Pacotes Copa do Mundo 2026 — USA, México, Canadá | Você na Copa',
    description: 'Pacotes exclusivos para a Copa do Mundo 2026. Voos, hotéis 5★, ingressos e atendimento humano via WhatsApp. Parcele em até 18× sem juros.'
  });
  React.useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <>
      <Hero
        brand={brand}
        subline={subline}
        headline2={headline2}
        installments={installments}
        heroVariant={heroVariant}
      />
      <PacotesDestaque installments={installments} />
      <MonteSeuPacoteCard />
      <CTAStrip brand={brand} installments={installments} />
      <Footer brand={brand} />
    </>
  );
};

// ─── PACOTES PAGE ─────────────────────────────────────────────────

const PacotesPage = ({ brand, installments }) => {
  usePageMeta({
    title: '6 Pacotes para a Copa 2026 — Voos, Hotéis 5★ e Ingressos | Você na Copa',
    description: 'Todos os 6 roteiros para a Copa do Mundo 2026. De grupos à final. Personalize no WhatsApp. Parcele em até 18× sem juros.'
  });
  usePageScroll();
  return (
    <>
      <SubHero
        brand={brand}
        eyebrow="6 roteiros · Preço de lançamento"
        title="Escolha o seu pacote"
        subtitle="Dos grupos à final. Personalize no WhatsApp."
      />
      <Pacotes installments={installments} />
      <CTAStrip brand={brand} installments={installments} />
      <Footer brand={brand} />
    </>
  );
};

// ─── MONTE SEU PACOTE PAGE ────────────────────────────────────────

const MonteSeuPacotePage = ({ brand, installments }) => {
  usePageMeta({
    title: 'Monte seu pacote da Copa 2026 + Visto | Você na Copa',
    description: 'Pacote personalizado para Copa 2026: jogos, cidades, hotéis, voos e visto.'
  });
  usePageScroll();
  return (
    <>
      <SubHero
        brand={brand}
        eyebrow="Personalize 100%"
        title="Monte seu pacote"
        subtitle="Escolha jogos, cidades, hotéis e voos. Cuidamos do visto também."
      />
      <Builder brand={brand} />
      <VisaSection />
      <CTAStrip brand={brand} installments={installments} />
      <Footer brand={brand} />
    </>
  );
};

// ─── VISTO PAGE · redirect para /monte-seu-pacote ─────────────────

const VistoPage = () => {
  React.useEffect(() => { navigateTo('/monte-seu-pacote'); }, []);
  return null;
};

// ─── SOBRE PAGE ───────────────────────────────────────────────────

const SobrePage = ({ brand, installments }) => {
  usePageMeta({
    title: 'Sobre a Você na Copa — 12 anos em grandes eventos esportivos',
    description: 'Conheça a Você na Copa: especialistas em Copas e Olimpíadas desde 2010. Veja depoimentos, diferenciais e as 16 cidades-sede da Copa 2026.'
  });
  usePageScroll();
  return (
    <>
      <SubHero
        brand={brand}
        eyebrow="12 anos em grandes eventos · Copas e Olimpíadas"
        title="Sobre a agência"
        subtitle="Especialistas em montar a viagem perfeita para quem vive o esporte."
      />
      <Diferenciais />
      <Depoimentos />
      <Sedes />
      <FAQ />
      <CTAStrip brand={brand} installments={installments} />
      <Footer brand={brand} />
    </>
  );
};

Object.assign(window, {
  useRoute, navigateTo, AppLink, usePageMeta, usePageScroll,
  GlobalVideoBackground,
  HomePage, PacotesPage, MonteSeuPacotePage, VistoPage, SobrePage,
  SubHero, PageNav, PacotesDestaque, MonteSeuPacoteCard
});
