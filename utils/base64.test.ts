import { test, expect } from "bun:test"

import { decodeBase64, encodeBase64 } from "./base64"

test("decodes base64 string", () => {
  const str = "こんにちは.png"
  const encodedString = "44GT44KT44Gr44Gh44GvLnBuZw=="

  expect(encodeBase64(str)).toBe(encodedString)
  expect(decodeBase64(encodedString)).toBe(str)
})
