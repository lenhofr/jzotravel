export interface Post {
  slug: string
  tag: string
  title: string
  excerpt: string
  image: string
  date: string
  body: string[]
  /** Line shown above the Start Planning button at the end of the post */
  cta?: string
}

export const posts: Post[] = [
  {
    slug: 'humongous-fungus-fest-michigan',
    tag: 'Michigan',
    title: "The World's (Maybe) Largest Living Organism Has Its Own Festival, and It's Magnificent",
    excerpt: "Beneath 37 acres of Michigan's Upper Peninsula lives a 400-ton, 2,000-year-old fungus — and every summer, Crystal Falls throws it a party.",
    image: '/images/pictured-rocks.webp',
    date: 'July 2026',
    cta: "Interested in a Michigan Upper Peninsula trip anchored by the Fungus Fest? Let us plan a full UP itinerary — the festival, Pictured Rocks, waterfalls, and a lakeside cabin stay.",
    body: [
      "If I told you to think of the world's largest organism, what are you picturing? Is it an African elephant or giraffe on the savanna? A blue whale deep in the ocean? Or maybe it's the majestic sequoia of the Sierra Nevada? What if I told you the world's largest organism (potentially) is in Michigan? Any guesses now?",
      "Deep in the forests of Michigan's Upper Peninsula, beneath at least 37 acres of Iron County woodland, a single organism has been quietly growing for over 2,000 years. It is an Armillaria gallica fungus, a honey mushroom colony, and it weighs an estimated 400 tons. For a brief period of time in the early 1990s, it was certified as the largest living organism ever discovered, eclipsed now by a different Armillaria colony in Oregon (a distinction the people of Crystal Falls, Michigan may politely decline to acknowledge).",
      "First discovered in 1988, a team of scientists studying tree pathogens for the Navy collected samples of Armillaria mushrooms on the Michigan-Wisconsin border for genetic testing and learned that what appeared to be many separate honey mushroom plants in the Iron County forest were actually genetically identical and all connected underground as a single organism. The Armillaria gallica colony spans 37 acres, is believed to be between 1,500 and 2,500 years old depending on the methodology used to estimate it, and continues to grow today. While the majority of the organism remains underground, above ground you'll notice during fall fruiting season that clusters of honey-colored mushrooms emerge from the soil and from tree roots across a wide swath of forest.",
      "Every summer, the town of Crystal Falls throws a weekend festival in its honor: the Humongous Fungus Fest. It's a unique, funny, and educational way to spend the weekend, and it doesn't hurt that it's set in some of the most beautiful lake and forest country in America.",
      "This year's festival is July 31 through August 1 in Crystal Falls, Michigan.",
      "The Humongous Fungus Parade rolls down Superior Avenue Friday afternoon at 5:00 p.m., featuring floats competing for the Best Fungus Float prize (sponsored by the Crystal Falls Business Association). The theme changes every year — this year's is Spore-tacular — but the spirit remains consistently enthusiastic.",
      "The Fungus Fest Cook-Off hosted by the Harbour House Museum is one of the highlights: local contestants compete with mushroom-centric appetizers, side dishes, or main dishes judged on taste, creativity, and presentation. The Humongous Pizza, 10 feet by 10 feet, is made with actual mushrooms from the colony and is declared by Crystal Falls to be the world's largest mushroom pizza.",
      "The weekend festival also includes a soap box derby, live music, a BBQ contest, and arts and crafts vendors, filling out a schedule that rewards relaxed exploration rather than rigid itinerary management.",
      "If you haven't visited the Upper Peninsula, this festival is a wonderful excuse to venture that way. Crystal Falls sits in the heart of Michigan's Upper Peninsula, one of the most dramatically underrated regions in American travel. The UP is a land of clean lakes, dense forests, waterfalls, copper mining history, Finnish culture, and a fierce local identity that's been forged by isolation and harsh winters. If that kind of natural beauty and culture isn't already calling you, should I mention the pasties? They're a meat-filled pastry of Cornish origin that dominates the regional food scene thanks in part to their history of sustaining the lumberjacks and copper miners.",
      "Things worth building into a UP trip around the festival:",
      "Pictured Rocks National Lakeshore (2.5 hours east) — Sandstone cliffs rising 200 feet above Lake Superior, painted in streaks of copper and iron. They're best seen from a kayak or boat tour. The Miners Beach and Chapel Falls trails also offer excellent day hikes.",
      "Tahquamenon Falls State Park (about 3 hours east) — The Upper Tahquamenon is one of the largest waterfalls east of the Mississippi, a brown-tinted cascade over 200 feet wide that looks like it's made of root beer (due to naturally occurring tannins from cedar and spruce). Canoe the river between the upper and lower falls.",
      "Porcupine Mountains Wilderness State Park (about 2 hours northwest) — 60,000 acres of old-growth forest with backcountry cabins on Lake of the Clouds, one of the most beautiful hikes in the Midwest.",
      "Copper Country — The old mining towns of Calumet, Houghton, and Hancock, where 19th-century brick architecture, Finnish saunas, and the best pasties in the state await.",
      "Waterfalls — The Upper Peninsula has over 300 named waterfalls. The area around Crystal Falls and Iron County alone has dozens worth visiting with a short hike.",
      "Getting There: The closest airports to Crystal Falls are Sawyer International Airport (MQT) in Marquette (about 1.5 hours east) and Iron Mountain/Kingsford Airport (IMT) about 40 minutes south, with limited service. Most UP visitors drive in from the surrounding area; it's 6 hours from Chicago, 5 hours from Milwaukee, and 6 hours from Detroit. The drive itself is often part of the appeal.",
      "Where to Stay: Crystal Falls has limited hotel options; the Iron County Lodging Association (ironcountylodging.com) lists cabins, resorts, and lodges throughout the region, many of them on lakes and rivers. This is genuinely beautiful lake country and staying in a lakeside cabin capitalizes on all the area has to offer.",
      "What to Bring: Insect repellent (the mosquitoes and black flies in the UP are no joke in the summertime!), layers for cool evenings, and good walking shoes or boots for forest trails. Don't forget cash for vendors; cell service can be hit-or-miss throughout Iron County.",
      "The Humongous Fungus Fest works because it simultaneously balances refusing to take itself entirely seriously while also being completely earnest about celebrating something genuinely extraordinary. A festival built around a 2,000-year-old organism quietly living beneath your feet while you eat mushroom pizza and watch a soap box derby is the kind of experience that only exists in certain very specific small American towns. This is the kind of festival worth crossing some state lines to see.",
      "Details are available at crystalfallsmi.com and ironcountylodging.com.",
    ],
  },
  {
    slug: 'patio-de-las-munecas-seville',
    tag: 'Spain',
    title: "The Courtyard of the Dolls: Look Up Inside Seville's Alcázar",
    excerpt: "A hidden Mudéjar courtyard, a 19th-century glass sky, and tiny carved faces you have to know to find.",
    image: '/images/IMG_6700.webp',
    date: 'June 2026',
    cta: 'Let us plan your Seville itinerary — every detail handled.',
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
    cta: 'Let us plan your Seville itinerary — every detail handled.',
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
