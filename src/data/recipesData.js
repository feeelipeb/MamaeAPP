export const MENU_STAGES = [
  {
    id: 'amamentacao',
    title: 'Amamentação Exclusiva',
    ageRange: '0 a 6 meses',
    emoji: '🤱',
    color: '#F9C6CE',
    description: 'O melhor alimento agora é o leite materno 🤱. Nos primeiros 6 meses, a OMS recomenda amamentação exclusiva. O leite materno oferece todos os nutrientes e anticorpos necessários.',
    tips: [
      'Amamente sob livre demanda',
      'Não ofereça água nem chá',
      'Acompanhe com seu pediatra',
      'Fortalece o vínculo mãe-bebê'
    ],
    recipeCount: 0
  },
  {
    id: 'liquido',
    title: 'Papas Líquidas',
    ageRange: 'A partir de 6 meses',
    emoji: '🥣',
    color: '#BAE6FD',
    description: 'Introdução suave com texturas líquidas e ricas em nutrientes.',
    tips: [
      'Um alimento novo por vez',
      'Aguarde 3 dias entre novos alimentos',
      'Não force o bebê a comer',
      'Sem sal, açúcar ou mel'
    ],
    recipeCount: 12
  },
  {
    id: 'pastoso_inicial',
    title: 'Pastoso Inicial',
    ageRange: '7 a 8 meses',
    emoji: '🥗',
    color: '#BBF7D0',
    description: 'Evoluindo para texturas mais densas e amassadinhas.',
    tips: [
      'Amasse bem com o garfo',
      'Ainda sem sal nas preparações',
      'Pode introduzir ovo cozido',
      'Introduza peixe (sem espinhas)'
    ],
    recipeCount: 12
  },
  {
    id: 'pastoso_avancado',
    title: 'Pastoso Avançado',
    ageRange: '9 a 11 meses',
    emoji: '🥘',
    color: '#FEF08A',
    description: 'Texturas mais variadas e pequenos pedaços para mastigação.',
    tips: [
      'Incentive comer com as mãos',
      'Mastigação em desenvolvimento',
      'Varie as texturas dos alimentos',
      'Varie as cores do prato'
    ],
    recipeCount: 12
  },
  {
    id: 'solido',
    title: 'Mesa da Família',
    ageRange: 'A partir de 12 meses',
    emoji: '🍽️',
    color: '#FED7AA',
    description: 'O bebê começa a comer o que a família come, com ajustes nutritivos.',
    tips: [
      'Mínimo de sal possível',
      'Evite alimentos ultraprocessados',
      'Coma junto com o bebê',
      'Mantenha o prato sempre colorido'
    ],
    recipeCount: 14
  },
  {
    id: 'blw',
    title: 'BLW (Baby-Led Weaning)',
    ageRange: 'A partir de 6 meses',
    emoji: '🌱',
    color: '#DDD6FE',
    description: 'O método onde o bebê conduz sua própria alimentação com pedaços inteiros.',
    alert: 'O BLW requer supervisão constante. Aprenda a diferença entre engasgo e sufocamento antes de iniciar.',
    tips: [
      'Supervisão 100% do tempo',
      'Corte em formatos seguros (palitos)',
      'Respeite o tempo do bebê',
      'Prepare-se para a bagunça divertida'
    ],
    recipeCount: 12
  }
];

export const RECIPES = {
  liquido: [
    { name: 'Papa de Abóbora com Frango', ingredients: ['50g abóbora', '20g peito de frango', 'água'], steps: ['Cozinhe bem', 'Triture até ficar líquido'], benefit: 'Vitamina A' },
    { name: 'Caldo de Legumes com Batata', ingredients: ['Batata', 'Cenoura', 'Chuchu'], steps: ['Cozinhe', 'Peneire o caldo'], benefit: 'Hidratação' },
    { name: 'Papa de Banana com Maçã', ingredients: ['Banana', 'Maçã'], steps: ['Triture as frutas'], benefit: 'Energia' },
    { name: 'Creme de Ervilha com Cenoura', ingredients: ['Ervilha fresca', 'Cenoura'], steps: ['Cozinhe e bata no liquidificador'], benefit: 'Fibras' },
    { name: 'Papa de Mandioquinha', ingredients: ['Mandioquinha', 'água'], steps: ['Cozinhe e processe'], benefit: 'Carboidratos' },
    { name: 'Caldo de Feijão Coado', ingredients: ['Feijão cozido'], steps: ['Peneire bem o caldinho'], benefit: 'Ferro' },
    { name: 'Papa de Pera com Aveia', ingredients: ['Pera', 'Aveia em flocos finos'], steps: ['Cozinhe a pera e bata com aveia'], benefit: 'Digestão' },
    { name: 'Creme de Batata-Doce', ingredients: ['Batata-doce'], steps: ['Cozinhe e bata até ficar cremoso'], benefit: 'Saciedade' },
    { name: 'Papa de Arroz com Cenoura', ingredients: ['Arroz bem cozido', 'Cenoura'], steps: ['Bata tudo até virar líquido'], benefit: 'Energia' },
    { name: 'Creme de Inhame', ingredients: ['Inhame'], steps: ['Cozinhe e bata bem'], benefit: 'Imunidade' },
    { name: 'Papa de Milho Verde', ingredients: ['Milho verde fresco'], steps: ['Bata e peneire bem'], benefit: 'Vitamina B' },
    { name: 'Creme de Beterraba com Maçã', ingredients: ['Beterraba', 'Maçã'], steps: ['Cozinhe a beterraba e bata com a maçã'], benefit: 'Ferro' }
  ],
  pastoso_inicial: [
    { name: 'Purê de Batata com Frango Desfiado', ingredients: ['Batata', 'Frango'], steps: ['Amasse a batata', 'Desfie bem o frango'], benefit: 'Proteína' },
    { name: 'Amassado de Feijão com Abóbora', ingredients: ['Feijão', 'Abóbora'], steps: ['Amasse com garfo'], benefit: 'Ferro' },
    { name: 'Papa de Arroz com Legumes', ingredients: ['Arroz', 'Legumes variados'], steps: ['Amasse grosseiramente'], benefit: 'Vitaminas' },
    { name: 'Purê de Lentilha com Cenoura', ingredients: ['Lentilha', 'Cenoura'], steps: ['Cozinhe e amasse'], benefit: 'Proteína Vegetal' },
    { name: 'Amassado de Abobrinha com Ovo', ingredients: ['Abobrinha', 'Ovo'], steps: ['Amasse a abobrinha', 'Cozinha o ovo e amasse'], benefit: 'Colina' },
    { name: 'Purê de Mandioca com Peixe', ingredients: ['Mandioca', 'Peixe branco'], steps: ['Amasse a mandioca', 'Peixe em pedacinhos minúsculos'], benefit: 'Ômega 3' },
    { name: 'Papa de Aveia com Banana e Maçã', ingredients: ['Aveia', 'Banana', 'Maçã'], steps: ['Misture e amasse'], benefit: 'Fibras' },
    { name: 'Amassado de Batata-Doce com Grão-de-Bico', ingredients: ['Batata-doce', 'Grão-de-bico'], steps: ['Amasse bem'], benefit: 'Proteína' },
    { name: 'Purê de Ervilha com Batata', ingredients: ['Ervilha', 'Batata'], steps: ['Amasse tudo'], benefit: 'Fibras' },
    { name: 'Papa de Quinoa com Legumes', ingredients: ['Quinoa', 'Legumes'], steps: ['Misture bem amacadinho'], benefit: 'Aminoácidos' },
    { name: 'Amassado de Abacate com Frango', ingredients: ['Abacate', 'Frango'], steps: ['Amasse o abacate', 'Misture o frango'], benefit: 'Gorduras Boas' },
    { name: 'Papa de Inhame com Carne Moída', ingredients: ['Inhame', 'Carne moída'], steps: ['Amasse o inhame', 'Misture a carne'], benefit: 'Ferro' }
  ],
  pastoso_avancado: [
    { name: 'Arroz, Feijão e Carne Moída em Pedacinhos', ingredients: ['Arroz', 'Feijão', 'Carne moída'], steps: ['Servir com grãos inteiros e carne moída'], benefit: 'Completo' },
    { name: 'Macarrão com Molho de Legumes', ingredients: ['Macarrão pequeno', 'Tomate', 'Legumes'], steps: ['Pique fino'], benefit: 'Lúdico' },
    { name: 'Frango Desfiado com Brócolis Cozido', ingredients: ['Frango', 'Brócolis'], steps: ['Pedacinhos pequenos'], benefit: 'Cálcio' },
    { name: 'Omelete de Legumes em Tiras', ingredients: ['Ovo', 'Legumes'], steps: ['Corte em tiras largas'], benefit: 'Autonomia' },
    { name: 'Bolinha de Batata-Doce com Atum', ingredients: ['Batata-doce', 'Atum'], steps: ['Modele bolinhas'], benefit: 'Ômega 3' },
    { name: 'Pirão de Peixe com Legumes', ingredients: ['Peixe', 'Farinha de mandioca', 'Legumes'], steps: ['Consistência firme'], benefit: 'Tradicional' },
    { name: 'Cuscuz com Ovo Mexido', ingredients: ['Farinha de milho', 'Ovo'], steps: ['Cuscuz macio'], benefit: 'Energia' },
    { name: 'Polenta Mole com Frango', ingredients: ['Fubá', 'Frango'], steps: ['Cozinhe bem'], benefit: 'Calórico' },
    { name: 'Sopa de Legumes com Macarrãozinho', ingredients: ['Legumes', 'Macarrão ave-maria'], steps: ['Pedaços visíveis'], benefit: 'Vitaminas' },
    { name: 'Bolinho de Arroz e Espinafre', ingredients: ['Arroz', 'Espinafre'], steps: ['Modele e asse'], benefit: 'Ferro' },
    { name: 'Salada de Frutas em Cubinhos', ingredients: ['Frutas variadas'], steps: ['Corte em cubos pequenos'], benefit: 'Antioxidantes' },
    { name: 'Risoto Simples de Legumes', ingredients: ['Arroz arbóreo', 'Legumes'], steps: ['Textura cremosa'], benefit: 'Texturas' }
  ],
  solido: [
    { name: 'Frango Grelhado com Arroz e Salada', ingredients: ['Frango', 'Arroz', 'Salada'], steps: ['Grelhe o frango', 'Monte o prato'], benefit: 'Equilibrado' },
    { name: 'Macarrão ao Molho de Tomate Caseiro', ingredients: ['Macarrão', 'Tomate fresco'], steps: ['Molho natural'], benefit: 'Vitamina C' },
    { name: 'Peixe Assado com Batata', ingredients: ['Peixe', 'Batata', 'Azeite'], steps: ['Ase no forno'], benefit: 'Ômega 3' },
    { name: 'Feijão Tropeiro Sem Sal', ingredients: ['Feijão', 'Farinha', 'Ovo'], steps: ['Refogue bem'], benefit: 'Energia' },
    { name: 'Carne Cozida com Legumes', ingredients: ['Carne em cubos', 'Legumes'], steps: ['Cozinhe na pressão'], benefit: 'Ferro' },
    { name: 'Torta de Legumes Assada', ingredients: ['Ovo', 'Farinha', 'Legumes'], steps: ['Asse até dourar'], benefit: 'Praticidade' },
    { name: 'Panqueca de Banana com Aveia', ingredients: ['Banana', 'Aveia', 'Ovo'], steps: ['Misture e grelhe'], benefit: 'Saudável' },
    { name: 'Yakissoba de Frango com Legumes', ingredients: ['Macarrão', 'Frango', 'Legumes'], steps: ['Refogado rápido'], benefit: 'Variedade' },
    { name: 'Sopa Cremosa de Abóbora', ingredients: ['Abóbora', 'Cebola', 'Azeite'], steps: ['Bata tudo'], benefit: 'Vitamina A' },
    { name: 'Omelete com Queijo e Espinafre', ingredients: ['Ovo', 'Queijo', 'Espinafre'], steps: ['Grelhe dos dois lados'], benefit: 'Cálcio' },
    { name: 'Bolinho de Atum com Batata', ingredients: ['Atum', 'Batata'], steps: ['Modele e asse'], benefit: 'Fósforo' },
    { name: 'Arroz de Forno com Frango', ingredients: ['Arroz', 'Frango desfiado'], steps: ['Asse por 15 min'], benefit: 'Fácil' },
    { name: 'Vitamina de Frutas com Aveia', ingredients: ['Leite/Água', 'Frutas', 'Aveia'], steps: ['Bata no liquidificador'], benefit: 'Energia' },
    { name: 'Mini Pizza Integral', ingredients: ['Massa integral', 'Tomate', 'Queijo'], steps: ['Asse no forno'], benefit: 'Lúdico' }
  ],
  blw: [
    { name: 'Palito de Cenoura Cozida', ingredients: ['Cenoura'], steps: ['Corte em palitos largos', 'Cozinhe até ficar macio'], benefit: 'Visão' },
    { name: 'Brócolis em Buquê Cozido', ingredients: ['Brócolis'], steps: ['Mantenha o talo longo', 'Cozinhe a vapor'], benefit: 'Cálcio' },
    { name: 'Banana Inteira com Casca Parcial', ingredients: ['Banana'], steps: ['Retire metade da casca'], benefit: 'Prático' },
    { name: 'Frango Cozido em Tiras', ingredients: ['Peito de frango'], steps: ['Corte em tiras do tamanho de um dedo'], benefit: 'Proteína' },
    { name: 'Palito de Batata-Doce Assada', ingredients: ['Batata-doce'], steps: ['Asse com casca em palitos'], benefit: 'Sabor' },
    { name: 'Ovo Mexido em Pedaços', ingredients: ['Ovo'], steps: ['Prepare firme e corte em tiras'], benefit: 'Cérebro' },
    { name: 'Fatia de Pão Integral Tostado', ingredients: ['Pão integral'], steps: ['Toste levemente'], benefit: 'Textura' },
    { name: 'Manga em Fatias com Casca', ingredients: ['Manga'], steps: ['Fatias longas com um pouco de casca'], benefit: 'Refrescante' },
    { name: 'Pepino em Palito Cru', ingredients: ['Pepino'], steps: ['Retire as sementes', 'Corte em palitos'], benefit: 'Alívio na Gengiva' },
    { name: 'Hamburguer de Frango Assado', ingredients: ['Frango moído'], steps: ['Modele em formato de dedo'], benefit: 'Ferro' },
    { name: 'Bolinha de Queijo Branco', ingredients: ['Queijo branco'], steps: ['Apenas pedaços grandes'], benefit: 'Cálcio' },
    { name: 'Abobrinha Grelhada em Tiras', ingredients: ['Abobrinha'], steps: ['Corte em tiras e grelhe'], benefit: 'Leveza' }
  ]
};
