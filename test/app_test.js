import { assertExists } from "@std/assert";
import { createApp } from "../src/app.js";

Deno.test("sample", () => {
  assertExists(createApp);
});
