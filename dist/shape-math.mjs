// Profile edits share the same radial deformation on the outer and inner wall.
export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
export function sculptProfile(profile, at, amount) {
  at = clamp(at, .08, .97);
  for (let i = 0; i < profile.length; i++) {
    const t = i / (profile.length - 1);
    const weight = Math.exp(-(((t - at) / .14) ** 2)) * Math.min(1, t / .16);
    profile[i] = clamp(profile[i] + amount * weight, -.24, .28);
  }
}
export function shapeVertex(x, y, z, settings, profile, weight = 1) {
  const t = clamp(y / 2.75, 0, 1);
  const index = t * (profile.length - 1), lo = Math.floor(index), hi = Math.min(lo + 1, profile.length - 1);
  const sculpt = profile[lo] + (profile[hi] - profile[lo]) * (index - lo);
  const baseLock = Math.min(1, Math.max(0, (t - .05) / .12));
  const belly = Math.exp(-(((t - .46) / .29) ** 2)) * (settings.belly - 1);
  const neck = Math.max(0, (t - .66) / .34) * (settings.neck - 1);
  const radius = 1 + (belly + neck + sculpt) * baseLock * weight;
  const height = 1 + (settings.height - 1) * weight;
  return [x * radius, .04 + (y - .04) * height, z * radius];
}
