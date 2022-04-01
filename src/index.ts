import * as core from "@actions/core";
import * as github from "@actions/github";
import { dateFilter, draftFilter, labelFilter } from "./filters";
import { parseInput } from "./input";
import { Pull } from "./types";

async function main() {
  const {
    daysBack,
    includeDrafts,
    labelsToIgnore,
    overrideOwner,
    overrideRepo,
    token,
  } = parseInput();

  const octokit = github.getOctokit(token);

  const pulls: Pull[] = [];

  for await (const response of octokit.paginate.iterator(
    octokit.rest.pulls.list,
    {
      owner: overrideOwner ?? github.context.repo.owner,
      repo: overrideRepo ?? github.context.repo.repo,
      state: "all",
      sort: "created",
      direction: "desc",
    }
  )) {
    const pullsBatch: Pull[] = response.data;
    const pullsAfterStartDate = pullsBatch.filter(dateFilter(daysBack));
    pulls.push(
      ...pullsAfterStartDate
        .filter(labelFilter(labelsToIgnore))
        .filter(draftFilter(includeDrafts))
    );
    if (pullsAfterStartDate.length < pullsBatch.length) {
      break;
    }
  }

  const pullsWithDurations = pulls
    .map(attachPullDurationMs)
    .sort((p1, p2) => p1[1] - p2[1]);

  const avgMs = pullsWithDurations
    .map(([p, d]) => d)
    .slice(1)
    .reduce((prev, curr, idx) => {
      return (prev * idx + curr) / (idx + 1);
    }, pullsWithDurations[0][1]);
  core.info(
    `Found ${pulls.length} pull requests created in the last ${daysBack} days`
  );

  core.notice(`Average active time: ${msToDays(avgMs)} d`, {
    title: "Average active time",
  });
  core.notice(
    `Minimum active time: ${msToDays(pullsWithDurations[0][1])} d (${
      pullsWithDurations[0][0].html_url
    })`,
    { title: "Minimum active time" }
  );
  core.notice(
    `Maximum active time: ${msToDays(
      pullsWithDurations[pullsWithDurations.length - 1][1]
    )} d (${pullsWithDurations[pullsWithDurations.length - 1][0].html_url})`,
    { title: "Maximum active time" }
  );
}

function attachPullDurationMs(pull: Pull): [Pull, number] {
  return [
    pull,
    new Date(pull.closed_at ?? pull.merged_at ?? Date.now()).valueOf() -
      new Date(pull.created_at).valueOf(),
  ];
}

function msToDays(ms: number): number {
  return Math.round((ms / (1000 * 60 * 60 * 24)) * 100) / 100;
}

main();
