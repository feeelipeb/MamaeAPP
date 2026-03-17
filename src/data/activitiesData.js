export const ACTIVITY_STAGES = [
  {
    id: '0-3m',
    title: '0 a 3 meses',
    ageRange: '0 a 3 meses',
    emoji: '👶',
    color: '#F9C6CE',
    description: 'Nesta fase o bebê está descobrindo o mundo pelos sentidos. Estímulos suaves de visão, tato e audição são os mais indicados.',
    categories: ['Social', 'Cognitivo', 'Motor', 'Linguagem', 'Sensorial'],
    recipeCount: 12
  },
  {
    id: '4-6m',
    title: '4 a 6 meses',
    ageRange: '4 a 6 meses',
    emoji: '🌱',
    color: '#BAE6FD',
    description: 'O bebê já sorri, vocaliza e começa a alcançar objetos! Estimule o movimento, a voz e a exploração com as mãos.',
    categories: ['Motor', 'Cognitivo', 'Sensorial', 'Linguagem', 'Criativo'],
    recipeCount: 12
  },
  {
    id: '7-9m',
    title: '7 a 9 meses',
    ageRange: '7 a 9 meses',
    emoji: '🧸',
    color: '#BBF7D0',
    description: 'O bebê está engatinhando, sentando e explorando tudo com a boca! É hora de atividades que estimulem o movimento e a curiosidade.',
    categories: ['Motor', 'Cognitivo', 'Sensorial', 'Criativo', 'Social'],
    recipeCount: 12
  },
  {
    id: '10-12m',
    title: '10 a 12 meses',
    ageRange: '10 a 12 meses',
    emoji: '🚶',
    color: '#FEF08A',
    description: 'Quase andando! O bebê já entende comandos simples, aponta e explora com mais independência. Atividades de causa e efeito são as favoritas dessa fase.',
    categories: ['Motor', 'Linguagem', 'Cognitivo', 'Social', 'Sensorial', 'Criativo'],
    recipeCount: 12
  },
  {
    id: '1-2a',
    title: '1 a 2 anos',
    ageRange: '1 a 2 anos',
    emoji: '🌟',
    color: '#FED7AA',
    description: 'O mundo está sendo descoberto com dois pezinhos! A linguagem explode nessa fase. Atividades que estimulem fala, imaginação e coordenação são essenciais.',
    categories: ['Criativo', 'Motor', 'Linguagem', 'Sensorial', 'Cognitivo', 'Social'],
    recipeCount: 12
  },
  {
    id: '2-3a',
    title: '2 a 3 anos',
    ageRange: '2 a 3 anos',
    emoji: '🎨',
    color: '#DDD6FE',
    description: 'A fase do "por quê?"! A criança está desenvolvendo autonomia, linguagem complexa e amor por histórias. Estimule a criatividade e a resolução de problemas.',
    categories: ['Criativo', 'Cognitivo', 'Motor', 'Sensorial', 'Linguagem'],
    recipeCount: 12
  },
  {
    id: '3-4a',
    title: '3 a 4 anos',
    ageRange: '3 a 4 anos',
    emoji: '🏃',
    color: '#A7F3D0',
    description: 'Energia sem fim! A criança já socializa, tem amigos imaginários e adora desafios. É a fase ideal para atividades em grupo, jogos de regras simples e projetos criativos.',
    categories: ['Motor', 'Criativo', 'Cognitivo', 'Sensorial', 'Social', 'Linguagem'],
    recipeCount: 12
  },
  {
    id: '4-5a',
    title: '4 a 5 anos',
    ageRange: '4 a 5 anos',
    emoji: '📚',
    color: '#FECACA',
    description: 'A pré-alfabetização começa aqui! A criança já escreve o nome, conta histórias elaboradas e adora projetos com começo, meio e fim.',
    categories: ['Motor', 'Cognitivo', 'Criativo', 'Linguagem', 'Social'],
    recipeCount: 12
  }
];

export const CATEGORIES = [
  { name: 'Todas', id: 'Todas', emoji: '🟣' },
  { name: 'Cognitivo', id: 'Cognitivo', emoji: '🧠' },
  { name: 'Motor', id: 'Motor', emoji: '🤸' },
  { name: 'Linguagem', id: 'Linguagem', emoji: '💬' },
  { name: 'Criativo', id: 'Criativo', emoji: '🎨' },
  { name: 'Social', id: 'Social', emoji: '👥' },
  { name: 'Sensorial', id: 'Sensorial', emoji: '😌' }
];

export const ACTIVITIES = {
  '0-3m': [
    { name: 'Contato Visual com Sorriso', category: 'Social', duration: '5 min', description: 'Posicione seu rosto a 20–30cm do bebê. Sorria e faça expressões suaves. O bebê começa a imitar expressões faciais.', benefit: 'Desenvolvendo reconhecimento facial e vínculo afetivo.' },
    { name: 'Móbile de Alto Contraste', category: 'Cognitivo', duration: '10 min', description: 'Penture objetos em preto, branco e vermelho acima do bebê. Bebês recém-nascidos enxergam melhor alto contraste.', benefit: 'Estimula o desenvolvimento visual e foco.' },
    { name: 'Tempo de Barriga (Tummy Time)', category: 'Motor', duration: '2–5 min', description: 'Com o bebê acordado e supervisionado, deite-o de barriga em superfície firme. Coloque brinquedo colorido na frente.', benefit: 'Fortalece pescoço, ombros e prepara para engatinhar.' },
    { name: 'Música Suave e Canto', category: 'Linguagem', duration: '10 min', description: 'Cante músicas de ninar, fale em voz suave e melodiosa. Varie o tom de voz. O bebê reconhece a voz da mãe desde o útero.', benefit: 'Desenvolve percepção sonora e vínculo.' },
    { name: 'Massagem Infantil', category: 'Sensorial', duration: '10 min', description: 'Com óleo vegetal morno nas mãos, massageie suavemente braços, pernas, barriga e costas do bebê.', benefit: 'Estimula circulação, alivia cólica e fortalece vínculo.' },
    { name: 'Móbile com Espelho', category: 'Cognitivo', duration: '5 min', description: 'Posicione espelho inquebrável na frente do bebê. Ele ficará fascinado observando o próprio reflexo.', benefit: 'Desenvolvimento da autoconsciência e foco visual.' },
    { name: 'Segurar o Dedo', category: 'Motor', duration: '5 min', description: 'Coloque seu dedo na palma da mão do bebê. Ele vai agarrar por reflexo. Experimente gentilmente puxar.', benefit: 'Estimula o reflexo de preensão e coordenação.' },
    { name: 'Passeio pela Casa', category: 'Sensorial', duration: '15 min', description: 'Carregue o bebê no colo e mostre cômodos, janelas, plantas, luzes. Descreva o que está vendo em voz calma.', benefit: 'Estimula visão, audição e exploração do ambiente.' },
    { name: 'Ruídos Suaves com Chocalho', category: 'Sensorial', duration: '5 min', description: 'Balance suavemente um chocalho fora do campo visual do bebê. Observe se ele vira a cabeça em direção ao som.', benefit: 'Desenvolvimento da localização sonora.' },
    { name: 'Banho de Sol Matinal', category: 'Sensorial', duration: '10–15 min', description: 'Sol da manhã (antes das 10h), bebê em fraldas. Converse com ele durante o processo.', benefit: 'Vitamina D, regulação do sono e estimulação suave.' },
    { name: 'Leitura em Voz Alta', category: 'Linguagem', duration: '5 min', description: 'Leia qualquer livro em voz alta com entonação variada. O conteúdo ainda não importa, apenas a melodia da fala.', benefit: 'Estimula o sistema auditivo e amor pelos livros.' },
    { name: 'Texturas Suaves no Corpo', category: 'Sensorial', duration: '5 min', description: 'Passe suavemente diferentes tecidos no braço e rosto do bebê: algodão, veludo, cetim. Observe as reações.', benefit: 'Desenvolvimento da percepção tátil.' }
  ],
  '4-6m': [
    { name: 'Alcançar Brinquedos Coloridos', category: 'Motor', duration: '10 min', description: 'Segure brinquedos coloridos à frente do bebê incentivando-o a alcançar e pegar. Varie a posição: direita, esquerda, acima.', benefit: 'Coordenação olho-mão e noção espacial.' },
    { name: 'Espelho de Mão', category: 'Cognitivo', duration: '5 min', description: 'Mostre o reflexo do bebê em espelho inquebrável. Faça caras engraçadas junto com ele.', benefit: 'Desenvolvimento da identidade e autoconsciência.' },
    { name: 'Bolsa Sensorial com Gel', category: 'Sensorial', duration: '10 min', description: 'Coloque gel transparente e glitter dentro de saco zip resistente bem vedado. Deixe o bebê apertar e explorar.', benefit: 'Estimulação visual e tátil segura.' },
    { name: 'Rolar para os Lados', category: 'Motor', duration: '10 min', description: 'Com o bebê de costas, use brinquedo para estimulá-lo a rolar para o lado. Ajude levemente se necessário.', benefit: 'Prepara para sentar e engatinhar.' },
    { name: 'Conversa com Imitação de Sons', category: 'Linguagem', duration: '10 min', description: 'Quando o bebê fizer sons (ah, uh, ba), repita o mesmo som de volta. Crie uma "conversa" de turnos.', benefit: 'Bases da comunicação e desenvolvimento da fala.' },
    { name: 'Brincar com Água Morna', category: 'Sensorial', duration: '10 min', description: 'Na hora do banho, deixe o bebê explorar a água com as mãos. Use copinhos para jogar água suavemente.', benefit: 'Sensorial aquático e conforto com água.' },
    { name: 'Esconde-Esconde com Pano', category: 'Cognitivo', duration: '5 min', description: 'Cubra seu rosto com um pano e tire. Diga "achou!". Depois cubra um brinquedo e deixe o bebê encontrar.', benefit: 'Primeiras noções de permanência do objeto.' },
    { name: 'Cantigas com Gestos', category: 'Linguagem', duration: '10 min', description: 'Cante músicas como "Cabeça, Ombro, Joelho e Pé" tocando as partes do corpo. Repita várias vezes.', benefit: 'Associação de palavras com partes do corpo.' },
    { name: 'Explorar Caixas e Potes', category: 'Motor', duration: '10 min', description: 'Ofereça potes de plástico e caixas de tamanhos variados. Deixe o bebê bater, empilhar e explorar livremente.', benefit: 'Causalidade e coordenação motora.' },
    { name: 'Brincar no Tapete de Atividades', category: 'Motor', duration: '15 min', description: 'Posicione o bebê no tapete com arco de brinquedos. Estimule a alcançar e bater nos brinquedos pendurados.', benefit: 'Coordenação motora e exploração livre.' },
    { name: 'Nomear Objetos e Pessoas', category: 'Linguagem', duration: '10 min', description: 'Aponte para objetos, pessoas e animais e diga o nome claramente. "Isso é uma árvore. Isso é o papai."', benefit: 'Vocabulário passivo e associação nome-objeto.' },
    { name: 'Bolhas de Sabão', category: 'Criativo', duration: '10 min', description: 'Faça bolhas de sabão e deixe o bebê tentar tocar. Mova as bolhas em diferentes direções.', benefit: 'Tracking visual e alegria sensorial.' }
  ],
  '7-9m': [
    { name: 'Túnel de Engatinhar', category: 'Motor', duration: '15 min', description: 'Faça um túnel com almofadas ou caixas e incentive o bebê a engatinhar.', benefit: 'Fortalecimento muscular e coordenação.' },
    { name: 'Caixinha de Surpresa', category: 'Cognitivo', duration: '10 min', description: 'Esconda brinquedo sob pano. Pergunte "cadê?" e revele. Deixe o bebê procurar.', benefit: 'Permanência do objeto.' },
    { name: 'Empilhar e Derrubar', category: 'Motor', duration: '10 min', description: 'Empilhe 3–4 blocos e deixe o bebê derrubar. Reempilhe e repita.', benefit: 'Causa e efeito e coordenação motora.' },
    { name: 'Bandeja Sensorial com Alimentos', category: 'Sensorial', duration: '15 min', description: 'Coloque na bandeja: aveia, macarrão cozido, banana amassada. Deixe explorar livremente (supervisionado).', benefit: 'Exploração tátil e aceitação de texturas.' },
    { name: 'Bater Panelas', category: 'Criativo', duration: '10 min', description: 'Dê uma colher de pau e potes/panelas pequenas. Deixe fazer barulho.', benefit: 'Ritmo e coordenação motora.' },
    { name: 'Passar Objetos de Mão a Mão', category: 'Motor', duration: '5 min', description: 'Ofereça objeto e incentive a passar de uma mão para a outra.', benefit: 'Coordenação bimanual.' },
    { name: 'Livros de Tecido ou Banho', category: 'Linguagem', duration: '10 min', description: 'Apresente livros de páginas grossas com figuras grandes e nomeie.', benefit: 'Literacia emergente.' },
    { name: 'Subir Almofadas', category: 'Motor', duration: '15 min', description: 'Crie obstáculos com almofadas para o bebê engatinhar por cima.', benefit: 'Equilíbrio e força.' },
    { name: 'Imitar Sons de Animais', category: 'Linguagem', duration: '10 min', description: 'Mostre figuras de animais e imite o som. Espere o bebê reagir.', benefit: 'Discriminação auditiva e sons da fala.' },
    { name: 'Copos Empilháveis Coloridos', category: 'Cognitivo', duration: '10 min', description: 'Empilhe e desempilhe copos coloridos. Introduz cor, tamanho e sequência.', benefit: 'Noções matemáticas iniciais.' },
    { name: 'Puxar Lenços Coloridos', category: 'Motor', duration: '10 min', description: 'Coloque lenços coloridos dentro de caixa com furo. O bebê puxa e se surpreende.', benefit: 'Coordenação motora fina.' },
    { name: 'Dança com o Bebê no Colo', category: 'Social', duration: '10 min', description: 'Dance suavemente com o bebê no colo com música animada. Sorria e faça contato visual.', benefit: 'Equilíbrio e vínculo afetivo.' }
  ],
  '10-12m': [
    { name: 'Primeiros Passos com Apoio', category: 'Motor', duration: '15 min', description: 'Segure pelas mãos e estimule a dar passos. Use motivação visual.', benefit: 'Preparação para o andar independente.' },
    { name: 'Apontar e Nomear', category: 'Linguagem', duration: '10 min', description: 'Quando o bebê apontar para algo, nomeie e fale sobre o objeto.', benefit: 'Comunicação intencional.' },
    { name: 'Encaixe de Formas Simples', category: 'Cognitivo', duration: '10 min', description: 'Apresente brinquedo de encaixar formas básicas (círculo, quadrado).', benefit: 'Raciocínio lógico e percepção visual.' },
    { name: 'Tchau e Olá com Gestual', category: 'Social', duration: '5 min', description: 'Ensine "tchau" com a mão, "manda beijo" e "bate palma". Repita em contextos reais.', benefit: 'Habilidades sociais e gestuais.' },
    { name: 'Procurar Objeto Escondido', category: 'Cognitivo', duration: '10 min', description: 'Esconda brinquedo sob almofada com o bebê vendo. Pergunte "cadê?" e deixe procurar.', benefit: 'Memória de curto prazo.' },
    { name: 'Caminhar Empurrando Cadeira', category: 'Motor', duration: '15 min', description: 'Apoie o bebê numa cadeira leve para ele empurrar e caminhar.', benefit: 'Independência e equilíbrio.' },
    { name: 'Garrafa Sensorial', category: 'Sensorial', duration: '10 min', description: 'Garrafa plástica transparente com água colorida e glitter bem vedada. O bebê chacoalha e observa o movimento.', benefit: 'Foco visual e relaxamento.' },
    { name: 'Separar por Cores', category: 'Cognitivo', duration: '10 min', description: 'Ofereça objetos de 2 cores. Mostre separar: "aqui os vermelhos, aqui os azuis."', benefit: 'Categorização visual.' },
    { name: 'Leitura Interativa', category: 'Linguagem', duration: '10 min', description: 'Leia livros de páginas grossas fazendo perguntas: "onde está o cachorro?"', benefit: 'Engajamento e vocabulário.' },
    { name: 'Rolar Bola de um para o Outro', category: 'Social', duration: '10 min', description: 'Sentados no chão, role a bola para o bebê e espere ele rolar de volta.', benefit: 'Turno social e cooperação.' },
    { name: 'Rabiscar com Giz de Cera Grosso', category: 'Criativo', duration: '10 min', description: 'Ofereça papel grande no chão e giz de cera grosso. Demonstre rabiscar.', benefit: 'Expressão criativa e preensão.' },
    { name: 'Imitar Tarefas Domésticas', category: 'Social', duration: '10 min', description: 'Dê ao bebê pano para "limpar", colher para "mexer". Ele adora imitar adultos.', benefit: 'Aprendizado social e funcional.' }
  ],
  '1-2a': [
    { name: 'Brincadeira de Faz de Conta', category: 'Criativo', duration: '20 min', description: 'Cozinhinha, boneca, telefone — introduza o faz de conta.', benefit: 'Símbolo e imaginação.' },
    { name: 'Pintura com os Dedos', category: 'Criativo', duration: '20 min', description: 'Tinta atóxica, papel grande no chão. Liberdade total para explorar.', benefit: 'Sensorial e expressividade.' },
    { name: 'Torre de Blocos', category: 'Motor', duration: '15 min', description: 'Empilhe o máximo de blocos possível. Conte cada bloco em voz alta.', benefit: 'Controle motor e noções de número.' },
    { name: 'Livros com Histórias Simples', category: 'Linguagem', duration: '10 min', description: 'Leia com expressividade. Pergunte "o que aconteceu aqui?"', benefit: 'Compreensão narrativa.' },
    { name: 'Passeio na Natureza', category: 'Sensorial', duration: '30 min', description: 'Explore folhas, pedras, grama. Nomeie cores, texturas e animais.', benefit: 'Conhecimento de mundo.' },
    { name: 'Massa de Modelar Caseira', category: 'Sensorial', duration: '20 min', description: 'Receita: farinha, sal, água e corante. Modele junto com a criança.', benefit: 'Força manual e criatividade.' },
    { name: 'Montar e Desmontar Peças Grandes', category: 'Cognitivo', duration: '15 min', description: 'Lego Duplo ou peças grandes de encaixe. Mostre a montar e deixe explorar.', benefit: 'Resolução de problemas.' },
    { name: 'Cantigas com Coreografia', category: 'Linguagem', duration: '10 min', description: 'Ensine músicas com gestos: "O Sapo Não Lava o Pé", "Borboletinha".', benefit: 'Ritmo e memória sequencial.' },
    { name: 'Classificar Objetos por Tamanho', category: 'Cognitivo', duration: '10 min', description: 'Separe objetos em "grandão" e "pequenininho". Use linguagem exagerada e divertida.', benefit: 'Noção de proporção.' },
    { name: 'Brincadeira de Roda', category: 'Social', duration: '15 min', description: '"Ciranda Cirandinha", "Escravos de Jó" — desenvolvem ritmo e cooperação.', benefit: 'Integração social.' },
    { name: 'Subir e Descer Escadas com Apoio', category: 'Motor', duration: '10 min', description: 'Com supervisão e mão dada, suba e desça escadas devagar contando os degraus.', benefit: 'Coordenação motora grossa.' },
    { name: 'Jogo de Encaixe com Pinos', category: 'Motor', duration: '15 min', description: 'Brinquedo de encaixar pinos em furos. Desenvolve pinça fina.', benefit: 'Precisão motora.' }
  ],
  '2-3a': [
    { name: 'Teatrinho de Fantoches', category: 'Criativo', duration: '20 min', description: 'Faça fantoches com meias velhas. Crie uma história simples juntos.', benefit: 'Narrativa e empatia.' },
    { name: 'Quebra-Cabeça de 4 a 6 Peças', category: 'Cognitivo', duration: '15 min', description: 'Comece com pouquíssimas peças. Aumente gradualmente conforme a habilidade.', benefit: 'Análise visual.' },
    { name: 'Pintura com Pincel', category: 'Criativo', duration: '20 min', description: 'Tinta guache e papel. Mostre diferentes movimentos com o pincel.', benefit: 'Controle de ferramenta.' },
    { name: 'Pular na Cama Elástica ou Almofadas', category: 'Motor', duration: '15 min', description: 'Criar área segura para pular. Desenvolve equilíbrio e coordenação.', benefit: 'Consciência corporal.' },
    { name: 'Recorte com Tesoura de Ponta Arredondada', category: 'Motor', duration: '15 min', description: 'Recorte linhas retas em papel. Primeira habilidade com tesoura.', benefit: 'Coordenação motora fina complexa.' },
    { name: 'Jogo da Memória Simples', category: 'Cognitivo', duration: '15 min', description: 'Use 4–6 pares de figuras. Introduz memória e concentração.', benefit: 'Foco e atenção.' },
    { name: 'Criar Colagem com Revistas', category: 'Criativo', duration: '20 min', description: 'Recorte figuras de revistas e cole em papel. Tema livre ou guiado.', benefit: 'Composição visual.' },
    { name: 'Jardinagem Simples', category: 'Sensorial', duration: '20 min', description: 'Plante sementes de feijão em copinho. A criança cuida e observa crescer.', benefit: 'Paciência e ciclo da vida.' },
    { name: 'Contar Objetos até 5', category: 'Cognitivo', duration: '10 min', description: 'Use objects do cotidiano para introduzir contagem com significado.', benefit: 'Correspondência um-para-um.' },
    { name: 'Brincadeira de Sombra', category: 'Criativo', duration: '15 min', description: 'Com lanterna em quarto escuro, façam sombras na parede com as mãos.', benefit: 'Criatividade e luz/sombra.' },
    { name: 'Circuito Motor com Almofadas', category: 'Motor', duration: '20 min', description: 'Monte um percurso: pular de almofada em almofada, rastejar, girar.', benefit: 'Planejamento motor.' },
    { name: 'Hora do Conto com Participação', category: 'Linguagem', duration: '15 min', description: 'Leia e pause. Pergunte "o que vai acontecer agora?" Deixe ela criar o final.', benefit: 'Expressão verbal.' }
  ],
  '3-4a': [
    { name: 'Amarelinha', category: 'Motor', duration: '20 min', description: 'Desenhe no chão com giz. Ensine a sequência e o equilíbrio.', benefit: 'Equilíbrio e regra de jogo.' },
    { name: 'Construção com Caixas de Papelão', category: 'Criativo', duration: '30 min', description: 'Casas, carros, castelos — a criança decide. Decore com tinta.', benefit: 'Engenharia e criatividade.' },
    { name: 'Jogo do Dado Gigante', category: 'Cognitivo', duration: '20 min', description: 'Dado feito de caixa. Cada número corresponde a uma ação (pular, girar, latir).', benefit: 'Associação e movimento.' },
    { name: 'Boliche de Garrafinhas', category: 'Motor', duration: '20 min', description: 'Garrafinhas com areia como pinos. Bola de meia como bola.', benefit: 'Direcionamento e mira.' },
    { name: 'Desenho Livre com Canetinha', category: 'Criativo', duration: '20 min', description: 'Papel grande no chão. Tema: "desenhe sua família", "seu lugar favorito".', benefit: 'Representação simbólica.' },
    { name: 'Plantio e Cuidado de Horta', category: 'Sensorial', duration: '30 min', description: 'Plante temperos em vaso (manjericão, salsinha). A criança rega todo dia.', benefit: 'Responsabilidade e natureza.' },
    { name: 'Caça ao Tesouro Simples', category: 'Cognitivo', duration: '20 min', description: 'Esconda objeto e dê pistas verbais simples: "está perto da porta azul".', benefit: 'Escuta ativa e lógica.' },
    { name: 'Teatro com Fantasia', category: 'Social', duration: '20 min', description: 'Caixa de fantasias e espelho. Deixe ela criar personagem e encenar.', benefit: 'Identidade e performance.' },
    { name: 'Circuito de Equilíbrio', category: 'Motor', duration: '20 min', description: 'Linha no chão com fita, pedras de rio, tábua. Percurso de equilíbrio.', benefit: 'Propriocepção.' },
    { name: 'Criar Livro de História Próprio', category: 'Linguagem', duration: '30 min', description: 'Dobre folhas como livro. A criança desenha e você escreve o que ela dita.', benefit: 'Noção de escrita.' },
    { name: 'Jogo de Memória com Fotos da Família', category: 'Cognitivo', duration: '15 min', description: 'Imprima fotos em pares. Além da memória, reforça laços familiares.', benefit: 'Reconhecimento e afeto.' },
    { name: 'Dança das Cadeiras', category: 'Social', duration: '15 min', description: 'Versão cooperativa: cada rodada retira uma cadeira mas todos precisam sentar juntos.', benefit: 'Colaboração.' }
  ],
  '4-5a': [
    { name: 'Aprender a Escrever o Nome', category: 'Motor', duration: '20 min', description: 'Escreva o nome em pontilhado para ela traçar. Use letras maiúsculas.', benefit: 'Alfabetização inicial.' },
    { name: 'Bingo de Letras', category: 'Cognitivo', duration: '20 min', description: 'Cartelas com letras do alfabeto. Fale a letra e a criança marca.', benefit: 'Identificação fonêmica.' },
    { name: 'Experiência de Vulcão', category: 'Cognitivo', duration: '30 min', description: 'Bicarbonato + vinagre + corante. A criança observa e aprende sobre reação química.', benefit: 'Pensamento científico.' },
    { name: 'Criar Receita com Desenho', category: 'Criativo', duration: '20 min', description: 'Peça para inventar uma receita e desenhar os ingredientes.', benefit: 'Sequenciamento lógico.' },
    { name: 'Leitura de Palavras Simples', category: 'Linguagem', duration: '15 min', description: 'Cartões com palavras curtas (bola, gato, casa). Associe com desenho.', benefit: 'Decodificação.' },
    { name: 'Origami Simples', category: 'Motor', duration: '20 min', description: 'Barquinho ou avião de papel. Desenvolve coordenação e sequência.', benefit: 'Atenção plena.' },
    { name: 'Criar Mapa do Quarto', category: 'Cognitivo', duration: '20 min', description: 'Peça para desenhar o quarto visto de cima. Introduz noção espacial.', benefit: 'Abstração.' },
    { name: 'Peça de Teatro com Roteiro', category: 'Social', duration: '30 min', description: 'Crie um roteiro simples juntos. Convide a família para assistir.', benefit: 'Trabalho em equipe.' },
    { name: 'Desafio de Construção com Palito', category: 'Cognitivo', duration: '20 min', description: 'Com palitos de sorvete e cola, construa estruturas: pontes, casinhas.', benefit: 'Engenharia básica.' },
    { name: 'Trilha da Matemática', category: 'Cognitivo', duration: '20 min', description: 'Trilha no chão com quadradinhos. Dado determina quantas casas anda. Nas casas há operações simples (1+1, 2+2).', benefit: 'Cálculo inicial.' },
    { name: 'Culinária Simples com Supervisão', category: 'Social', duration: '30 min', description: 'Faça receita simples juntos: salada de frutas, vitamina, sanduíche. A criança participa de todas as etapas.', benefit: 'Autonomia e prazer.' },
    { name: 'Criar Diário com Desenhos', category: 'Criativo', duration: '20 min', description: 'Caderninho exclusivo. Todo dia ela desenha "o melhor momento do dia".', benefit: 'Reflexão e registro.' }
  ]
};
