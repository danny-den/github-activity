import { eventTemplate } from "./github.ts";
import type { Event, EventDic, EventType } from "./github.ts";

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

const githubActivity = async () => {
  try {
    const username = Deno.args[0];
    if (!username) {
      throw new TypeError("No username provided: try github-activity username");
    }

    const url = new URL(`https://api.github.com/users/${username}/events`);
    const response = await fetch(url);
    if (response.status != 200) {
      throw new Error(`Not a user on github: ${username}`);
    }
    const events: Event[] = await response.json();
    const output = format(events);
    console.log(output);
  } catch (e) {
    if (e instanceof TypeError) {
      if (e.message.startsWith("Invalid URL")) {
        console.warn(
          "Not valid url see: https://developer.mozilla.org/en-US/docs/Web/API/URL/URL",
        );
      }
    }
    console.error((e as Error).message);
    Deno.exit(1);
  }
};

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  await githubActivity();
}
