import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export class ApiError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function toErrorContext(error: ApiError) {
  return {
    status: error.status,
    code: error.code,
    details: error.details,
  };
}

export function handleApiError(error: unknown, context: string) {
  if (error instanceof ApiError) {
    if (error.status >= 500) {
      logger.error(context, error, toErrorContext(error));
    } else {
      logger.warn(context, toErrorContext(error));
    }

    const safeMessage =
      error.status >= 500 && process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : error.message;

    return NextResponse.json(
      {
        error: safeMessage,
        code: error.code,
      },
      { status: error.status }
    );
  }

  logger.error(context, error);

  return NextResponse.json(
    {
      error: error instanceof Error ? error.message : "Something went wrong",
      stack: error instanceof Error ? error.stack : undefined,
      code: "internal_error",
    },
    { status: 500 }
  );
}
