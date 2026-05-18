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
          { name: 'Protein Sources', items: ['Eggs (2–3 whole)', 'Greek yogurt', 'Cottage cheese', 'Whey shake if rushed'] },
          { name: 'Carb Sources', items: ['Oats', 'Sourdough toast', 'Fruit (banana, berries)', 'Rice cakes with honey'] },
          { name: 'Healthy Fats', items: ['Avocado', 'Nut butter', 'Handful of nuts'] },
          { name: 'Note', items: ['If session is within 90 min, treat this AS your pre-session meal.'] },
        ],
      },
      {
        id: 'pre', label: 'Pre-Session Top-up', time: '30–60 min before (if needed)', color: '#F59E0B', icon: '⚡', goal: 'Quick carbs to top up glycogen. Skip if you ate within ~2 hours.',
        sections: [
          { name: 'Options', items: ['Banana + small handful of dates', 'Rice cake with honey', 'Slice of toast with jam'] },
          { name: 'Add-Ons', items: ['Creatine (5g)', 'Coffee/caffeine if needed'] },
          { name: 'Avoid', items: ['Heavy fat or fiber within 60 min of training — sits in the stomach'] },
        ],
      },
      {
        id: 'post', label: 'Post-Session', time: 'Within ~2 hours', color: '#5BF0A5', icon: '🔁', goal: 'Solid meal: protein + carbs + veg.',
        sections: [
          { name: 'Protein Sources', items: ['Chicken breast', 'Salmon', 'Lean beef', 'Eggs', 'Greek yogurt'] },
          { name: 'Carb Sources', items: ['Rice', 'Sweet potato', 'Pasta', 'Potato'] },
          { name: 'Vegetables', items: ['Whatever you\'ll actually eat — broccoli, peppers, spinach, salad'] },
          { name: 'Note', items: ['Shake only if you can\'t eat real food for a while. Timing within ~2 hours is fine.'] },
        ],
      },
      {
        id: 'lunch', label: 'Lunch / Dinner', time: 'Main fuel meals', color: '#38BDF8', icon: '🍽', goal: 'Main fuel meals — these do most of the work hitting your macros.',
        sections: [
          { name: 'Protein', items: ['Chicken thigh/breast', 'Salmon, mackerel, sardines (better than tuna)', 'Lean beef', 'Lentils, chickpeas, tofu'] },
          { name: 'Complex Carbs', items: ['Rice (white or brown)', 'Pasta', 'Potato / sweet potato', 'Quinoa', 'Bread'] },
          { name: 'Vegetables', items: ['Anything you like — variety matters more than "superfoods"'] },
          { name: 'Healthy Fats', items: ['Olive oil', 'Avocado', 'Nuts', 'Fatty fish'] },
        ],
      },
      {
        id: 'snack', label: 'Snacks', time: 'As needed', color: '#A78BFA', icon: '🤏', goal: 'Bridge gaps to hit macros',
        sections: [
          { name: 'High-Protein', items: ['Greek yogurt + fruit', 'Cottage cheese + berries', 'Hard-boiled eggs', 'Protein bar (>15g P, <15g sugar)'] },
          { name: 'Other', items: ['Apple + peanut butter', 'Trail mix'] },
        ],
      },
      {
        id: 'night', label: 'Evening (Optional)', time: '30–60 min before bed', color: '#6EE7B7', icon: '🌙', goal: 'Slow protein helps overnight recovery.',
        sections: [
          { name: 'Options', items: ['Cottage cheese', 'Greek yogurt', 'Casein shake', 'Glass of milk'] },
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
          { name: 'Protein Sources', items: ['3 whole eggs scrambled', 'Greek yogurt', 'Cottage cheese', 'Smoked salmon'] },
          { name: 'Carb Sources', items: ['2 slices sourdough', 'Oats (smaller portion)', 'Fruit (1 piece)'] },
          { name: 'Healthy Fats', items: ['½ avocado', 'Olive oil drizzle', 'Handful of nuts'] },
        ],
      },
      {
        id: 'lunch', label: 'Lunch', time: 'Midday', color: '#38BDF8', icon: '🍽', goal: 'Lean & balanced',
        sections: [
          { name: 'Protein', items: ['Tuna, chicken, or eggs', 'Legumes (lentil soup, chickpeas)', 'White fish'] },
          { name: 'Carbs (reduced)', items: ['½ cup brown rice', '1 sweet potato', '1 slice whole grain bread'] },
          { name: 'Vegetables', items: ['Large mixed salad', 'Steamed broccoli or greens', 'Roasted peppers'] },
        ],
      },
      {
        id: 'dinner', label: 'Dinner', time: 'Evening', color: '#38BDF8', icon: '🌙', goal: 'Lean protein, light carbs',
        sections: [
          { name: 'Protein', items: ['White fish or turkey', 'Lean beef (small portion)', 'Eggs or tofu'] },
          { name: 'Vegetables (plenty)', items: ['Stir-fried mixed veg', 'Big green salad', 'Roasted root vegetables'] },
          { name: 'Light Carbs', items: ['½ cup lentils', 'Small portion quinoa', '1 small sweet potato'] },
        ],
      },
      {
        id: 'snack', label: 'Snacks', time: 'As needed', color: '#A78BFA', icon: '🤏', goal: 'Keep protein up',
        sections: [
          { name: 'Best Rest Day Snacks', items: ['Cottage cheese + berries', 'Hard-boiled eggs', 'Protein shake (water-based)', 'Apple + almond butter', 'Greek yogurt (plain)'] },
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
          { name: 'Packed Meal Template', items: ['Rice cakes + turkey', 'Fruit', 'Greek yogurt', 'Mixed nuts', 'Protein shake'] },
        ],
      },
    ],
  },
};
