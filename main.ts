import { eventTemplate } from "./github.ts";
import type { Event, EventDic, EventType } from "./github.ts";

/**
 * Github Activity
 * {@link https://roadmap.sh/projects/github-user-activity | Roadmap.sh}
 *
 * @module
 */

const count = (events: Event[]): EventDic => {
  const dic = {} as EventDic;
  for (const { type, repo } of events) {
    const { name } = repo;
    if (!dic[type]) dic[type] = {};
    if (!dic[type][name]) dic[type][name] = 0;
    dic[type][name] += 1;
  }
  return dic;
};

const format = (events: Event[]): string => {
  const eventsDic = count(events);
  const messages: string[] = [];
  for (
    const [eventType, event] of Object.entries(eventsDic) as [
      eventType: EventType,
      event: Record<string, number>,
    ][]
  ) {
    for (const [name, count] of Object.entries(event)) {
      const message = eventTemplate[eventType]({ count, name });
      messages.push(message);
    }
  }
  return messages.join("\n");
};

/**
 * Fetch github api for events for username.
 * By default 30 items per page
 *
 * @param username A valid github username.
 * @returns Events such as Push, Commit, PR, etc.
 */
const githubActivity = async (username: string): Promise<string> => {
    const url = new URL(`https://api.github.com/users/${username}/events`);
    const response = await fetch(url);
    if (response.status != 200) {
      throw new Error(`Not a user on github: ${username}`);
    }
    const events: Event[] = await response.json();
    return format(events);
};

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  try {
    const username = Deno.args[0];
    if (!username) {
      throw new TypeError("No username provided: try github-activity kamranahmedse");
    }

    const activity = await githubActivity(username);
    console.log(activity)
  } catch (e) {
    console.error((e as Error).message);
    Deno.exit(1);
  }
}

export default githubActivity
