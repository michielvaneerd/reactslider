(function (win) {

  var rootStyle = {
    position: "relative",
    width: 400,
    paddingTop: 10,
    paddingBottom: 10
  };

  var sliderStyle = {
    width: "100%",
    backgroundColor: "gray",
    height: 2
  };

  var thumbStyle = {
    position: "absolute",
    width: 10,
    height: "100%",
    top: 0,
    left: 0,
    border: "none",
    padding: 0
  };

  var offsetLeft = 0;
  var offsetWidth = 0;

  var simpleClone = function (ob) {
    var c = {};
    for (var key in ob) {
      c[key] = ob[key];
    }
    return c;
  };

  win.Slider = React.createClass({
    displayName: "Slider",

    onBodyMouseMove: function (e) {
      this.onMouseMove(e);
    },
    getInitialState: function () {
      return { value: parseFloat(this.props.value), nativeSlider: true };
    },
    componentWillReceiveProps: function (nextProps) {
      this.setState({
        value: nextProps.value ? parseFloat(nextProps.value) : 0
      });
    },
    onBodyMouseUp: function (e) {
      this.onMouseUp(e);
      win.document.body.removeEventListener("mousemove", this.onBodyMouseMove);
      win.document.body.removeEventListener("mouseup", this.onBodyMouseUp);
    },
    getDefaultProps: function () {
      return {
        min: 0,
        max: 10
      };
    },
    componentWillMount: function () {
      var el = document.createElement("input");
      el.setAttribute("type", "range");
      this.setState({ nativeSlider: el.type === "raunge" });
    },
    componentDidMount: function () {
      offsetLeft = parseFloat(this.refs.sliderRoot.offsetLeft + this.refs.sliderThumb.clientWidth / 2);
      offsetWidth = parseFloat(this.refs.sliderRoot.clientWidth);
      this.setState({
        value: this.state.value
      });
    },
    onChange: function (e) {
      this.setState({
        value: parseFloat(e.target.value)
      });
    },
    onMouseDown: function (e) {
      var x = e.clientX - offsetLeft;
      this.setState({
        started: true,
        value: x / offsetWidth * (this.props.max - this.props.min) + parseInt(this.props.min)
      });
      win.document.body.addEventListener("mousemove", this.onBodyMouseMove);
      win.document.body.addEventListener("mouseup", this.onBodyMouseUp);
    },
    onMouseMove: function (e) {
      if (this.state.started) {
        var x = e.clientX - offsetLeft;
        if (e.clientX - offsetLeft > offsetWidth) {
          this.setState({
            value: this.props.max
          });
        } else if (e.clientX - offsetLeft < 0) {
          this.setState({
            value: this.props.min
          });
        } else {
          this.setState({
            value: x / offsetWidth * (this.props.max - this.props.min) + parseInt(this.props.min)
          });
        }
      }
    },
    onMouseUp: function (e) {
      if (this.state.started) {
        this.setState({
          started: false
        });
        console.log(this.state.value + " is value");
      }
    },
    onKeyDown: function (e) {
      var newValue = parseInt(this.state.value);
      console.log(newValue);
      switch (e.keyCode) {
        case 37:
          newValue -= this.props.step || 1;
          if (newValue < parseInt(this.props.min)) {
            newValue = this.props.min;
          }
          break;
        case 39:
          newValue += this.props.step || 1;
          if (newValue > parseInt(this.props.max)) {
            newValue = this.props.max;
          }
          break;
      }
      if (newValue !== null) {
        this.setState({
          value: newValue
        });
      }
    },
    render: function () {
      if (this.state.nativeSlider) {
        return React.createElement(
          "div",
          null,
          React.createElement("input", {
            type: "range",
            min: this.props.min,
            max: this.props.max,
            value: this.state.value || 0,
            onChange: this.onChange })
        );
      } else {
        var currentThumbStyle = simpleClone(thumbStyle);
        var x = (this.state.value - this.props.min) / (this.props.max - this.props.min) * offsetWidth;
        currentThumbStyle.left = x;
        var me = this;
        return React.createElement(
          "div",
          { style: rootStyle,
            ref: "sliderRoot",
            onMouseDown: this.onMouseDown },
          React.createElement(
            "div",
            { style: sliderStyle },
            React.createElement("button", {
              autoFocus: true,
              onKeyDown: this.onKeyDown,
              ref: "sliderThumb",
              style: currentThumbStyle,
              value: this.state.value })
          )
        );
      }
    }
  });

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
    render: function () {
      var style = { padding: 20 };
      return React.createElement(
        "div",
        { style: style },
        React.createElement(Slider, { min: 50, max: 100, step: 10, value: this.state.value }),
        React.createElement(
          "button",
          { onClick: this.onClick },
          "OK"
        )
      );
    }
  });
})(window);

ReactDOM.render(React.createElement(App, null), document.getElementById("app"));