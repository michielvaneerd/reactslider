(function (win) {

  win.App = React.createClass({
    displayName: "App",

    getInitialState: function () {
      return { value: 70 };
    },
    onClick: function () {
      this.setState({
        value: 90
      });
    },
    onSliderChange: function (value) {
      this.setState({
        value: value
      });
    },
    render: function () {
      var style = { padding: 20 };
      return React.createElement(
        "div",
        { style: style },
        React.createElement(ReactSlider, { nativeSlider: false, min: 50, max: 100, step: 1, value: this.state.value, onChange: this.onSliderChange }),
        React.createElement(
          "p",
          null,
          this.state.value
        ),
        React.createElement(
          "p",
          null,
          React.createElement(
            "button",
            { onClick: this.onClick },
            "OK"
          )
        )
      );
    }
  });

  ReactDOM.render(React.createElement(App, null), document.getElementById("app"));
})(window);