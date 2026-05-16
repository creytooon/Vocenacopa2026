// ════════════════════════════════════════════════════════════════
// HERO · full-screen video background + countdown
// ════════════════════════════════════════════════════════════════

// Countdown hook — atualiza a cada segundo
function useCountdown(target) {
  const calc = () => {
    const ms = target.getTime() - Date.now();
    if (ms <= 0) return { d: 0, h: 0, m: 0, s: 0, done: true };
    const d = Math.floor(ms / 86400000);
    const h = Math.floor((ms % 86400000) / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return { d, h, m, s, done: false };
  };
  const [t, setT] = React.useState(calc);
  React.useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

const pad = (n) => String(n).padStart(2, "0");

const Countdown = () => {
  const { d, h, m, s } = useCountdown(KICKOFF_DATE);
  return (
    <div className="countdown-wrap">
      <div className="countdown-head">
        <span>Contagem regressiva</span>
        <span className="live-dot">11.06.2026 · Pontapé inicial</span>
      </div>
      <div className="countdown">
        <div className="cd-cell"><div className="cd-num">{pad(d)}</div><div className="cd-lbl">Dias</div></div>
        <div className="cd-cell"><div className="cd-num">{pad(h)}</div><div className="cd-lbl">Horas</div></div>
        <div className="cd-cell"><div className="cd-num">{pad(m)}</div><div className="cd-lbl">Min</div></div>
        <div className="cd-cell"><div className="cd-num">{pad(s)}</div><div className="cd-lbl">Seg</div></div>
      </div>
    </div>
  );
};

const HeroNav = ({ brand }) => (
  <header className="hero-nav">
    <a href="#/" className="brand-mark">
      <span className="brand-badge">26</span>
      <span>{brand}</span>
    </a>
    <nav className="hero-navlinks">
      <a href="#/pacotes">Pacotes</a>
      <a href="#/monte-seu-pacote">Monte seu pacote</a>
      <a href="#/visto">Visto</a>
      <a href="#/sobre">Sobre</a>
    </nav>
    <a href={waLink("Olá! Quero saber mais sobre os pacotes da Copa 2026.")} target="_blank" rel="noopener" className="nav-cta">
      <span style={{width:6,height:6,borderRadius:"50%",background:"var(--gold)",boxShadow:"0 0 8px var(--gold)"}}></span>
      Atendimento ao vivo
    </a>
  </header>
);

const Hero = ({ brand, headline2, subline, installments, heroVariant = "main" }) => {
  return (
    <section className="hero" id="top">
      {/* Slot do admin: imagem sobrepõe o vídeo global se configurada */}
      <div className="hero-media">
        <MediaSlot
          id="hero-bg"
          label="Imagem de fundo do hero"
          group="Hero"
          anchor="top"
          placeholder="Arraste uma imagem de fundo (estádio, torcida, fogos…)"
          className="hero-slot"
        />
      </div>
      <div className="hero-overlay"></div>
      <div className="hero-vignette"></div>

      <HeroNav brand={brand} />

      <div className="hero-body">
        <Reveal>
          <span className="hero-eyebrow">
            <span className="pill-flags">
              <FlagSVG country="USA" size={14} />
              <FlagSVG country="CAN" size={14} />
              <FlagSVG country="MEX" size={14} />
            </span>
            EUA · Canadá · México &nbsp;·&nbsp; 11 jun → 19 jul · 2026
          </span>
        </Reveal>

        <Reveal delay={120}>
          <h1 className="hero-title">
            <span className="line1">É hora de</span>
            <span className="line2">{headline2}</span>
          </h1>
        </Reveal>

        <Reveal delay={240}>
          <p className="hero-sub">{subline}</p>
        </Reveal>

        <Reveal delay={320}>
          <div className="hero-stats">
            <div className="hs">
              <div className="hs-num">6</div>
              <div className="hs-lbl">Pacotes</div>
            </div>
            <div className="hs">
              <div className="hs-num">16</div>
              <div className="hs-lbl">Sedes</div>
            </div>
            <div className="hs hs-gold">
              <div className="hs-num">{installments}×</div>
              <div className="hs-lbl">Sem juros</div>
            </div>
            <div className="hs">
              <div className="hs-num">24/7</div>
              <div className="hs-lbl">WhatsApp</div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={400}>
          <div className="hero-ctas">
            <a href="#/pacotes" className="btn btn-gold">
              Ver pacotes
              <Icon name="arrow-right" size={18} />
            </a>
            <a href={waLink("Olá! Quero falar com um especialista sobre a Copa 2026.")} target="_blank" rel="noopener" className="btn btn-outline">
              <Icon name="whatsapp" size={18} />
              Falar no WhatsApp
            </a>
          </div>
        </Reveal>

        <Reveal delay={520}>
          <Countdown />
        </Reveal>
      </div>

      <a href="#pacotes-destaque" className="scroll-ind" aria-label="Rolar para a próxima seção"
         onClick={(e) => { e.preventDefault(); document.getElementById("pacotes-destaque")?.scrollIntoView({behavior:"smooth"}); }}>
        Role para descobrir
        <span className="line"></span>
      </a>
    </section>
  );
};

Object.assign(window, { Hero, Countdown, useCountdown });
