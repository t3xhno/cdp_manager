# React + TypeScript + Vite

## Initialization instructions

The basics - install dependencies and the running script:

```bash
npm i
npm run dev
```

What is not out of the box expected behavior - the `run` script contains an invocation to the `typechain` tool, which generates our ABI types, and puts them in the `src/types/abiTypes` directory.

The ABI type generation can also be manually invoked by running:

```bash
npm run typechain
```
