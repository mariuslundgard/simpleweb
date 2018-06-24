// @flow @jsx h

import { Component, h } from 'preact'

import ToggleButton from './ToggleButton'

import type { Features } from 'types'

type Props = {
  features: Features,
  onToggle: (key: string) => void
}

class FeaturesList extends Component<Props> {
  render () {
    const { features, onToggle } = this.props

    return (
      <div class='ml-features-list'>
        <h2>Features</h2>
        <ul>
          <li>
            <div>Maintenance</div>
            <div>
              <ToggleButton
                onToggle={() => onToggle('maintenance')}
                toggled={features.maintenance}
              />
            </div>
          </li>
          <li>
            <div>Projects</div>
            <div>
              <ToggleButton
                onToggle={() => onToggle('projects')}
                toggled={features.projects}
              />
            </div>
          </li>
        </ul>
      </div>
    )
  }
}

export default FeaturesList
