export type EventDic = Record<EventType, Record<string, number>>;

// Tagged Templates See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates
const t = (strings: TemplateStringsArray, ...keys: string[]) => {
  // 'strings' is an array of string literals from the template
  // 'keys' are the placeholders in the template

  return (values: { count: number; name: string }) => {
    // 'values' are the arguments passed when the closure is called
    const dict = values as Record<string, number | string>;

    // Initialize the result array with the first literal string
    const result = [strings[0]];

    // Iterate over each key (placeholder) in the template
    keys.forEach((key, i) => {
      const value = dict[key];
      if (!value) {
        console.warn(key, " is missing");
        return;
      }

      // Append the value and the next literal string to the result
      result.push(value.toString(), strings[i + 1]);
    });

    // Join all parts into a single string and return
    return result.join("");
  };
};

export const eventTemplateDic = {
  "CommitCommentEvent": t`Made ${"count"} commit/s in ${"name"}`,
  "CreateEvent": t`Created a new repo ${"name"}`,
  "DeleteEvent": t`Deleted ${"name"}`,
  "ForkEvent": t`Forked ${"name"}`,
  "GollumEvent": t`Gollum ${"count"}${"name"}`,
  "IssueCommentEvent": t`Made ${"count"} comment/s in ${"name"}`,
  "IssuesEvent": t`Opened ${"count"} issue/s in ${"name"}`,
  "MemberEvent": t`Became a member in ${"name"}`,
  "PublicEvent": t`Made ${"name"} public`,
  "PullRequestEvent": t`Made ${"count"} pull request/s in ${"name"}`,
  "PullRequestReviewEvent": t`Reviewed ${"count"} pull request/s in ${"name"}`,
  "PullRequestReviewCommentEvent":
    t`Reviewed ${"count"} comment/s in ${"name"}`,
  "PullRequestReviewThreadEvent": t`Reviewed ${"count"} threads in ${"name"}`,
  "PushEvent": t`Pushed ${"count"} commit/s to ${"name"}`,
  "ReleaseEvent": t`Made ${"count"} release/s in ${"name"}`,
  "SponsorshipEvent": t`Is now sponsoring ${"name"}`,
  "WatchEvent": t`Is now watching ${"name"}`,
};

export const eventTemplate: Record<
  EventType,
  (values: { count: number; name: string }) => string
> = eventTemplateDic;

export type EventType = keyof typeof eventTemplateDic;

export type Event = {
  type: EventType;
  repo: {
    name: string;
    url: string;
  };
};
