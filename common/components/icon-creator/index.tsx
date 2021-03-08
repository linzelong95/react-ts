import React, { CSSProperties } from 'react'
import { IconProps } from './type'
import MAP from './map'
import styles from './style.less'

function createIconStyle(params: Omit<IconProps, 'className'>): CSSProperties {
  const { name, width, height, color } = params
  let icon: string = MAP[name]
  if (color) {
    icon = icon.replace('{{COLOR}}', encodeURIComponent(color))
  }
  const iconStyle: CSSProperties = {
    backgroundImage: `url("${icon}")`,
    height: height || '',
    width: width || '',
  }
  return iconStyle
}

export function Icon(props: IconProps): JSX.Element {
  const { name, width, height, color, className } = props
  const iconStyle = createIconStyle({ name, width, height, color })
  return <span className={`${styles['svg-icon']} ${className || ''}`} style={iconStyle} />
}
