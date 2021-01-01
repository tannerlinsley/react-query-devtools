# DEPRECATED

This repo and package has been deprecated in favor of the new [built-in devtools](https://react-query.tanstack.com/devtools) that ship with React Query v3. This repo will remain here for people still using v2.

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
$ npm i --save react-query-devtools
# or
$ yarn add react-query-devtools
```

Using React Native? Try [react-query-native-devtools](https://github.com/bgaleotti/react-query-native-devtools) instead.

# Usage

By default, React Query Devtools are not imported and used when `process.env.NODE_ENV === 'production'`, so you don't need to worry about excluding them during a production build.

If you want to use the devtools in production, you can manually import them (preferably asynchronously code-split) by importing the `dist/react-query-devtools.production.min.js` file directly.

## Floating Mode

Floating Mode will mount the devtools as a fixed, floating element in your app and provide a toggle in the corner of the screen to show and hide the devtools. This toggle state will be stored and remembered in localStorage across reloads.

Place the following code as high in your React app as you can. The closer it is to the root of the page, the better it will work!

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
- `panelProps: PropsObject`
  - Use this to add props to the panel. For example, you can add `className`, `style` (merge and override default style), etc.
- `closeButtonProps: PropsObject`
  - Use this to add props to the close button. For example, you can add `className`, `style` (merge and override default style), `onClick` (extend default handler), etc.
- `toggleButtonProps: PropsObject`
  - Use this to add props to the toggle button. For example, you can add `className`, `style` (merge and override default style), `onClick` (extend default handler), etc.
- `position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"`
  - Defaults to `bottom-left`
  - The position of the React Query logo to open and close the devtools panel

## Embedded Mode

Embedded Mode will embed the devtools as a regular component in your application. You can style it however you'd like after that!

```js
import { ReactQueryDevtoolsPanel } from 'react-query-devtools'

function App() {
  return (
    <>
      {/* The rest of your application */}
      <ReactQueryDevtoolsPanel style={styles} className={className} />
    </>
  )
}
```

### Options

Use these options to style the dev tools.

- `style: StyleObject`
  - The standard React style object used to style a component with inline styles
- `className: string`
  - The standard React className property used to style a component with classes

<!--  -->
