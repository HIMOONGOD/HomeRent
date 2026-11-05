# API integration

Set `VITE_API_BASE_URL` in a local `.env` file to enable API mode. Copy `.env.example` and set the URL for the backend. When it is blank, the current browser-local demo remains active.

The frontend currently expects this REST contract:

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/properties` | Public rental directory |
| POST | `/owner/properties` | Create a rental listing and atomically charge posting credits; request includes `durationMonths` and `creditsToCharge`; response is `{ property, remainingCredits }` |
| DELETE | `/admin/properties/:id` | Remove a listing; requires an admin role |
| POST | `/auth/login` | Sign in; returns `{ accessToken, user }` |
| POST | `/auth/register` | Register; returns `{ accessToken, user }` |
| GET | `/admin/properties` | Admin listing directory; requires an admin role |
| GET | `/admin/overview` | Admin summary metrics; requires an admin role |
| GET | `/admin/owners` | Admin owner directory; requires an admin role |

Auth responses use `user: { id, name, email, role }`. The API client sends the bearer token from session storage on later requests. The backend must enforce owner/admin authorization and validate all input; frontend route visibility is not security. Configure production CORS on the backend to allow the deployed frontend origin.

Posting fee checkout and payment webhooks are intentionally not implemented here. A payment provider and a defined cash price/currency are needed before adding those endpoints. Never put provider secret keys in a `VITE_*` variable; Vite variables are public in the built client.
