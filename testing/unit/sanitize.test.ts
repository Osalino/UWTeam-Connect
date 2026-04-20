import { describe, it, expect } from "vitest";
import { sanitizeString } from "../../server/utils/validation";

describe("sanitizeString", () => {
  it("replaces < with &lt;", () => {
    expect(sanitizeString("<div>")).toBe("&lt;div&gt;");
  });

  it("replaces > with &gt;", () => {
    expect(sanitizeString("a > b")).toBe("a &gt; b");
  });

  it("replaces double quotes with &quot;", () => {
    expect(sanitizeString('"hello"')).toBe("&quot;hello&quot;");
  });

  it("replaces single quotes with &#x27;", () => {
    expect(sanitizeString("it's")).toBe("it&#x27;s");
  });

  it("replaces forward slashes with &#x2F;", () => {
    expect(sanitizeString("a/b")).toBe("a&#x2F;b");
  });

  it("trims leading and trailing whitespace", () => {
    expect(sanitizeString("  hello world  ")).toBe("hello world");
  });

  it("leaves safe strings unchanged", () => {
    expect(sanitizeString("Hello World 123")).toBe("Hello World 123");
  });

  it("neutralises a full XSS attack string", () => {
    const xss = '<script>alert("xss")</script>';
    const result = sanitizeString(xss);
    expect(result).not.toContain("<");
    expect(result).not.toContain(">");
    expect(result).not.toContain('"');
  });

  it("handles an empty string", () => {
    expect(sanitizeString("")).toBe("");
  });

  it("handles strings with only whitespace", () => {
    expect(sanitizeString("   ")).toBe("");
  });
});
