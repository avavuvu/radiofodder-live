import { DateTime, Info } from "luxon";
import type { ScheduleEvent } from "./scheduleTypes";

export type FormattedScheduleEvent = {
    type: "schedule";
    media: string;
    title: string;
    start: DateTime;
    end: DateTime;
    artistId: string | undefined;
    color: string;
}

export type EventDisplay = FormattedScheduleEvent | {
    type: "break";
    start: DateTime;
    end: DateTime;
} | {
    type: "emptyDay";
}


export const convertScheduleData = (schedule: ScheduleEvent): FormattedScheduleEvent => {
    const {
        title,
        description,
        timezone,
        start,
        end,
        artistIds,
        color,
        media,
    } = schedule

    const startDateTime = DateTime.fromISO(start).setZone(timezone);
    const endDateTime = DateTime.fromISO(end).setZone(timezone);

    if (!startDateTime.isValid) {
        console.error(startDateTime, "is invalid!");
        throw new Error("error");
    }

    return {
        title,
        start: startDateTime,
        end: endDateTime,
        artistId: artistIds ? artistIds[0] : undefined,
        color: color || "white",
        media: media.type,
        type: "schedule",
    };
}

type Weekdays = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday"

export const generateScheduleData = (schedules: ScheduleEvent[]) => {
    const firstEvent = schedules.at(0)
    if(!firstEvent) {
        return []
    }

    const firstEventStartTime = DateTime.fromISO(firstEvent.start).setZone(firstEvent.timezone);
    const daysOfWeek: [Weekdays, EventDisplay[]][] = Array.from({length: 7}, (_, index) => {
        const zeroIndexedWeekday = firstEventStartTime.weekday - 1
        const weekdayNumber = (zeroIndexedWeekday + index + 7) % 7
        const weekdayString = Info.weekdays("long", {})[weekdayNumber] as Weekdays

        return [weekdayString, []]
    })

    for (const schedule of schedules) {
        const event = convertScheduleData(schedule)

        const weekday = event.start.weekdayLong!;
        const events = daysOfWeek.find(([day,]) => day === weekday)![1];
        const lastEvent = events.at(-1);

        if (
            lastEvent?.type === "schedule" &&
            event.end.diff(lastEvent.end).as("hours") > 1
        ) {
            events.push({ 
                type: "break",
                start: lastEvent.end,
                end: event.start
            })
        }

        events.push(event);
    }

    return daysOfWeek;
};