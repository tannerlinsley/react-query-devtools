# Changelog

## 1.1.5

- Added default styles for inputs and select boxes
- Fixed a bug where `match-sorter` was not a dependency

## 1.1.4

- Added the ability to filter the query list

## 1.1.2 - 1.1.3

- Updated the global package namespace from `ReactQuery` to `ReactQueryDevtools`

## 1.1.1

- Fixed an issue where arrow functions were present in the production placeholder build

## 1.1.0

- Added the ability to add props to all three internal dev tools components
- Fixed an issue where z-index was not initially set to something very high

## 1.0.13

- Better overflow styles
- No more useLayoutEffect warnings in non-window environments like Next.js

## 1.0.12

- Prevent queries header from scrolling

## 1.0.11

- No text shadow on stale indicators

## 1.0.10

- Fix instance count styles

## 1.0.9

- Default sort by status
- Add instance count next to query

## 1.0.8

- Sort by status is now fixed for fresh queries

## 1.0.7

- Buttons now use a pointer cursor style

## 1.0.6

- Removes Codemirror Editing until a non-css-file based solution can be found

## 1.0.5

- Fixes an issue where localStorage could not be accessed and would crash
- Removes some stray logging

## 1.0.4

- Fix: Devtools will import noop components during production by default. Updated Readme with information on how to use in production as well.

## 1.0.3

- Styles: Toggle button has less of a text-shadow now

## 1.0.2

Initial Release!
