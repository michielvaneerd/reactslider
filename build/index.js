(function (win) {

  win.App = React.createClass({
    displayName: "App",

    getInitialState: function () {
      return { value: 70, useNativeSlider: false };
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
      return React.createElement(
        "div",
        null,
        React.createElement(
          "h3",
          null,
          "Default React Slider"
        ),
        React.createElement(ReactSlider, { id: "slider1", nativeSlider: false, min: 50, max: 100, step: 1, value: this.state.value, onChange: this.onSliderChange }),
        React.createElement(
          "h3",
          null,
          "React Slider with some modifications"
        ),
        React.createElement(ReactSlider, { className: "my-slider", sliderLineColor: "green", id: "slider2", nativeSlider: false, min: 50, max: 100, step: 1, value: this.state.value, onChange: this.onSliderChange }),
        React.createElement(
          "h4",
          null,
          "Native slider when supported"
        ),
        React.createElement(ReactSlider, { min: 50, max: 100, step: 1, value: this.state.value, onChange: this.onSliderChange }),
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