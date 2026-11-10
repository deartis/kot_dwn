# K.O.T — Baixe e teste

Um app que transforma caminhadas e corridas em uma aventura de evolução de personagem e reinos.

> **O nome e a logo ainda não foram decididos. K.O.T / King of Territory e a logo atual são temporários e podem mudar.**

## Baixar e instalar

**[🚀 Baixar para Android — v0.1.0, build 47](https://github.com/deartis/kot_dwn/releases/download/v0.1.0-build47/kot-v0.1.0-build47.apk)**

- **Tamanho:** `120.444.109 bytes` (~114,9 MB)
- **SHA-256:** `3096fd77589a6f119246e542308273a0123321cfc1007611d516dc5c5d23a149`
- **Checksum:** [SHA256SUMS-build47.txt](https://github.com/deartis/kot_dwn/releases/download/v0.1.0-build47/SHA256SUMS-build47.txt)
- **Requisitos:** Android 7.0 ou superior.

### Como instalar ou atualizar

1. Abra o link acima no celular e baixe o arquivo APK.
2. Abra o arquivo baixado. Se o Android solicitar, permita que o navegador instale o aplicativo.
3. Conclua a instalação e abra o app.
4. *Já possui uma versão anterior instalada?* Basta baixar o APK e instalar por cima para atualizar com todos os seus dados preservados.

---

## Novidades da Build 47

- **🎬 Anúncios Premiados Oficiais do Google AdMob Ativos:**
  - Configurado o **App ID de produção** (`ca-app-pub-4260401394051559~6794130633`) no `AndroidManifest.xml`.
  - Configurado o **Bloco de Anúncios Premiados (Rewarded Video)** oficial (`ca-app-pub-4260401394051559/4236250057`) na **Tenda do Bardo & Mercador** (`AdService` e `RewardAdScreen`).
- **🧪 Poções de Treinamento na Loja de Poções:**
  - Removido o card fixo da tela inicial (Home); as 3 poções de treinamento (**Elixir da Sabedoria +50% XP**, **Poção de Vigor Rápido** e **Infusão do Rastreador 2x Drops**) são adquiridas na Loja de Poções do Vilarejo com opção de comprar e beber na hora.

---

## Novidades da Build 46

- **🛡️ Alinhamento da Captação de Energia com o Escudo do Reino:**
  - Corrigido o slide de captação de energia e os tópicos do Grimório: a energia dos cristais acumulados nas passadas é canalizada para recarregar o Escudo do Reino e manter a integridade das muralhas, em vez de converter em ouro.
- **🏷️ Padronização do Nome Oficial K.O.T (King of Territory):**
  - Textos de boas-vindas, tutoriais e FAQ atualizados com o nome oficial K.O.T (King of Territory).

---

## Novidades da Build 45

- **✨ Carrossel Interativo de Boas-Vindas (`BeginnerTutorialDialog`):**
  - Exibição automática na primeira vez que o atleta acessa a Home, apresentando os 4 pilares do jogo: o mundo real como tabuleiro com GPS/Passos em segundo plano, reinos geográficos e peregrinação de 1 km, captação de energia para o escudo do reino e os aposentos do herói com forja e arena.
  - Navegação fluida com dots animados, passos ilustrados e link direto para o compêndio.
- **📖 Grimório do Aventureiro (`AdventureGuideScreen`):**
  - Nova tela dedicada com busca em tempo real para consultar regras completas e FAQs a qualquer momento.
  - Tópicos detalhados sobre treinos, defesa e muralhas, equipamentos, joias, poções, reinos e dúvidas gerais.
- **🧭 Acesso Rápido na Interface:**
  - Novo botão de compêndio (`Icons.auto_stories_rounded`) no cabeçalho da Home ao lado do arauto de voz.
  - Card temático de acesso aos tutoriais nos Aposentos do Herói / Perfil.

---

## Novidades da Build 44

- **✨ Acessibilidade & Legibilidade Global (P0):**
  - Textos e badges de status ampliados para no mínimo 11–12 px em toda a interface (Diálogos de Forja, Joias, Vitória de Treino, HUD de Poções e Jornada), suportando fontes ampliadas do sistema sem cortes.
  - Áreas de toque aumentadas para 48×48 dp nos controles táteis do mapa na Arena com suporte a leitores de tela (`Semantics`).
  - Tratamento de erros silenciosos na Carteira, Perfil e Sensores de Localização com alertas visuais.
- **🎨 Carteira & Economia com Tema Dark Fantasy:**
  - Reformulação visual da Carteira com a identidade *Dark Fantasy Tactile Modernism* ([AppColors](file:///home/jalvivi/Projects/king_of_territory/app_sport/lib/core/app_colors.dart) e `Cinzel`).
  - Indicador de progresso tático de metros acumulados para a próxima carga de energia (fração de 500 m) e histórico estilizado com badges de débito/crédito.
- **🛡️ Navegação e Diálogos Responsivos:**
  - Navegação inferior blindada contra travamentos de pilha ao alternar abas.
  - Diálogos de Forja, Extração de Ouro e Upgrade protegidos com rolagem adaptativa e limites de altura elásticos contra transbordamentos (*RenderFlex overflow*).

---

## Novidades da Build 43

- **💰 Venda de Equipamentos Usados e Sobressalentes por 50% do Valor Real:**
  - Agora você pode vender armas, armaduras e mochilas repetidas ou sobressalentes diretamente pelo Baú/Arsenal nos Aposentos do Herói.
  - O valor de avaliação do item considera suas matérias-primas e custos de forja ou raridade básica, com retorno fixado no clássico padrão de RPG: **exatamente 50% em Gold depositado na hora na carteira do atleta**.
  - **Bônus de Aprimoramento:** itens aprimorados (+1..+5) recebem valorização extra no preço de venda proporcional ao investimento feito na Forja.
  - **Trava de Segurança:** itens equipados no herói não podem ser vendidos acidentalmente (é necessário desequipar primeiro) e itens com gemas engastadas exigem remoção das joias antes da venda para evitar prejuízos ao jogador.

---

## Novidades da Build 42

- **🔨 Sistema de Upgrade de Equipamentos na Forja (+1 a +5):**
  - Evolua armas, armaduras e equipamentos de combate na Forja do Reino até o nível +5 (+10% por nível nos atributos base).
  - Custos escaláveis utilizando Gold, Tábuas de Madeira e Barras de Ferro, com Joia do Caos no nível +5.
- **🔒 Travas de Nível de Atleta para Equipar:**
  - Equipamentos exigem nível mínimo do atleta (ex: Espada Enferrujada Nv 1, Elmo de Ferro Nv 4, etc.).

---

## Mais informações

- O aplicativo está em fase inicial de testes.
- Se encontrar algum problema ou tiver sugestões, compartilhe pelo canal de testes.
- Versão: **0.1.0 (build 47)**.
