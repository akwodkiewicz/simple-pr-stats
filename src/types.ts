import type { getOctokit } from "@actions/github";

export type Pull = Awaited<
  ReturnType<ReturnType<typeof getOctokit>["rest"]["pulls"]["list"]>
>["data"][number];
