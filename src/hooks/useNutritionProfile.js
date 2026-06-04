import { useLocalStorage } from './useLocalStorage';

// The athlete's body stats + goal, used to personalise calorie/macro targets.
// Local-only (like theme) — it never leaves the device, so no Supabase sync.
const DEFAULT_PROFILE = {
  sex: 'male',
  age: '',
  height: '',
  weight: '',
  activity: 'moderate',
  goal: 'maintain',
};

export function useNutritionProfile() {
  const [profile, setProfile] = useLocalStorage('nutritionProfile', DEFAULT_PROFILE);

  // Merge a partial update so callers can set one field at a time.
  const updateProfile = (patch) => setProfile((prev) => ({ ...prev, ...patch }));

  // Clear back to defaults — drops the personalised targets so the nutrition
  // section falls back to the plan's generic numbers.
  const resetProfile = () => setProfile(DEFAULT_PROFILE);

  return { profile, updateProfile, resetProfile };
}
