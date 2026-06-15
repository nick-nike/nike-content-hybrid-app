# Budget Project Handover Calendar Standalone

This is a standalone frontend-only copy of the Budget Project Handover Calendar page.

## Local Run

```bash
pnpm install
pnpm run dev -- --host localhost --port 8080
```

Open:

```text
http://localhost:8080/budget-project-calendar
```

The same app also works at the root URL:

```text
http://localhost:8080/
```

## Build for Server Deployment

```bash
pnpm install
pnpm run build
```

Deploy the generated `dist` folder to any static web server.

## Auto Save Behavior

Page edits are automatically saved in the browser through `localStorage`, including:

- Touchbase Date / Checklist / Tech Release
- GW1/2 and GW3/4/5 date changes
- Handover status changes

These saved edits stay in the same browser. They do not automatically sync across computers or browsers.
