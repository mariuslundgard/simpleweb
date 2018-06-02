// @flow

import format from 'date-fns/format'

export function formatDate (d: any) {
  const t = new Date()

  if (typeof d !== 'object') {
    d = new Date(d)
  }

  const dy = d.getFullYear()
  const ty = t.getFullYear()
  const dm = d.getMonth()
  const tm = t.getMonth()
  const dd = d.getDate()
  const td = t.getDate()

  if (dy === ty && dm === tm && dd === td) {
    return format(d, 'h:mm a')
  }

  if (dy === ty) {
    return format(d, 'MMMM D')
  }

  return format(d, 'MMMM D, YYYY h:mm a')
}
