# MongoDB 500 Error: Causes and Fix

This guide records how the local home page returned HTTP 500 and how to diagnose the same class of problem next time.

## What happened

The `/` route only returns the `welcome` view. The view was not the cause. Laravel failed while initializing services that use the configured database.

There were two related configuration problems:

1. The active `.env` selected `DB_CONNECTION=mongodb`, but `config/database.php` did not define a `mongodb` connection. The MongoDB Laravel package supplies the MongoDB driver, but the application still has to configure the connection. Laravel reported `Database connection [mongodb] not configured`.
2. After adding the connection, MongoDB reported that database `Home` already existed but the application was trying to use `home`. Database names must be used consistently, including their capitalization.

The cache, session, and queue settings also used database-backed drivers. Those services can touch the database even when a route does not query an application model, so a database configuration problem can surface on a simple page.

## The fix

Register the connection in `config/database.php` and map it to the environment variables used by the application:

```php
'mongodb' => [
    'driver' => 'mongodb',
    'dsn' => env('DB_URI', 'mongodb://127.0.0.1:27017'),
    'database' => env('DB_DATABASE', 'laravel'),
    'options' => [
        'appName' => env('APP_NAME', 'laravel'),
    ],
],
```

Then make sure the local `.env` selects that connection and names the database exactly as it exists in MongoDB:

```dotenv
DB_CONNECTION=mongodb
DB_URI=mongodb://127.0.0.1:27017/
DB_DATABASE=Home
```

Use the actual database name for your environment; `Home` is the name used by this local setup. Do not copy a real URI containing credentials into documentation or commit it to source control.

If Laravel has cached configuration, clear it after changing `.env` or `config/database.php`:

```powershell
php artisan config:clear
```

## How to investigate next time

1. Reproduce the failing request and note its URL and HTTP status.
2. Read the latest exception in `storage/logs/laravel.log`. Start with the exception message, not the generic HTTP 500 page.
3. For `Database connection [name] not configured`, compare `DB_CONNECTION` in `.env` with the connection names in `config/database.php`. Confirm the matching database driver package is installed too.
4. For MongoDB errors about a database or collection, check the URI, database name, capitalization, and server availability. MongoDB database names are case-sensitive for this application setup.
5. Check `CACHE_STORE`, `SESSION_DRIVER`, and `QUEUE_CONNECTION`. If any are database-backed, confirm their storage drivers support the selected database and are configured correctly.
6. Clear cached configuration when needed, then verify Laravel can resolve the route and reload the page:

```powershell
php artisan route:list --path=/
```

Finally, request `/` again. If it still fails, inspect the newest log entry because fixing one configuration issue can reveal the next one, as it did here.

## Lessons to keep

- A simple view route can fail because of framework services initialized around the request, not because of the view itself.
- Installing a database integration does not automatically add its connection to the application's `config/database.php`.
- Keep `.env` values consistent with configured drivers and with the exact database names on the server.
- Keep `.env` private. Share exception messages and relevant setting names when asking for help, but redact passwords, tokens, and credential-bearing connection strings.