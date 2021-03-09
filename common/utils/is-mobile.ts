export function isMobile(includeIPad: boolean): boolean {
  const { userAgent } = navigator
  const regExps = [
    /iphone/i,
    /ipod/i,
    /ipad/i,
    /\bandroid.+mobile\b/i,
    /android/i,
    /\bandroid.+sd4930ur\b/i,
    /\bandroid.+kf[a-z]{24}\b/i,
    /windows phone/i,
    /\bwindows.+arm\b/i,
    /blackberry/i,
    /bb10/i,
    /opera mini/i,
    /\b(crios|chrome).+mobile/i,
    /mobile.+firefox\b/i,
  ]
  return /ipad/i.test(userAgent) && !includeIPad ? false : regExps.some((regex) => regex.test(userAgent))
}
