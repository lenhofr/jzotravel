export interface Post {
  slug: string
  tag: string
  title: string
  excerpt: string
  image: string
  date: string
  body: string[]
}

export const posts: Post[] = [
  {
    slug: 'patio-de-las-munecas-seville',
    tag: 'Spain',
    title: "The Courtyard of the Dolls: Look Up Inside Seville's Alcázar",
    excerpt: "A hidden Mudéjar courtyard, a 19th-century glass sky, and tiny carved faces you have to know to find.",
    image: '/images/IMG_6700.webp',
    date: 'June 2026',
    body: [
      "Step into the Patio de las Muñecas — the Courtyard of the Dolls — and the first instinct is to tilt your head back. Above you is one of the most distinctive ceilings in Seville's Royal Alcázar: a pale blue glass skylight set into a frame of intricate, layered stuccowork that draws the eye upward in concentric rings.",
      "The courtyard is a masterpiece of Mudéjar architecture — the style that emerged when Muslim craftsmen continued working under Christian rulers after the Reconquista. The walls are alive with horseshoe arches, polychrome tiles, and stucco carving so fine it looks more like lace than plaster. It is small, intimate, and easy to walk through without realizing what you've just passed.",
      "The glass skylight you see overhead is not original. It was added in the 19th century to protect the inner courtyard from rain and weather while still letting daylight pour in. The result is a space that feels enclosed and open at the same time — sheltered, but never dim.",
      "The name is the best part. Look closely at the bases of the arches and you'll find them: tiny human faces — the muñecas, or dolls — carved into the stone. There are only a few, and they are easy to miss unless you know where to look. By tradition, spotting all of them is supposed to bring good luck. Most visitors leave without ever noticing one.",
      "If the Alcázar feels familiar even on a first visit, that's because the palace complex famously stood in for the Water Gardens of Dorne in HBO's Game of Thrones. The production needed very little dressing — the architecture is that cinematic on its own.",
      "The Patio de las Muñecas sits within the Palacio de Don Pedro, the 14th-century heart of the Alcázar. It is included with general admission, but the crowds tend to surge through quickly. Hang back, let the room empty, and give yourself a few minutes. Then look up — and then look down at the arches.",
    ],
  },
  {
    slug: 'alcazar-baths-seville',
    tag: 'Spain',
    title: "Beneath the Alcázar: The Secret Chamber That Captivated Kings",
    excerpt: "Hidden under Seville's Royal Alcázar, a 14th-century water vault that has awed visitors for centuries — and yes, you may recognize it from Game of Thrones.",
    image: '/images/IMG_6970.webp',
    date: 'June 2026',
    body: [
      "Most visitors to Seville's Royal Alcázar spend their time in the sun-drenched courtyards and ornate throne rooms above. But descend beneath the Patio del Crucero and you'll find one of the most extraordinary spaces in all of Spain — the Baños de Doña María de Padilla.",
      "The chamber is a series of vaulted Gothic cisterns built to collect rainwater, stretching in a long symmetrical tunnel of ribbed stone arches that reflect perfectly in the dark, still water below. The silence down here is total. The air is cool. It feels less like a utility room and more like a cathedral that decided to go underground.",
      "The baths take their name from María de Padilla, the mistress of King Peter I of Castile — known to history as Peter the Cruel — who ruled from the Alcázar during the 14th century. According to legend, the courtiers of the palace would drink the water that María had bathed in, believing it to be enchanted. Whether flattery or genuine devotion, it speaks to the hold she had over the court.",
      "If the space feels strangely familiar, there's a reason. The chamber was used as a filming location for the Water Gardens of Dorne in Game of Thrones — the scenes featuring the Martell family and their water palace. The production team needed very little dressing. The space is that cinematic on its own.",
      "Getting here is straightforward — the Alcázar is a short walk from Seville's cathedral in the old city center. Book tickets well in advance, especially in spring and summer. The baths are included with general admission but easy to miss; follow the signs for the underground sections after you pass through the Patio del Crucero.",
      "Seville rewards the traveler who slows down. The Alcázar alone deserves half a day, and the baths are reason enough to linger in the lower levels long after the tour groups have moved on.",
    ],
  },
  {
    slug: 'patagonia-one-week',
    tag: 'South America',
    title: "Patagonia in a Week: What's Worth It and What's Not",
    excerpt: "An honest guide to planning the end of the world without blowing your budget.",
    image: 'https://picsum.photos/seed/jzo-blog3/600/400',
    date: 'Coming Soon',
    body: [],
  },
]

export function getPost(slug: string): Post | undefined {
  return posts.find(p => p.slug === slug)
}
