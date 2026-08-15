import { io, type Socket } from 'socket.io-client';
import { PUBLIC_RADIOCULT_API_KEY, PUBLIC_API_URL, PUBLIC_STATION_ID } from '$env/static/public';

const SOCKET_BASE = 'https://api.radiocult.fm';

export type LiveStatus = 'schedule' | 'offAir' | 'defaultPlaylist';

export type LiveMetadata = {
	title: string;
	artist?: string;
	album?: string;
	duration?: number;
	playoutStartUnixTimestamp?: number;
	artwork?: Record<string, string | undefined>;
};

export type LiveContent = Record<string, unknown>;

type LivePayload = {
	status: LiveStatus;
	content: LiveContent;
	metadata: LiveMetadata;
};

class NowPlaying {
	status: LiveStatus | undefined = $state(undefined);
	content: LiveContent | undefined = $state(undefined);
	metadata: LiveMetadata | undefined = $state(undefined);
	streamingUrl: string | undefined = $state(undefined);
	error: string | undefined = $state(undefined);

	#socket: Socket | undefined;
	#started = false;

	start() {
		if (this.#started || typeof window === 'undefined') {
			return;
		}
		this.#started = true;

		this.#loadInitialState();
		this.#connectSocket();
    }

    isOnAir() {
        return this.metadata?.title === "Live"
	}

	async #loadInitialState() {
		try {
			const [stationResponse, liveResponse] = await Promise.all([
				fetch(PUBLIC_API_URL, {
					headers: { 'x-api-key': PUBLIC_RADIOCULT_API_KEY }
				}),
				fetch(`${PUBLIC_API_URL}/schedule/live`, {
					headers: { 'x-api-key': PUBLIC_RADIOCULT_API_KEY }
				})
			]);

			if (stationResponse.ok) {
				const { station } = await stationResponse.json();
				this.streamingUrl = station?.channels?.[0]?.streamingUrl;
			}

			if (liveResponse.ok) {
				const { result } = await liveResponse.json();
				this.#applyUpdate(result);
			}
		} catch (err) {
			this.error = err instanceof Error ? err.message : 'Failed to load now playing data';
		}
	}

	#connectSocket() {
		this.#socket = io(SOCKET_BASE, {
			auth: { 'x-api-key': PUBLIC_RADIOCULT_API_KEY },
			transports: ['websocket'],
			query: { stationId: PUBLIC_STATION_ID }
		});

		this.#socket.on('player-metadata', (payload: LivePayload) => {
			this.#applyUpdate(payload);
		});
	}

	#applyUpdate(data: LivePayload) {
		this.status = data.status;
		this.content = data.content;
		this.metadata = data.metadata;
		this.error = undefined;
	}
}

export const nowPlaying = new NowPlaying();
