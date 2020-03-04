import { styled } from './utils'

export const Panel = styled(
  'div',
  (props, theme) => ({
    fontSize: '1rem',
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
  fontSize: '.9rem',
  fontWeight: 'bold',
  background: theme.gray,
  border: '0',
  borderRadius: '.3rem',
  color: 'white',
  padding: '.5rem',
  opacity: props.disabled ? '.5' : undefined,
}))

export const QueryKeys = styled('span', {
  display: 'inline-block',
  fontSize: '0.9rem',
})

export const QueryKey = styled('span', {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '.2rem .4rem',
  fontWeight: 'bold',
  textShadow: '0 0 10px black',
  borderRadius: '.2rem',
})

export const Code = styled('code', {
  fontSize: '.9rem',
})
