'use client'

import type { AnchorHTMLAttributes, MouseEvent } from 'react'
import {
  sendMeasurementEvent,
  type MeasurementClientEvent,
} from './measurement-client'

type MeasuredExternalLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string
  measurement: MeasurementClientEvent
}

export function MeasuredExternalLink({
  href,
  measurement,
  onClick,
  ...props
}: MeasuredExternalLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event)
    if (!event.defaultPrevented) sendMeasurementEvent(measurement)
  }

  return <a href={href} onClick={handleClick} {...props} />
}
