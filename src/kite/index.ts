import { KiteConnect } from "kiteconnect";

export const KITE_API_KEY = process.env.NEXT_PUBLIC_KITE_API_KEY!;

export const KITE_API_KEY_SECRET = process.env.KITE_API_KEY_SECRET!;

const requestToken = "your_request_token";

const kc = new KiteConnect({ api_key: KITE_API_KEY });

export default kc;
