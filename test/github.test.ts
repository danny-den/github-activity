import { assertEquals } from "@std/assert";

import { describe, it } from "@std/testing/bdd";

import sample from "./sample.json" with { "type": "json" };

import { count, type Event, format } from "../src/github.ts";

describe("github functions", () => {
  describe("count", () => {
    it("should return a dictionary by event and repo with count", () => {
      const sampleArray: Event[] = sample as Event[];
      assertEquals(sampleArray.length, 9);
      const dic = count(sampleArray);
      const repo = "kamranahmedse/developer-roadmap";
      assertEquals(dic.PushEvent[repo], 2);
      assertEquals(dic.PullRequestEvent[repo], 1);
      assertEquals(dic.IssueCommentEvent[repo], 2);
      assertEquals(dic.PullRequestReviewCommentEvent[repo], 1);
      assertEquals(dic.PullRequestReviewEvent[repo], 1);
      assertEquals(dic.IssuesEvent[repo], 2);
    });

    it("should only filter-in events", () => {
      const sampleArray: Event[] = sample as Event[];
      assertEquals(sampleArray.length, 9);
      const dic = count(sampleArray, false, [
        "PullRequestEvent",
        "IssuesEvent",
      ]);
      const repo = "kamranahmedse/developer-roadmap";
      assertEquals(dic.PushEvent, undefined);
      assertEquals(dic.PullRequestEvent[repo], 1);
      assertEquals(dic.IssueCommentEvent, undefined);
      assertEquals(dic.PullRequestReviewCommentEvent, undefined);
      assertEquals(dic.PullRequestReviewEvent, undefined);
      assertEquals(dic.IssuesEvent[repo], 2);
    });

    it("should only filter-out events", () => {
      const sampleArray: Event[] = sample as Event[];
      assertEquals(sampleArray.length, 9);
      const dic = count(sampleArray, true, ["PullRequestEvent", "IssuesEvent"]);
      const repo = "kamranahmedse/developer-roadmap";
      assertEquals(dic.PushEvent[repo], 2);
      assertEquals(dic.PullRequestEvent, undefined);
      assertEquals(dic.IssueCommentEvent[repo], 2);
      assertEquals(dic.PullRequestReviewCommentEvent[repo], 1);
      assertEquals(dic.PullRequestReviewEvent[repo], 1);
      assertEquals(dic.IssuesEvent, undefined);
    });
  });

  describe("format", () => {
    it("should return a well formatted message with counts", () => {
      const sampleArray: Event[] = sample as Event[];
      assertEquals(sampleArray.length, 9);
      const output = format(sampleArray);
      const expected = `Pushed 2 commits to kamranahmedse/developer-roadmap
Made a pull request in kamranahmedse/developer-roadmap
Made 2 comments in kamranahmedse/developer-roadmap
Reviewed a comment in kamranahmedse/developer-roadmap
Reviewed a pull request in kamranahmedse/developer-roadmap
Opened 2 issues in kamranahmedse/developer-roadmap`;
      assertEquals(output, expected);
    });

    it("should return only specified keys", () => {
      const sampleArray: Event[] = sample as Event[];
      assertEquals(sampleArray.length, 9);
      const output = format(sampleArray, "text", { keys: ["pr", "issue"] });
      const expected = `Made a pull request in kamranahmedse/developer-roadmap
Opened 2 issues in kamranahmedse/developer-roadmap`;
      assertEquals(output, expected);
    });
  });
});
