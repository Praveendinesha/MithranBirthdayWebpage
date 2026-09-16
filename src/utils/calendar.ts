export interface CalendarEventParams {
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
}

export const createGoogleCalendarUrl = (params: CalendarEventParams): string => {
  const formatUtc = (date: Date): string => {
    return date.toISOString().replace(/-|:|\.\d+/g, '');
  };

  const start = formatUtc(params.startDate);
  const end = formatUtc(params.endDate);

  const url = new URL('https://calendar.google.com/calendar/render');
  url.searchParams.append('action', 'TEMPLATE');
  url.searchParams.append('text', params.title);
  url.searchParams.append('dates', `${start}/${end}`);
  url.searchParams.append('details', params.description);
  url.searchParams.append('location', params.location);

  return url.toString();
};

export const downloadIcsFile = (params: CalendarEventParams) => {
  const formatUtc = (date: Date): string => {
    return date.toISOString().replace(/-|:|\.\d+/g, '');
  };

  const icsData = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Prince Liam 1st Birthday//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:${params.title}`,
    `DESCRIPTION:${params.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${params.location}`,
    `DTSTART:${formatUtc(params.startDate)}`,
    `DTEND:${formatUtc(params.endDate)}`,
    `STATUS:CONFIRMED`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'Prince_Liam_1st_Birthday.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
