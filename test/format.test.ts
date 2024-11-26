import { assertEquals } from "@std/assert";

import { describe, it } from "@std/testing/bdd";

import sample from "./sample.json" with { "type": "json" };
import { formatToCsv, formatToJson, t } from "../src/format.ts";
import { count, type Event } from "../src/github.ts";

describe("format functions", () => {
  describe("tagged template", () => {
    it("should return an array with no plurals", () => {
      const tt = t`Made ${"count"} pull requests in ${"name"}`;
      const output = tt({ count: 1, name: "test/test" });
      assertEquals(output, "Made a pull request in test/test");
    });
  });

  describe("non text format", () => {
    it("should return a csv", () => {
      const sampleArray: Event[] = sample as Event[];
      assertEquals(sampleArray.length, 9);
      const dic = count(sampleArray);
      const repo = "kamranahmedse/developer-roadmap";
      const message = formatToCsv(dic);
      assertEquals(message.split("\n")[1], `PushEvent,${repo},2`);
      assertEquals(message.split("\n")[6], `IssuesEvent,${repo},2`);
    });

    it("should return a json", () => {
      const sampleArray: Event[] = sample as Event[];
      assertEquals(sampleArray.length, 9);
      const dic = count(sampleArray);
      const repo = "kamranahmedse/developer-roadmap";
      const json = JSON.parse(formatToJson(dic));
      assertEquals(json[0].event, "PushEvent");
      assertEquals(json[0].repository, repo);
      assertEquals(json[0].count, 2);
    });
  });
});
