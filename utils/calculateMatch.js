export const calculateMatch = (preferences, profile) => {
  let score = 50;

  if (
    preferences?.location &&
    profile?.location?.toLowerCase() === preferences.location?.toLowerCase()
  ) {
    score += 15;
  }

  if (
    preferences?.religion &&
    profile?.religion?.toLowerCase() === preferences.religion?.toLowerCase()
  ) {
    score += 15;
  }

  if (
    preferences?.gender &&
    profile?.gender?.toLowerCase() === preferences.gender?.toLowerCase()
  ) {
    score += 10;
  }

  if (
    preferences?.minAge &&
    preferences?.maxAge &&
    profile?.age >= Number(preferences.minAge) &&
    profile?.age <= Number(preferences.maxAge)
  ) {
    score += 10;
  }

  return Math.min(score, 98);
};
