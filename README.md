# K.O.T — Baixe e teste

Um app que transforma caminhadas e corridas em uma aventura de evolução de personagem e reinos.

> **O nome e a logo ainda não foram decididos. K.O.T / King of Territory e a logo atual são temporários e podem mudar.**

## Baixar e instalar

**[🚀 Baixar para Android — v0.1.3, build 55](https://github.com/deartis/kot_dwn/releases/download/v0.1.3-build55/kot-v0.1.3-build55.apk)**

- **Tamanho:** `120.633.113 bytes` (~115,0 MB)
- **SHA-256:** `b4f94a26242231a0e9b3483ee0e8056539be56e906ba6a3a1c5fc2d22947b1b6`
- **Checksum:** [SHA256SUMS-build55.txt](https://github.com/deartis/kot_dwn/releases/download/v0.1.3-build55/SHA256SUMS-build55.txt)
- **Requisitos:** Android 7.0 ou superior.

### Como instalar ou atualizar

1. Abra o link acima no celular e baixe o arquivo APK.
2. Abra o arquivo baixado. Se o Android solicitar, permita que o navegador instale o aplicativo.
3. Conclua a instalação e abra o app.
4. *Já possui uma versão anterior instalada?* Basta baixar o APK e instalar por cima para atualizar com todos os seus dados preservados.

---

## Novidades da v0.1.3 (Build 55)

- **Detecção de atualizações em tempo real:** o app agora verifica novas releases automaticamente a cada 60 segundos enquanto está aberto usando `If-None-Match` (ETag), exibindo a barra de atualização na hora sem gastar limite da API do GitHub.
- **Limpeza automática do APK baixado:** ao abrir a nova versão após a instalação (e antes de baixar novas atualizações), o app exclui automaticamente os APKs temporários antigos para liberar espaço no celular.

---

## Novidades da v0.1.2 (Build 54)

- **Foto do perfil sem piscar:** corrigido o bug no `PlayerAvatar` que re-decodificava fotos escolhidas da galeria (`base64`) a cada atualização de tela; agora os bytes ficam em cache com `gaplessPlayback`.
- **Entrega real das Convocações da Coroa:** convocações individuais e Éditos Gerais emitidos pelo Soberano agora são salvos no servidor e entregues no celular dos cidadãos leais via notificação local Android e modal da Coroa dentro do app.

---

## Novidades da v0.1.1 (Build 53)

- **Atualização automática dentro do app:** nova barra persistente no topo de todas as telas avisando sempre que uma nova release oficial estiver disponível no GitHub, com visualização das novidades, download do APK com barra de progresso dentro do aplicativo e abertura direta do instalador Android.
- **Filtro inteligente de releases:** builds internas de teste na mesma versão semântica não incomodam com avisos repetidos; o banner só aparece em releases oficiais superiores.

---

## Novidades da Build 52

- **Atalho direto para a Mochila nos Aposentos do Herói:** adicionados ícone de mochila na barra superior e botão **"Abrir Mochila & Inventário →"** no card de atributos dos Aposentos do Herói, sincronizando o loadout ao voltar.

---

## Novidades da Build 51

- **Altar de Joias Raras sincronizado com a API:** corrigidos os preços exibidos nos botões de compra (**400 Gold** para Joia do Caos e **900 Gold** para Safira Arcana e Esmeralda Mística), agora enviados diretamente pela API.
- **Barra de saldo mais clara nos Engastes:** exibidos os rótulos abaixo de cada quantidade (**Caos**, **Safira**, **Esmeralda**, **Ferro** e **Gold**), incluindo o saldo de **Ferro Refinado** necessário para perfurar engastes.
- **Joias visíveis na Mochila / Inventário:** as joias raras possuídas agora aparecem diretamente na grade da mochila, com modal de detalhes, atalho para os Aposentos do Herói e opção de venda rápida por Gold (+20% ao reino leal).

---

## Novidades da Build 50

- **Reino de lealdade persistente:** atletas leais agora mantêm seu reino de lealdade fixo na Home, na aba Reino, na Mochila, no Vilarejo e nos Desafios da Temporada, mesmo ao caminhar por outros territórios.
- **Tela dedicada para Reino Visitado:** ao passar por um reino diferente do seu, o atleta leal acessa uma tela dedicada (`Reino Visitado`) com informações e ações de passagem (Arena/Mapa, Fronteira e visita ao vilarejo estrangeiro).
- **Aviso em vilarejo estrangeiro:** ao entrar no vilarejo de outro reino, um banner explícito identifica a visita sem misturar com o seu reino de origem.

---

## Novidades da Build 49

- **Correções de UX e estados de erro:** feedback visual e opção de tentar novamente em falhas de carregamento na Home, Perfil e Carteira, aviso persistente quando a permissão de localização é negada na Arena, e confirmação visual ao salvar perfil.
- **Acessibilidade e layout:** fontes mínimas ajustadas para `>= 12 px`, áreas de toque padronizadas em `48 dp`, correção de overflow em diálogos/cabeçalhos e tema dark consistente na Carteira.
- **Navegação e fontes:** barra inferior padronizada com `pushReplacement` e carregamento centralizado de fontes (`AppFonts`).
- **Segurança na API:** cabeçalhos de segurança (`helmet`), rate limiting nas rotas de autenticação, CORS configurável, auditoria de login no painel admin e bloqueio de `NODE_ENV=test` em produção.

---

## Novidades da Build 48

- **🏘️ Vilarejo Completo & Lojas Abertas:**
  - Todas as 6 lojas do vilarejo estão abertas e operacionais por padrão em todos os reinos (Sede do Reino, Ferraria da Guarda, Marcenaria Real, Tenda do Mercador, Loja de Poções e Loja de Proteínas).
- **💸 Taxas Amigáveis para Mobilidade Urbana:**
  - **Reino Leal (Cidadão):** taxa comercial reduzida para apenas **5%** (95% do ouro fica com o atleta; 5% fortalece o seu próprio reino).
  - **Fora do Reino Leal (Em Trânsito):** taxa comercial reduzida de 50% para apenas **15%** (85% para o atleta e 15% para o tesouro local).
  - **Forja e Artesanato Liberados em Trânsito:** forje armas e armaduras e curta peles em qualquer reino, sem barreiras.
- **📜 Nova Interface de Vilarejo em Cards:**
  - Lista vertical temática no estilo Dark RPG com imagens das lojas à esquerda, identificação do NPC e lore no centro, e botão direto `[ Acessar ]`.
  - Card dinâmico de status de Cidadania no topo destacando as vantagens do Reino Leal.
- **🗣️ Lojas Imersivas com NPCs Vivos:**
  - Tela dedicada com mestres de ofício temáticos (*Durin*, *Gunnar*, *Freya*, *Eldrin*, *Brunhild* e *Valerius*), balão de fala dinâmico com haptic feedback e abas organizadas para cada atividade comercial.

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
