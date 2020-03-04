import { styled } from './utils'

export const Panel = styled(
  'div',
  (props, theme) => ({
    fontSize: '14px',
    display: 'flex',
    backgroundColor: theme.background,
    color: theme.foreground,
  }),
  {
    '(max-width: 600px)': {
      fontSize: '.9rem',
      flexDirection: 'column',
    },
  }
)

export const Button = styled('button', (props, theme) => ({
  appearance: 'none',
  fontSize: '.9em',
  fontWeight: 'bold',
  background: theme.gray,
  border: '0',
  borderRadius: '.3em',
  color: 'white',
  padding: '.5em',
  opacity: props.disabled ? '.5' : undefined,
}))

export const QueryKeys = styled('div', {
  fontSize: '0.9em',
})

export const QueryKey = styled('span', {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '.2em .4em',
  fontWeight: 'bold',
  textShadow: '0 0 10px black',
  borderRadius: '.2em',
})

export const Code = styled('code', {
  fontSize: '.9em',
})
