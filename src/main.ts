import { format } from "./github.ts";
import type { Event, Options } from "./github.ts";
import { getOptions } from "./utils.ts";

/**
 * Github Activity
 * {@link https://roadmap.sh/projects/github-user-activity | Roadmap.sh}
 *
 * @module
 */

/**
 * Fetch github api for events for username.
 * By default 30 items per page in plain text format
 * Check Options type to change behaviour
 *
 * @param username A valid github username.
 * @param options Pagination, format and filters.
 * @returns Events such as Push, Commit, PR, etc.
 */
const githubActivity = async (
  username: string,
  options?: Options,
): Promise<string> => {
  const params = new URLSearchParams({
    "per_page": options?.perPage.toString() || "30",
    "page": options?.page.toString() || "1",
  });
  const url = new URL(
    `https://api.github.com/users/${username}/events?${params.toString()}`,
  );
  const response = await fetch(url);
  if (response.status != 200) {
    throw new Error(`Not a user on github: ${username}`);
  }
  const events: Event[] = await response.json();
  return format(events, options?.format, options?.filters);
};

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  try {
    const options = getOptions();
    const username = options?.username as string;
    const activity = await githubActivity(username, options);

    if (options?.format === "table") {
      const data = activity.split("\n");
      console.table(data.map((row) => row.split(",")));
      Deno.exit();
    }
    console.log(activity);
  } catch (e) {
    console.error((e as Error).message);
    Deno.exit(1);
  }
}

export default githubActivity;
