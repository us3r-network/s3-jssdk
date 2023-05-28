import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export const formatDateFromNow = (date: string | number | Date) =>
  dayjs(date).fromNow();
