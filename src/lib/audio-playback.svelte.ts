export type PlaybackState = 'paused' | 'playing' | 'loading';

class AudioPlayback {
	state: PlaybackState = $state('paused');
}

export const audioPlayback = new AudioPlayback();
