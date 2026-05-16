// ════════════════════════════════════════════════════════════════
// APP · raiz + roteamento via useRoute() + painel Tweaks
// ════════════════════════════════════════════════════════════════

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "brand": "VOCÊ NA COPA",
  "accent": "#D4AF37",
  "headline2Variant": "campo",
  "showCountdown": true,
  "showHostFilters": true,
  "installments": 18,
  "heroVariant": "main"
}/*EDITMODE-END*/;

const HEADLINE_VARIANTS = {
  "campo":  { label: "Entrar em campo" },
  "lá":     { label: "Estar lá" },
  "viver":  { label: "Viver a Copa" },
  "vestir": { label: "Vestir a camisa" }
};

// fallback: garante acesso ao hook de rota independente da ordem de carregamento
const useRoute = window.useRoute || function useRoute() {
  function _hp(h) { if (!h||h==='#'||h==='#/') return '/'; return h.startsWith('#/')?h.slice(1):'/'; }
  const [path, setPath] = React.useState(() => _hp(window.location.hash));
  React.useEffect(() => {
    const handler = () => setPath(_hp(window.location.hash));
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);
  return path;
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [highlightMedia, setHighlightMedia] = React.useState(false);
  const [adminOpen, setAdminOpen] = React.useState(() => !!window.__VNC_ADMIN_MODE);
  const [authed, setAuthed] = React.useState(() =>
    typeof isLoggedIn === "function" ? isLoggedIn() : false
  );

  const path = useRoute();

  React.useEffect(() => {
    document.documentElement.style.setProperty("--gold", t.accent);
  }, [t.accent]);

  React.useEffect(() => {
    document.body.dataset.countdown = t.showCountdown ? "on" : "off";
    document.body.dataset.hostFilters = t.showHostFilters ? "on" : "off";
  }, [t.showCountdown, t.showHostFilters]);

  React.useEffect(() => {
    document.body.dataset.mediaHighlight = highlightMedia ? "on" : "off";
  }, [highlightMedia]);

  const subline = `A maior Copa da história te espera. Ingressos garantidos, hotéis premium e atendimento humano no WhatsApp.`;
  const headline2 = HEADLINE_VARIANTS[t.headline2Variant]?.label || "Entrar em campo";

  if (window.__VNC_ADMIN_MODE && !authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} />;
  }

  const pageProps = {
    brand: t.brand,
    headline2,
    subline,
    installments: t.installments,
    heroVariant: t.heroVariant
  };

  const renderPage = () => {
    if (path.startsWith('/monte-seu-pacote')) return <MonteSeuPacotePage key="monte"   {...pageProps} />;
    if (path.startsWith('/pacotes'))          return <PacotesPage         key="pacotes" {...pageProps} />;
    if (path.startsWith('/visto'))            return <VistoPage            key="visto"  {...pageProps} />;
    if (path.startsWith('/sobre'))            return <SobrePage            key="sobre"  {...pageProps} />;
    return <HomePage key="home" {...pageProps} />;
  };

  return (
    <>
      <div className="app-bg" aria-hidden="true"></div>
      <GlobalVideoBackground />

      {renderPage()}

      <FabWhatsApp />
      <PacoteModal />
      <LegalModal />

      {adminOpen && typeof AdminPanel !== "undefined" && (
        <AdminPanel
          tweaks={t}
          setTweak={setTweak}
          onClose={() => {
            if (window.__VNC_ADMIN_MODE) {
              window.location.href = "index.html";
            } else {
              setAdminOpen(false);
            }
          }}
        />
      )}

      <TweaksPanel>
        <TweakSection label="Marca" />
        <TweakText label="Nome da agência" value={t.brand}
          onChange={(v) => setTweak("brand", v)} />

        <TweakSection label="Visual" />
        <TweakColor label="Cor de acento"
          value={t.accent}
          options={["#D4AF37", "#E8501C", "#22C55E", "#3B82F6", "#F4F1E8"]}
          onChange={(v) => setTweak("accent", v)} />

        <TweakSection label="Hero" />
        <TweakSelect label="Frase de impacto"
          value={t.headline2Variant}
          options={Object.keys(HEADLINE_VARIANTS).map(k => ({value: k, label: HEADLINE_VARIANTS[k].label}))}
          onChange={(v) => setTweak("headline2Variant", v)} />
        <TweakToggle label="Contagem regressiva"
          value={t.showCountdown}
          onChange={(v) => setTweak("showCountdown", v)} />

        <TweakSection label="Comercial" />
        <TweakSlider label="Parcelamento" value={t.installments}
          min={6} max={24} step={1} unit="×"
          onChange={(v) => setTweak("installments", v)} />

        <TweakSection label="Pacotes" />
        <TweakToggle label="Filtros por país"
          value={t.showHostFilters}
          onChange={(v) => setTweak("showHostFilters", v)} />

        <MediaManagerSection
          highlight={highlightMedia}
          onHighlightChange={setHighlightMedia} />
      </TweaksPanel>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
