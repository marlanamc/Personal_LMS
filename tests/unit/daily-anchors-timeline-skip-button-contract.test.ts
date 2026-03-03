import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("DailyAnchorsTimeline desktop skip button", () => {
  const filePath = resolve(process.cwd(), "src/components/dashboard/DailyAnchorsTimeline.tsx");
  const source = readFileSync(filePath, "utf8");

  it("prevents bubbling before updating skip status", () => {
    const desktopSkipButtonBlock = source.match(
      /onClick=\{\(e\) => \{[\s\S]*?handleToggleSkipToday\(anchor\.id, isSkipped\);[\s\S]*?\}\}/,
    )?.[0];

    expect(desktopSkipButtonBlock).toBeTruthy();
    expect(desktopSkipButtonBlock).toContain("e.preventDefault();");
    expect(desktopSkipButtonBlock).toContain("e.stopPropagation();");
    expect(desktopSkipButtonBlock).toContain("handleToggleSkipToday(anchor.id, isSkipped);");
  });

  it("uses skip status label toggle on desktop", () => {
    expect(source).toContain("{isSkipped ? 'Undo skip' : 'Skip today'}");
  });
});
