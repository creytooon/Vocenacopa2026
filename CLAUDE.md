# CLAUDE.md

Este arquivo orienta o Claude Code ao trabalhar neste projeto. Leia antes de qualquer tarefa.

---

## SOBRE O PROJETO

**vocenacopa2026.com** — Landing page premium de pacotes para a Copa do Mundo 2026.

**Stack:**
- React 18 via CDN (sem build, sem bundler, sem npm install)
- JSX compilado no navegador via Babel standalone
- CSS puro (sem Tailwind, sem styled-components)
- Hospedagem estática (Vercel)
- Componentes globais expostos via `Object.assign(window, { ... })`

**Arquivos principais:**
- `index.html` — entry point, carrega todos os scripts na ordem correta
- `primitives.jsx` — componentes base (Reveal, Icon, FlagSVG)
- `data.jsx` — dados (pacotes, sedes, jogos), helpers WhatsApp, config
- `hero.jsx` — seção Hero
- `sections.jsx` — Diferenciais, Pacotes, Sedes, CTA, Visto, FAQ, Footer
- `builder.jsx` — "Monte seu pacote" (calculadora)
- `app.jsx` — raiz da aplicação
- `admin.jsx`, `admin-login.jsx`, `paineladmin.html` — painel administrativo
- `styles.css` — todo o CSS do site
- `store.jsx` — persistência (localStorage)

---

## COMO TRABALHAR COMIGO

### Antes de codar
1. **Sempre leia primeiro.** Antes de editar, leia os arquivos envolvidos por completo. Nunca presuma estrutura.
2. **Apresente um plano antes de executar mudanças grandes.** Mudança grande = mais de 1 arquivo, mais de 30 linhas, ou qualquer coisa que toque em rotas/admin/dados.
3. **Pergunte se houver ambiguidade.** Se duas interpretações forem válidas, pergunte qual eu quero — não escolha sozinho.
4. **Confirme antes de instalar dependências.** Este projeto NÃO usa npm. Não introduza pacotes, bundlers (Webpack, Vite, Parcel) ou ferramentas de build sem minha autorização explícita.

### Durante o trabalho
5. **Diffs pequenos e focados.** Uma mudança por vez. Não misture refatoração com correção de bug com mudança de estilo na mesma edição.
6. **Não reescreva código que não está quebrado.** Se algo funciona, não "melhore" sem que eu peça.
7. **Preserve o admin sempre.** `admin.jsx`, `admin-login.jsx`, `paineladmin.html`, `store.jsx`, `tweaks-panel.jsx`, `media-panel.jsx` e a verificação `window.__VNC_ADMIN_MODE` em `app.jsx` são intocáveis a não ser que o pedido seja explícito sobre o admin.
8. **Mantenha o padrão `Object.assign(window, { ... })`** no final de cada arquivo JSX para expor componentes globais. Não use `import`/`export` ES modules — o projeto não tem build.

### Depois de mudar
9. **Resuma o que mudou em bullets curtos.** Liste arquivos tocados e o que foi feito em cada um. Sem prosa floreada.
10. **Aponte riscos.** Se uma mudança pode quebrar algo (admin, vídeo de fundo, modal, etc), avise antes que eu teste.
11. **Não comite automaticamente.** Eu reviso e comito.

---

## ESTILO DE COMUNICAÇÃO

- **Português brasileiro.** Sempre.
- **Direto ao ponto.** Sem "Claro!", "Ótima pergunta!", "Vou começar fazendo...". Comece pela resposta.
- **Sem floreios.** Cortes adjetivos duplicados, frases de reforço, introduções longas.
- **Liste em vez de discursar.** Quando houver mais de 2 itens, vira lista.
- **Honesto sobre incertezas.** Se não souber, diga "não sei" ou "preciso verificar". Nunca invente comportamento de código.
- **Sem emoji em respostas técnicas** (a menos que eu use primeiro).

---

## CONVENÇÕES DO CÓDIGO

### JSX
- Componentes funcionais sempre, nunca classes.
- Props destruturadas no parâmetro: `const Card = ({ title, body }) => (...)`.
- `React.useState` e `React.useEffect` (não importados — React está global).
- Nomes de componentes em PascalCase, nomes de helpers em camelCase.

### CSS
- Use classes existentes em `styles.css` antes de criar novas.
- Se precisar de classe nova, adicione ao final do arquivo com um comentário identificando a seção.
- Nunca use CSS-in-JS. Nunca use `style={{...}}` para mais de 2-3 propriedades — vire classe CSS.
- Mantenha o padrão de variáveis CSS (`var(--gold)`, `var(--ink)`, etc).

### Texto/Copy
- Português brasileiro coloquial e direto. Sem "outrossim", "destarte", "ademais".
- Sem adjetivos empilhados ("exclusivo e único", "memorável e inesquecível").
- CTAs imperativos e curtos ("Ver pacotes", "Falar no WhatsApp").
- Respostas de FAQ começam com Sim/Não, depois 1 frase de explicação.

### Estrutura de página
- Cada seção tem um `id` para navegação por âncora.
- Toda seção visível usa o componente `<Reveal>` para animação de entrada.
- Imagens de fundo passam por `<VideoBackground>` ou `<MediaSlot>` para serem editáveis no admin.

---

## O QUE NUNCA FAZER

- ❌ Adicionar `npm install`, `package.json` novo, ou qualquer ferramenta de build.
- ❌ Migrar para TypeScript sem pedido explícito.
- ❌ Migrar para Next.js, Remix, ou outro framework.
- ❌ Substituir CSS puro por Tailwind, Bootstrap, etc.
- ❌ Mexer em `localStorage` keys sem avisar (o admin depende delas).
- ❌ Remover `Object.assign(window, ...)` no final dos arquivos.
- ❌ Quebrar o link `paineladmin.html` ou os fluxos de autenticação admin.
- ❌ Apagar `data.jsx` ou alterar a estrutura de `PACOTES`, `SEDES`, `HOST_CITIES`.
- ❌ Criar arquivos "temporários" e esquecer de removê-los.
- ❌ Fazer commit no Git sem eu pedir.

---

## CONTEXTO COMERCIAL

O site vende pacotes de viagem premium (ticket médio R$ 15-50k). A conversão acontece pelo **WhatsApp** — todo CTA leva pra lá. Não estamos otimizando pra cliques em formulários ou cadastros.

**Princípios de UX a respeitar:**
- Página rápida (sem JS pesado, sem libs desnecessárias).
- Mobile-first: a maioria dos acessos é mobile.
- Identidade premium: preto + dourado, espaçamento generoso, tipografia editorial.
- Menos texto, mais design. Cortar palavras é sempre uma melhoria, não uma perda.

---

## QUANDO EU PEDIR ALGO AMBÍGUO

Se eu pedir algo como "deixe o site mais bonito" ou "melhore a performance", **NÃO COMECE A MEXER**. Em vez disso:
1. Liste 3-5 interpretações possíveis do meu pedido.
2. Pergunte qual eu quero.
3. Espere resposta antes de tocar em qualquer arquivo.

Mesmo princípio para "arrume isso aqui" sem especificar o quê.

---

## FORMATO DE RESPOSTA PADRÃO

Quando eu pedir uma tarefa, sua resposta deve seguir esta estrutura:

```
PLANO
- Bullet 1
- Bullet 2

ARQUIVOS QUE VOU TOCAR
- arquivo1.jsx (o quê)
- arquivo2.jsx (o quê)

RISCOS
- O que pode quebrar / o que devo testar depois

POSSO SEGUIR?
```

Espere meu "sim" antes de editar (a menos que seja uma tarefa trivial de 1-2 linhas).

Após terminar:

```
FEITO
- arquivo1.jsx: [mudanças em bullets]
- arquivo2.jsx: [mudanças em bullets]

TESTE ISSO
- Passo 1
- Passo 2

DECISÕES QUE TOMEI
- [se tomei alguma decisão não óbvia, listo aqui]
```
