import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export type MyNextMiddleware = (
  request: NextRequest,
  event: NextFetchEvent
) => NextResponse | Promise<NextResponse>;
export type MiddleWareFactory = (
  middleware: MyNextMiddleware
) => MyNextMiddleware;
