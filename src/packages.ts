export const defaultDependencies = ["react", "react-dom"]

export const defaultDevDependencies = [
  "@types/react",
  "@types/react-dom",
  "typescript",
  "@tsconfig/vite-react",
  "vite",
  "vitest",
  "@vitejs/plugin-react-swc",
  "eslint@8.57.0",
  "eslint-config-react-app",
  "simple-git-hooks",
  "lint-staged",
  "prettier",
]

export const PACKAGES: { [name: string]: string[] } = {
  "@tanstack/react-query": [],
  "@tanstack/react-query-persist-client": [],
  "@tanstack/query-sync-storage-persister": [],
  "@lukemorales/query-key-factory": [],
  "react-router-dom": [],
  "react-hook-form": [],
  "@hookform/resolvers": [],
  "react-error-boundary": [],
  recoil: [],
  ramda: ["@types/ramda"],
  clsx: [],
  ky: [],
  zod: [],
  rxjs: [],
  "date-fns": [],
  "bignumber.js": [],
  "@mantine/core": ["postcss", "postcss-preset-mantine"],
  "@mantine/hooks": [],
  "@mantine/modals": [],
  "@mantine/notifications": [],
}
