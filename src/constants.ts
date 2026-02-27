import { TypesVersion } from './types';
import type { Race } from './types';

// Imagens curadas do Unsplash para garantir visual pro mesmo sem URL oficial
export const FALLBACK_IMAGES = {
  SHORT: [
    "https://images.unsplash.com/photo-1596727147705-54a75c82325c?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop",
  ],
  MEDIUM: [
    "https://images.unsplash.com/photo-1552674605-5d28c4e1902c?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=800&auto=format&fit=crop",
  ],
  HALF: [
    "https://images.unsplash.com/photo-1513593771513-6568e733ac87?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=800&auto=format&fit=crop",
  ],
  MARATHON: [
    "https://images.unsplash.com/photo-1533561797500-4fad143ca5ee?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop",
  ]
};

// CALENDÁRIO ESTÁTICO 2025 (Fallback Database)
export const STATIC_RACES: Race[] = [
  {
    id: "sao-silvestre-2025",
    name: "99ª Corrida Internacional de São Silvestre",
    date: "2025-12-31",
    distanceKm: 15,
    distances: [15],
    location: "Av. Paulista, SP",
    imageUrl: FALLBACK_IMAGES.MARATHON[0],
    difficulty: "Difícil",
    confidence: "confirmed",
    siteUrl: "https://www.saosilvestre.com.br"
  },
  {
    id: "maratona-sp-2025",
    name: "29ª Maratona Internacional de São Paulo",
    date: "2025-04-06",
    distanceKm: 42,
    distances: [5, 10, 21, 42],
    location: "Ibirapuera, SP",
    imageUrl: FALLBACK_IMAGES.MARATHON[1],
    difficulty: "Intermediário",
    confidence: "confirmed",
    siteUrl: "https://www.maratonadesaopaulo.com.br"
  },
  {
    id: "meia-sampa-2025",
    name: "Meia Maratona Internacional de SP",
    date: "2025-02-02",
    distanceKm: 21,
    distances: [5, 10, 21],
    location: "Pacaembu, SP",
    imageUrl: FALLBACK_IMAGES.HALF[0],
    difficulty: "Intermediário",
    confidence: "confirmed",
    siteUrl: "https://www.yescom.com.br"
  },
  {
    id: "circuito-estacoes-outono-2025",
    name: "Circuito das Estações - Outono",
    date: "2025-03-16",
    distanceKm: 10,
    distances: [5, 10, 13],
    location: "Pacaembu, SP",
    imageUrl: FALLBACK_IMAGES.MEDIUM[0],
    difficulty: "Iniciante",
    confidence: "confirmed",
  },
  {
    id: "night-run-sp-2025",
    name: "Night Run SP - Etapa 1",
    date: "2025-05-10",
    distanceKm: 5,
    distances: [5, 10],
    location: "Sambódromo do Anhembi, SP",
    imageUrl: FALLBACK_IMAGES.SHORT[1],
    difficulty: "Iniciante",
    confidence: "confirmed",
  },
  {
    id: "track-field-jk",
    name: "Track&Field Run Series - JK Iguatemi",
    date: "2025-06-08",
    distanceKm: 10,
    distances: [5, 10],
    location: "Shopping JK Iguatemi, SP",
    imageUrl: FALLBACK_IMAGES.MEDIUM[1],
    difficulty: "Iniciante",
    confidence: "confirmed",
  },
  {
    id: "track-field-villa-lobos",
    name: "Track&Field Run Series - Villa Lobos",
    date: "2025-07-20",
    distanceKm: 10,
    distances: [5, 10],
    location: "Parque Villa-Lobos, SP",
    imageUrl: FALLBACK_IMAGES.MEDIUM[0],
    difficulty: "Iniciante",
    confidence: "confirmed",
  },
  {
    id: "sp-city-marathon",
    name: "SP City Marathon 2025",
    date: "2025-07-27",
    distanceKm: 42,
    distances: [21, 42],
    location: "Pacaembu / Jockey, SP",
    imageUrl: FALLBACK_IMAGES.MARATHON[0],
    difficulty: "Difícil",
    confidence: "confirmed",
    siteUrl: "https://www.iguanasports.com.br"
  },
  {
    id: "corrida-mulher-maravilha",
    name: "Corrida Mulher-Maravilha SP",
    date: "2025-08-24",
    distanceKm: 6,
    distances: [6, 10],
    location: "Centro Histórico, SP",
    imageUrl: FALLBACK_IMAGES.SHORT[0],
    difficulty: "Iniciante",
    confidence: "confirmed"
  },
  {
    id: "asics-golden-run",
    name: "Asics Golden Run SP 2025",
    date: "2025-05-25",
    distanceKm: 21,
    distances: [10, 21],
    location: "Marginal Pinheiros, SP",
    imageUrl: FALLBACK_IMAGES.HALF[1],
    difficulty: "Intermediário",
    confidence: "confirmed"
  },
  {
    id: "global-energy-race",
    name: "Global Energy Race Bimbo",
    date: "2025-09-21",
    distanceKm: 10,
    distances: [5, 10],
    location: "Cidade Universitária, SP",
    imageUrl: FALLBACK_IMAGES.MEDIUM[1],
    difficulty: "Iniciante",
    confidence: "confirmed"
  },
  {
    id: "corrida-insana",
    name: "Corrida Insana 2025",
    date: "2025-09-14",
    distanceKm: 5,
    distances: [5],
    location: "Autódromo de Interlagos, SP",
    imageUrl: FALLBACK_IMAGES.SHORT[1],
    difficulty: "Intermediário",
    confidence: "confirmed"
  }
];