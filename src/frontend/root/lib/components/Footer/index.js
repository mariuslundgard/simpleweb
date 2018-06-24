// @flow @jsx h

import { Component, h } from 'preact'

class Footer extends Component<any> {
  render () {
    return (
      <div class='ml-footer'>
        Marius Lundgård is a graphic designer who codes.
        <hr class='ml-separator' />
        <div>
          <a href='https://github.com/mariuslundgard'>GitHub</a>
        </div>
        <div>
          <a href='https://twitter.com/mariuslundgard'>Twitter</a>
        </div>
        <hr class='ml-separator' />
        <div>Copyright &copy; 2018</div>
      </div>
    )
  }
}

export default Footer
