export interface ClimberRank {
  id: number;
  title: string;
  emoji: string;
  requirement: string;
  requiredConfirmedMountains: number;
  description: string;
}

export interface MountainImage {
  url: string;
  alt: string;
}

export interface MountainWiki {
  id: string;
  name: string;
  location: string;
  elevationMeters: number;
  minimumRankId: number;
  summary: string;
  bestSeason: string;
  mapLabel: string;
  mapUrl: string;
  climbPlan: string[];
  requiredGear: string[];
  cardImage: MountainImage;
  gallery: MountainImage[];
}

export const CLIMBER_RANKS: ClimberRank[] = [
  {
    id: 1,
    title: 'Novice',
    emoji: '🥾',
    requirement: 'Registration completed',
    requiredConfirmedMountains: 0,
    description: 'Starting level. Profile is created and ready for first climbs.',
  },
  {
    id: 2,
    title: 'Tourist',
    emoji: '⛰️',
    requirement: '3 mountains confirmed',
    requiredConfirmedMountains: 3,
    description: 'Understands basic trail discipline and altitude safety.',
  },
  {
    id: 3,
    title: 'Amateur',
    emoji: '🏔️',
    requirement: '7 mountains confirmed',
    requiredConfirmedMountains: 7,
    description: 'Stable experience on several routes.',
  },
  {
    id: 4,
    title: 'Alpinist',
    emoji: '🧗',
    requirement: '15 mountains confirmed',
    requiredConfirmedMountains: 15,
    description: 'Experienced participant in technical ascents.',
  },
  {
    id: 5,
    title: 'Master',
    emoji: '🦅',
    requirement: '30 mountains confirmed',
    requiredConfirmedMountains: 30,
    description: 'High level of preparation and confirmed experience.',
  },
  {
    id: 6,
    title: 'Legend',
    emoji: '👑',
    requirement: '50 mountains confirmed',
    requiredConfirmedMountains: 50,
    description: 'Top level of the Mount Up community.',
  },
];

export const MOUNTAIN_WIKI: MountainWiki[] = [
  {
    id: 'furmanov-peak',
    name: 'Peak Furmanov',
    location: 'Ile Alatau, Kazakhstan',
    elevationMeters: 3053,
    minimumRankId: 1,
    summary:
      'Popular route near Almaty. A strong first verified summit for new climbers with basic fitness.',
    bestSeason: 'May to October',
    mapLabel: '43.1128, 77.0837',
    mapUrl: 'https://www.google.com/maps?q=43.1128,77.0837',
    climbPlan: [
      'Start from Medeu or Shymbulak early in the morning.',
      'Follow marked ridge sections and avoid loose scree shortcuts.',
      'Track weather changes and reserve time for safe descent.',
    ],
    requiredGear: ['Trekking boots', 'Windproof layer', '2L water', 'Basic first aid kit'],
    cardImage: {
      url: 'https://picsum.photos/seed/furmanov-main/1200/800',
      alt: 'Ridge trail in Ile Alatau with clear weather.',
    },
    gallery: [
      {
        url: 'https://picsum.photos/seed/furmanov-1/1200/800',
        alt: 'Mountain path with valley view.',
      },
      {
        url: 'https://picsum.photos/seed/furmanov-2/1200/800',
        alt: 'Wide alpine skyline near Furmanov peak.',
      },
    ],
  },
  {
    id: 'big-almaty-peak',
    name: 'Big Almaty Peak',
    location: 'Ile Alatau, Kazakhstan',
    elevationMeters: 3681,
    minimumRankId: 2,
    summary:
      'Higher altitude route with stronger exposure. Best after several confirmed climbs.',
    bestSeason: 'June to September',
    mapLabel: '43.0537, 76.9827',
    mapUrl: 'https://www.google.com/maps?q=43.0537,76.9827',
    climbPlan: [
      'Acclimatize on lower peaks before summit day.',
      'Use established trails and avoid weather risk windows.',
      'Set strict turnaround time for descent safety.',
    ],
    requiredGear: ['Layered clothing', 'Trekking poles', 'Sun protection', 'Offline map'],
    cardImage: {
      url: 'https://picsum.photos/seed/almaty-main/1200/800',
      alt: 'Steep slope with broad panorama over Almaty region.',
    },
    gallery: [
      {
        url: 'https://picsum.photos/seed/almaty-1/1200/800',
        alt: 'Rock and snow sections near summit ridge.',
      },
      {
        url: 'https://picsum.photos/seed/almaty-2/1200/800',
        alt: 'Mountain shoulder in late afternoon light.',
      },
    ],
  },
  {
    id: 'talgar-peak',
    name: 'Talgar Peak',
    location: 'Trans-Ili Alatau, Kazakhstan',
    elevationMeters: 4979,
    minimumRankId: 3,
    summary:
      'Tall objective requiring stronger acclimatization and route discipline.',
    bestSeason: 'July to September',
    mapLabel: '43.1736, 77.3389',
    mapUrl: 'https://www.google.com/maps?q=43.1736,77.3389',
    climbPlan: [
      'Complete 2 to 3 prep climbs for acclimatization.',
      'Move glacier sections in controlled rope teams.',
      'Keep conservative timing at all high points.',
    ],
    requiredGear: ['Helmet', 'Crampons', 'Harness', 'Rope team kit'],
    cardImage: {
      url: 'https://picsum.photos/seed/talgar-main/1200/800',
      alt: 'High snowy massif with glacier exposure.',
    },
    gallery: [
      {
        url: 'https://picsum.photos/seed/talgar-1/1200/800',
        alt: 'Large summit wall with mixed terrain.',
      },
      {
        url: 'https://picsum.photos/seed/talgar-2/1200/800',
        alt: 'Early morning approach below Talgar peak.',
      },
    ],
  },
  {
    id: 'khan-tengri',
    name: 'Khan Tengri',
    location: 'Tian Shan, Kazakhstan/Kyrgyzstan/China',
    elevationMeters: 7010,
    minimumRankId: 4,
    summary:
      'Technical seven-thousander requiring expedition discipline and high-altitude control.',
    bestSeason: 'July to August',
    mapLabel: '42.1990, 80.1700',
    mapUrl: 'https://www.google.com/maps?q=42.1990,80.1700',
    climbPlan: [
      'Run staged acclimatization and camp rotation.',
      'Attempt summit only in stable weather windows.',
      'Protect descent reserves with strict cut-off times.',
    ],
    requiredGear: ['High-altitude boots', 'Down suit', 'Crevasse rescue kit', 'Satellite communicator'],
    cardImage: {
      url: 'https://picsum.photos/seed/khan-main/1200/800',
      alt: 'Sharp icy pyramid peak under dramatic sky.',
    },
    gallery: [
      {
        url: 'https://picsum.photos/seed/khan-1/1200/800',
        alt: 'Snow wall and ridge at high altitude.',
      },
      {
        url: 'https://picsum.photos/seed/khan-2/1200/800',
        alt: 'Cloud sea around mountain massif.',
      },
    ],
  },
  {
    id: 'mount-everest',
    name: 'Mount Everest',
    location: 'Himalayas, Nepal/China',
    elevationMeters: 8848,
    minimumRankId: 5,
    summary:
      'Highest mountain in the world with strict weather, oxygen and logistics requirements.',
    bestSeason: 'Late April to May',
    mapLabel: '27.9881, 86.9250',
    mapUrl: 'https://www.google.com/maps?q=27.9881,86.9250',
    climbPlan: [
      'Complete full acclimatization camp rotations.',
      'Use validated weather windows for summit push.',
      'Follow oxygen and emergency descent protocol.',
    ],
    requiredGear: ['8000m suit', 'Supplemental oxygen', 'Expedition mitts', 'Ascender kit'],
    cardImage: {
      url: 'https://picsum.photos/seed/everest-main/1200/800',
      alt: 'Everest summit ridge with snow plume.',
    },
    gallery: [
      {
        url: 'https://picsum.photos/seed/everest-1/1200/800',
        alt: 'High camp and summit approach terrain.',
      },
      {
        url: 'https://picsum.photos/seed/everest-2/1200/800',
        alt: 'Himalayan skyline in cold weather window.',
      },
    ],
  },
  {
    id: 'jengish-chokusu',
    name: 'Jengish Chokusu (Peak Pobeda)',
    location: 'Tian Shan, Kyrgyzstan/China',
    elevationMeters: 7439,
    minimumRankId: 6,
    summary:
      'One of the most demanding peaks in the region. Reserved for elite, highly experienced teams.',
    bestSeason: 'July to August',
    mapLabel: '42.0333, 80.1167',
    mapUrl: 'https://www.google.com/maps?q=42.0333,80.1167',
    climbPlan: [
      'Prepare a multi-stage expedition with reserve weather days.',
      'Use robust camp logistics and strict rope team procedures.',
      'Treat descent management as primary safety priority.',
    ],
    requiredGear: ['Expedition-grade shelter', 'Technical ice kit', 'Satellite backup', 'Extended food/fuel reserve'],
    cardImage: {
      url: 'https://picsum.photos/seed/pobeda-main/1200/800',
      alt: 'Massive high-altitude mountain wall with glaciated faces.',
    },
    gallery: [
      {
        url: 'https://picsum.photos/seed/pobeda-1/1200/800',
        alt: 'Large glaciated mountain basin near expedition route.',
      },
      {
        url: 'https://picsum.photos/seed/pobeda-2/1200/800',
        alt: 'Severe high mountain weather over summit ridge.',
      },
    ],
  },
];

export const CLIMBER_RANK_MAP = new Map(CLIMBER_RANKS.map((rank) => [rank.id, rank]));
export const MOUNTAIN_WIKI_MAP = new Map(MOUNTAIN_WIKI.map((mountain) => [mountain.id, mountain]));