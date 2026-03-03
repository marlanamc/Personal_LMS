import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("DailyAnchorsTimeline desktop skip action", () => {
  const filePath = resolve(process.cwd(), "src/components/dashboard/DailyAnchorsTimeline.tsx");
  const source = readFileSync(filePath, "utf8");

  it("uses context menu and prevents bubbling before updating skip status", () => {
    const contextMenuBlock = source.match(
      /onContextMenu=\{\(e\) => \{[\s\S]*?handleToggleSkipToday\(anchor\.id, isSkipped\);[\s\S]*?\}\}/,
    )?.[0];

    expect(contextMenuBlock).toBeTruthy();
    expect(contextMenuBlock).toContain("e.preventDefault();");
    expect(contextMenuBlock).toContain("e.stopPropagation();");
    expect(contextMenuBlock).toContain("handleToggleSkipToday(anchor.id, isSkipped);");
  });

  it("exposes a right-click hint title on desktop anchor", () => {
    expect(source).toContain("title={isSkipped ? 'Right-click to undo skip' : 'Right-click to skip today'}");
  });
});
