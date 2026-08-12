// The server works exclusively in GMT, while JavaScript Date is bound to the
// browser's local timezone. These helpers shift dates by the timezone offset
// so that the *local* components of every Date equal the GMT wall-clock. In
// effect the local timezone is treated as if it were GMT, making all date
// handling timezone-independent.
//
// Use fromGMT when a date arrives from the server (an epoch in GMT) and
// toGMT when a date is sent to the server.

export function fromGMT(gmtEpoch: number): Date {
  return new Date(gmtEpoch + new Date(gmtEpoch).getTimezoneOffset() * 60000);
}

export function toGMT(date: Date): number {
  return date.getTime() - date.getTimezoneOffset() * 60000;
}
