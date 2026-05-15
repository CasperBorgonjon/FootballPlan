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
        id: 'pre', label: 'Pre-Session', time: '60–90 min before', color: '#F59E0B', icon: '⚡', goal: 'Fast energy, no crash',
        sections: [
          { name: 'Carb Sources', items: ['Oats / oatmeal', 'White rice or pasta', 'Banana or dates', 'Rice cakes', 'White bread + jam', 'Fruit juice (small glass)'] },
          { name: 'Protein Sources', items: ['Whole eggs or egg whites', 'Greek yogurt (low fat)', 'Whey protein shake', 'Turkey slices'] },
          { name: 'Add-Ons', items: ['Honey', 'Black coffee / green tea', 'Creatine (5g)', 'Pinch of salt'] },
          { name: 'Avoid', items: ['High-fat foods', 'High-fiber meals', 'Dairy-heavy foods', 'Spicy food', 'Carbonated drinks'] },
        ],
      },
      {
        id: 'post', label: 'Post-Session', time: 'Within 45 min', color: '#5BF0A5', icon: '🔁', goal: 'Rapid recovery',
        sections: [
          { name: 'Protein Sources', items: ['Whey protein (fast-absorbing)', 'Chicken breast', 'Tuna or white fish', 'Egg whites', 'Low-fat milk'] },
          { name: 'Carb Sources', items: ['White rice', 'Sweet potato', 'Banana, mango, pineapple', 'Rice cakes', 'White pasta'] },
          { name: 'Electrolytes', items: ['Sodium (pinch of salt)', 'Potassium (banana, coconut water)', 'Magnesium (pumpkin seeds)', 'Light sports drink'] },
          { name: 'Avoid', items: ['High-fat meats', 'Alcohol', 'Skipping this meal'] },
        ],
      },
      {
        id: 'main', label: 'Main Meals', time: 'Lunch & Dinner', color: '#38BDF8', icon: '🍽', goal: 'Balanced performance fuel',
        sections: [
          { name: 'Protein Sources', items: ['Chicken breast or thigh', 'Salmon / mackerel', 'Lean beef or turkey', 'Eggs', 'Lentils / chickpeas'] },
          { name: 'Complex Carbs', items: ['Brown or white rice', 'Sweet potato', 'Quinoa', 'Pasta', 'Whole grain bread', 'Oats'] },
          { name: 'Vegetables', items: ['Broccoli', 'Spinach / kale', 'Bell peppers', 'Zucchini', 'Tomatoes', 'Carrots', 'Beetroot (good for endurance)'] },
          { name: 'Healthy Fats', items: ['Avocado', 'Olive oil', 'Almonds / walnuts', 'Nut butters', 'Fatty fish'] },
        ],
      },
      {
        id: 'snack', label: 'Snacks', time: 'Between meals', color: '#A78BFA', icon: '🤏', goal: 'Bridge gaps, maintain energy',
        sections: [
          { name: 'High-Protein', items: ['Greek yogurt', 'Cottage cheese', 'Hard-boiled eggs', 'Protein bar', 'Turkey rolls'] },
          { name: 'Carb-Based', items: ['Banana or apple', 'Rice cakes + honey', 'Granola (low sugar)', 'Dates or raisins (small)'] },
          { name: 'Fat + Protein', items: ['Almonds + jerky', 'Peanut butter on rice cakes', 'Hummus + veggies', 'Trail mix'] },
        ],
      },
      {
        id: 'night', label: 'Night Recovery', time: '30–60 min before bed', color: '#6EE7B7', icon: '🌙', goal: 'Overnight muscle repair',
        sections: [
          { name: 'Slow Proteins', items: ['Cottage cheese', 'Casein protein powder', 'Full-fat Greek yogurt', 'Warm milk', 'Quark / skyr'] },
          { name: 'Optional Fats', items: ['Almond butter (1 tbsp)', 'Walnuts', 'Chia seeds'] },
          { name: 'Sleep Support', items: ['Chamomile tea', 'Magnesium glycinate', 'Tart cherry juice', 'Small amount of honey'] },
          { name: 'Avoid', items: ['Large carb-heavy meals', 'Caffeine after 2pm', 'Alcohol', 'Heavy fats late at night'] },
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
    ],
  },
};
