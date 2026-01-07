import { DateTime } from "luxon";

export const normalizeDate = (date: Date | string) =>
  DateTime.fromJSDate(new Date(date)).startOf("day").toJSDate();
