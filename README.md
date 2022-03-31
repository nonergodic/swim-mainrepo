# Swim TypeScript Monorepo

This monorepo setup uses Yarn v3 Workspaces without Lerna. Lerna basically uses this Yarn functionality under the hood, adding higher-level features on top, but seems to be under-resourced as a project and has had some trouble meeting community demand. Since Yarn v2, the advantages of Lerna over built-in Yarn features are pretty minimal.

One of the major benefits of Yarn v2+ is its [Plug'n'Play](https://yarnpkg.com/features/pnp) system for making dependency management more sane/efficient. In my experience the npm ecosystem is simply not ready for this as many packages do not conform to the strict standards required (eg specifying all dependencies correctly), but the promise is great. To begin with though, I’ve set the linker to `node-modules` (ie the classic approach we all know and hate).

## Structure

Libraries live in `packages` and applications live in `apps`. As you can see in `apps/example-ui/package.json`, packages can reference each other via the `workspace:` prefix.

## Publish to npm

This approach uses [Lerna-style locked versioning](https://github.com/lerna/lerna#fixedlocked-mode-default), which simplifies a bunch of things at the cost of empty releases for some packages some of the time.

### One-time setup

1. Login using `yarn npm login --publish`

### For every release

1. Run `git clean -xdf ./packages && yarn install && yarn build`
1. `yarn workspaces foreach exec yarn version <strategy>` (See `yarn version --help` for available strategies)
1. Run `git add . && git commit -m "Bump version" && git tag "v<version>`"
1. Either pre-release `yarn publish-next` or stable release `yarn publish-latest`
1. Run `git push && git push --tags`

## To-do

- ESLint
- CLI example
- Consider Yarn’s Plug'n'Play - see [these notes on migrating](https://github.com/cosmos/cosmjs/blob/main/docs/YARN.md#step-14-enable-plug-n-play)
