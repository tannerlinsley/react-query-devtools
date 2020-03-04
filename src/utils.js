import React from 'react'

import { useTheme } from './theme'
import useMediaQuery from './useMediaQuery'

export function getQueryStatusColor(query, theme) {
  return query.state.isFetching
    ? theme.active
    : !query.instances.length
    ? theme.gray
    : query.state.isStale
    ? theme.warning
    : theme.success
}

export function getQueryStatusLabel(query) {
  return query.state.isFetching
    ? 'fetching'
    : !query.instances.length
    ? 'inactive'
    : query.state.isStale
    ? 'stale'
    : 'fresh'
}

export function styled(type, newStyles, queries = {}) {
  return React.forwardRef(({ style, ...rest }, ref) => {
    const theme = useTheme()

    const mediaStyles = Object.entries(queries).reduce(
      (current, [key, value]) => {
        return useMediaQuery(key)
          ? {
              ...current,
              ...(typeof value === 'function' ? value(rest, theme) : value),
            }
          : current
      },
      {}
    )

    return React.createElement(type, {
      ...rest,
      style: {
        ...(typeof newStyles === 'function'
          ? newStyles(rest, theme)
          : newStyles),
        ...style,
        ...mediaStyles,
      },
      ref,
    })
  })
}
