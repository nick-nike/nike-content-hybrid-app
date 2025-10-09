# react-project-template

## Features

- PNPM
- Vite
- TailwindCSS v4
- Vitest
- React Router

## Usage

```sh
pnpm install
```

## Development & Build

dev:

```sh
pnpm dev
```

build:

```sh
pnpm build
```

preview after build:

```sh
pnpm preview
```

## Tailwind Support

Here some additional (optional) steps to enable classes autocompletion using `cn` with Tailwind CSS.

<details>
<summary>
  Visual Studio Code
</summary>

1. [Install the "Tailwind CSS IntelliSense" Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

2. Add the following to your [`settings.json`](https://code.visualstudio.com/docs/getstarted/settings):

  ```json
   {
    "tailwindCSS.experimental.classRegex": [
      ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
    ]
   }
  ```
</details>
