"use client";

import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@pw/shared";

export const trpc = createTRPCReact<AppRouter>();
