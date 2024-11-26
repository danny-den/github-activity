import { formatToCsv, formatToJson, formatToText } from "./format.ts";
import type { EventDic, EventType } from "./format.ts";

export type Event = {
  type: EventType;
  repo: {
    name: string;
    url: string;
  };
};

export const eventsFiltersDic: Record<Filter, EventType> = {
  "commit-comment": "CommitCommentEvent",
  "create": "CreateEvent",
  "delete": "DeleteEvent",
  "fork": "ForkEvent",
  "gollum": "GollumEvent",
  "issue-comment": "IssueCommentEvent",
  "issue": "IssuesEvent",
  "member": "MemberEvent",
  "public": "PublicEvent",
  "pr": "PullRequestEvent",
  "pr-review": "PullRequestReviewEvent",
  "pr-review-comment": "PullRequestReviewCommentEvent",
  "pr-review-thread": "PullRequestReviewThreadEvent",
  "push": "PushEvent",
  "release": "ReleaseEvent",
  "sponsor": "SponsorshipEvent",
  "watch": "WatchEvent",
};

export type Filter =
  | "commit-comment"
  | "create"
  | "delete"
  | "fork"
  | "gollum"
  | "issue-comment"
  | "issue"
  | "member"
  | "public"
  | "pr"
  | "pr-review"
  | "pr-review-comment"
  | "pr-review-thread"
  | "push"
  | "release"
  | "sponsor"
  | "watch";

export type Format = "text" | "table" | "json" | "csv";

export type Filters = {
  keys: Filter[];
  filterOut?: boolean;
};

export type Options = {
  cache: boolean;
  filters: Filters;
  format: Format;
  perPage: number;
  page: number;
};

export const format = (
  events: Event[],
  format: Format = "text",
  filters: Filters = { keys: [], filterOut: false },
): string => {
  const eventsFilters = map(filters.keys);
  const eventsDic = count(events, filters.filterOut, eventsFilters);

  const formatsDic = {
    "text": formatToText,
    "table": formatToCsv,
    "json": formatToJson,
    "csv": formatToCsv,
  };

  return formatsDic[format](eventsDic);
};

export const map = (filters: Filter[]): EventType[] => {
  return filters.map((key) => eventsFiltersDic[key]);
};

export const count = (
  events: Event[],
  filterOut: boolean = false,
  eventsFilters?: EventType[],
): EventDic => {
  const dic = {} as EventDic;
  const hasFilters = eventsFilters?.length;

  const createCheckFilter = (filterOut: boolean) => {
    if (filterOut) {
      return (events: EventType[], type: EventType) => events.includes(type);
    }
    return (events: EventType[], type: EventType) => !events.includes(type);
  };

  const checkFilter = createCheckFilter(filterOut);

  for (const { type, repo } of events) {
    const { name } = repo;
    if (hasFilters && checkFilter(eventsFilters, type)) continue;
    if (!dic[type]) dic[type] = {};
    if (!dic[type][name]) dic[type][name] = 0;
    dic[type][name] += 1;
  }
  return dic;
};
