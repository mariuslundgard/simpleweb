// @flow @jsx h

import { Component, h } from 'preact'

class Footer extends Component<any> {
  render () {
    // const { onLinkClick } = this.context

    return (
      <div class='web-footer'>
        <hr />
        Marius Lundgård is a graphic designer who codes.
        <hr />
        <div>
          <a href='https://github.com/mariuslundgard'>GitHub</a>
        </div>
        <div>
          <a href='https://twitter.com/mariuslundgard'>Twitter</a>
        </div>
        <hr />
        <div>Copyright &copy; 2018</div>
      </div>
    )
  }
}

export default Footer
