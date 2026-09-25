// The editor's draft readers and the shape a role's chosen kinds are saved in.

import { describe, expect, it } from "vitest";
import { storedKinds, strList } from "@/features/edit-record/editDraft";

describe("strList", () => {
  it("reads a field holding one word as a list of one", () => {
    expect(strList({ employmentType: "contract" }, "employmentType")).toEqual(["contract"]);
  });

  it("reads a list as it stands, dropping anything that is not a word", () => {
    expect(strList({ employmentType: ["contract", 3, "part-time"] }, "employmentType")).toEqual(["contract", "part-time"]);
  });

  it("reads a blank or missing field as no words", () => {
    expect(strList({ employmentType: "" }, "employmentType")).toEqual([]);
    expect(strList({}, "employmentType")).toEqual([]);
  });
});

describe("storedKinds", () => {
  it("drops the field when no kind is chosen, which the door would refuse as an empty list", () => {
    expect(storedKinds([])).toBeUndefined();
  });

  it("stores one kind as a word, the form every older entry uses", () => {
    expect(storedKinds(["part-time"])).toBe("part-time");
  });

  it("stores several kinds as a list", () => {
    expect(storedKinds(["contract", "part-time"])).toEqual(["contract", "part-time"]);
  });
});
