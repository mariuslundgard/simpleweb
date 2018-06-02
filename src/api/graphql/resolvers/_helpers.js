import { format } from 'date-fns'

export function parseDate (str, time) {
  let date

  if (str === 'now') {
    date = time
  } else if (str === 'yesterday') {
    date = new Date(
      format(new Date(time.getTime() - 1000 * 60 * 60 * 24), 'YYYY-MM-DD')
    )
  } else if (str === 'tomorrow') {
    date = new Date(
      format(new Date(time.getTime() + 1000 * 60 * 60 * 24), 'YYYY-MM-DD')
    )
  } else if (str === 'today') {
    date = new Date(format(time, 'YYYY-MM-DD'))
  } else {
    date = new Date(str)
  }

  return date
}

export function getFields (fieldNode) {
  const fields = fieldNode.selectionSet.selections.reduce((fields, s, idx) => {
    fields[s.name.value] = fieldNode.selectionSet.selections[idx]
    return fields
  }, {})

  return fields
}

export function getArgs (fieldNode) {
  return fieldNode.arguments.reduce((acc, arg) => {
    if (arg.value.kind === 'IntValue') {
      acc[arg.name.value] = Number(arg.value.value)
    } else {
      acc[arg.name.value] = arg.value.value
    }

    return acc
  }, {})
}
