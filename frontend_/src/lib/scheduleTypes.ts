import type { JSONContent, RadioCultMetadata } from "./types";

export type RadioCultEvent = {
    id: string;
    stationId: string;
    title: string;
    startDateUtc: string;
    endDateUtc: string;
    description?: JSONContent;
    duration: number;
    timezone: string;
    color?: string;
    artistIds?: string[];
    isRecurring: boolean
    media:
    | {
        type: 'mix';
        trackId?: string | undefined;
    }
    | {
        type: 'playlist';
        playlistId: string;
    }
    | {
        type: 'live';
    };
}

// this is just a fix for undocumented stuff that is also included when you get a schedule event
export type ScheduleEvent = RadioCultEvent & {
    start: string,
    end: string,
    scheduleRangeStartUtc: string,
    scheduleRangeEndUtc: string
}

export type LiveData = {
    status: 'schedule'; 
    content: RadioCultEvent; 
    metadata: RadioCultMetadata
}| {
    status: 'offAir'; 
    content: 'Off Air'; 
    metadata: RadioCultMetadata
} | {
    status: 'defaultPlaylist';
    content: {
        name: string;
        numberOfSongs: number;
        duration: number;
    };
    metadata: RadioCultMetadata
} | {
    status: 'loading';
    content: 'Loading';
    metadata: RadioCultMetadata
}