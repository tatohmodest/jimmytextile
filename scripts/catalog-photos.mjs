/** Unsplash lifestyle photos that match each catalog product. First URL is the main photo. */
function photo(id) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`;
}

export const CATALOG_PHOTOS = {
  "double-plastic-bedsheet": [
    photo("1547104442-044448b73426"),
    photo("1600908389678-64b54d9cf054"),
  ],
  "double-bedsheet-in-bag": [
    photo("1606855637183-ea2a00b6f15f"),
    photo("1631049307264-da0ec9d70304"),
  ],
  "triple-bedsheet-2-pillowcases": [
    photo("1522771739844-6a9f6d5f14af"),
    photo("1759264244726-adde4e4318fc"),
  ],
  "triple-flat-fitted-2-pillowcases": [
    photo("1556020685-ae41abfc9365"),
    photo("1642357083553-0afd747c38cd"),
  ],
  "triple-sheet-2-pillowcases-2-curtains-essentiel": [
    photo("1618220179428-22790b461013"),
    photo("1748679979588-dfd926667927"),
  ],
  "triple-bedsheet-4-pillowcases": [
    photo("1505693416388-ac5ce068fe85"),
    photo("1616594039964-ae9021a400a0"),
  ],
  "triple-bedsheet-2-pillowcases-2-curtains": [
    photo("1540518614846-7eded433c457"),
    photo("1748679979588-dfd926667927"),
  ],
  "triple-bedsheet-4-pillowcases-4-curtains": [
    photo("1767050387941-b97f0d5a3232"),
    photo("1615874694520-474822394e73"),
  ],
  "king-bedsheet-2-pillowcases": [
    photo("1566665797739-1674de7a421a"),
    photo("1611892440504-42a792e24d32"),
  ],
  "king-bedsheet-4-pillowcases": [
    photo("1617325247661-675ab4b64ae2"),
    photo("1505693416388-ac5ce068fe85"),
  ],
  "triple-duvet-2-sheets-4-pillowcases": [
    photo("1698746044370-4ea50c59c009"),
    photo("1631049307264-da0ec9d70304"),
  ],
  "curtain-3-in-1": [
    photo("1748679979588-dfd926667927"),
    photo("1618220179428-22790b461013"),
  ],
  "large-mosquito-net": [
    photo("1533633310920-cc9bf1e7f9b0"),
    photo("1595526114035-0d45ed16cfbf"),
  ],
  "medium-mosquito-net": [
    photo("1595526114035-0d45ed16cfbf"),
    photo("1533633310920-cc9bf1e7f9b0"),
  ],
};
