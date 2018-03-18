import * as moment from "moment";

export const longDate = (iso8601Date: string) => moment(iso8601Date).format("D. MMMM, H:mm");
export const timeOnly = (iso8601Date: string) => moment(iso8601Date).format("H:mm");
