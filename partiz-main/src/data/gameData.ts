
import { GameMode, Card } from '../types/game';

export const gameModes: GameMode[] = [
  {
    id: 'happiz-hour',
    name: 'Happiz Hour',
    description: 'Une petite pinte après le travail : tu es détendu et tu comptes te rappeler de ta soirée.',
    emoji: '🍻',
    color: 'from-orange-400 to-yellow-500'
  },
  {
    id: 'orgizzz',
    name: 'Orgizzz',
    description: 'Bande de pervers, c\'est vraiment ce que vous voulez ?',
    emoji: '🔥',
    color: 'from-red-500 to-pink-600'
  },
  {
    id: 'vie-dartizste',
    name: 'Vie d\'artizste',
    description: 'Ayons des deep conversations pour voir qui tu es vraiment. Plutôt bohémien ou poète torturé ?',
    emoji: '🎨',
    color: 'from-purple-500 to-indigo-600'
  },
  {
    id: 'psykoz',
    name: 'Psykoz',
    description: 'J\'espère que tu as les nerfs solides. Après ça plus aucun secret.',
    emoji: '🧠',
    color: 'from-green-500 to-teal-600'
  },
  {
    id: 'tas-la-ref',
    name: 'T\'as la réf',
    description: 'Mode spécial pour 2 joueurs : trouve la référence avant ton adversaire ! Trends, memes et culture web.',
    emoji: '📱',
    color: 'from-blue-500 to-cyan-600'
  }
];

export const cards: Card[] = [
  // ===== ALCOOL 0, SEXUALITÉ 0, DEEP OUI, DATE NON =====
  {
    id: 'new6',
    content: '{player1}, si tu as quelque chose sur le coeur c\'est le moment de te confesser à {player2}. Des excuses, un aveu, une décla ?',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'close',
    isDeep: true,
    dateMode: 'no',
    explicitlySexual: false
  },
  {
    id: 'new15',
    content: 'Répondez chacun à cette question sans vous concerter : "Qui est le plus émotif ?". Si vos réponses sont différentes c\'est 2 gorgées chacun.',
    alcoholLevel: 3,
    sexualLevel: 0,
    proximityLevel: 'close',
    isDeep: true,
    dateMode: 'no',
    explicitlySexual: false
  },
  {
    id: 'new24',
    content: '{player1}, quel détail anodin chez toi est super important mais que les gens ne remarquent jamais ?',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'compatible',
    explicitlySexual: false
  },
  {
    id: 'new25',
    content: '{player1}, raconte une habitude chelou que t\'as chez toi et que personne ne sait.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'compatible',
    explicitlySexual: false
  },
  {
    id: 'new26',
    content: '{player1}, donne une chanson qui te résume bien en ce moment. Explique pourquoi.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'compatible',
    explicitlySexual: false
  },
  {
    id: 'new27',
    content: '{player1}, quelle chose t\'apaise instantanément quand ça va pas, même si c\'est un peu nul ?',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'compatible',
    explicitlySexual: false
  },
  {
    id: 'new29',
    content: '{player1}, raconte une chose que tu pensais vraie plus jeune, mais que tu trouves complètement absurde aujourd\'hui.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'compatible',
    explicitlySexual: false
  },
  {
    id: 'new30',
    content: '{player1}, quelle partie de toi tu protèges le plus, et que t\'aimerais oser montrer davantage ?',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'compatible',
    explicitlySexual: false
  },
  {
    id: 'new31',
    content: '{player1}, pose à {player2} une question que personne ne te pose jamais, mais que t\'aimerais vraiment qu\'on te pose un jour.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'compatible',
    explicitlySexual: false
  },
  {
    id: 'new32',
    content: '{player1}, raconte un moment de ta vie où tu t\'es senti.e profondément à ta place. Même si c\'était rien d\'extraordinaire.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'compatible',
    explicitlySexual: false
  },
  {
    id: 'new33',
    content: '{player1}, si tu pouvais téléphoner à ton toi de 15 ans pendant 30 secondes, tu lui dirais quoi ?',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'compatible',
    explicitlySexual: false
  },
  {
    id: 'new34',
    content: '{player1}, quelle est une chose que tu n\'as pas encore osé faire par peur d\'être jugé.e ?',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'compatible',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0dno_1',
    content: '{player1}, raconte le moment où tu t\'es senti le plus fier de toi cette année.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'no',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0dno_2',
    content: '{player1}, quelle leçon de vie importante tu as apprise trop tard ?',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'no',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0dno_3',
    content: 'Tout le monde partage un moment où vous avez ressenti de la gratitude pure.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'no',
    explicitlySexual: false
  },

  // ===== ALCOOL 0, SEXUALITÉ 0, DEEP OUI, DATE OUI =====
  {
    id: 'new16',
    content: 'Décrivez-vous mutuellement en un mot... mais le plus brutal possible.',
    alcoholLevel: 3,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'compatible',
    explicitlySexual: false
  },
  {
    id: 'new17',
    content: '{player1}, si tu devais résumer ton dernier crush en un nom de film, ce serait lequel ? Sinon, bois 2 gorgées.',
    alcoholLevel: 1,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'compatible',
    explicitlySexual: false
  },
  {
    id: 'new19',
    content: '{player1}, complimente quelque chose chez {player2} que tu penses qu\'il/elle sous-estime.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'compatible',
    explicitlySexual: false
  },
  {
    id: 'new28',
    content: '{player1}, tu as le droit de demander à {player2} ce que tu veux savoir sur lui/elle. Il/elle doit répondre honnêtement (ou boire 2 gorgées).',
    alcoholLevel: 1,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'compatible',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0dyo_1',
    content: '{player1}, quelle est la chose la plus authentique chez {player2} que tu as remarquée ?',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'compatible',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0dyo_2',
    content: '{player1}, raconte un moment où tu t\'es senti vraiment compris par quelqu\'un.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'compatible',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0dyo_3',
    content: '{player1}, quelle qualité chez {player2} t\'inspire le plus et pourquoi ?',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'compatible',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0dyo_4',
    content: '{player1}, partage un rêve ou une ambition que tu n\'oses jamais dire à voix haute.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'compatible',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0dyo_5',
    content: '{player1}, décris comment {player2} pourrait te réconforter si tu avais une journée de merde.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'compatible',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0dyo_6',
    content: '{player1}, quelle peur irrationnelle tu as et comment {player2} pourrait t\'aider à la surmonter ?',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'compatible',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0dyo_7',
    content: '{player1}, raconte un souvenir d\'enfance qui définit encore qui tu es aujourd\'hui.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'compatible',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0dyo_8',
    content: '{player1}, quelle conversation difficile tu évites depuis trop longtemps ?',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'compatible',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0dyo_9',
    content: '{player1}, décris {player2} comme si tu l\'expliquais à ton meilleur ami.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'compatible',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0dyo_10',
    content: '{player1}, quelle partie de ta personnalité {player2} fait ressortir le mieux ?',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'compatible',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0dyo_11',
    content: '{player1}, raconte un moment où tu t\'es senti vulnérable et comment ça t\'a fait grandir.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'compatible',
    explicitlySexual: false
  },

  // ===== ALCOOL 0, SEXUALITÉ 0, DEEP OUI, DATE UNIQUEMENT =====
  {
    id: 'new35',
    content: '{player1}, si tu devais te présenter à quelqu\'un sans parler de ton métier, ton âge ou ton prénom... tu dirais quoi ?',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'exclusive',
    explicitlySexual: false
  },
  {
    id: 'new18',
    content: '{player1} et {player2}, regardez-vous dans les yeux pendant 10 secondes, sans parler. Si un de vous éclate de rire ou détourne le regard, il boit.',
    alcoholLevel: 1,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'exclusive',
    explicitlySexual: false
  },
  {
    id: 'new21',
    content: 'Faites un jeu de "Je n\'ai jamais" à 2. Chacun en pose un, à tour de rôle. Le premier qui boit 3 fois a perdu.',
    alcoholLevel: 1,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'exclusive',
    explicitlySexual: false
  },
  {
    id: 'new23',
    content: '{player1}, à ton avis, qu\'est-ce que {player2} kiffe chez toi ? Tu dois répondre sans faire genre t\'en sais rien.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'exclusive',
    explicitlySexual: false
  },
  {
    id: 'new39',
    content: '{player1}, quelle croyance sur toi-même tu penses devoir désapprendre un jour ?',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'exclusive',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0dye_1',
    content: '{player1}, raconte-moi ton premier souvenir de bonheur pur.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'exclusive',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0dye_2',
    content: '{player1}, quelle est la chose la plus courageuse que tu aies jamais faite ?',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'exclusive',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0dye_3',
    content: '{player1}, si tu pouvais revivre une journée de ta vie, laquelle choisirais-tu ?',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'exclusive',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0dye_4',
    content: '{player1}, raconte-moi le moment où tu t\'es senti le plus libre.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'exclusive',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0dye_5',
    content: '{player1}, quelle est la chose que tu aimerais que je comprenne vraiment sur toi ?',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'exclusive',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0dye_6',
    content: '{player1}, ferme les yeux et décris-moi ton endroit idéal pour être heureux.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'exclusive',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0dye_7',
    content: '{player1}, quelle promesse tu t\'es faite à toi-même et que tu as du mal à tenir ?',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'exclusive',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0dye_8',
    content: '{player1}, raconte-moi un secret que tu n\'as jamais dit à personne.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'exclusive',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0dye_9',
    content: '{player1}, quelle est la chose la plus importante que j\'ai besoin de savoir sur toi ?',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'exclusive',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0dye_10',
    content: '{player1}, si on pouvait lire dans tes pensées maintenant, qu\'est-ce qu\'on découvrirait ?',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'exclusive',
    explicitlySexual: false
  },

  // ===== ALCOOL 0, SEXUALITÉ 0, DEEP NON, DATE NON =====
  {
    id: 'gen_a0s0nno_1',
    content: '{player1}, distribue 1 gorgée à qui tu veux et explique pourquoi cette personne te fait rire.',
    alcoholLevel: 1,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'no',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0nno_2',
    content: 'Tout le monde boit une gorgée en l\'honneur de cette soirée de ouf !',
    alcoholLevel: 1,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'no',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0nno_3',
    content: '{player1}, imite le rire de {player2}. Si c\'est raté, distribue 1 gorgée.',
    alcoholLevel: 1,
    sexualLevel: 0,
    proximityLevel: 'friend',
    isDeep: false,
    dateMode: 'no',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0nno_4',
    content: 'Silence total pendant 30 secondes. Le premier qui parle ou rigole distribue 2 gorgées.',
    alcoholLevel: 2,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'no',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0nno_5',
    content: '{player1}, choisis quelqu\'un pour faire un battle de grimaces. Le moins convaincant boit 1 gorgée.',
    alcoholLevel: 1,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'no',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0nno_6',
    content: 'Tout le monde vote pour la personne la plus susceptible de devenir célèbre. Cette personne distribue 2 gorgées.',
    alcoholLevel: 2,
    sexualLevel: 0,
    proximityLevel: 'friend',
    isDeep: false,
    dateMode: 'no',
    explicitlySexual: false,
    isVote: true
  },
  {
    id: 'gen_a0s0nno_7',
    content: '{player1}, raconte une blague pourrie. Si personne ne rit, bois 2 gorgées.',
    alcoholLevel: 2,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'no',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0nno_8',
    content: 'Le dernier qui lève la main boit 1 gorgée. Allez-y !',
    alcoholLevel: 1,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'no',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0nno_9',
    content: '{player1}, choisis une personne et regardez-vous méchamment pendant 10 secondes. Le premier qui sourit distribue 1 gorgée.',
    alcoholLevel: 1,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'no',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0nno_10',
    content: 'Tout le monde pointe qui a la plus belle voix. Cette personne chante une ligne et distribue 1 gorgée.',
    alcoholLevel: 1,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'no',
    explicitlySexual: false,
    isVote: true
  },
  {
    id: 'gen_a0s0nno_11',
    content: '{player1}, trouve un compliment rigolo pour chaque personne ou bois 1 gorgée par compliment raté.',
    alcoholLevel: 3,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'no',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0nno_12',
    content: 'Pierre-feuille-ciseaux géant ! Tout le monde joue, les perdants boivent 1 gorgée.',
    alcoholLevel: 1,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'no',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0nno_13',
    content: '{player1}, imite un animal. Les autres devinent. Si personne ne trouve, tu distribues 2 gorgées.',
    alcoholLevel: 2,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'no',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0nno_14',
    content: 'Comptez tous ensemble jusqu\'à 20 en commençant par {player1}. Si deux personnes parlent en même temps, recommencez et buvez tous 1 gorgée.',
    alcoholLevel: 1,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'no',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0nno_15',
    content: 'Applaudissements ! Tout le monde applaudit cette soirée magnifique.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'no',
    explicitlySexual: false
  },

  // ===== ALCOOL 0, SEXUALITÉ 0, DEEP NON, DATE OUI =====
  {
    id: 'gen_a0s0nyo_1',
    content: '{player1}, si tu devais choisir un animal pour représenter {player2}, ce serait lequel et pourquoi ?',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'compatible',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0nyo_2',
    content: '{player1}, imite la façon de rire de {player2}. Si c\'est raté, bois 1 gorgée.',
    alcoholLevel: 1,
    sexualLevel: 0,
    proximityLevel: 'friend',
    isDeep: false,
    dateMode: 'compatible',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0nyo_3',
    content: '{player1}, trouve 3 points communs avec {player2} en 30 secondes ou buvez 1 gorgée chacun.',
    alcoholLevel: 1,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'compatible',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0nyo_4',
    content: '{player1}, donne un surnom mignon à {player2} basé sur sa personnalité.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'compatible',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0nyo_5',
    content: '{player1}, choisis une chanson qui représente l\'ambiance avec {player2} ce soir.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'compatible',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0nyo_6',
    content: '{player1}, raconte à {player2} un souvenir d\'enfance drôle en 30 secondes.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'compatible',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0nyo_7',
    content: '{player1}, montre ta danse la plus embarrassante à {player2}.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'compatible',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0nyo_8',
    content: '{player1}, invente une histoire de 30 secondes où {player2} est le héros.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'compatible',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0nyo_9',
    content: '{player1}, apprends un nouveau mot rigolo à {player2} et utilisez-le dans une phrase ensemble.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'compatible',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0nyo_10',
    content: '{player1}, dessine {player2} en 30 secondes avec les yeux fermés.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'compatible',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0nyo_11',
    content: '{player1}, raconte un moment gênant en imitant tous les personnages de l\'histoire.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'compatible',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0nyo_12',
    content: '{player1}, trouve 5 compliments originaux pour {player2} en 1 minute.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'compatible',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0nyo_13',
    content: '{player1}, explique à {player2} pourquoi il/elle serait parfait(e) dans un film et dans quel rôle.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'compatible',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0nyo_14',
    content: '{player1}, chante joyeux anniversaire à {player2} avec l\'accent de ton choix.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'compatible',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0nyo_15',
    content: '{player1}, crée une poignée de main secrète avec {player2} en 1 minute.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'compatible',
    explicitlySexual: false
  },

  // ===== ALCOOL 0, SEXUALITÉ 0, DEEP NON, DATE UNIQUEMENT =====
  {
    id: 'gen_a0s0nye_1',
    content: '{player1}, raconte-moi ton pire rendez-vous en 30 secondes chrono.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'exclusive',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0nye_2',
    content: '{player1}, imite comment tu pensais que ce date allait se passer.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'exclusive',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0nye_3',
    content: '{player1}, montre-moi ta technique de drague la plus ridicule.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'exclusive',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0nye_4',
    content: '{player1}, raconte ton crush le plus improbable de collège.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'exclusive',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0nye_5',
    content: '{player1}, montre-moi comment tu danses quand personne ne regarde.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'exclusive',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0nye_6',
    content: '{player1}, avoue ton message de drague le plus foireux envoyé sur une app.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'exclusive',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0nye_7',
    content: '{player1}, imite ton comportement dans un ascenseur avec ton crush.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'exclusive',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0nye_8',
    content: '{player1}, raconte le compliment le plus bizarre qu\'on t\'ait jamais fait.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'exclusive',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0nye_9',
    content: '{player1}, montre ta "face de séduction" la plus ridicule.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'exclusive',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0nye_10',
    content: '{player1}, avoue ton pickup line le plus nul que tu connaisses.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'exclusive',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0nye_11',
    content: '{player1}, raconte comment tu as foiré ton premier bisou.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'exclusive',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0nye_12',
    content: '{player1}, imite comment tu réagis quand quelqu\'un te plaît vraiment.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'exclusive',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0nye_13',
    content: '{player1}, avoue ton red flag le plus ridicule chez un potentiel crush.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'exclusive',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0nye_14',
    content: '{player1}, montre comment tu checkes discrètement quelqu\'un qui te plaît.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'exclusive',
    explicitlySexual: false
  },
  {
    id: 'gen_a0s0nye_15',
    content: '{player1}, raconte ta stratégie la plus foireuse pour impressionner quelqu\'un.',
    alcoholLevel: 0,
    sexualLevel: 0,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'exclusive',
    explicitlySexual: false
  },

  // ===== ALCOOL 0, SEXUALITÉ 1-2, DEEP OUI, DATE UNIQUEMENT =====
  {
    id: 'new20',
    content: '{player1}, décris ton style de crush idéal… mais en utilisant uniquement des métaphores alimentaires. Sinon, bois 2 gorgées.',
    alcoholLevel: 1,
    sexualLevel: 1,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'exclusive',
    explicitlySexual: false
  },
  {
    id: 'new22',
    content: '{player1}, sans parler, mime ta première pensée quand tu as vu {player2} ce soir. Si tu veux pas, bois 3 gorgées.',
    alcoholLevel: 1,
    sexualLevel: 1,
    proximityLevel: 'stranger',
    isDeep: true,
    dateMode: 'exclusive',
    explicitlySexual: false
  },

  // ===== ALCOOL 3-5, SEXUALITÉ 3-5, DEEP NON, DATE NON =====
  {
    id: 'new1',
    content: 'Tout le monde pointe le/la tana du groupe. Cette personne distribue 3 gorgées.',
    alcoholLevel: 3,
    sexualLevel: 3,
    proximityLevel: 'close',
    isDeep: false,
    dateMode: 'no',
    explicitlySexual: true,
    isVote: true
  },
  {
    id: 'new3',
    content: '{player1}, bois autant de gorgées que ton bodycount.',
    alcoholLevel: 5,
    sexualLevel: 4,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'no',
    explicitlySexual: true
  },
  {
    id: 'new7',
    content: '{player1}, si tu t\'es masturbé plus de 3x cette semaine tu es pas net et tu bois 3 gorgées.',
    alcoholLevel: 2,
    sexualLevel: 3,
    proximityLevel: 'stranger',
    isDeep: false,
    dateMode: 'no',
    explicitlySexual: true
  }
];
