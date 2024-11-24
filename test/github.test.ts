import { assertEquals } from "@std/assert";

import { describe, it } from "@std/testing/bdd";

import sample from "./sample.json" with { "type": "json" };

import { count, type Event, format, t } from "../src/github.ts";

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
  });

  describe("tagged template", () => {
    it("should return an array with no plurals", () => {
      const tt = t`Made ${"count"} pull requests in ${"name"}`;
      const output = tt({ count: 1, name: "test/test" });
      assertEquals(output, "Made a pull request in test/test");
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
  });
});
