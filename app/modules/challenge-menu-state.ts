/**
 * Client memory of the last navbar challenge load (#237). `shouldRevalidate`
 * in `_main` gets no loader data, so it reads this to retry a failed load.
 * Written by `useChallengeMenuItem` in an effect, so client only.
 */

let lastLoadFailed = false;

export function setChallengeLoadFailed(failed: boolean): void {
  lastLoadFailed = failed;
}

export function didChallengeLoadFail(): boolean {
  return lastLoadFailed;
}
