const BOSTON_LATITUDE = 42.3601;
const BOSTON_LONGITUDE = -71.0589;
const ZENITH_DEGREES = 90.833; // Official sunrise/sunset

type SunEvent = "sunrise" | "sunset";

interface DateParts {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
}

function normalizeDegrees(value: number): number {
  return (value % 360 + 360) % 360;
}

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function toDegrees(value: number): number {
  return (value * 180) / Math.PI;
}

function dayOfYear(parts: DateParts): number {
  const now = Date.UTC(parts.year, parts.month - 1, parts.day);
  const start = Date.UTC(parts.year, 0, 0);
  return Math.floor((now - start) / 86_400_000);
}

function shiftDate(parts: DateParts, days: number): DateParts {
  const shifted = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + days));
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
  };
}

function getBostonDateParts(date: Date): DateParts {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number.parseInt(part.value, 10)]),
  ) as Record<string, number>;

  return {
    year: values.year,
    month: values.month,
    day: values.day,
  };
}

function calculateSunEventUtc(parts: DateParts, event: SunEvent): Date {
  const dayNumber = dayOfYear(parts);
  const lngHour = BOSTON_LONGITUDE / 15;
  const timeGuess =
    dayNumber + (event === "sunrise" ? (6 - lngHour) / 24 : (18 - lngHour) / 24);

  const meanAnomaly = 0.9856 * timeGuess - 3.289;
  const trueLongitude = normalizeDegrees(
    meanAnomaly +
      1.916 * Math.sin(toRadians(meanAnomaly)) +
      0.02 * Math.sin(toRadians(2 * meanAnomaly)) +
      282.634,
  );

  let rightAscension = toDegrees(Math.atan(0.91764 * Math.tan(toRadians(trueLongitude))));
  rightAscension = normalizeDegrees(rightAscension);

  const trueLongitudeQuadrant = Math.floor(trueLongitude / 90) * 90;
  const rightAscensionQuadrant = Math.floor(rightAscension / 90) * 90;
  rightAscension += trueLongitudeQuadrant - rightAscensionQuadrant;
  rightAscension /= 15;

  const sinDeclination = 0.39782 * Math.sin(toRadians(trueLongitude));
  const cosDeclination = Math.cos(Math.asin(sinDeclination));

  const cosLocalHourAngle =
    (Math.cos(toRadians(ZENITH_DEGREES)) -
      sinDeclination * Math.sin(toRadians(BOSTON_LATITUDE))) /
    (cosDeclination * Math.cos(toRadians(BOSTON_LATITUDE)));

  if (cosLocalHourAngle > 1 || cosLocalHourAngle < -1) {
    return new Date(Date.UTC(parts.year, parts.month - 1, parts.day, event === "sunrise" ? 6 : 18));
  }

  let localHourAngle =
    event === "sunrise"
      ? 360 - toDegrees(Math.acos(cosLocalHourAngle))
      : toDegrees(Math.acos(cosLocalHourAngle));
  localHourAngle /= 15;

  const localMeanTimeRaw =
    localHourAngle + rightAscension - 0.06571 * timeGuess - 6.622;
  const localMeanTime = ((localMeanTimeRaw % 24) + 24) % 24;
  const utcHourRaw = localMeanTime - lngHour;
  const dayOffset = Math.floor(utcHourRaw / 24);
  const utcHour = ((utcHourRaw % 24) + 24) % 24;

  return new Date(
    Date.UTC(parts.year, parts.month - 1, parts.day + dayOffset) +
      Math.round(utcHour * 3_600_000),
  );
}

function getSunTimes(date: Date): { sunrise: Date; sunset: Date } {
  const parts = getBostonDateParts(date);

  return {
    sunrise: calculateSunEventUtc(parts, "sunrise"),
    sunset: calculateSunEventUtc(parts, "sunset"),
  };
}

export function isBostonDaylight(date: Date = new Date()): boolean {
  const { sunrise, sunset } = getSunTimes(date);
  const timestamp = date.getTime();

  return timestamp >= sunrise.getTime() && timestamp < sunset.getTime();
}

export function getNextBostonDaylightTransition(date: Date = new Date()): Date {
  const parts = getBostonDateParts(date);
  const { sunrise, sunset } = getSunTimes(date);
  const timestamp = date.getTime();

  if (timestamp < sunrise.getTime()) {
    return sunrise;
  }

  if (timestamp < sunset.getTime()) {
    return sunset;
  }

  const tomorrow = shiftDate(parts, 1);
  return calculateSunEventUtc(tomorrow, "sunrise");
}
