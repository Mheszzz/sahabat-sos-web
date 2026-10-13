import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const host = import.meta.env.VITE_REVERB_HOST || window.location.hostname || 'localhost';
const port = parseInt(import.meta.env.VITE_REVERB_PORT || '8080', 10);
const scheme = import.meta.env.VITE_REVERB_SCHEME || 'http';
const key = import.meta.env.VITE_REVERB_APP_KEY || 'sahabat-sos-app-key';

export const echo = new Echo({
  broadcaster: 'reverb',
  key: key,
  wsHost: host,
  wsPort: port,
  wssPort: port,
  forceTLS: scheme === 'https',
  enabledTransports: ['ws', 'wss'],
});

export default echo;
