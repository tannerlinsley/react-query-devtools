import React from 'react'

const getItem = key => {
  try {
    const val = JSON.parse(localStorage.getItem(key))
    return val
  } catch {
    return undefined
  }
}

export default function useLocalStorage(key, defaultValue) {
  const [value, setValue] = React.useState(() => {
    const val = getItem(key)
    if (typeof val === 'undefined') {
      return typeof defaultValue === 'function' ? defaultValue() : defaultValue
    }
    return val
  })

  const setter = React.useCallback(
    updater => {
      setValue(old => {
        let newVal = updater

        if (typeof updater == 'function') {
          newVal = updater(old)
        }

        localStorage.setItem(key, newVal)

        return newVal
      })
    },
    [key]
  )

  return [value, setter]
}
