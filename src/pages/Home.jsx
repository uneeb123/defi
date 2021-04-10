import React from 'react';

export default class Home extends React.PureComponent {
  render() {
    return (
      <div className="jumbotron">
        <div className="container">
          <h1>
            The Protocol currently has
            <span> $123,990,000 </span>
            earning an annual interest of
            <span> 15.45% </span>
          </h1>
        </div>
      </div>
    );
  }
}
