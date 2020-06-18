import React from 'react'
import match from 'match-sorter'
import { useQueryCache } from 'react-query'
import useLocalStorage from './useLocalStorage'

//

import pkg from '../package.json'
import {
  Panel,
  QueryKeys,
  QueryKey,
  Button,
  Code,
  Input,
  Select,
} from './styledComponents'
import { ThemeProvider } from './theme'
import { getQueryStatusLabel, getQueryStatusColor } from './utils'
import Explorer from './Explorer'

const isServer = typeof window === 'undefined'

const theme = {
  background: '#0b1521',
  backgroundAlt: '#132337',
  foreground: 'white',
  gray: '#3f4e60',
  grayAlt: '#222e3e',
  success: '#00ab52',
  danger: '#ff0085',
  active: '#006bff',
  warning: '#ffb200',
}

export function ReactQueryDevtools({
  initialIsOpen,
  panelProps = {},
  closeButtonProps = {},
  toggleButtonProps = {},
}) {
  const rootRef = React.useRef()
  const panelRef = React.useRef()
  const [isOpen, setIsOpen] = useLocalStorage(
    'reactQueryDevtoolsOpen',
    initialIsOpen
  )
  const [isResolvedOpen, setIsResolvedOpen] = React.useState(false)

  React.useEffect(() => {
    setIsResolvedOpen(isOpen)
  }, [isOpen, isResolvedOpen])

  React[isServer ? 'useEffect' : 'useLayoutEffect'](() => {
    if (isResolvedOpen) {
      const previousValue = rootRef.current?.parentElement.style.paddingBottom

      const run = () => {
        const containerHeight = panelRef.current?.getBoundingClientRect().height
        rootRef.current.parentElement.style.paddingBottom = `${containerHeight}px`
      }

      run()

      window.addEventListener('resize', run)

      return () => {
        window.removeEventListener('resize', run)
        rootRef.current.parentElement.style.paddingBottom = previousValue
      }
    }
  }, [isResolvedOpen])

  const { style: panelStyle = {}, ...otherPanelProps } = panelProps
  const {
    style: closeButtonStyle = {},
    onClick: onCloseClick,
    ...otherCloseButtonProps
  } = closeButtonProps
  const {
    style: toggleButtonStyle = {},
    onClick: onToggleClick,
    ...otherToggleButtonProps
  } = toggleButtonProps

  return (
    <div ref={rootRef} className="ReactQueryDevtools">
      {isResolvedOpen ? (
        <ThemeProvider theme={theme}>
          <ReactQueryDevtoolsPanel
            ref={panelRef}
            {...otherPanelProps}
            style={{
              position: 'fixed',
              bottom: '0',
              right: '0',
              zIndex: '99999',
              width: '100%',
              height: '500px',
              maxHeight: '50%',
              boxShadow: '0 0 20px rgba(0,0,0,.3)',
              borderTop: `1px solid ${theme.gray}`,
              ...panelStyle,
            }}
          />
          <Button
            {...otherCloseButtonProps}
            onClick={() => {
              setIsOpen(false)
              onCloseClick && onCloseClick()
            }}
            style={{
              position: 'fixed',
              bottom: '0',
              right: '0',
              zIndex: '99999',
              margin: '.5rem',
              ...closeButtonStyle,
            }}
          >
            Close
          </Button>
        </ThemeProvider>
      ) : (
        <div
          {...otherToggleButtonProps}
          onClick={() => {
            setIsOpen(true)
            onToggleClick && onToggleClick()
          }}
          style={{
            position: 'fixed',
            bottom: '0',
            right: '0',
            zIndex: '99999',
            display: 'inline-block',
            fontSize: '1.5rem',
            margin: '.5rem',
            cursor: 'pointer',
            textShadow: 'rgba(0,0,0,0.4) 0px 5px 10px',
            ...toggleButtonStyle,
          }}
        >
          <span>🎛</span>
        </div>
      )}
    </div>
  )
}

const getStatusRank = q =>
  q.state.isFetching ? 0 : !q.instances.length ? 3 : q.state.isStale ? 2 : 1

const sortFns = {
  'Status > Last Updated': (a, b) =>
    getStatusRank(a) === getStatusRank(b)
      ? sortFns['Last Updated'](a, b)
      : getStatusRank(a) > getStatusRank(b)
      ? 1
      : -1,
  'Query Hash': (a, b) => (a.queryHash > b.queryHash ? 1 : -1),
  'Last Updated': (a, b) => (a.state.updatedAt < b.state.updatedAt ? 1 : -1),
}

export const ReactQueryDevtoolsPanel = React.forwardRef(
  function ReactQueryDevtoolsPanel(props, ref) {

    const queryCache = useQueryCache();

    const [sort, setSort] = useLocalStorage(
      'reactQueryDevtoolsSortFn',
      Object.keys(sortFns)[0]
    )

    const [filter, setFilter] = useLocalStorage('reactQueryDevtoolsFilter', '')

    const [sortDesc, setSortDesc] = useLocalStorage(
      'reactQueryDevtoolsSortDesc',
      false
    )

    const sortFn = React.useMemo(() => sortFns[sort], [sort])

    React[isServer ? 'useEffect' : 'useLayoutEffect'](() => {
      if (!sortFn) {
        setSort(Object.keys(sortFns)[0])
      }
    }, [setSort, sortFn])

    const [unsortedQueries, setUnsortedQueries] = React.useState(
      Object.values(queryCache.queries)
    )

    const [activeQueryHash, setActiveQueryHash] = React.useState(null)

    const queries = React.useMemo(() => {
      const sorted = [...unsortedQueries].sort(sortFn)

      if (sortDesc) {
        sorted.reverse()
      }

      return match(sorted, filter, { keys: ['queryHash'] })
    }, [sortDesc, sortFn, unsortedQueries, filter])

    const [activeQuery, activeQueryJson] = React.useMemo(() => {
      const activeQuery = queries.find(
        query => query.queryHash === activeQueryHash
      )

      return [
        activeQuery,
        activeQuery ? JSON.parse(JSON.stringify(activeQuery, (key, value) => key === 'cache' ? undefined : value)) : null,
      ]
    }, [activeQueryHash, queries])

    const hasFresh = queries.filter(q => getQueryStatusLabel(q) === 'fresh')
      .length
    const hasFetching = queries.filter(
      q => getQueryStatusLabel(q) === 'fetching'
    ).length
    const hasStale = queries.filter(q => getQueryStatusLabel(q) === 'stale')
      .length
    const hasInactive = queries.filter(
      q => getQueryStatusLabel(q) === 'inactive'
    ).length

    React.useEffect(() => {
      return queryCache.subscribe(queryCache => {
        setUnsortedQueries(Object.values(queryCache.queries))
      })
    }, [sort, sortFn, sortDesc])

    React.useEffect(() => {
      if (activeQueryHash && !activeQuery) {
        setActiveQueryHash(null)
      }
    }, [activeQuery, activeQueryHash])

    return (
      <ThemeProvider theme={theme}>
        <Panel ref={ref} className="ReactQueryDevtoolsPanel" {...props}>
          <div
            style={{
              flex: '1 1 50%',
              minHeight: '33%',
              overflow: 'auto',
              borderRight: `1px solid ${theme.grayAlt}`,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                padding: '.5rem',
                background: theme.backgroundAlt,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '1.2rem',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    marginBottom: '.5rem',
                    opacity: 0.3,
                  }}
                >
                  React Query Devtools <small>v{pkg.version}</small>
                </div>
                <div
                  style={{
                    fontWeight: 'bold',
                  }}
                >
                  Queries ({queries.length})
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <QueryKeys style={{ marginBottom: '.5rem' }}>
                  <QueryKey
                    style={{
                      background: theme.success,
                      opacity: hasFresh ? 1 : 0.3,
                    }}
                  >
                    fresh <Code>({hasFresh})</Code>
                  </QueryKey>{' '}
                  <QueryKey
                    style={{
                      background: theme.active,
                      opacity: hasFetching ? 1 : 0.3,
                    }}
                  >
                    fetching <Code>({hasFetching})</Code>
                  </QueryKey>{' '}
                  <QueryKey
                    style={{
                      background: theme.warning,
                      color: 'black',
                      textShadow: '0',
                      opacity: hasStale ? 1 : 0.3,
                    }}
                  >
                    stale <Code>({hasStale})</Code>
                  </QueryKey>{' '}
                  <QueryKey
                    style={{
                      background: theme.gray,
                      opacity: hasInactive ? 1 : 0.3,
                    }}
                  >
                    inactive <Code>({hasInactive})</Code>
                  </QueryKey>
                </QueryKeys>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Input
                    placeholder="Filter"
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Escape') setFilter('')
                    }}
                    style={{
                      flex: '1',
                      marginRight: '.5rem',
                    }}
                  />
                  <Select
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                    style={{
                      flex: '1',
                      marginRight: '.5rem',
                    }}
                  >
                    {Object.keys(sortFns).map(key => (
                      <option key={key} value={key}>
                        Sort by {key}
                      </option>
                    ))}
                  </Select>
                  <Button
                    onClick={() => setSortDesc(old => !old)}
                    style={{
                      padding: '.2rem .4rem',
                    }}
                  >
                    {sortDesc ? '⬇ Desc' : '⬆ Asc'}
                  </Button>
                </div>
              </div>
            </div>
            <div
              style={{
                overflow: 'auto',
              }}
            >
              {queries.map(query => (
                <div
                  key={query.queryHash}
                  onClick={() => setActiveQueryHash(query.queryHash)}
                  style={{
                    display: 'flex',
                    borderBottom: `solid 1px ${theme.grayAlt}`,
                    cursor: 'pointer',
                    background:
                      query === activeQuery
                        ? 'rgba(255,255,255,.1)'
                        : undefined,
                  }}
                >
                  <div
                    style={{
                      flex: '0 0 auto',
                      width: '2rem',
                      height: '2rem',
                      background: getQueryStatusColor(query, theme),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      textShadow:
                        getQueryStatusLabel(query) === 'stale'
                          ? '0'
                          : '0 0 10px black',
                      color:
                        getQueryStatusLabel(query) === 'stale'
                          ? 'black'
                          : 'white',
                    }}
                  >
                    {query.instances.length}
                  </div>
                  <Code
                    style={{
                      padding: '.5rem',
                    }}
                  >
                    {query.queryHash}
                  </Code>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              flex: '1 1 50%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'auto',
            }}
          >
            <div
              style={{
                padding: '.5rem',
                background: theme.backgroundAlt,
              }}
            >
              Query Details
            </div>
            {activeQuery ? (
              <>
                <div
                  style={{
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Code
                    style={{
                      lineHeight: '1.8rem',
                    }}
                  >
                    {activeQuery.queryHash}
                  </Code>
                  <span
                    style={{
                      padding: '0.3rem .6rem',
                      borderRadius: '0.4rem',
                      fontWeight: 'bold',
                      textShadow: '0 2px 10px black',
                      background: getQueryStatusColor(activeQuery, theme),
                      flexShrink: 0,
                    }}
                  >
                    {getQueryStatusLabel(activeQuery)}
                  </span>
                </div>
                <div
                  style={{
                    flex: '1',
                    overflow: 'auto',
                  }}
                >
                  <div
                    style={{
                      background: theme.backgroundAlt,
                      padding: '.5rem',
                    }}
                  >
                    Actions
                  </div>
                  <div
                    style={{
                      padding: '1rem',
                    }}
                  >
                    <Button
                      onClick={() => activeQuery.fetch()}
                      disabled={activeQuery.state.isFetching}
                      style={{
                        background: theme.active,
                      }}
                    >
                      Refetch
                    </Button>{' '}
                    <Button
                      onClick={() =>
                        queryCache.removeQueries(q => q === activeQuery)
                      }
                      style={{
                        background: theme.danger,
                      }}
                    >
                      Remove
                    </Button>{' '}
                  </div>
                  <div
                    style={{
                      background: theme.backgroundAlt,
                      padding: '.5rem',
                    }}
                  >
                    Data Explorer
                  </div>
                  <div
                    style={{
                      padding: '.5rem',
                    }}
                  >
                    <Explorer
                      label="Data"
                      value={activeQueryJson.state.data}
                      defaultExpanded={{}}
                    />
                  </div>
                  <div
                    style={{
                      background: theme.backgroundAlt,
                      padding: '.5rem',
                    }}
                  >
                    Query Explorer
                  </div>
                  <div
                    style={{
                      padding: '.5rem',
                    }}
                  >
                    <Explorer
                      label="Query"
                      value={activeQueryJson}
                      defaultExpanded={{
                        queryKey: true,
                      }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div
                style={{
                  padding: '1rem',
                }}
              >
                Select a query for more info...
              </div>
            )}
          </div>
        </Panel>
      </ThemeProvider>
    )
  }
)
