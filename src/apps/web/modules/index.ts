import { concat } from "lodash";

import { Route } from "@web/lib/types/route";

import QuizRoutes from "./quiz/index";

export const getAllRoutes = (): Route[] => concat(QuizRoutes());
