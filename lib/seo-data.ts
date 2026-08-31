export type SeoCity = {
  slug: string;
  name: string;
  region: string;
  blurb: string;
  body: string;
};

export type SeoGuide = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  categorySlug?: string;
  sections: { heading: string; body: string }[];
};

export const CAMEROON_CITIES: SeoCity[] = [
  {
    slug: "douala",
    name: "Douala",
    region: "Littoral",
    blurb: "Home of the house. Fast packing and delivery across Douala — Akwa, Bonanjo, Bonapriso, Makepe, Logbessou and beyond.",
    body: "Jimmy Home Textile is based in Douala, so orders for bedsheets, curtains, towels and bed covers leave the atelier with short city lead times. Whether you are furnishing a flat in Bonamoussadi or a family house in Bépanda, we pack linens so they arrive clean, labelled and ready for the bed. WhatsApp us for same-week Douala delivery windows and bulk orders for guesthouses.",
  },
  {
    slug: "yaounde",
    name: "Yaoundé",
    region: "Centre",
    blurb: "Bedsheets, curtains and towels delivered to Yaoundé — Bastos, Mvog-Mbi, Nlongkak, Essos and surrounding quarters.",
    body: "We send home textiles from Douala to Yaoundé every week. Cotton bedsheets, blackout curtains and bath towels travel packed against humidity so they open as they left the house. Families in Bastos, offices near the centre, and new builds in Odza order king and queen sets in XAF with PayUnit. Tell us your neighbourhood when you check out so the rider can find you without fuss.",
  },
  {
    slug: "bafoussam",
    name: "Bafoussam",
    region: "West",
    blurb: "Quality linens for the West Region — bedsheets, blankets and curtains delivered to Bafoussam.",
    body: "Bafoussam homes mix cool evenings with warm afternoons, so our blankets, cotton sheets and lined curtains earn their keep. We deliver across the West Region with careful packing. Hotel and family orders are welcome; ask for wholesale bedsheets and pillowcases if you run a guesthouse on the Bafoussam–Dschang road.",
  },
  {
    slug: "bamenda",
    name: "Bamenda",
    region: "Northwest",
    blurb: "Shop bedsheets, curtains and towels online and have them sent to Bamenda.",
    body: "Northwest households look for sturdy cotton and colours that hold through the rains. Jimmy Home Textile ships bed linen, bath towels and window curtains to Bamenda with the same packing we use in Douala. Pay in XAF, track the parcel, and write to us on WhatsApp if you need a specific size.",
  },
  {
    slug: "buea",
    name: "Buea",
    region: "Southwest",
    blurb: "Mountain-town linens — cotton sheets, throws and curtains delivered to Buea and Molyko.",
    body: "Buea evenings run cooler than the coast. Our throws, blankets and percale sheets suit student rooms in Molyko as much as family houses higher on the mountain. Delivery from Douala is routine; we wrap textiles against the damp so they stay fresh until you make the bed.",
  },
  {
    slug: "limbe",
    name: "Limbe",
    region: "Southwest",
    blurb: "Coastal homes in Limbe — beach-house towels, light bedsheets and airy curtains.",
    body: "Limbe’s salt air and humidity ask for washable cotton and well-finished hems. We send bath towels, light bedsheets and sheer or lined curtains to Down Beach, Church Street and the hills above town. Weekend houses and small hotels can order sets together.",
  },
  {
    slug: "kribi",
    name: "Kribi",
    region: "South",
    blurb: "Holiday-house textiles for Kribi — towels, sheets and curtains packed for the coast.",
    body: "Kribi lodges and family houses need linens that survive sun, sand and frequent washing. Order towels, bedsheets and curtains online; we dispatch from Douala with care notes for coastal humidity. Villa owners often buy extra pillowcases and a spare sheet set — we can pack those in one shipment.",
  },
  {
    slug: "garoua",
    name: "Garoua",
    region: "North",
    blurb: "North Region delivery — breathable sheets, mosquito-friendly curtains and washable towels.",
    body: "Garoua heat calls for breathable cotton bedsheets and curtains that still darken a room for rest. We ship across the North with extra wrapping for the road. Ask for light colours and king or queen sizes when you write to the house.",
  },
  {
    slug: "ngaoundere",
    name: "Ngaoundéré",
    region: "Adamawa",
    blurb: "Adamawa homes — blankets, sheets and curtains delivered to Ngaoundéré.",
    body: "Nights in Ngaoundéré can turn cool. Our blankets, quilted bed covers and cotton sheets are chosen for that swing in temperature. Delivery is arranged from Douala; we keep you posted so someone is home when the parcel arrives.",
  },
  {
    slug: "maroua",
    name: "Maroua",
    region: "Far North",
    blurb: "Far North delivery for sheets, towels and curtains that stand up to heat and dust.",
    body: "Maroua orders favour tightly woven cotton, washable towels and curtains that keep rooms restful in the heat. We pack for a long road and confirm delivery by phone or WhatsApp. Hotel and household quantities are both welcome.",
  },
  {
    slug: "bertoua",
    name: "Bertoua",
    region: "East",
    blurb: "East Region linens — bedsheets, blankets and towels sent to Bertoua.",
    body: "Bertoua families and guesthouses order the same collections we show in Douala: cotton bedsheets, bed covers, curtains and towels. We schedule East Region dispatch with tracking so you are not left guessing.",
  },
  {
    slug: "ebolowa",
    name: "Ebolowa",
    region: "South",
    blurb: "South Region delivery of home textiles to Ebolowa.",
    body: "From Douala we send fitted sheets, curtains and bath linens to Ebolowa with the same quality packing as a local order. Tell us if you need a specific window measurement for curtains — we will help you choose a drop that looks finished.",
  },
  {
    slug: "kumba",
    name: "Kumba",
    region: "Southwest",
    blurb: "Bedsheets, curtains and towels delivered to Kumba.",
    body: "Kumba is on our Southwest delivery list. Cotton sheets, pillowcases and household towels ship from the Douala atelier. WhatsApp the house for stock on a colour or size before you pay.",
  },
  {
    slug: "dschang",
    name: "Dschang",
    region: "West",
    blurb: "University-town linens for Dschang — sheets, throws and curtains.",
    body: "Dschang’s cooler climate suits our throws, blankets and percale bedsheets. Students and family houses alike order online in XAF. We pack compactly for West Region transport and include care notes in English and French.",
  },
  {
    slug: "edea",
    name: "Edéa",
    region: "Littoral",
    blurb: "Short-run delivery from Douala to Edéa for sheets, towels and curtains.",
    body: "Edéa sits close enough to Douala for prompt delivery. Order bedsheets, bed covers or a curtain pair online and we will move them down the road with the next Littoral run. Ideal if you want atelier quality without a Douala pickup.",
  },
  {
    slug: "nkongsamba",
    name: "Nkongsamba",
    region: "Littoral",
    blurb: "Moungo linens — bedsheets and curtains delivered to Nkongsamba.",
    body: "Nkongsamba households can shop the full Jimmy Home Textile catalogue: cotton bedsheets, towels, pillowcases and window curtains. We dispatch from Douala and confirm when the parcel is on the way.",
  },
];

export const CATEGORY_LANDING: Record<
  string,
  { seoTitle: string; seoDescription: string; intro: string; body: string }
> = {
  bedsheets: {
    seoTitle: "Bedsheets in Cameroon | Cotton Sheets Douala & Nationwide",
    seoDescription:
      "Buy cotton bedsheets in Cameroon — king, queen and double sets delivered from Douala to Yaoundé and across the country. Quality bed linen in XAF.",
    intro:
      "Cotton bedsheets for Cameroon homes — breathable, well-finished, and sized for king, queen and double beds.",
    body: "Our bedsheet collection is chosen for tropical weather: percale and cotton that sleeps cool in Douala humidity and still feels considered on a Yaoundé bed. Shop fitted and flat sheets, stripe and ivory sets, and matching pillowcases. Every order is packed in the atelier and sent nationwide. Looking for draps de lit or a full linge de lit set? Start here, then add pillowcases and a bed cover.",
  },
  "bed-covers": {
    seoTitle: "Bed Covers & Duvet Covers in Cameroon | Jimmy Home Textile",
    seoDescription:
      "Shop quilted bed covers, couvre-lits and duvet covers in Cameroon. Finish the bed with atelier pieces delivered from Douala.",
    intro: "Bed covers and duvet covers that finish a Cameroonian bedroom without fuss.",
    body: "A bed cover is the piece guests see first. We stock quilted covers, simple couvre-lits and duvet covers (housses de couette) in colours that hold in strong light. Pair them with our sheets for a full set, or order a cover alone if you already have linen you like. Delivery across Cameroon, priced in XAF.",
  },
  curtains: {
    seoTitle: "Curtains in Cameroon | Window Curtains Douala, Yaoundé & Beyond",
    seoDescription:
      "Buy window curtains, blackout curtains and sheer panels in Cameroon. Measured looks for living rooms and bedrooms, delivered nationwide.",
    intro: "Window curtains for Cameroon light — sheers for the breeze, lined panels when you want the room dark.",
    body: "Cameroon sun is generous. Our curtain collection includes sheers, living-room drapes and blackout-ready panels so bedrooms can rest in the afternoon. We help with drop and width if you send a photo or measurement on WhatsApp. Rideaux and rideaux occultants ship from Douala to every region.",
  },
  blankets: {
    seoTitle: "Blankets & Throws in Cameroon | Jimmy Home Textile",
    seoDescription:
      "Shop blankets and throws for cooler Cameroon nights — Buea, Dschang, Ngaoundéré and air-conditioned Douala rooms.",
    intro: "Blankets and throws for the nights that turn cool — mountains, Adamawa, and air-conditioned rooms on the coast.",
    body: "Not every Cameroon evening is hot. Buea, Dschang and Ngaoundéré ask for a proper blanket; Douala flats with strong AC do too. Choose a light throw for the sofa or a denser blanket for the bed. Machine-care notes come with every piece.",
  },
  pillowcases: {
    seoTitle: "Pillowcases in Cameroon | Cotton Pillow Cases & Taies d’oreiller",
    seoDescription:
      "Buy cotton pillowcases in Cameroon. Match your bedsheets or refresh the set — delivered from Douala nationwide.",
    intro: "Cotton pillowcases to match the sheets or to refresh a tired set.",
    body: "Pillowcases wear first. We sell them in pairs and with sheet sets so the bed stays consistent. Soft cotton, clean seams, colours that sit beside our bedsheets. Taies d’oreiller ship with the same packing as a full linen order.",
  },
  towels: {
    seoTitle: "Towels in Cameroon | Bath Towels Douala & Nationwide",
    seoDescription:
      "Shop bath towels, hand towels and serviettes de bain in Cameroon. Absorbent, washable, delivered from Douala.",
    intro: "Bath towels that stay generous after washing — for Douala bathrooms, Kribi houses and hotel cupboards.",
    body: "Humidity is hard on cheap towels. Ours are chosen to dry, wash and keep their hand. Add hand towels for the guest bath. Hotels and guesthouses can ask for wholesale towels; we pack by the dozen when you need them.",
  },
  "other-home-textiles": {
    seoTitle: "Home Textiles in Cameroon | Cushion Covers & Extra Linens",
    seoDescription:
      "Cushion covers, extra linens and other home textiles from Jimmy Home Textile. Shop finishing pieces delivered across Cameroon.",
    intro: "The finishing pieces — cushion covers and extra linens that make a room feel complete.",
    body: "Beyond the bed and the window: cushion covers, spare linens and the small textiles a house actually uses. Pair them with our main collections or send a photo of the room and we will point you to a match.",
  },
};

export const GUIDES: SeoGuide[] = [
  {
    slug: "choose-bedsheets-cameroon",
    title: "How to choose bedsheets in Cameroon",
    description: "Cotton, size and weave — a practical guide to buying bedsheets for Douala, Yaoundé and the rest of Cameroon.",
    eyebrow: "Bed linen",
    categorySlug: "bedsheets",
    sections: [
      {
        heading: "Start with the climate",
        body: "Coastal Douala and Limbe ask for breathable cotton that does not trap heat. Yaoundé sits higher and dries a little faster. In Buea or Dschang, a percale sheet plus a throw covers most nights. If the room is air-conditioned, choose a weave that still feels like cloth, not plastic. Our bedsheet collection is built around cotton that sleeps well in all of those rooms.",
      },
      {
        heading: "King, queen and double",
        body: "Measure the mattress, not the old sheet. Cameroon beds are often queen or double; king sets suit larger rooms and hotel twins pushed together. If you are between sizes, size up — a generous drape looks finished and washes without pulling. We list sizes on every product page in centimetres.",
      },
      {
        heading: "Colour that holds",
        body: "Ivory, sand and soft forest tones hide less dirt than you think if you wash them properly; they also photograph well and match most wood furniture. Strong sun fades cheap dyes. We choose colours that stay themselves after repeated washing in local water.",
      },
      {
        heading: "Order from the house",
        body: "Shop bedsheets online in XAF, pay with PayUnit, and we pack from Douala. Add pillowcases in the same colour so the set looks intentional. If you need draps de lit for a guesthouse, WhatsApp us for wholesale quantities.",
      },
    ],
  },
  {
    slug: "cotton-sheets-tropical-weather",
    title: "Cotton sheets for tropical weather",
    description: "Why cotton still wins for Cameroon bedrooms, and how to wash sheets when the air is humid.",
    eyebrow: "Fabric",
    categorySlug: "bedsheets",
    sections: [
      {
        heading: "Cotton breathes",
        body: "Polyester blends can feel clammy by midnight in Douala. Cotton wicks and dries against the skin. Percale — a crisp plain weave — is our usual recommendation for the coast. Sateen is smoother and a little warmer; save it for air-conditioned rooms or cooler towns.",
      },
      {
        heading: "Washing in humidity",
        body: "Wash in warm water, skip overloading the machine, and hang sheets fully spread. Do not leave damp linen in a bag. A hot iron on cotton finishes the fibre and helps with mites. We print care on every set so the housekeeper or the family has the same instructions.",
      },
      {
        heading: "What to buy",
        body: "A minimum useful cupboard is two sheet sets per bed so one can dry while the other is on. Add a third if you host. Shop our cotton bedsheets and keep a spare pair of pillowcases — they wear first.",
      },
    ],
  },
  {
    slug: "curtain-sizes-cameroon-homes",
    title: "Curtain sizes for Cameroon homes",
    description: "How to measure windows for curtains in Douala and Yaoundé apartments, family houses and new builds.",
    eyebrow: "Windows",
    categorySlug: "curtains",
    sections: [
      {
        heading: "Measure twice",
        body: "Width: measure the track or pole, then add fullness — curtains should be at least 1.5 to 2 times the window width so they hang in folds, not a flat sheet. Drop: from the pole to where you want the hem — floor, sill, or a clean hover above the tiles. Send us a photo on WhatsApp if the window is awkward.",
      },
      {
        heading: "Light in Cameroon",
        body: "West-facing rooms in Douala need more lining than a north-facing office in Yaoundé. Sheers filter; lined or blackout panels let a bedroom sleep in the afternoon. Many houses layer both — a sheer for the day, a heavier curtain after dark.",
      },
      {
        heading: "Ready-made versus custom",
        body: "Our ready-made curtains suit standard openings. For very wide living rooms we can advise pairing panels. Rideaux occultants are worth it for street-facing bedrooms. Shop the curtain collection, then write if you need a longer drop.",
      },
    ],
  },
  {
    slug: "towels-humid-climate",
    title: "Towels that work in a humid climate",
    description: "Buying bath towels for Cameroon bathrooms — absorbency, drying, and how many you actually need.",
    eyebrow: "Bath",
    categorySlug: "towels",
    sections: [
      {
        heading: "Let them dry",
        body: "A thick towel that never dries becomes sour. In Douala and Kribi, hang towels on a bar with air around them, not bunched on a hook. Mid-weight cotton is often more useful than hotel-weight piles that stay wet until evening.",
      },
      {
        heading: "How many",
        body: "Two bath towels per person plus a guest set is a working minimum. Hand towels by the basin stop the bath towel doing every job. Wash in a hot enough cycle and avoid fabric softener if you want them to keep drinking water.",
      },
      {
        heading: "For houses and hotels",
        body: "Guesthouses in Limbe and Kribi should budget extra towels — guests use more when they swim. We pack wholesale towels from the atelier. Shop the towel collection or message us for dozens.",
      },
    ],
  },
  {
    slug: "finish-the-bed-covers",
    title: "How to finish the bed with a cover",
    description: "Bed covers, quilted couvre-lits and duvet covers — what to put on top in a Cameroon bedroom.",
    eyebrow: "The bed",
    categorySlug: "bed-covers",
    sections: [
      {
        heading: "Cover versus duvet",
        body: "A bed cover (couvre-lit) sits on top and is easy to fold at night. A duvet cover needs an insert — useful in Buea, less so in an uncooled Douala room unless the AC runs. Quilted covers add a little structure without much warmth.",
      },
      {
        heading: "Match the sheets, do not copy them",
        body: "Ivory sheets with a deeper forest or sand cover look more considered than a full match. If you already own patterned sheets, choose a quiet cover. Our bed cover collection is meant to sit with the sheet sets, not fight them.",
      },
      {
        heading: "Hotel finish",
        body: "Small hotels: one cover per bed plus a spare. Guests judge the room by the bed. We can pack mixed sizes in one dispatch to Douala, Yaoundé or the coast.",
      },
    ],
  },
  {
    slug: "pillowcase-care-comfort",
    title: "Pillowcases, skin and sleep",
    description: "Why pillowcases need replacing first, and how cotton taies d’oreiller keep the bed feeling new.",
    eyebrow: "Details",
    categorySlug: "pillowcases",
    sections: [
      {
        heading: "They wear out first",
        body: "Hair oil, skin and weekly washing fade pillowcases long before the fitted sheet gives up. Replacing just the cases is cheaper than a full set and immediately makes the bed look tended.",
      },
      {
        heading: "Cotton on the face",
        body: "Smooth cotton is kinder in heat than a rough blend. Wash pillowcases more often than sheets if you can — every few days in humid months. Our cotton pillowcases match the bedsheet colours so you can restock without a visible mismatch.",
      },
    ],
  },
  {
    slug: "blankets-vs-duvet-cameroon",
    title: "Blanket or duvet in Cameroon?",
    description: "When to buy a blanket, a throw or a duvet for Cameroon bedrooms from the coast to Adamawa.",
    eyebrow: "Warmth",
    categorySlug: "blankets",
    sections: [
      {
        heading: "Coast versus highland",
        body: "Douala rarely needs a winter duvet. A light throw at the foot of the bed is enough for AC. Buea, Dschang and Ngaoundéré justify a proper blanket. Garoua nights can drop after hot days — a cotton blanket layers better than a plastic fleece that does not breathe.",
      },
      {
        heading: "One piece, many rooms",
        body: "A throw moves from sofa to bed. A heavy blanket stays on the bed. If you are furnishing a whole house, buy throws for living rooms and blankets only where people sleep cold. Shop blankets and throws in the same collection.",
      },
    ],
  },
  {
    slug: "wholesale-hotel-linens-cameroon",
    title: "Wholesale home textiles for hotels in Cameroon",
    description: "Bedsheets, towels and curtains for guesthouses and hotels — packing, sizes and how to order from the atelier.",
    eyebrow: "Hospitality",
    sections: [
      {
        heading: "What hotels actually replace",
        body: "Towels and pillowcases cycle fastest. Sheets next. Curtains last if the lining is decent. Start a hotel order with two sheet sets per bed, three towels per room, and spare pillowcases. We pack by the dozen from Douala.",
      },
      {
        heading: "How to order",
        body: "WhatsApp the house with room count, bed sizes and whether you need blackout curtains. Payment in XAF via PayUnit. We deliver to Douala, Yaoundé, Kribi, Limbe and other cities on our delivery list. Ask for a simple packing list so housekeeping can check the delivery in.",
      },
    ],
  },
  {
    slug: "measure-windows-for-curtains",
    title: "Measuring windows for curtains",
    description: "A short measuring lesson before you buy curtains in Cameroon — poles, tracks, fullness and drop.",
    eyebrow: "How to",
    categorySlug: "curtains",
    sections: [
      {
        heading: "Pole or track",
        body: "If you already have a pole, measure its width end to end. For a new track, decide whether it should run past the window so stacked curtains do not eat the glass. Inside a reveal looks tailored; outside a reveal blocks more light.",
      },
      {
        heading: "Drop",
        body: "Floor-length looks calmer in living rooms. Sill-length suits kitchens and some bedrooms with tile that you want to keep clear. Leave a centimetre or two above the floor if the house is not perfectly level — many Cameroon floors are not.",
      },
    ],
  },
  {
    slug: "linen-cupboard-essentials",
    title: "Building a linen cupboard in Cameroon",
    description: "The useful minimum: sheets, towels, pillowcases and a spare cover — without overbuying.",
    eyebrow: "The house",
    sections: [
      {
        heading: "Per bed",
        body: "Two sheet sets, two pairs of pillowcases, one bed cover, one spare blanket or throw. That is enough for washing day without a crisis. Add a third sheet set if you have children or guests every weekend.",
      },
      {
        heading: "Per bathroom",
        body: "Two bath towels per person who uses that room, plus two hand towels. A beach or extra bath sheet for Kribi and Limbe houses. Keep them on open shelves if the cupboard is damp.",
      },
      {
        heading: "Where to start",
        body: "Shop collections rather than random colours. Ivory and forest mix. Our shop is arranged so you can fill a cupboard in one order and have it delivered together.",
      },
    ],
  },
  {
    slug: "gift-textiles-cameroon",
    title: "Gifting home textiles in Cameroon",
    description: "Bedsheets, towel sets and curtains as gifts — weddings, new homes and what actually gets used.",
    eyebrow: "Gifts",
    sections: [
      {
        heading: "What people keep",
        body: "A good sheet set or a pair of bath towels is used. Decorative cushions are loved for a week. For weddings and housewarmings in Douala or Yaoundé, choose cotton bedsheets in ivory or a quiet stripe, and add pillowcases.",
      },
      {
        heading: "How we pack",
        body: "Tell us it is a gift at checkout or on WhatsApp. We pack cleanly. Delivery can go straight to the new address. Prices in XAF so the budget is clear.",
      },
    ],
  },
  {
    slug: "bed-sizes-cameroon",
    title: "King, queen and double — a Cameroon size guide",
    description: "Match mattresses to bedsheets and bed covers. Avoid the almost-right size that never sits well.",
    eyebrow: "Sizing",
    categorySlug: "bedsheets",
    sections: [
      {
        heading: "Measure the mattress",
        body: "Width, length and depth. Deep mattresses need fitted sheets with a proper pocket. If you bought the bed second-hand, do not trust the old label — measure. We list dimensions on product pages so you can compare at home.",
      },
      {
        heading: "Covers follow the sheets",
        body: "A queen cover on a king mattress looks mean. Buy the cover in the same size family as the sheets. When in doubt, write to the house with a photo of the bed.",
      },
    ],
  },
  {
    slug: "colour-palettes-tropical-interiors",
    title: "Colour palettes for tropical interiors",
    description: "Ivory, sand, forest and ink — how Jimmy Home Textile colours sit in Cameroon light.",
    eyebrow: "Colour",
    sections: [
      {
        heading: "Work with the light",
        body: "Cameroon daylight is strong. Stark white can glare; ivory and sand stay calm. Forest green on a curtain or a throw anchors a room of pale walls. Ink is best in small doses — piping, a cushion, a stripe.",
      },
      {
        heading: "Build a house, not a showroom",
        body: "Pick two neutrals and one deeper tone and repeat them from bed to window. Our collections are designed to mix so you can add a curtain later without starting over.",
      },
    ],
  },
  {
    slug: "delivery-packing-care",
    title: "Delivery, packing and care",
    description: "How Jimmy Home Textile packs linens in Douala, ships across Cameroon, and how you should unpack them.",
    eyebrow: "After you order",
    sections: [
      {
        heading: "Packed in the atelier",
        body: "Pieces are checked, folded and wrapped so they do not pick up dust on the road. Curtains are folded to protect the hem. You should not need to wash before first use unless you prefer to.",
      },
      {
        heading: "Across Cameroon",
        body: "Douala is fastest. Yaoundé, Bafoussam, Buea, Limbe, Kribi and the North follow on scheduled runs. Delivery fees are shown at checkout; orders over the free-delivery threshold travel without that fee. Keep your phone on for the rider.",
      },
      {
        heading: "If something is wrong",
        body: "Photograph the parcel and write to us the same day. We would rather replace a mis-pack than have a bed that looks unfinished.",
      },
    ],
  },
];

export const FAQS: { question: string; answer: string }[] = [
  {
    question: "Where is Jimmy Home Textile based?",
    answer:
      "The house is in Douala, Cameroon. We sell bedsheets, bed covers, curtains, blankets, pillowcases and towels online and deliver nationwide.",
  },
  {
    question: "Do you deliver outside Douala?",
    answer:
      "Yes. We deliver to Yaoundé, Bafoussam, Bamenda, Buea, Limbe, Kribi, Garoua, Ngaoundéré, Maroua, Bertoua, Ebolowa, Kumba, Dschang, Edéa, Nkongsamba and other towns. See the delivery pages for city notes.",
  },
  {
    question: "What currency do you charge?",
    answer: "Prices are in Central African CFA francs (XAF / FCFA). Checkout uses PayUnit.",
  },
  {
    question: "Can I pay with MTN Mobile Money or Orange Money?",
    answer:
      "PayUnit checkout supports the mobile money and card options available on our live PayUnit account. You will see the methods when you pay.",
  },
  {
    question: "How long does delivery take in Douala?",
    answer:
      "Douala orders are packed in the atelier and usually move within a few days, depending on stock. You will get a chance to track or confirm by phone or WhatsApp.",
  },
  {
    question: "How long does delivery take to Yaoundé?",
    answer:
      "Yaoundé runs go out regularly from Douala. Allow extra time versus a local Douala drop. We pack linens against humidity for the road.",
  },
  {
    question: "Do you sell king size bedsheets in Cameroon?",
    answer:
      "Yes. We stock king, queen and double bedsheets. Measure your mattress and check the product dimensions before you buy.",
  },
  {
    question: "Do you sell cotton bedsheets?",
    answer:
      "Cotton is our main cloth for bedsheets. It sleeps better than plastic-feeling blends in Cameroon heat. See the bedsheets collection.",
  },
  {
    question: "Can I buy curtains in Douala without visiting a shop?",
    answer:
      "Yes. Shop window curtains online, or send a window photo on WhatsApp and we will help with drop and fullness. We deliver across Douala.",
  },
  {
    question: "Do you have blackout curtains?",
    answer:
      "We stock lined and blackout-ready curtains for bedrooms that need afternoon dark. Ask if you need a specific opacity.",
  },
  {
    question: "Do you sell towels for hotels?",
    answer:
      "Yes. Guesthouses and hotels in Douala, Kribi, Limbe and Yaoundé order bath towels in quantity. WhatsApp the house for wholesale packing.",
  },
  {
    question: "Can I order wholesale bedsheets?",
    answer:
      "Yes. Tell us how many beds and which sizes. We pack from Douala for hotels, rentals and family compounds.",
  },
  {
    question: "What is your delivery fee?",
    answer:
      "A standard delivery fee applies, with free delivery over a threshold shown at checkout and in the site settings. Remote towns may need a confirmed window.",
  },
  {
    question: "Do you deliver to Buea and Limbe?",
    answer: "Yes. Southwest deliveries include Buea, Limbe and Kumba. Packing accounts for humidity on the mountain and the coast.",
  },
  {
    question: "Do you deliver to Kribi?",
    answer: "Yes. Holiday houses and lodges in Kribi order towels, sheets and curtains. We pack for coastal weather.",
  },
  {
    question: "Are pillowcases sold separately?",
    answer: "Yes. Pillowcases (taies d’oreiller) are sold in the pillowcases collection and also with many sheet sets.",
  },
  {
    question: "How should I wash bedsheets in Cameroon?",
    answer:
      "Warm wash, do not leave them damp in a basin, hang them fully open, iron cotton if you can. Care instructions are on each product.",
  },
  {
    question: "Do you have French names for the products?",
    answer:
      "Yes — draps de lit, housse de couette, couvre-lit, rideaux, taies d’oreiller, serviettes de bain, linge de maison. The shop is in English; we understand French on WhatsApp.",
  },
  {
    question: "Can I track my order?",
    answer: "Use the Track order page with your order number. Keep your phone reachable for the rider.",
  },
  {
    question: "What if an item is out of stock?",
    answer: "Product pages show stock. Message us if you need a restock date for a colour or size.",
  },
  {
    question: "Do you offer gift packing?",
    answer: "Tell us at checkout or on WhatsApp. We can send a sheet or towel set straight to a new address.",
  },
  {
    question: "Do you ship to Garoua or Maroua?",
    answer: "Yes. North and Far North deliveries are scheduled from Douala with extra wrapping for the road.",
  },
  {
    question: "What sizes of curtains do you sell?",
    answer:
      "Ready-made panels for common Cameroon windows. Send measurements if your opening is wide or unusually tall and we will advise.",
  },
  {
    question: "Are your colours the same as on the website?",
    answer:
      "Photography is taken to be honest, but screens differ. Ivory, sand and forest are our core. If you need a match to an existing room, send a photo.",
  },
  {
    question: "Can I return an unused set?",
    answer:
      "Write within a short window if the parcel is unused and in its packing. Made-to-measure or clearly used pieces cannot come back. Contact the house and we will say what is possible.",
  },
  {
    question: "Do you sell cushion covers?",
    answer: "Yes, under other home textiles, alongside extra finishing pieces for the living room.",
  },
  {
    question: "Is Jimmy Home Textile only online?",
    answer:
      "The catalogue is online so the whole country can order. Douala customers can also reach us by phone and WhatsApp to discuss pickup or delivery.",
  },
  {
    question: "Do you sell to offices and Airbnbs?",
    answer:
      "Yes. Offices need towels and sometimes curtains; short-lets need full sheet and towel cycles. We pack mixed carts in one delivery.",
  },
  {
    question: "What does a typical Douala bedroom order include?",
    answer:
      "A cotton sheet set, extra pillowcases, a bed cover, and often a curtain pair if the window faces the street. Add towels if you are furnishing a whole house.",
  },
  {
    question: "Do you use Cloudinary for product photos?",
    answer:
      "Product and gallery images are stored on Cloudinary so they stay sharp on phones. That does not change how we pack the physical textiles.",
  },
  {
    question: "Can I buy only one curtain panel?",
    answer: "Most listings are sold as the pairing the window needs. Ask on WhatsApp if you need a single replacement panel.",
  },
  {
    question: "Do you have children’s sizes?",
    answer: "Most pieces are standard adult bed and bath sizes. A double sheet still works on many children’s beds — measure first.",
  },
  {
    question: "How do I care for curtains?",
    answer:
      "Shake out dust, follow the care label, and hang them fully so hems drop. Lined curtains last longer if they are not crushed wet.",
  },
  {
    question: "Do you deliver on Saturdays?",
    answer: "The house runs Monday to Saturday. Exact rider days depend on the city. We confirm when we dispatch.",
  },
  {
    question: "Can I pay on delivery?",
    answer:
      "Online orders are paid at checkout through PayUnit so we can pack with the order confirmed. Contact us if you have a special arrangement.",
  },
  {
    question: "Do you sell tablecloths?",
    answer: "When we have table linen it appears under other home textiles. Bedsheets, curtains and towels remain the core collection.",
  },
  {
    question: "How do I contact Jimmy Home Textile?",
    answer:
      "Use the contact form, email, phone or WhatsApp. Facebook is also listed in the footer. We reply in English and French.",
  },
  {
    question: "What is linge de maison?",
    answer:
      "French for household linen — sheets, towels, curtains and the rest of the cupboard. That is the whole of Jimmy Home Textile.",
  },
];

const PRODUCT_TERMS = [
  "bedsheets",
  "bed sheets",
  "cotton bedsheets",
  "satin bedsheets",
  "king size bedsheets",
  "queen size bedsheets",
  "double bedsheets",
  "fitted sheets",
  "flat sheets",
  "bed linen",
  "draps de lit",
  "draps",
  "linge de lit",
  "duvet covers",
  "duvet cover set",
  "housse de couette",
  "bed covers",
  "couvre-lit",
  "quilted bed covers",
  "comforters",
  "bedspreads",
  "curtains",
  "window curtains",
  "blackout curtains",
  "sheer curtains",
  "living room curtains",
  "bedroom curtains",
  "rideaux",
  "rideaux occultants",
  "blankets",
  "fleece blankets",
  "cotton blankets",
  "throws",
  "couvertures",
  "pillowcases",
  "pillow cases",
  "cotton pillowcases",
  "taies d'oreiller",
  "towels",
  "bath towels",
  "hand towels",
  "bath sheets",
  "serviettes de bain",
  "cushion covers",
  "home textiles",
  "linge de maison",
  "hotel linens",
  "wholesale bedsheets",
  "wholesale towels",
];

const INTENT_PREFIXES = [
  "buy",
  "shop",
  "order",
  "acheter",
  "affordable",
  "premium",
  "luxury",
  "quality",
  "cheap",
  "best",
];

const COUNTRY_TAILS = [
  "Cameroon",
  "Cameroun",
  "in Cameroon",
  "in Cameroun",
  "Cameroon online",
  "online Cameroon",
  "Douala",
  "Yaoundé",
  "Yaounde",
];

const CITY_PRODUCTS = [
  "bedsheets",
  "curtains",
  "towels",
  "blankets",
  "pillowcases",
  "bed covers",
  "home textiles",
  "linge de maison",
  "draps",
  "rideaux",
  "serviettes",
];

const EXTRA_PHRASES = [
  "Jimmy Home Textile",
  "Jimmy Home Textile Cameroon",
  "Jimmy Home Textile Douala",
  "home textiles Douala",
  "home textiles Yaoundé",
  "buy bedsheets online Cameroon",
  "buy curtains online Cameroon",
  "buy towels online Cameroon",
  "bedsheets delivery Cameroon",
  "curtains delivery Douala",
  "towels delivery Yaoundé",
  "cotton sheets tropical climate",
  "hotel bedsheets Cameroon",
  "guesthouse towels Cameroon",
  "Airbnb linens Cameroon",
  "PayUnit home textiles",
  "XAF bedsheets",
  "FCFA curtains",
  "MTN Mobile Money bedsheets",
  "Orange Money shopping Cameroon",
  "made for Cameroon homes",
  "atelier linens Douala",
  "quality bedsheets Cameroon",
  "quality curtains Cameroon",
  "quality towels Cameroon",
  "king size sheets Douala",
  "queen size sheets Yaoundé",
  "blackout curtains Douala",
  "sheer curtains Yaoundé",
  "bath towels Douala",
  "cotton pillowcases Cameroon",
  "quilted bed cover Cameroon",
  "wholesale linens Douala",
  "wholesale linens Yaoundé",
  "delivery across Cameroon",
  "nationwide textile delivery Cameroon",
  "Littoral home textiles",
  "Centre Region curtains",
  "Southwest towels Limbe",
  "Kribi holiday house linens",
  "Buea student bedsheets",
  "Bafoussam blankets",
  "Bamenda curtains",
  "Garoua cotton sheets",
  "Maroua home textiles",
  "Ngaoundéré blankets",
  "Dschang throws",
  "Edéa delivery textiles",
  "Nkongsamba bedsheets",
  "Bertoua towels",
  "Ebolowa curtains",
  "Kumba home textiles",
  "shop linge de maison Cameroun",
  "acheter draps Douala",
  "acheter rideaux Yaoundé",
  "acheter serviettes Cameroun",
  "housse de couette Cameroun",
  "taies d'oreiller Douala",
  "couvre-lit Yaoundé",
  "linge de lit Cameroun",
  "décoration intérieure Cameroun",
  "chambre à coucher Douala",
  "rideaux salon Cameroun",
  "draps coton Cameroun",
  "serviettes hôtel Cameroun",
  "fourniture hôtelière Cameroun",
  "textiles maison Cameroun",
  "boutique linge Douala",
  "boutique linge Yaoundé",
  "online textile shop Cameroon",
  "Cameroon bedding store",
  "Cameroon curtain shop",
  "Cameroon towel shop",
  "bedroom linens Cameroon",
  "living room curtains Cameroon",
  "bathroom towels Cameroon",
  "complete bed set Cameroon",
  "sheet set with pillowcases Cameroon",
  "fitted sheet Cameroon",
  "flat sheet Cameroon",
  "duvet insert Cameroon",
  "throw blanket Douala",
  "sofa throw Cameroon",
  "window treatment Cameroon",
  "drapes Cameroon",
  "voile curtains Cameroon",
  "lined curtains Cameroon",
  "moisture resistant towels Cameroon",
  "quick dry towels Cameroon",
  "percale sheets Cameroon",
  "sateen sheets Cameroon",
  "ivory bedsheets Cameroon",
  "forest green curtains Cameroon",
  "sand linen Cameroon",
  "wedding gift bedsheets Cameroon",
  "housewarming towels Cameroon",
  "new apartment linens Douala",
  "new apartment linens Yaoundé",
  "compound house textiles Cameroon",
  "family pack bedsheets Cameroon",
  "bulk order towels Cameroon",
  "dozen towels hotel Cameroon",
  "care instructions cotton sheets",
  "how to wash bedsheets Cameroon",
  "how to measure curtains Cameroon",
  "what size bedsheets Cameroon",
  "best bedsheets in Douala",
  "best curtains in Yaoundé",
  "best towels in Cameroon",
  "where to buy bedsheets in Douala",
  "where to buy curtains in Yaoundé",
  "where to buy towels in Cameroon",
  "home textile delivery Yaoundé",
  "home textile delivery Bafoussam",
  "home textile delivery Bamenda",
  "home textile delivery Buea",
  "home textile delivery Garoua",
];

function uniqueKeywords(values: string[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of values) {
    const value = raw.replace(/\s+/g, " ").trim();
    const key = value.toLowerCase();
    if (value.length < 4 || seen.has(key)) continue;
    seen.add(key);
    out.push(value);
  }
  return out;
}

function buildKeywordBank() {
  const bag: string[] = [...EXTRA_PHRASES];
  for (const product of PRODUCT_TERMS) {
    for (const tail of COUNTRY_TAILS) {
      bag.push(`${product} ${tail}`);
    }
    for (const intent of INTENT_PREFIXES) {
      bag.push(`${intent} ${product} Cameroon`);
      bag.push(`${intent} ${product} Douala`);
    }
    bag.push(`${product} delivery Cameroon`);
    bag.push(`${product} XAF`);
    bag.push(`${product} FCFA`);
    bag.push(`${product} Jimmy Home Textile`);
  }
  for (const city of CAMEROON_CITIES) {
    for (const product of CITY_PRODUCTS) {
      bag.push(`${product} ${city.name}`);
      bag.push(`buy ${product} in ${city.name}`);
      bag.push(`${product} delivery ${city.name}`);
    }
    bag.push(`Jimmy Home Textile ${city.name}`);
    bag.push(`home textile shop ${city.name}`);
    bag.push(`linge de maison ${city.name}`);
  }
  return uniqueKeywords(bag);
}

export const KEYWORD_BANK = buildKeywordBank();
export const KEYWORD_COUNT = KEYWORD_BANK.length;

export const DISCOVER_LINKS: { href: string; label: string }[] = [
  { href: "/categories/bedsheets", label: "Bedsheets in Cameroon" },
  { href: "/categories/curtains", label: "Curtains in Douala" },
  { href: "/categories/towels", label: "Bath towels Cameroon" },
  { href: "/categories/bed-covers", label: "Bed covers & housses" },
  { href: "/categories/blankets", label: "Blankets & throws" },
  { href: "/categories/pillowcases", label: "Cotton pillowcases" },
  { href: "/delivery/douala", label: "Delivery in Douala" },
  { href: "/delivery/yaounde", label: "Delivery in Yaoundé" },
  { href: "/delivery/buea", label: "Bedsheets in Buea" },
  { href: "/delivery/limbe", label: "Towels in Limbe" },
  { href: "/delivery/kribi", label: "Holiday linens Kribi" },
  { href: "/delivery/bafoussam", label: "Linens in Bafoussam" },
  { href: "/delivery/bamenda", label: "Home textiles Bamenda" },
  { href: "/delivery/garoua", label: "Sheets in Garoua" },
  { href: "/guides/choose-bedsheets-cameroon", label: "How to choose bedsheets" },
  { href: "/guides/curtain-sizes-cameroon-homes", label: "Curtain sizes" },
  { href: "/guides/cotton-sheets-tropical-weather", label: "Cotton for tropical weather" },
  { href: "/guides/wholesale-hotel-linens-cameroon", label: "Hotel & wholesale linens" },
  { href: "/guides/towels-humid-climate", label: "Towels in humidity" },
  { href: "/faq", label: "FAQ — sizes, PayUnit, delivery" },
  { href: "/shop", label: "Shop all home textiles" },
  { href: "/about", label: "A Cameroonian textile house" },
];

export const PRIMARY_KEYWORDS = [
  "bedsheets Cameroon",
  "curtains Douala",
  "home textiles Cameroon",
  "cotton bedsheets Douala",
  "towels Yaoundé",
  "linge de maison Cameroun",
  "draps de lit Douala",
  "rideaux Yaoundé",
  "Jimmy Home Textile",
  "buy bedsheets online Cameroon",
  "wholesale towels Cameroon",
  "king size bedsheets Cameroon",
  "blackout curtains Cameroon",
  "pillowcases Douala",
  "bed covers Cameroon",
  "delivery across Cameroon",
  "XAF home textiles",
  "hotel linens Cameroon",
];

export function getCity(slug: string) {
  return CAMEROON_CITIES.find((city) => city.slug === slug) || null;
}

export function getGuide(slug: string) {
  return GUIDES.find((guide) => guide.slug === slug) || null;
}

export function relatedCities(slug: string, limit = 6) {
  return CAMEROON_CITIES.filter((city) => city.slug !== slug).slice(0, limit);
}

export function relatedGuides(slug: string, limit = 4) {
  return GUIDES.filter((guide) => guide.slug !== slug).slice(0, limit);
}
