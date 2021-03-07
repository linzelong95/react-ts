import React, { cloneElement, memo } from 'react'
import type { FC, CSSProperties, ReactElement } from 'react'

const containerStyle: CSSProperties = {
  width: '100%',
  maxWidth: 800,
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingRight: 16,
  paddingLeft: 16,
  flex: 'auto',
  minHeight: 0,
}

interface ContainerProps {
  renderer?: ReactElement
}

const Container: FC<ContainerProps> = memo((props) => {
  const { children, renderer = <div /> } = props
  const newElement = cloneElement(renderer, {
    children,
    style: { ...containerStyle, ...renderer.props.style },
  })
  return newElement
})

export default Container
