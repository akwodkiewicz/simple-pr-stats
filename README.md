# simple-pr-stats

Calculate simple PR statistics in your repository.

## Output

The stats contain:

- average time of PR completion
- minimum time of PR completion (with a link to the PR)
- maximum time of PR completion (with a link to the PR)

The information is shown as workflow run annotations in the _Actions_ tab and (optionally) in the _Pull Request_ view (if a `pull_request` trigger was chosen to run the action).

## Inputs

### `token`

**Required** Your workflow `GITHUB_TOKEN`, allowing access to GitHub API

### `labels_to_ignore`

Comma-delimited list of labels to ignore.
The stats will ignore all the PRs that are marked with any of the provided labels.

### `days_back`

The stats will only include PRs between the date `days_back` days ago and now. Does **not** have to be an integer.

Default: 30

### `include_drafts`

If set to `true`, the stats will include draft PRs.

Default: `false`

## Example usage

```
on:
  schedule:
    - cron: '0 8 * * *'

jobs:
  calculate-stats:
    runs-on: ubuntu-latest
    steps:
      - name: Run simple-pr-stats
        uses: akwodkiewicz/simple-pr-stats@v0.1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          labels_to_ignore: label with spaces, release
```
