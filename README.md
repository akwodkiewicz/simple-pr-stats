# pr-stats

Calculate simple PR statistics in your repository.

## Output

The statistics are shown as workflow run annotations in _Actions_ tab and optionally _Pull Request_ view (if a `pull` trigger was chosen to run the action).

## Inputs

## `token`

**Required** Your workflow `GITHUB_TOKEN`, allowing access to GitHub API

## Example usage

```
on:
  schedule:
    - cron: '0 8 * * *'

jobs:
  calculate-stats:
    runs-on: ubuntu-latest
    steps:
      - name: Run pr-stats
        uses: akwodkiewicz/pr-stats@v0.1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
```