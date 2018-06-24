// @flow @jsx h

import { h } from 'preact'

type Props = {
  onToggle?: () => void,
  toggled?: boolean
}

function ToggleButton ({ toggled, onToggle }: Props) {
  return (
    <button
      class={`ml-toggle-btn ml-toggle-btn--${toggled ? 'on' : 'off'}`}
      onClick={onToggle}
    >
      {toggled ? <span>On</span> : <span>Off</span>}
    </button>
  )
}

export default ToggleButton
