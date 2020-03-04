![React Query Header](https://github.com/tannerlinsley/react-query/raw/master/media/header.png)

![React Query Header](https://github.com/tannerlinsley/react-query-devtools/raw/master/media/screenshot.png)

<img src='https://github.com/tannerlinsley/react-query/raw/master/media/logo.png' width='300'/>

Devtools for React Query

<!-- <a href="https://travis-ci.org/tannerlinsley/react-query" target="\_parent">
  <img alt="" src="https://travis-ci.org/tannerlinsley/react-query.svg?branch=master" />
</a> -->
<a href="https://twitter.com/intent/tweet?button_hashtag=TanStack" target="\_parent">
  <img alt="#TanStack" src="https://img.shields.io/twitter/url?color=%2308a0e9&label=%23TanStack&style=social&url=https%3A%2F%2Ftwitter.com%2Fintent%2Ftweet%3Fbutton_hashtag%3DTanStack">
</a><a href="https://bundlephobia.com/result?p=react-query-devtools@latest" target="\_parent">
  <img alt="" src="https://badgen.net/bundlephobia/minzip/react-query-devtools@latest" />
</a><a href="https://spectrum.chat/react-query">
  <img alt="Join the community on Spectrum" src="https://withspectrum.github.io/badge/badge.svg" />
</a><a href="https://github.com/tannerlinsley/react-query-devtools" target="\_parent">
  <img alt="" src="https://img.shields.io/github/stars/tannerlinsley/react-query-devtools.svg?style=social&label=Star" />
</a><a href="https://twitter.com/tannerlinsley" target="\_parent">
  <img alt="" src="https://img.shields.io/twitter/follow/tannerlinsley.svg?style=social&label=Follow" />
</a>

Enjoy this library? Try them all! [React Table](https://github.com/tannerlinsley/react-table), [React Form](https://github.com/tannerlinsley/react-form), [React Charts](https://github.com/tannerlinsley/react-charts)

## Quick Features

- View the cache in realtime
- Inspect core query objects and query data payloads
- Manually refetch, update and remove queries

# Documentation

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Usage](#usage)
  - [Floating Mode](#floating-mode)
  - [Embedded Mode](#embedded-mode)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Installation

```bash
$ npm i --save react-query
# or
$ yarn add react-query
```

# Usage

## Floating Mode

Floating Mode will mount the devtools as a fixed, floating element in your app and provide a toggle in the corner of the screen you can use to show and hide the devtools. This toggle state will be stored and remembered in localStorage across reloads.

Place the following code as high in your React app as you possibly can. The close it is to the root of the page, the better it will work!

```js
import { ReactQueryDevtools } from 'react-query-devtools'

function App() {
  return (
    <>
      {/* The rest of your application */}
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  )
}
```

### Options

- `initialIsOpen: Boolean`
  - Set this `true` if you want the dev tools to default to being open

## Embedded Mode

Embedded Mode will embed the devtools as a regular component in your application. You can style it however you'd like after that!

```js
import { ReactQueryDevtools } from 'react-query-devtools'

function App() {
  return (
    <>
      {/* The rest of your application */}
      <ReactQueryDevtools style={styles} className={className} />
    </>
  )
}
```

### Options

- `style: StyleObject`
  - The standard React style object used to style a component with inline styles
- `className: string`
  - The standard React className property used to style a component with classes
