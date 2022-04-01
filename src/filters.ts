import { Input } from "./input";
import { Pull } from "./types";

export function dateFilter(
  daysBack: Input["daysBack"]
): (pull: Pull) => boolean {
  const ms = daysBack * 24 * 60 * 60 * 1000;
  const thresholdDate = new Date(Date.now() - ms);
  return (p: Pull) => {
    return new Date(p.created_at) >= thresholdDate;
  };
}
