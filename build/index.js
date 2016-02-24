(function (win) {

  var rootStyle = {
    position: "relative",
    width: 200,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "yellow"
  };

  var sliderStyle = {
    width: "100%",
    backgroundColor: "black",
    height: 10
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

    componentWillMount: function () {
      var el = document.createElement("input");
      el.setAttribute("type", "range");
      this.setState({ nativeSlider: el.type === "raunge" });
    },
    componentDidMount: function () {
      offsetLeft = this.refs.sliderRoot.offsetLeft + this.refs.sliderThumb.clientWidth / 2;
      offsetWidth = this.refs.sliderRoot.clientWidth;
      console.log(offsetLeft + " en " + offsetWidth);
    },
    onChange: function (e) {
      this.setState({
        value: e.target.value
      });
    },
    onMouseDown: function (e) {
      var x = e.clientX - offsetLeft;
      this.setState({
        started: true,
        x: x,
        value: x / offsetWidth * 10
      });
    },
    onMouseMove: function (e) {
      if (this.state.started) {
        var x = e.clientX - offsetLeft;
        if (e.clientX - offsetLeft > 200) {
          this.setState({
            x: 200,
            value: 10
          });
        } else if (e.clientX - offsetLeft < 0) {
          this.setState({
            x: 0,
            value: 0
          });
        } else {
          // TODO: value
          this.setState({
            x: x,
            value: x / offsetWidth * 10
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
    render: function () {
      if (this.state.nativeSlider) {
        return React.createElement(
          "div",
          null,
          React.createElement("input", {
            type: "range",
            min: this.props.min || 0,
            max: this.props.max || 10,
            value: this.state.value || 0,
            onChange: this.onChange })
        );
      } else {
        var currentThumbStyle = simpleClone(thumbStyle);
        currentThumbStyle.left = this.state.x;
        return React.createElement(
          "div",
          { style: rootStyle,
            ref: "sliderRoot",
            onMouseDown: this.onMouseDown,
            onMouseUp: this.onMouseUp,
            onMouseMove: this.onMouseMove },
          React.createElement(
            "div",
            { style: sliderStyle },
            React.createElement("button", {
              ref: "sliderThumb",
              style: currentThumbStyle,
              value: this.state.value })
          )
        );
      }
    }
  });
})(window);

ReactDOM.render(React.createElement(Slider, null), document.getElementById("app"));