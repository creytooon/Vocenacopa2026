# 📋 Pacotes Copa 2026 — Mudanças Aplicadas

Documento completo de tudo que foi alterado no seu projeto. Use isso pra navegar e testar.

---

## ⚡ Antes de mais nada

1. **Faça backup do projeto original** antes de substituir os arquivos
2. **Abra primeiro o `/paineladmin.html`** e configure os dados da empresa (CNPJ, CADASTUR, WhatsApp, etc) — sem isso o site fica com placeholders
3. **Limpe o localStorage** do navegador antes do primeiro teste (DevTools → Application → Local Storage → Clear) pra começar com config zerada

---

## 🎯 As 15 alterações aplicadas

### 1. ✅ Tabela real da Copa 2026 (fase de grupos completa)

**Arquivo**: `data.jsx`

- Substituí o gerador procedural por **dados oficiais do sorteio FIFA de 05/dez/2025**
- **72 jogos da fase de grupos** com seleções reais (Brasil x Marrocos, México x África do Sul, etc), cidade e estádio corretos, horários em Brasília
- **32-avos, oitavas, quartas, semifinais, 3º lugar e final** ficam com cidades/datas/horários reais mas **confrontos como "A definir"** (não foram sorteados ainda)
- Adicionado emoji de bandeira automático para cada seleção
- Fonte: tabela oficial Exame/FIFA

### 2. ✅ Cards das 16 cidades-sede reorganizados

**Arquivo**: `data.jsx` (array `SEDES`)

- **Nova York** virou card extra-grande (`span: "xl"` = 2 colunas × 2 linhas) por ser sede da FINAL
- **Cidade do México** com `span: "w"` (sede do Jogo de Abertura)
- **Los Angeles, Dallas** com `span: "h"` (sedes de Semifinal)
- **Miami** com `span: "w"` (disputa de 3º lugar)
- Adicionado campo `note` com nota contextual em cada sede (ex: "Sede da GRANDE FINAL · 19/jul · MetLife")
- Nomes dos estádios atualizados pros reais (NRG Stadium, MetLife, Estádio Azteca, SoFi, etc)

### 3. ✅ Estimativa inteligente de preços

**Arquivo**: `data.jsx` (função `estimatePackagePrice`)

Calcula preço de pacote baseado em:
- **Voo base por região** (México, USA Leste/Central/Oeste, Canadá) — em USD
- **Multiplicador de classe** (Eco 1×, Premium 1.8×, Executiva 3.5×, Primeira 6×)
- **Hotel base por cidade × estrelas** (16 cidades × 3 tiers)
- **Multiplicador Copa** (alta temporada, default 1.6×)
- **Antecedência** (compra <60 dias = +25%)
- **Trechos extras** (+US$ 300 por cidade adicional)
- **Passageiros** (adulto 100%, criança 75%, bebê 10%)
- **Margem** (mostra range min-max em vez de valor único)
- **Cotação USD→BRL** ajustável no admin

### 4. ✅ Seletor de passageiros

**Arquivos**: `sections.jsx`, `builder.jsx`, `styles.css`

- **Adultos** (18+) — mínimo 1, máximo 9
- **Crianças** (2-17 anos) — máximo 9
- **Bebês de colo** (0-23 meses) — máximo 4
- Total combinado limitado a 9 passageiros
- **Persistência via localStorage** (não perde ao recarregar)
- Aparece em 2 lugares:
  - **Modal de confirmação** quando clica em "Solicitar pacote" nos pacotes pré-definidos
  - **Builder** (passo 5) quando o usuário monta o próprio pacote
- Aviso visual quando tem criança/bebê: *"⚠️ Documentação especial necessária"*

### 5. ✅ 6 Pacotes reformulados com -20% e dados reais

**Arquivo**: `data.jsx` (array `BASE_PACOTES`)

Substituí os 6 pacotes antigos por:

| # | Pacote | Destaque | De → Por |
|---|--------|----------|----------|
| 1 | Abertura no Azteca | México x África do Sul · 11/jun | R$ 14.900 → **R$ 11.920** |
| 2 | Brasil na Fase de Grupos | Brasil x Marrocos, Haiti, Escócia | R$ 22.400 → **R$ 17.920** |
| 3 | Jornada Argentina | Argentina · 3 jogos · Grupo J | R$ 21.000 → **R$ 16.800** |
| 4 | Oitavas em Nova York | MetLife · 05/jul | R$ 27.000 → **R$ 21.600** |
| 5 | Roteiro Tri-Sede | EUA → México → Canadá | R$ 59.000 → **R$ 47.200** |
| 6 | A Grande Final | MetLife Stadium · 19/jul | R$ 38.500 → **R$ 30.800** |

Cada um inclui:
- Tag visual "−20%" pulsante no card
- Campo `matchHighlight` com o jogo principal
- Campo `vagas` (mostra "Últimas X vagas neste preço")
- Lista de inclusos detalhada

### 6. ✅ Sistema de imagens dos pacotes editável

**Arquivos**: `sections.jsx`, painel admin

- Cada pacote tem um **slot de imagem** identificado por `pkg-{id}`
- **Você sobe a imagem pelo painel admin** (aba Imagens) usando drag-and-drop
- Se não tiver imagem definida, mostra um placeholder com estádio estilizado
- O sistema `ImageSlot` existente já suportava isso — apenas garanti que cada pacote tem um slot único

### 7. ✅ Envio automático para WhatsApp com detalhes

**Arquivo**: `data.jsx` (funções `buildWhatsAppMessage` + `sendToWhatsApp`)

**Pacote pré-definido**:
- Clica em "Solicitar pacote" → abre modal com detalhes do pacote + seletor de passageiros
- Clica em "Enviar pelo WhatsApp" → abre conversa com mensagem **formatada completa**

**Builder customizado**:
- Mensagem incluí: lista de jogos com data/hora/estádio, hotel escolhido, classe de voo, modalidade, passageiros, estimativa de preço

Mensagem exemplo:
```
🏆 SOLICITAÇÃO DE PACOTE · COPA 2026

📦 Pacote: Brasil na Fase de Grupos
📍 Destino: Nova York · Filadélfia · Miami
📅 Período: 12 jun – 25 jun (14 dias)
⚽ Destaque: 3 jogos do Brasil
💰 Valor: R$ 17.920

👥 Passageiros:
• 2 adultos
• 1 criança (2-17 anos)
```

### 8. ✅ Vídeos só no desktop · Mobile usa poster (economia ~17MB)

**Arquivo**: `video-bg.jsx`

- **Detecção mobile** via `matchMedia` + UserAgent
- Se for mobile: vídeo **NUNCA carrega** — apenas o `.jpg` poster correspondente como fundo estático
- Desktop continua com vídeo full (todos os 3 vídeos: hero-bg, hero-bg-alt, fans-loop)
- **Resultado**: mobile economiza ~17 MB de download, mantém visual igual

### 9. ✅ SEO completo

**Arquivo**: `index.html`

- **Title novo**: "Pacotes Copa do Mundo 2026 — USA, México, Canadá"
- **Meta description** otimizada
- **Keywords**, **canonical**, **robots**
- **Open Graph completo** (Facebook, WhatsApp, LinkedIn)
- **Twitter Card** (summary_large_image)
- **Schema.org JSON-LD** como `TravelAgency`
- **robots.txt** criado
- **sitemap.xml** criado
- Todos os campos **editáveis pelo admin** (aba SEO & Analytics)

### 10. ✅ Conformidade legal editável

**Arquivo**: `admin.jsx` (aba Empresa)

Campos editáveis no painel admin:
- Nome fantasia, razão social, **CNPJ**, **CADASTUR**
- Telefone, **WhatsApp** (só números, formato internacional)
- E-mail, Instagram (@ + URL)
- Endereço
- Toggle "Membro ABAV", "Credencial IATA"
- **Política de Privacidade** (rich text)
- **Termos & Condições** (rich text)

Footer e modais leem esses dados automaticamente.

### 11. ✅ Depoimentos (prova social)

**Arquivos**: `sections.jsx` (componente `Depoimentos`), `admin.jsx` (aba Conteúdo)

- Nova seção entre Pacotes e Builder
- 3 depoimentos default (Catar 2022, Rússia 2018) com nome, local, viagem feita, texto e estrelas
- **Totalmente editável no admin** (adicionar, remover, editar nome, local, viagem, texto, avatar)
- Layout responsivo (3 cols → 1 col em mobile)

### 12. ✅ FAQ

**Arquivos**: `sections.jsx` (componente `FAQ`), `admin.jsx` (aba Conteúdo)

- Nova seção colapsável após Sedes
- 5 perguntas default (ingressos, visto, cancelamento, seguro, parcelamento)
- Click expande/colapsa
- **Totalmente editável no admin** (você adiciona/edita/remove perguntas)

### 13. ✅ Urgência honesta + parcelamento

**Arquivo**: `sections.jsx`

- Tag **"Últimas X vagas neste preço"** com dot pulsante (campo `vagas` no pacote)
- Badge **"−20%"** pulsante no canto do card
- Preço antigo **riscado** acima do preço novo
- **"18× de R$ X sem juros"** logo abaixo do preço, em destaque

### 14. ✅ Formulário alternativo "Me liga em 24h"

**Arquivos**: `sections.jsx` (componente `ContactForm`), `styles.css`

- Formulário com: Nome, Telefone, Melhor horário (Manhã/Tarde/Noite), Mensagem
- **Envia pelo WhatsApp** com mensagem formatada
- Tela de sucesso visual após envio
- Dispara evento `lead_form_submit` no GA4

*(Nota: o componente está pronto, mas você decide onde colocar — pode ser dentro do CTAStrip, antes do Footer, ou em página própria. Me avise pra eu posicionar onde achar melhor.)*

### 15. ✅ Analytics (GA4 + Meta Pixel + GTM)

**Arquivos**: `index.html`, `admin.jsx` (aba SEO & Analytics)

- **Carregamento condicional**: scripts só carregam se ID estiver configurado no admin
- Suporta:
  - Google Analytics 4 (`G-XXXXXXXXXX`)
  - Meta (Facebook) Pixel (só números)
  - Google Tag Manager (`GTM-XXXXXX`)
- **Eventos automáticos** disparados:
  - `page_view` em toda página
  - `select_package` ao confirmar pacote pré-definido
  - `complete_builder` ao enviar pacote customizado
  - `click_whatsapp_fab` ao clicar no WhatsApp flutuante
  - `lead_form_submit` ao enviar formulário "me liga"

---

## 🆕 Novas abas no painel admin

Acesse `/paineladmin.html`:

| Aba | O que faz |
|-----|-----------|
| **Pacotes prontos** | (já existia) Editar título, preço, fase, inclusos dos 6 pacotes |
| **Jogos** | (já existia) Editar jogos da Copa |
| **Hotéis** | (já existia) Editar opções de hotel por cidade |
| **Imagens** | (já existia) Upload de imagens via drag-and-drop |
| **🆕 Empresa** | CNPJ, CADASTUR, contatos, ABAV, páginas legais |
| **🆕 SEO & Analytics** | Title, description, OG image, GA4, Meta Pixel, GTM |
| **🆕 FAQ & Depoimentos** | Adicionar/editar/remover perguntas e depoimentos |
| **🆕 Preços** | Multiplicadores da estimativa (cotação USD, voo base, classe, Copa) |
| **Marca & visual** | (já existia) Cor de acento, nome da agência, etc |

---

## 📁 Arquivos novos criados

- `robots.txt` — instruções pra crawlers
- `sitemap.xml` — mapa do site pra Google indexar

---

## 🚨 O que VOCÊ precisa fazer depois de subir

### Crítico (faça antes de publicar)
1. **Configure os dados da empresa** no admin → Empresa (CNPJ, CADASTUR, WhatsApp, e-mail)
2. **Substitua a URL** `https://vocenacopa.com.br/` por sua URL real em:
   - `index.html` (canonical, OG, JSON-LD)
   - `robots.txt`
   - `sitemap.xml`
3. **Preencha Política de Privacidade e Termos** com texto preparado por advogado (LGPD exige)
4. **Cadastre IDs do GA4 e Meta Pixel** na aba SEO & Analytics
5. **Suba uma imagem OG** (1200×630px) e cole a URL no admin SEO

### Importante (pra otimizar)
6. **Comprima os vídeos** se possível (FFmpeg: `ffmpeg -i input.mp4 -vcodec libx264 -crf 28 -preset slow output.mp4`)
7. **Faça upload de imagens reais** nos slots dos pacotes (aba Imagens)
8. **Ajuste preços e vagas** dos pacotes conforme realidade
9. **Edite os depoimentos** com casos reais de clientes anteriores
10. **Revise as perguntas do FAQ** e adicione perguntas que clientes realmente fazem

### Recomendado (próxima rodada)
11. **Hospedagem com CDN** (Cloudflare grátis) pra performance
12. **Build de produção** (Vite/Parcel) pra eliminar Babel runtime
13. **Blog SEO** com conteúdo sobre Copa, visto, cidades

---

## 🧪 Como testar localmente

1. Descompacte o ZIP em uma pasta
2. Abra com servidor local (Python: `python3 -m http.server 8000`)
3. Acesse `http://localhost:8000` (site público)
4. Acesse `http://localhost:8000/paineladmin.html` (painel admin)
5. No painel, vá em **Empresa** e preencha os dados básicos
6. Volte ao site público e veja as mudanças refletidas no footer

---

## ⚠️ Notas e limitações conhecidas

1. **Imagens dos jogadores não foram inseridas** — você decidiu deixar pra resolver depois. O sistema está preparado pra você fazer upload via admin quando quiser.
2. **Mata-mata (32-avos, oitavas, quartas, semis, final)** mostra "A definir" nos confrontos — vai atualizar automaticamente quando você editar no admin → Jogos.
3. **WhatsApp number ainda está como placeholder** (`5511999999999`) — você definiu que vai alterar no painel. Faça isso antes de publicar.
4. **Bandeira da Escócia/Inglaterra** usa emoji subnacional (`🏴󠁧󠁢󠁳󠁣󠁴󠁿`) que nem todos os sistemas renderizam — pode aparecer como caixa em alguns dispositivos. Considerar SVG no futuro.

---

**Total de arquivos modificados**: 7 (`data.jsx`, `index.html`, `app.jsx`, `sections.jsx`, `builder.jsx`, `admin.jsx`, `video-bg.jsx`, `styles.css`)
**Arquivos criados**: 2 (`robots.txt`, `sitemap.xml`)
