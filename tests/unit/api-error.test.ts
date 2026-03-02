import { describe, expect, it, vi } from "vitest";

const loggerMock = vi.hoisted(() => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/lib/logger", () => loggerMock);

import { ApiError, handleApiError } from "@/lib/api-error";

describe("handleApiError", () => {
  it("returns typed response for ApiError", async () => {
    const response = handleApiError(
      new ApiError(404, "not_found", "Resource not found"),
      "api/test"
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: "Resource not found",
      code: "not_found",
    });
    expect(loggerMock.logger.warn).toHaveBeenCalled();
  });

  it("returns generic 500 for unknown errors", async () => {
    const response = handleApiError(new Error("boom"), "api/test");

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Something went wrong",
      code: "internal_error",
    });
    expect(loggerMock.logger.error).toHaveBeenCalled();
  });
});
