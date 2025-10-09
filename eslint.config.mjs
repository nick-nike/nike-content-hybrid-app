import { config as base } from '@eds-open/eslint-config-bundle/libs/index.js';
import path from 'path';
import fs from 'fs';

/**
 * Recursively walks `dir`, looking for the first .css file
 * that has a line starting with @import "tailwindcss
 * @param {string} dir  absolute path to start searching from
 * @returns {string|null}  absolute path to matching CSS, or null if none found
 *
 * @example
 * const twCssPath = findTailwindImportCss(process.cwd())
 */
function findTailwindImportCss(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const found = findTailwindImportCss(fullPath);
      if (found) return found;
    } else if (entry.isFile() && entry.name.endsWith(".css")) {
      // read & scan lines
      const lines = fs.readFileSync(fullPath, "utf8").split(/\r?\n/);
      for (let line of lines) {
        if (line.trim().startsWith(`@import 'tailwindcss'`)) {
          return fullPath;
        }
      }
    }
  }

  return null;
}

/**
 * @type {import('eslint').Linter.Config[]}
 */
const config = [
    ...base,
    {
        ignores: ['src/components/ui/**/*.tsx','**/*.d.ts', '**/icon-components/**/*', '**/dist/**/*', 'eslint.config.mjs', 'vite.config.mjs'],
    },
    {
        rules: {
            'max-lines-per-function': ['error', { max: 150, skipBlankLines: true, skipComments: true }],
            '@typescript-eslint/no-use-before-define': 'off',
            '@stylistic/arrow-parens': 'off',
            '@stylistic/brace-style': 'off',
            'eslint-plugin-tailwindcss/*':'off',
        },
    },
    {
        // cosmos files run independently
        files: ['**/*.fixture.tsx', '**/__mocks__/*'],
        rules: {
            'import/no-unused-modules': ['off'],
            'import/no-default-export': ['off'],
        },
    },
    {
        settings: {
            tailwindcss: {
                config: findTailwindImportCss(process.cwd()),
            }
        }
    }
];

export default config;
