import { Input } from "./input";
import { Pull } from "./types";

export function dateFilter(
  daysBack: Input["daysBack"]
): (pull: Pull) => boolean {
  const ms = daysBack * 24 * 60 * 60 * 1000;
  const timeWindowStart = new Date(Date.now() - ms);
  return (p: Pull) => {
    const finishDateString = p.merged_at ?? p.closed_at;
    return finishDateString
      ? new Date(finishDateString) >= timeWindowStart
      : true;
  };
}

export function labelFilter(
  labelsToIgnore: Input["labelsToIgnore"]
): (pull: Pull) => boolean {
  return (p: Pull) => {
    return labelsToIgnore.every(
      (labelToIgnore) => !p.labels.map((l) => l.name).includes(labelToIgnore)
    );
  };
}

export function draftFilter(
  includeDrafts: Input["includeDrafts"]
): (pull: Pull) => boolean {
  return (p: Pull) => (includeDrafts ? true : !p.draft);
}
