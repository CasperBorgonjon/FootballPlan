// Day-level fuel guidance. Food-section items are FOOD IDS (resolved against
// data/foods.js for portion + macros); anything that isn't a known id renders as
// a plain note/prose line. That keeps macros defined in exactly one place.

export const nutritionData = {
  training: {
    macros: [
      { l: 'Calories', v: '3,050', u: 'kcal', c: '#5BF0A5' },
      { l: 'Protein', v: '175', u: 'g', c: '#F59E0B' },
      { l: 'Carbs', v: '370', u: 'g', c: '#38BDF8' },
      { l: 'Fat', v: '85', u: 'g', c: '#A78BFA' },
    ],
    categories: [
      {
        id: 'breakfast', label: 'Breakfast', time: 'After waking', color: '#FCD34D', icon: '☀️', goal: 'Main fuel meal. Carbs + protein + some fat.',
        sections: [
          { name: 'Protein Sources', items: ['eggs', 'greek_yogurt', 'cottage_cheese', 'whey'] },
          { name: 'Carb Sources', items: ['oats', 'sourdough', 'banana', 'berries', 'rice_cakes'] },
          { name: 'Healthy Fats', items: ['avocado', 'nut_butter', 'nuts'] },
          { name: 'Note', items: ['If session is within 90 min, treat this AS your pre-session meal.'] },
        ],
      },
      {
        id: 'pre', label: 'Pre-Session Top-up', time: '30–60 min before (if needed)', color: '#F59E0B', icon: '⚡', goal: 'Quick carbs to top up glycogen. Skip if you ate within ~2 hours.',
        sections: [
          { name: 'Options', items: ['banana', 'dates', 'rice_cakes', 'Slice of toast with jam'] },
          { name: 'Add-Ons', items: ['Creatine (5g)', 'Coffee / caffeine if needed'] },
          { name: 'Avoid', items: ['Heavy fat or fiber within 60 min of training — sits in the stomach'] },
        ],
      },
      {
        id: 'post', label: 'Post-Session', time: 'Within ~2 hours', color: '#5BF0A5', icon: '🔁', goal: 'Solid meal: protein + carbs + veg.',
        sections: [
          { name: 'Protein Sources', items: ['chicken_breast', 'salmon', 'lean_beef', 'eggs', 'greek_yogurt'] },
          { name: 'Carb Sources', items: ['rice', 'sweet_potato', 'pasta', 'potato'] },
          { name: 'Vegetables', items: ['broccoli', 'peppers', 'spinach', 'salad'] },
          { name: 'Note', items: ['Shake only if you can\'t eat real food for a while. Timing within ~2 hours is fine.'] },
        ],
      },
      {
        id: 'lunch', label: 'Lunch / Dinner', time: 'Main fuel meals', color: '#38BDF8', icon: '🍽', goal: 'Main fuel meals — these do most of the work hitting your macros.',
        sections: [
          { name: 'Protein', items: ['chicken_thigh', 'salmon', 'mackerel', 'sardines', 'lean_beef', 'lentils', 'chickpeas', 'tofu'] },
          { name: 'Complex Carbs', items: ['rice', 'pasta', 'potato', 'sweet_potato', 'quinoa', 'wholegrain'] },
          { name: 'Vegetables', items: ['Anything you like — variety matters more than "superfoods"'] },
          { name: 'Healthy Fats', items: ['olive_oil', 'avocado', 'nuts', 'mackerel'] },
        ],
      },
      {
        id: 'snack', label: 'Snacks', time: 'As needed', color: '#A78BFA', icon: '🤏', goal: 'Bridge gaps to hit macros',
        sections: [
          { name: 'High-Protein', items: ['greek_yogurt', 'cottage_cheese', 'eggs', 'protein_bar'] },
          { name: 'Other', items: ['apple', 'nut_butter', 'trail_mix'] },
        ],
      },
      {
        id: 'night', label: 'Evening (Optional)', time: '30–60 min before bed', color: '#6EE7B7', icon: '🌙', goal: 'Slow protein helps overnight recovery.',
        sections: [
          { name: 'Options', items: ['cottage_cheese', 'greek_yogurt', 'casein', 'milk'] },
          { name: 'Note', items: ['Skip if you\'ve already hit protein for the day. Not a magic recovery window.'] },
        ],
      },
    ],
    examples: [
      {
        title: 'Morning Session',
        rows: [
          ['07:30', 'Breakfast (= pre-session)', 'Oats + whey + banana + coffee + 5g creatine'],
          ['09:30', 'TRAIN', ''],
          ['10:30', 'Post-session meal', 'Rice + chicken + broccoli + olive oil'],
          ['14:00', 'Lunch', 'Pasta + salmon + salad'],
          ['17:00', 'Snack', 'Greek yogurt + nuts'],
          ['20:00', 'Dinner', 'Sweet potato + chicken + roasted veg'],
        ],
      },
      {
        title: 'Evening Session',
        rows: [
          ['08:00', 'Breakfast', 'Eggs + sourdough + fruit + coffee'],
          ['12:30', 'Lunch (main carb load)', 'Rice + chicken + veg + olive oil'],
          ['15:00', 'Pre-session top-up', 'Banana + rice cake + honey + 5g creatine'],
          ['16:30', 'TRAIN', ''],
          ['18:00', 'Post-session meal', 'Pasta + salmon + salad'],
          ['21:00', 'Light evening', 'Greek yogurt + berries (optional)'],
        ],
      },
    ],
  },
  rest: {
    macros: [
      { l: 'Calories', v: '2,400', u: 'kcal', c: '#5BF0A5' },
      { l: 'Protein', v: '160', u: 'g', c: '#F59E0B' },
      { l: 'Carbs', v: '240', u: 'g', c: '#38BDF8' },
      { l: 'Fat', v: '80', u: 'g', c: '#A78BFA' },
    ],
    categories: [
      {
        id: 'morning', label: 'Morning', time: 'On waking', color: '#38BDF8', icon: '🌅', goal: 'Refuel gently',
        sections: [
          { name: 'Protein Sources', items: ['eggs', 'greek_yogurt', 'cottage_cheese', 'smoked_salmon'] },
          { name: 'Carb Sources', items: ['sourdough', 'oats', 'apple'] },
          { name: 'Healthy Fats', items: ['avocado', 'olive_oil', 'nuts'] },
        ],
      },
      {
        id: 'lunch', label: 'Lunch', time: 'Midday', color: '#38BDF8', icon: '🍽', goal: 'Lean & balanced',
        sections: [
          { name: 'Protein', items: ['tuna', 'chicken_breast', 'eggs', 'lentils', 'white_fish'] },
          { name: 'Carbs (reduced)', items: ['rice', 'sweet_potato', 'wholegrain'] },
          { name: 'Vegetables', items: ['salad', 'broccoli', 'peppers'] },
        ],
      },
      {
        id: 'dinner', label: 'Dinner', time: 'Evening', color: '#38BDF8', icon: '🌙', goal: 'Lean protein, light carbs',
        sections: [
          { name: 'Protein', items: ['white_fish', 'turkey', 'lean_beef', 'eggs', 'tofu'] },
          { name: 'Vegetables (plenty)', items: ['mixed_veg', 'salad', 'root_veg'] },
          { name: 'Light Carbs', items: ['lentils', 'quinoa', 'sweet_potato'] },
        ],
      },
      {
        id: 'snack', label: 'Snacks', time: 'As needed', color: '#A78BFA', icon: '🤏', goal: 'Keep protein up',
        sections: [
          { name: 'Best Rest Day Snacks', items: ['cottage_cheese', 'eggs', 'whey', 'apple', 'greek_yogurt', 'almond_butter'] },
          { name: 'Avoid on Rest Days', items: ['High-carb snacks (crisps, bread)', 'Sugary drinks or juices', 'Large portions', 'Takeaways or processed food'] },
        ],
      },
      {
        id: 'sunday', label: 'Sunday Shift', time: 'Work day — also rest day', color: '#FB923C', icon: '👷', goal: 'Rest from training but on your feet for hours. Eat like a light training day.',
        sections: [
          { name: 'Calories', items: ['Bump to 2,600–2,700 kcal — don\'t drop to full rest-day calories'] },
          { name: 'Carbs', items: ['Moderate 280–300g — glycogen needed on your feet all day'] },
          { name: 'Hydration', items: ['2.5–3L minimum — hydration is key'] },
          { name: 'Guidance', items: ['Pack food. Don\'t rely on what\'s available at work.', 'Keep carbs moderate — you need glycogen for hours of standing.'] },
          { name: 'Packed Meal Template', items: ['rice_cakes', 'turkey', 'banana', 'greek_yogurt', 'nuts', 'whey'] },
        ],
      },
    ],
  },
};
