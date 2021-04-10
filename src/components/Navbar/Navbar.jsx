import React from 'react';

export default class Navbar extends React.PureComponent {
  render() {
    const { open, connected, address } = this.props;
    return (
      <div className="navbar-wrapper">
        <div className="container">
          <div className="navbar-container">
            <div className="navbar-logo">
              <h1>Finpound</h1>
            </div>
            <div>
              <ul className="navbar-elements">
                <li>Markets</li>
                <li>Governance</li>
                <li>Developers</li>
                <li>Prices</li>
                <li>Docs</li>
              </ul>
            </div>
            <div>
              {
                connected 
                ? (
                   <button type="button" onClick={() => { open(); }}>
                    {address.slice(0,6) + '.....' + address.slice(38,42)}
                   </button>
                ) 
                : (
                  <button type="button" onClick={() => { open(); }}>
                    Connect Wallet
                  </button>
                )
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
