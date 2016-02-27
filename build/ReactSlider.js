(function (win) {

  var rootStyle = {
    position: "relative",
    minWidth: 50,
    minHeight: 10,
    display: "block"
  };

  var sliderLineStyle = {
    width: "100%",
    minHeight: 1,
    position: "absolute"
  };

  var thumbStyle = {
    position: "absolute",
    minHeight: 10,
    minWidth: 10
  };

  var nativeStyle = {
    display: "block",
    width: "100%",
    margin: 0
  };

  var simpleClone = function () {
    var c = {};
    for (var i = 0; i < arguments.length; i++) {
      var ob = arguments[i];
      for (var key in ob) {
        c[key] = ob[key];
      }
    }
    return c;
  };

  win.ReactSlider = React.createClass({
    displayName: "ReactSlider",


    // Internal properties (computed properties):
    sliderLineStyle: {},
    offsetLeft: 0,
    offsetWidth: 0,
    halfStep: 0,

    onBodyMouseMove: function (e) {
      this.onMouseMove(e);
    },
    getInitialState: function () {
      return {
        value: parseInt(this.props.value),
        nativeSlider: this.props.nativeSlider
      };
    },
    componentWillReceiveProps: function (nextProps) {
      this.setState({
        value: nextProps.value ? parseInt(nextProps.value) : 0
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
        max: 10,
        step: 1,
        nativeSlider: true,
        id: "",
        className: "react-slider-root",
        sliderLineColor: "gray",
        thumbId: ""
      };
    },
    componentWillMount: function () {
      if (this.props.nativeSlider) {

        var el = document.createElement("input");
        el.setAttribute("type", "range");
        this.setState({ nativeSlider: el.type === "range" });
      }

      this.sliderLineStyle = simpleClone(sliderLineStyle, { backgroundColor: this.props.sliderLineColor });
    },
    componentWillUnmount: function () {
      win.document.body.removeEventListener("mousemove", this.onBodyMouseMove);
      win.document.body.removeEventListener("mouseup", this.onBodyMouseUp);
    },
    componentDidMount: function () {
      if (!this.state.nativeSlider) {

        var parent = this.refs.sliderRoot;
        while (parent) {
          this.offsetLeft += parent.offsetLeft;
          parent = parent.offsetParent;
        }
        this.offsetLeft += this.refs.sliderThumb.offsetWidth / 2;

        this.offsetWidth = parseFloat(this.refs.sliderRoot.offsetWidth - this.refs.sliderThumb.offsetWidth);
        this.halfStep = Math.round(this.props.step / 2);
        this.refs.sliderLine.style.top = parseFloat(this.refs.sliderRoot.offsetHeight / 2 - this.refs.sliderLine.offsetHeight / 2) + "px";
        this.refs.sliderThumb.style.top = parseFloat(this.refs.sliderRoot.offsetHeight / 2 - this.refs.sliderThumb.offsetHeight / 2) + "px";
      }
      this.setState({
        value: this.state.value
      });
    },
    onNativeSliderChange: function (e) {
      this.handleChange(e.target.value);
    },
    onMouseDown: function (e) {
      var newValue = this.getNewValue(e.clientX);
      this.setState({
        started: true,
        value: newValue
      });
      this.fireOnChange(newValue);
      win.document.body.addEventListener("mousemove", this.onBodyMouseMove);
      win.document.body.addEventListener("mouseup", this.onBodyMouseUp);
    },
    handleChange: function (newValue) {
      this.setState({
        value: newValue
      });
      this.fireOnChange(newValue);
    },
    getNewValue: function (clientX) {

      var x = clientX - this.offsetLeft;

      if (x > this.offsetWidth) {
        return this.props.max;
      }

      if (x < 0) {
        return this.props.min;
      }

      var oldValue = this.state.value;
      var newValue = Math.round(x / this.offsetWidth * (this.props.max - this.props.min) + this.props.min);

      if (newValue == oldValue || this.props.step == 1) {
        return newValue;
      }

      if (newValue < oldValue && oldValue - newValue > this.halfStep) {
        newValue = oldValue - this.props.step;
        if (newValue < this.props.min) {
          return this.props.min;
        }
        return newValue;
      }

      if (newValue > oldValue && newValue - oldValue > this.halfStep) {
        newValue = oldValue + this.props.step;
        if (newValue > this.props.max) {
          return this.props.max;
        }
        return newValue;
      }

      return newValue;
    },
    onMouseMove: function (e) {
      if (this.state.started) {
        this.handleChange(this.getNewValue(e.clientX));
      }
    },
    fireOnChange: function (value) {
      if (this.props.onChange) {
        this.props.onChange(value);
      }
    },
    onMouseUp: function (e) {
      if (this.state.started) {
        this.setState({
          started: false
        });
      }
    },
    onKeyDown: function (e) {
      var newValue = this.state.value;
      switch (e.keyCode) {
        case 37:
          newValue -= this.props.step;
          if (newValue < this.props.min) {
            newValue = this.props.min;
          }
          break;
        case 39:
          newValue += this.props.step;
          if (newValue > this.props.max) {
            newValue = this.props.max;
          }
          break;
      }
      if (newValue != this.state.value) {
        this.handleChange(Math.round(newValue));
      }
    },
    render: function () {
      if (this.state.nativeSlider) {
        return React.createElement(
          "div",
          null,
          React.createElement("input", {
            style: nativeStyle,
            className: this.props.className,
            id: this.props.id,
            type: "range",
            min: this.props.min,
            max: this.props.max,
            step: this.props.step,
            value: this.state.value,
            onChange: this.onNativeSliderChange })
        );
      } else {
        var currentThumbStyle = simpleClone(thumbStyle);
        var x = (this.state.value - this.props.min) / (this.props.max - this.props.min) * this.offsetWidth;
        currentThumbStyle.left = x;
        var me = this;
        return React.createElement(
          "div",
          { className: this.props.className,
            tabIndex: 0,
            id: this.props.id,
            onKeyDown: this.onKeyDown,
            style: rootStyle,
            ref: "sliderRoot",
            onMouseDown: this.onMouseDown },
          React.createElement("div", { ref: "sliderLine", className: "react-slider-line", style: this.sliderLineStyle }),
          React.createElement("button", {
            id: this.props.thumbId,
            tabIndex: -1,
            className: "react-slider-thumb",
            ref: "sliderThumb",
            style: currentThumbStyle,
            value: this.state.value })
        );
      }
    }
  });
})(window);