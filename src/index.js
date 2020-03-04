import React from 'react'
import { queryCache } from 'react-query'
import useLocalStorage from './useLocalStorage'
import CodeMirror from 'react-codemirror'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'

//

import { Panel, QueryKeys, QueryKey, Button, Code } from './styledComponents'
import { ThemeProvider, useTheme } from './theme'
import { getQueryStatusLabel, getQueryStatusColor } from './utils'
import Explorer from './Explorer'

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

export function ReactQueryDevtools({ initialIsOpen }) {
  const rootRef = React.useRef()
  const panelRef = React.useRef()
  const [isOpen, setIsOpen] = useLocalStorage(
    'reactQueryDevtoolsOpen',
    initialIsOpen
  )

  React.useLayoutEffect(() => {
    if (isOpen) {
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
  }, [isOpen])

  return (
    <div ref={rootRef} className="ReactQueryDevtools">
      {isOpen ? (
        <ThemeProvider theme={theme}>
          <ReactQueryDevtoolsPanel
            ref={panelRef}
            style={{
              position: 'fixed',
              bottom: '0',
              right: '0',
              width: '100%',
              height: '500px',
              maxHeight: '50%',
              boxShadow: '0 0 20px rgba(0,0,0,.3)',
              borderTop: `1px solid ${theme.gray}`,
            }}
          />
          <Button
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              bottom: '0',
              right: '0',
              margin: '.5em',
            }}
          >
            Close
          </Button>
        </ThemeProvider>
      ) : (
        <div
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '0',
            right: '0',
            display: 'inline-block',
            fontSize: '1.5em',
            margin: '.5em',
            cursor: 'pointer',
            textShadow: '0 0 10px black',
          }}
        >
          <span>🎛</span>
        </div>
      )}
    </div>
  )
}

function getSortedQueries(queryCache) {
  const sortByAccessor = d => d.queryHash

  return Object.values(queryCache.queries).sort(
    (a, b) => sortByAccessor(a) - sortByAccessor(b)
  )
}

export const ReactQueryDevtoolsPanel = React.forwardRef(
  function ReactQueryDevtoolsPanel(props, ref) {
    const [isEditingQuery, setIsEditingQuery] = React.useState(false)
    const [queries, setQueries] = React.useState(getSortedQueries(queryCache))
    const [activeQueryHash, setActiveQueryHash] = React.useState(null)

    React.useEffect(() => {
      return queryCache.subscribe(queryCache => {
        setQueries(getSortedQueries(queryCache))
      })
    }, [])

    const [activeQuery, activeQueryJson] = React.useMemo(() => {
      const activeQuery = queries.find(
        query => query.queryHash === activeQueryHash
      )

      return [
        activeQuery,
        activeQuery ? JSON.parse(JSON.stringify(activeQuery)) : null,
      ]
    }, [activeQueryHash, queries])

    React.useEffect(() => {
      if (activeQueryHash) {
        setIsEditingQuery(false)
      }
    }, [activeQueryHash])

    React.useEffect(() => {
      if (activeQueryHash && !activeQuery) {
        setActiveQueryHash(null)
      }
    }, [activeQuery, activeQueryHash])

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

    return (
      <ThemeProvider theme={theme}>
        <Panel ref={ref} className="ReactQueryDevtoolsPanel" {...props}>
          <div
            style={{
              flex: '1 1 50%',
              minHeight: '33%',
              overflow: 'auto',
              borderRight: `1px solid ${theme.grayAlt}`,
            }}
          >
            <div
              style={{
                padding: '.5em',
                background: theme.backgroundAlt,
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div>
                Queries <Code>({queries.length})</Code>
              </div>
              <QueryKeys>
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
            </div>
            <div
              style={{
                overflow: 'scroll',
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
                      width: '.5em',
                      height: '2em',
                      background: getQueryStatusColor(query, theme),
                    }}
                  />
                  <Code
                    style={{
                      padding: '.5em',
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
                padding: '.5em',
                background: theme.backgroundAlt,
              }}
            >
              Query Details
            </div>
            {activeQuery ? (
              <>
                <div
                  style={{
                    padding: '1em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Code
                    style={{
                      lineHeight: '1.8em',
                    }}
                  >
                    {activeQuery.queryHash}
                  </Code>
                  <span
                    style={{
                      padding: '0.3em .6em',
                      borderRadius: '0.4em',
                      fontWeight: 'bold',
                      textShadow: '0 2px 10px black',
                      background: getQueryStatusColor(activeQuery, theme),
                    }}
                  >
                    {getQueryStatusLabel(activeQuery)}
                  </span>
                </div>
                {isEditingQuery ? (
                  <QueryEditor
                    query={activeQuery}
                    onClose={() => setIsEditingQuery(false)}
                  />
                ) : (
                  <div
                    style={{
                      flex: '1',
                      overflow: 'auto',
                    }}
                  >
                    <div
                      style={{
                        background: theme.backgroundAlt,
                        padding: '.5em',
                      }}
                    >
                      Actions
                    </div>
                    <div
                      style={{
                        padding: '1em',
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
                        onClick={() => {
                          setIsEditingQuery(old => !old)
                        }}
                        disabled={isEditingQuery}
                      >
                        Edit Data
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
                        padding: '.5em',
                      }}
                    >
                      Data Explorer
                    </div>
                    <div
                      style={{
                        padding: '.5em',
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
                        padding: '.5em',
                      }}
                    >
                      Query Explorer
                    </div>
                    <div
                      style={{
                        padding: '.5em',
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
                )}
              </>
            ) : (
              <div
                style={{
                  padding: '1em',
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

function QueryEditor({ query, onClose }) {
  const theme = useTheme()
  const [editedData, setEditedData] = React.useState('')

  return (
    <>
      <div
        style={{
          flex: '1',
          marginBottom: '.5em',
          overflow: 'hidden',
        }}
      >
        <CodeMirror
          value={JSON.stringify(query.state.data, null, 2)}
          onChange={setEditedData}
          options={{
            mode: 'application/json',
            lineNumbers: true,
            theme: 'material',
          }}
        />
      </div>
      <div>
        <Button
          onClick={() => {
            query.setData(JSON.parse(editedData))
            onClose()
          }}
          style={{
            background: theme.success,
          }}
        >
          Save
        </Button>{' '}
        <Button
          onClick={() => onClose()}
          style={{
            background: theme.danger,
          }}
        >
          Cancel
        </Button>
      </div>
    </>
  )
}
