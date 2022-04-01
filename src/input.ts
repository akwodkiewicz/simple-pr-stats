import * as core from "@actions/core";

const DEFAULT_DAYS_BACK = 30;

export function parseInput(): Input {
  const token = core.getInput("token", { required: true });

  const rawDaysBack = core.getInput("days_back") || undefined;
  let daysBack: number;
  if (rawDaysBack) {
    daysBack = Number.parseFloat(rawDaysBack);
    if (Number.isNaN(daysBack)) {
      throw Error("days_back is not a valid number");
    }
  } else {
    daysBack = DEFAULT_DAYS_BACK;
  }

  const labelsToIgnore = core
    .getInput("labels_to_ignore")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

  const overrideOwner = core.getInput("override_owner") || undefined;
  const overrideRepo = core.getInput("override_repo") || undefined;

  return {
    token,
    daysBack,
    labelsToIgnore,
    overrideRepo,
    overrideOwner,
  };
}

export interface Input {
  token: string;
  daysBack: number;
  labelsToIgnore: string[];
  overrideRepo?: string;
  overrideOwner?: string;
}
