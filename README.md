# Tech Stack: React + Vite + Typescript

## Overview

Small DeFi application. Connects to the injected MetaMask provider. It uses the MakerDAO protocol to read CDP vault data based on entered collateral type and CDP ID.

## Initialization instructions

The basics - install dependencies and then run the `dev` script:

```bash
npm i
#
# ============================= NOTE =============================
#
# @typehcain/web3-v1 has an older version web3 package dependency
# This means that we potentially have to add the --legacy-peer-deps
# flag when installing the node modules.
# This does not appear to break the application at this time.
#
npm run dev
```

Modified behavior - the `run` script contains an invocation to the `typechain` tool, which generates our ABI types, and outputs them in the `src/types/abiTypes` directory.

The ABI type generation can also be manually invoked by running:

```bash
npm run generate-typechain
```

The rest of the `package.json` scripts are the standard `vite` generated scripts for linting and building the project.

## Configuration

The configurable app parameters are located in `config.ts`, where they can be freely changed. They are:

1. CDP_DATA_COUNT - the number of total CDP searched around (including) the CDP ID that was entered in the input
2. MAX_CONCURRENT_RPC_CALLS - Fetching of CDP data is done in batches, to limit the waiting for the RPC calls. This represents the maximum amount of RPC calls that will be batched together at one time.
3. DEBOUNCE_DELAY_MS - The input for the CDP ID debounce delay in milliseconds. This is what toggles the data fetching.
4. ZERO_ADDRESS - This one represents the zero address. If a CDP owner is listed as this address, we consider that CDP non-existent.
5. MOCK_RESOLVE_DELAY_MS - [Development] Only used in development. We are mocking some information fetching (current collateral USD value, and collateral liquidation ratio), and are making them take this amount of time in milliseconds to resolve while rendering the UI.

## Third party libraries

Uses a number of third party libraries. In no particular order:

1. `@defisaver/token` - for the `util` function, which has convenient methods for encoding/decoding between strings and bytes for the CDP `ilk` value, which represents the collateral type.
2. `@esbuild-plugins/node-globals-polyfill` - the `@defisaver/token` functions use the `NodeJS` `Buffer` structure in their implementation, and this plugin makes it available regardless of default browser availability.
3. `@metamask/jazzicons` - the library used to generate the MetaMask account avatar image. Uses the account address as the seed. This is the same library used by MetaMask itself in the background.
4. `@metamask/providers` - used to declare the type of the global `Window` object injected MetaMask provider, so we can check for it's existence and connect to the provider in a typesafe way.
5. `typechain` and `@typechain/web3-v1` - `typechain` is a tool that is used to generate types for us from ABIs. `@typechain/web3-v1` is the tools extension telling it what target library to generate them for. In this case, since we are using `Web3JS`, that is our target.
6. `sass` - `*.scss` preprocessor to write more compact CSS files.
7. `vite-tsconfig-paths` - A `Vite` plugin that automatically mirrors our custom `compilerOptions.paths.*` aliases from the `tsconfig.json` file to our `vite.config.ts` file.

**UNFINISHED**
