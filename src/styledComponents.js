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
  cursor: 'pointer',
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

export const Input = styled('input', {
  border: 0,
  borderRadius: '.2rem',
  fontSize: '.9rem',
  padding: '.3rem .4rem',
})

export const Select = styled('select', {
  display: `inline-block`,
  fontSize: `.9rem`,
  fontFamily: `sans-serif`,
  fontWeight: 'normal',
  lineHeight: `1.3`,
  padding: `.3rem 1.5rem .3rem .5rem`,
  height: 'auto',
  border: 0,
  borderRadius: `.2rem`,
  appearance: `none`,
  WebkitAppearance: 'none',
  backgroundColor: `#fff`,
  backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='%23444444'><polygon points='0,25 100,25 50,75'/></svg>")`,
  backgroundRepeat: `no-repeat`,
  backgroundPosition: `right .55rem center`,
  backgroundSize: `.65em auto, 100%`,
})
