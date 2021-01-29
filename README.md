# Tone Generator

## Abstract
I am a practicing saxophonist. I spend some significant amount of time every day playing long tones (literally just playing a note for an extended period of time to work on tone, intonation, etc.). I found it very helpful to practice along to sine waves as the pure tones helped me naturally focus on intonation. While many tone generating tools exist, none of them worked exactly the way I wanted them to. The Random Sequence Generator was built as a practice aid for a friend. Drones are an alternative long tone practice aid using the more organic sound of a tanpura as opposed to the more specific, but cold pure tones of the Tone Generator. All pitches generated in this project correspond to twelve-tone equal temperament.


## Methodology
Tone Generator relies on the web audio api. Each oscillator is created and added to an array of oscillators with individually manipulatable nodes.
## About Each Page

### Tone Generator
Tone Generator is capable of creating multiple oscillators in which one can set frequency, volume, panning and wave type per generator. One can use the 'Auto Generate Overtones' tool to quickly create multiple oscillators with the pitch automatically set to the closest pitches of the first 3 or 4 overtones in the overtone series based on the selected fundamental. If the frequency does not exactly match the nearest pitch, one can click on the ~ to round the frequency to the nearest pitch. One can also click on the frequency itself to set the frequency manually up to 8 decimal points. 

### Random Sequence Generator
The Random Sequence Generator generates random pitches in sequence based on a number of options available to the user. One is able to set the lower and upper pitch limits of the range manually or by using the instrument selector. Then one can choose the number of pitches to play in a sequence, the speed in beats per minute (BPM) and whether to play an infinite series of pitches, or a single sequence. If one chooses the infinite option, the Random Sequence Generator will play a rest at the set BPM between each sequence of pitches.

Using the Advanced Controls, one can do the following:
-See each pitch as it plays or see a running list of all the pitches played
-Play anywhere from 1-4 intervals at once
-Choose to limit the set of pitches from which the Random Sequence Generator randomly chooses to any major or minor mode as well as a few symmetrical scales



# Svelte Sapper Boilerplate Language

## sapper-template

The default template for setting up a [Sapper](https://github.com/sveltejs/sapper) project. Can use either Rollup or webpack as bundler.


#### Getting started


###### Using `degit`

To create a new Sapper project based on Rollup locally, run

```bash
npx degit "sveltejs/sapper-template##rollup" my-app
```

For a webpack-based project, instead run

```bash
npx degit "sveltejs/sapper-template##webpack" my-app
```

[`degit`](https://github.com/Rich-Harris/degit) is a scaffolding tool that lets you create a directory from a branch in a repository.

Replace `my-app` with the path where you wish to create the project.


###### Using GitHub templates

Alternatively, you can create the new project as a GitHub repository using GitHub's template feature.

Go to either [sapper-template-rollup](https://github.com/sveltejs/sapper-template-rollup) or [sapper-template-webpack](https://github.com/sveltejs/sapper-template-webpack) and click on "Use this template" to create a new project repository initialized by the template.


###### Running the project

Once you have created the project, install dependencies and run the project in development mode:

```bash
cd my-app
npm install ## or yarn
npm run dev
```

This will start the development server on [localhost:3000](http://localhost:3000). Open it and click around.

You now have a fully functional Sapper project! To get started developing, consult [sapper.svelte.dev](https://sapper.svelte.dev).

###### Using TypeScript

By default, the template uses plain JavaScript. If you wish to use TypeScript instead, you need some changes to the project:

 * Add `typescript` as well as typings as dependences in `package.json`
 * Configure the bundler to use [`svelte-preprocess`](https://github.com/sveltejs/svelte-preprocess) and transpile the TypeScript code.
 * Add a `tsconfig.json` file
 * Update the project code to TypeScript

The template comes with a script that will perform these changes for you by running

```bash
node scripts/setupTypeScript.js
```

`@sapper` dependencies are resolved through `src/node_modules/@sapper`, which is created during the build. You therefore need to run or build the project once to avoid warnings about missing dependencies.

The script does not support webpack at the moment.

#### Directory structure

Sapper expects to find two directories in the root of your project —  `src` and `static`.


###### src

The [src](src) directory contains the entry points for your app — `client.js`, `server.js` and (optionally) a `service-worker.js` — along with a `template.html` file and a `routes` directory.


######## src/routes

This is the heart of your Sapper app. There are two kinds of routes — *pages*, and *server routes*.

**Pages** are Svelte components written in `.svelte` files. When a user first visits the application, they will be served a server-rendered version of the route in question, plus some JavaScript that 'hydrates' the page and initialises a client-side router. From that point forward, navigating to other pages is handled entirely on the client for a fast, app-like feel. (Sapper will preload and cache the code for these subsequent pages, so that navigation is instantaneous.)

**Server routes** are modules written in `.js` files, that export functions corresponding to HTTP methods. Each function receives Express `request` and `response` objects as arguments, plus a `next` function. This is useful for creating a JSON API, for example.

There are three simple rules for naming the files that define your routes:

* A file called `src/routes/about.svelte` corresponds to the `/about` route. A file called `src/routes/blog/[slug].svelte` corresponds to the `/blog/:slug` route, in which case `params.slug` is available to the route
* The file `src/routes/index.svelte` (or `src/routes/index.js`) corresponds to the root of your app. `src/routes/about/index.svelte` is treated the same as `src/routes/about.svelte`.
* Files and directories with a leading underscore do *not* create routes. This allows you to colocate helper modules and components with the routes that depend on them — for example you could have a file called `src/routes/_helpers/datetime.js` and it would *not* create a `/_helpers/datetime` route.


######## src/node_modules/images

Images added to `src/node_modules/images` can be imported into your code using `import 'images/<filename>'`. They will be given a dynamically generated filename containing a hash, allowing for efficient caching and serving the images on a CDN.

See [`index.svelte`](src/routes/index.svelte) for an example.


######## src/node_modules/@sapper

This directory is managed by Sapper and generated when building. It contains all the code you import from `@sapper` modules.


###### static

The [static](static) directory contains static assets that should be served publicly. Files in this directory will be available directly under the root URL, e.g. an `image.jpg` will be available as `/image.jpg`.

The default [service-worker.js](src/service-worker.js) will preload and cache these files, by retrieving a list of `files` from the generated manifest:

```js
import { files } from '@sapper/service-worker';
```

If you have static files you do not want to cache, you should exclude them from this list after importing it (and before passing it to `cache.addAll`).

Static files are served using [sirv](https://github.com/lukeed/sirv).


#### Bundler configuration

Sapper uses Rollup or webpack to provide code-splitting and dynamic imports, as well as compiling your Svelte components. With webpack, it also provides hot module reloading. As long as you don't do anything daft, you can edit the configuration files to add whatever plugins you'd like.


#### Production mode and deployment

To start a production version of your app, run `npm run build && npm start`. This will disable live reloading, and activate the appropriate bundler plugins.

You can deploy your application to any environment that supports Node 10 or above. As an example, to deploy to [Vercel Now](https://vercel.com) when using `sapper export`, run these commands:

```bash
npm install -g vercel
vercel
```

If your app can't be exported to a static site, you can use the [now-sapper](https://github.com/thgh/now-sapper) builder. You can find instructions on how to do so in its [README](https://github.com/thgh/now-sapper##basic-usage).


#### Using external components

When using Svelte components installed from npm, such as [@sveltejs/svelte-virtual-list](https://github.com/sveltejs/svelte-virtual-list), Svelte needs the original component source (rather than any precompiled JavaScript that ships with the component). This allows the component to be rendered server-side, and also keeps your client-side app smaller.

Because of that, it's essential that the bundler doesn't treat the package as an *external dependency*. You can either modify the `external` option under `server` in [rollup.config.js](rollup.config.js) or the `externals` option in [webpack.config.js](webpack.config.js), or simply install the package to `devDependencies` rather than `dependencies`, which will cause it to get bundled (and therefore compiled) with your app:

```bash
npm install -D @sveltejs/svelte-virtual-list
```


#### Bugs and feedback

Sapper is in early development, and may have the odd rough edge here and there. Please be vocal over on the [Sapper issue tracker](https://github.com/sveltejs/sapper/issues).
