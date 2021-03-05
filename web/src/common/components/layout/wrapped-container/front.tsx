import React, { memo, cloneElement, useMemo } from 'react'
import type { FC, CSSProperties, ReactElement } from 'react'

interface FrontContainerProps {
  style?: CSSProperties
  renderer?: ReactElement
  ghost?: boolean
}

const FrontContainer: FC<FrontContainerProps> = memo((props) => {
  const { children, ghost, renderer = <div /> } = props

  const style = useMemo<CSSProperties>(() => {
    return {
      width: '100%',
      maxWidth: 1300,
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingRight: 16,
      paddingLeft: 16,
      flex: 'auto',
      minHeight: 0,
      background: ghost ? undefined : '#f0f2f5',
      ...props.style,
      ...renderer.props.style,
    }
  }, [renderer, ghost, props])

  return cloneElement(renderer, { children, style })
})

export default FrontContainer
