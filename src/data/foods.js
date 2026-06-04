// Central food database — the single source of truth for macros. The category
// browse (nutrition.js), the protein helper and the meal builder all reference
// foods by id from here, so a macro is only ever defined once.
//
// Macros are per the stated `portion` and are sensible reference values, not lab
// figures — close enough to plan a day around. kcal is derived (see meal.js), not
// stored, so it can never drift out of sync with the macros.
//
// group drives filtering/colour: protein | carb | fat | veg.

export const FOODS = {
  // ── Protein ────────────────────────────────────────────────
  eggs:           { name: 'Eggs',            portion: '3 whole',     group: 'protein', p: 18, c: 1,  f: 15 },
  greek_yogurt:   { name: 'Greek yogurt',    portion: '170g pot',    group: 'protein', p: 17, c: 6,  f: 4 },
  cottage_cheese: { name: 'Cottage cheese',  portion: '150g',        group: 'protein', p: 18, c: 5,  f: 4 },
  whey:           { name: 'Whey shake',      portion: '1 scoop',     group: 'protein', p: 24, c: 3,  f: 2 },
  casein:         { name: 'Casein shake',    portion: '1 scoop',     group: 'protein', p: 24, c: 4,  f: 1 },
  milk:           { name: 'Milk',            portion: '300ml',       group: 'protein', p: 10, c: 14, f: 8 },
  chicken_breast: { name: 'Chicken breast',  portion: '150g',        group: 'protein', p: 35, c: 0,  f: 4 },
  chicken_thigh:  { name: 'Chicken thigh',   portion: '150g',        group: 'protein', p: 30, c: 0,  f: 11 },
  salmon:         { name: 'Salmon',          portion: '150g',        group: 'protein', p: 30, c: 0,  f: 20 },
  smoked_salmon:  { name: 'Smoked salmon',   portion: '80g',         group: 'protein', p: 15, c: 0,  f: 8 },
  mackerel:       { name: 'Mackerel',        portion: '120g',        group: 'protein', p: 24, c: 0,  f: 25 },
  sardines:       { name: 'Sardines',        portion: '1 tin',       group: 'protein', p: 25, c: 0,  f: 14 },
  tuna:           { name: 'Tuna',            portion: '1 tin',       group: 'protein', p: 26, c: 0,  f: 2 },
  white_fish:     { name: 'White fish',      portion: '150g',        group: 'protein', p: 30, c: 0,  f: 2 },
  lean_beef:      { name: 'Lean beef',       portion: '150g',        group: 'protein', p: 38, c: 0,  f: 12 },
  turkey:         { name: 'Turkey',          portion: '150g',        group: 'protein', p: 38, c: 0,  f: 3 },
  tofu:           { name: 'Tofu',            portion: '150g',        group: 'protein', p: 18, c: 3,  f: 11 },
  lentils:        { name: 'Lentils',         portion: '150g cooked', group: 'protein', p: 13, c: 30, f: 1 },
  chickpeas:      { name: 'Chickpeas',       portion: '150g cooked', group: 'protein', p: 12, c: 40, f: 4 },
  protein_bar:    { name: 'Protein bar',     portion: '1 bar',       group: 'protein', p: 20, c: 20, f: 7 },

  // ── Carbs ──────────────────────────────────────────────────
  oats:           { name: 'Oats',            portion: '60g dry',     group: 'carb', p: 8,  c: 40, f: 5 },
  sourdough:      { name: 'Sourdough toast', portion: '2 slices',    group: 'carb', p: 8,  c: 44, f: 2 },
  wholegrain:     { name: 'Wholegrain bread',portion: '2 slices',    group: 'carb', p: 8,  c: 36, f: 2 },
  rice:           { name: 'Rice',            portion: '75g dry',     group: 'carb', p: 6,  c: 58, f: 1 },
  pasta:          { name: 'Pasta',           portion: '75g dry',     group: 'carb', p: 10, c: 56, f: 2 },
  potato:         { name: 'Potato',          portion: '250g',        group: 'carb', p: 5,  c: 45, f: 0 },
  sweet_potato:   { name: 'Sweet potato',    portion: '200g',        group: 'carb', p: 3,  c: 40, f: 0 },
  quinoa:         { name: 'Quinoa',          portion: '75g dry',     group: 'carb', p: 10, c: 50, f: 5 },
  banana:         { name: 'Banana',          portion: '1 medium',    group: 'carb', p: 1,  c: 27, f: 0 },
  berries:        { name: 'Berries',         portion: '100g',        group: 'carb', p: 1,  c: 12, f: 0 },
  apple:          { name: 'Apple',           portion: '1 medium',    group: 'carb', p: 0,  c: 25, f: 0 },
  dates:          { name: 'Dates',           portion: '3',           group: 'carb', p: 1,  c: 36, f: 0 },
  rice_cakes:     { name: 'Rice cakes + honey', portion: '2 + honey',group: 'carb', p: 2,  c: 26, f: 0 },

  // ── Fats ───────────────────────────────────────────────────
  avocado:        { name: 'Avocado',         portion: '½',           group: 'fat', p: 2, c: 6, f: 15 },
  olive_oil:      { name: 'Olive oil',       portion: '1 tbsp',      group: 'fat', p: 0, c: 0, f: 14 },
  nuts:           { name: 'Mixed nuts',      portion: '30g',         group: 'fat', p: 6, c: 6, f: 18 },
  nut_butter:     { name: 'Nut butter',      portion: '1 tbsp',      group: 'fat', p: 4, c: 3, f: 9 },
  almond_butter:  { name: 'Almond butter',   portion: '1 tbsp',      group: 'fat', p: 3, c: 3, f: 9 },
  trail_mix:      { name: 'Trail mix',       portion: '40g',         group: 'fat', p: 8, c: 18, f: 16 },

  // ── Veg ────────────────────────────────────────────────────
  broccoli:       { name: 'Broccoli',        portion: '150g',        group: 'veg', p: 4, c: 7,  f: 0 },
  peppers:        { name: 'Peppers',         portion: '1',           group: 'veg', p: 1, c: 6,  f: 0 },
  spinach:        { name: 'Spinach',         portion: '80g',         group: 'veg', p: 2, c: 2,  f: 0 },
  salad:          { name: 'Mixed salad',     portion: 'big bowl',    group: 'veg', p: 2, c: 5,  f: 0 },
  mixed_veg:      { name: 'Mixed veg',       portion: '150g',        group: 'veg', p: 3, c: 8,  f: 0 },
  root_veg:       { name: 'Roasted root veg',portion: '150g',        group: 'veg', p: 2, c: 20, f: 0 },
};

// Filter groups for the meal builder, in display order.
export const FOOD_GROUPS = [
  { id: 'protein', label: 'Protein', color: '#F59E0B' },
  { id: 'carb',    label: 'Carbs',   color: '#38BDF8' },
  { id: 'fat',     label: 'Fats',    color: '#A78BFA' },
  { id: 'veg',     label: 'Veg',     color: '#5BF0A5' },
];

// All ids of a group, for the builder's filtered chip grid.
export const foodsInGroup = (group) =>
  Object.keys(FOODS).filter((id) => FOODS[id].group === group);
