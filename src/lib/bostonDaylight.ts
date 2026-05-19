const BOSTON_LATITUDE = 42.3601;
const BOSTON_LONGITUDE = -71.0589;
const BOSTON_TIME_ZONE = "America/New_York";
const ZENITH_DEGREES = 90.833; // Official sunrise/sunset

type SunEvent = "sunrise" | "sunset";

export interface SunLocation {
  latitude: number;
  longitude: number;
  timeZone: string;
}

export interface SunTimes {
  sunrise: Date;
  sunset: Date;
}

export interface SunTimelineTimes extends SunTimes {
  sunriseMinutes: number;
  sunsetMinutes: number;
}

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

function getZonedDateParts(date: Date, timeZone: string): DateParts {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
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

function getZonedMinutes(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number.parseInt(part.value, 10)]),
  ) as Record<string, number>;

  return values.hour * 60 + values.minute;
}

function calculateSunEventUtc(parts: DateParts, event: SunEvent, location: SunLocation): Date {
  const dayNumber = dayOfYear(parts);
  const lngHour = location.longitude / 15;
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
      sinDeclination * Math.sin(toRadians(location.latitude))) /
    (cosDeclination * Math.cos(toRadians(location.latitude)));

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

export function getSunTimesForLocation(date: Date, location: SunLocation): SunTimes {
  const parts = getZonedDateParts(date, location.timeZone);

  return {
    sunrise: calculateSunEventUtc(parts, "sunrise", location),
    sunset: calculateSunEventUtc(parts, "sunset", location),
  };
}

export function getSunTimelineTimes(date: Date, location: SunLocation): SunTimelineTimes {
  const times = getSunTimesForLocation(date, location);
  return {
    ...times,
    sunriseMinutes: getZonedMinutes(times.sunrise, location.timeZone),
    sunsetMinutes: getZonedMinutes(times.sunset, location.timeZone),
  };
}

function getBostonSunTimes(date: Date): SunTimes {
  return getSunTimesForLocation(date, {
    latitude: BOSTON_LATITUDE,
    longitude: BOSTON_LONGITUDE,
    timeZone: BOSTON_TIME_ZONE,
  });
}

export function isBostonDaylight(date: Date = new Date()): boolean {
  const { sunrise, sunset } = getBostonSunTimes(date);
  const timestamp = date.getTime();

  return timestamp >= sunrise.getTime() && timestamp < sunset.getTime();
}

export function getNextBostonDaylightTransition(date: Date = new Date()): Date {
  const bostonLocation = {
    latitude: BOSTON_LATITUDE,
    longitude: BOSTON_LONGITUDE,
    timeZone: BOSTON_TIME_ZONE,
  };
  const parts = getZonedDateParts(date, bostonLocation.timeZone);
  const { sunrise, sunset } = getBostonSunTimes(date);
  const timestamp = date.getTime();

  if (timestamp < sunrise.getTime()) {
    return sunrise;
  }

  if (timestamp < sunset.getTime()) {
    return sunset;
  }

  const tomorrow = shiftDate(parts, 1);
  return calculateSunEventUtc(tomorrow, "sunrise", bostonLocation);
}
