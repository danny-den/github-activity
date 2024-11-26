import mod from "../deno.json" with { "type": "json" };
import { parseArgs } from "jsr:@std/cli/parse-args";
import type { Filter, Format, Options } from "./github.ts";

type ExtendedOptions = Options & { username: string };

export const getOptions = (): ExtendedOptions | undefined => {
  const flags = parseArgs(Deno.args, {
    boolean: [
      "h",
      "help",
      "v",
      "version",
      "cache",
      "filter-out",
      "show-filters",
      "show-formats",
    ],
    string: ["filter", "format", "page", "per-page"],
    default: {
      cache: true,
      filter: "",
      "filter-out": false,
      format: "text",
      page: "1",
      "per-page": "30",
    },
    negatable: ["cache"],
  });

  if (flags.help || flags.h) {
    console.log(help());
    Deno.exit();
  }

  if (flags.version || flags.v) {
    console.log(help());
    Deno.exit();
  }

  if (flags["show-filters"]) {
    console.log(showFilters());
    Deno.exit();
  }

  if (flags["show-formats"]) {
    console.log(showFormats());
    Deno.exit();
  }

  const username = flags._[0] as string;
  if (!username) {
    throw new TypeError(
      "No username provided: try github-activity kamranahmedse",
    );
  }

  const options: ExtendedOptions = {
    cache: flags.cache,
    filters: {
      keys: flags.filter.split(",") as unknown as Filter[],
      filterOut: flags["filter-out"],
    },
    format: flags.format as unknown as Format,
    perPage: parseInt(flags["per-page"]),
    page: parseInt(flags.page),
    username,
  };

  return options;
};

export const help = () =>
  `github-activity: Use GitHub API to fetch user activity and display it in the terminal
Read more: https://roadmap.sh/projects/github-user-activity

Get pr and issue events from the last 100 events of username in a json
github-activity --filter pr,issue --format json kamranahmedse 

Usage: github-activity [OPTIONS] [USERNAME]

Arguments:
  [USERNAME]  A github username

Options:
      --cache         Uses cache if possible. Default: true
      --filter        Filters by event type with comma separed keys
                      List all event keys with --show-filters
      --filter-out    Opposite match for filtered keys
      --format        Formats output. Default: text
                      List all formats with --show-formats
  -h, --help          Shows this help message
      --no-cache      Same as --cache=false
      --page          Github events api page number. Default: 1
      --per-page      Github events api page size. Default: 30 
      --show-filters  Prints available filters
      --show-formats  Prints available formats
  -v, --version       Shows github-activity version
`;

export const version = () => {
  const version: string[][] = [];
  if (Deno !== undefined) version.push(...Object.entries(Deno.version));
  const modVersion = ["githubActivity", mod.version];
  version.push(modVersion);
  return version.join("\n");
};

export const showFilters = () =>
  `Available filtering keys:
commit-comment,create,delete,fork,gollum,issue-comment,issue,member,public,pr,pr-review,pr-review-comment,pr-review-thread,push,release,sponsor,watch

Usage: 
  github-activity --filter=pr,issue
  github-activity --filter pr-review,pr-review-comment
  github-activity --filter issue,issue-comment --filter-out # Anything but issue events
`;

export const showFormats = () =>
  `Available formats:
text(default) or table or json or csv`;
