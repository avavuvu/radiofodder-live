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

export type RadioCultMetadata = {
    title: string;
    filename: string;
    duration: number;
    album: string | undefined;
    artist: string | undefined;
    playoutStartUnixTimestamp: number;
    playoutStartIsoTimestamp: string;
    artwork: {
        original?: string;
        default?: string;
        '32x32'?: string;
        '64x64'?: string;
        '128x128'?: string;
        '256x256'?: string;
        '512x512'?: string;
    } | undefined;
}

export type RadioCultLiveData = {
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
} 

export type CustomShowMetadata = {
    showtime?: string,
    hosts?: string
}

interface TextNode {
    type: 'text';
    text: string;
}

interface ParagraphNode {
    type: 'paragraph';
    content: TextNode[];
}

export type JSONContent =  {
    type: 'doc';
    content: ParagraphNode[];
}


export type Artist = {
    id: string;
    name?: string;
    stationId: string;
    slug?: string;
    socials?: {
        twitterHandle?: string;
        instagramHandle?: string;
        facebook?: string;
        mixcloud?: string;
        soundcloud?: string;
        site?: string;
    };
    shareableLinkId: string;
    description?: JSONContent | undefined;
    logo?: {
        default: string;
        '1024x1024': string;
        '32x32'?: string;
        '64x64'?: string;
        '128x128'?: string;
        '256x256'?: string;
        '512x512'?: string;
    };
    tags: Array<string>;
    genres: Array<string>;
    modified: string;
    created: string;
}