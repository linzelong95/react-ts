import React from 'react'
import { TooltipPropsWithOverlay } from 'antd/lib/tooltip'

export interface IEllipsisTooltipProps extends TooltipPropsWithOverlay {
  title?: undefined
  overlayStyle?: undefined
}

export interface IEllipsisProps {
  tooltip?: boolean | IEllipsisTooltipProps
  length?: number
  lines?: number
  style?: React.CSSProperties
  className?: string
  fullWidthRecognition?: boolean
}

export function getStrFullLength(str: string): number
export function cutStrByFullLength(str: string, maxLength: number): number

export default class Ellipsis extends React.Component<IEllipsisProps, any> {}
