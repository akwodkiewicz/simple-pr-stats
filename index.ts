import * as core from '@actions/core';
import * as github from '@actions/github';

type Pull = Awaited<ReturnType<ReturnType<typeof github['getOctokit']>['rest']['pulls']['list']>>['data'][number];

async function main() {
    const token = core.getInput('token');
    const octokit = github.getOctokit(token);

    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
    const thresholdDate = new Date(Date.now() - THIRTY_DAYS);
    const pulls: Pull[] = [];

    for await (const response of octokit.paginate.iterator(octokit.rest.pulls.list, {
        owner: 'facebook',
        repo: 'jest',
        state: 'all',
        sort: 'created',
        direction: 'desc'
    })) {
        const pullsAboveThreshold = response.data.filter((d: Pull) => new Date(d.created_at) >= thresholdDate);
        pulls.push(...pullsAboveThreshold);
        if (pullsAboveThreshold.length < response.data.length) {
            break;
        }
    }


    const durationsMs = pulls.map(getPullDurationMs);
    const avgMs = durationsMs.slice(1).reduce((prev, curr, idx) => {
        return (prev * idx + curr) / (idx + 1);
    }, durationsMs[0]);
    core.info(`Found ${pulls.length} pull request created after ${thresholdDate}`);
    core.info(`Average active time: ${msToDays(avgMs)} d`);
    core.info(`Minimum active time: ${msToDays(Math.min(...durationsMs))} d`);
    core.info(`Maximum active time: ${msToDays(Math.max(...durationsMs))} d`);
}

function getPullDurationMs(pull: Pull): number {
    return new Date(pull.closed_at ?? pull.merged_at ?? Date.now()).valueOf() - new Date(pull.created_at).valueOf();
}

function msToDays(ms: number): number {
    return Math.round((ms / (1000 * 60 * 60 * 24)) * 100) / 100;
}

main();