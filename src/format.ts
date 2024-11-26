export const replacePlurals = (
  templateStrings: TemplateStringsArray,
  count: number,
): string[] => {
  if (count !== 1) return templateStrings as unknown as string[];

  const plurals = new RegExp(
    /commits|requests|releases|comments|threads|issues/,
  );
  const strings: string[] = [];

  const endsWithPlural = new RegExp(/s$/);
  for (const string of templateStrings) {
    if (string.match(plurals)?.length) {
      const words = string.split(" ");
      const singular = words.map((word) => word.replace(endsWithPlural, ""));
      strings.push(singular.join(" "));
      continue;
    }
    strings.push(string);
  }

  return strings;
};

// Tagged Templates See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates
export const t = (templateStrings: TemplateStringsArray, ...keys: string[]) => {
  // 'strings' is an array of string literals from the template
  // 'keys' are the placeholders in the template

  return (values: { count: number; name: string }) => {
    // 'values' are the arguments passed when the closure is called
    const dict = values as Record<string, number | string>;

    const strings = replacePlurals(templateStrings, values.count);

    // Initialize the result array with the first literal string
    const result = [strings[0]];

    // Iterate over each key (placeholder) in the template
    keys.forEach((key, i) => {
      let value = dict[key];
      if (!value) {
        console.warn(key, " is missing");
        return;
      }

      value = value.toString();
      // Handle count === 1
      value = value === "1" ? "a" : value;

      // Append the value and the next literal string to the result
      result.push(value, strings[i + 1]);
    });

    // Join all parts into a single string and return
    return result.join("");
  };
};

export const eventTemplateDic = {
  "CommitCommentEvent": t`Made ${"count"} commits in ${"name"}`,
  "CreateEvent": t`Created a new repo ${"name"}`,
  "DeleteEvent": t`Deleted ${"name"}`,
  "ForkEvent": t`Forked ${"name"}`,
  "GollumEvent": t`Gollum ${"count"}${"name"}`,
  "IssueCommentEvent": t`Made ${"count"} comments in ${"name"}`,
  "IssuesEvent": t`Opened ${"count"} issues in ${"name"}`,
  "MemberEvent": t`Became a member in ${"name"}`,
  "PublicEvent": t`Made ${"name"} public`,
  "PullRequestEvent": t`Made ${"count"} pull requests in ${"name"}`,
  "PullRequestReviewEvent": t`Reviewed ${"count"} pull requests in ${"name"}`,
  "PullRequestReviewCommentEvent": t`Reviewed ${"count"} comments in ${"name"}`,
  "PullRequestReviewThreadEvent": t`Reviewed ${"count"} threads in ${"name"}`,
  "PushEvent": t`Pushed ${"count"} commits to ${"name"}`,
  "ReleaseEvent": t`Made ${"count"} releases in ${"name"}`,
  "SponsorshipEvent": t`Is now sponsoring ${"name"}`,
  "WatchEvent": t`Is now watching ${"name"}`,
};

export const eventTemplate: Record<
  EventType,
  (values: { count: number; name: string }) => string
> = eventTemplateDic;

export type EventType = keyof typeof eventTemplateDic;

export type EventDic = Record<EventType, Record<string, number>>;

export const formatToText = (eventsDic: EventDic): string => {
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

export const formatToCsv = (eventsDic: EventDic): string => {
  const headers = ["Event", "Repository", "Count"];
  const messages: string[] = [headers.join(",")];
  for (
    const [eventType, event] of Object.entries(eventsDic) as [
      eventType: EventType,
      event: Record<string, number>,
    ][]
  ) {
    for (const [name, count] of Object.entries(event)) {
      const message = [eventType, name, count].join(",");
      messages.push(message);
    }
  }
  return messages.join("\n");
};

export const formatToJson = (eventsDic: EventDic): string => {
  const messages: { event: string; repository: string; count: number }[] = [];
  for (
    const [eventType, event] of Object.entries(eventsDic) as [
      eventType: EventType,
      event: Record<string, number>,
    ][]
  ) {
    for (const [name, count] of Object.entries(event)) {
      const message = { event: eventType, repository: name, count };
      messages.push(message);
    }
  }
  return JSON.stringify(messages);
};
