(function(win) {

  var rootStyle = {
    position: "relative",
    minWidth: 50,
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
  
  var simpleClone = function(ob) {
    var c = {};
    for (var key in ob) {
      c[key] = ob[key];
    }
    return c;
  };

  win.Slider = React.createClass({
    onBodyMouseMove : function(e) {
      this.onMouseMove(e);
    },
    getInitialState : function() {
      return {value : parseInt(this.props.value), nativeSlider : true}
    },
    componentWillReceiveProps : function(nextProps) {
      this.setState({
        value : nextProps.value ? parseInt(nextProps.value) : 0
      });
    },
    onBodyMouseUp : function(e) {
      this.onMouseUp(e);
      win.document.body.removeEventListener("mousemove", this.onBodyMouseMove);
      win.document.body.removeEventListener("mouseup", this.onBodyMouseUp);
    },
    getDefaultProps : function() {
      return {
        min : 0,
        max : 10
      }
    },
    componentWillMount : function() {
      var el = document.createElement("input");
      el.setAttribute("type", "range");
      this.setState({nativeSlider : el.type === "range"});
    },
    componentDidMount : function() {
      if (!this.state.nativeSlider) {
        offsetLeft = parseFloat(this.refs.sliderRoot.offsetLeft + (this.refs.sliderThumb.clientWidth / 2));
        offsetWidth = parseFloat(this.refs.sliderRoot.clientWidth);
      }
      this.setState({
        value : this.state.value
      });
    },
    onChange : function(e) {
      this.setState({
        value : e.target.value
      });
      this.fireOnChange(e.target.value);
    },
    onMouseDown : function(e) {
      var x = e.clientX - offsetLeft;
      this.setState({
        started : true,
        value : Math.round((x / offsetWidth) * (this.props.max - this.props.min) + parseInt(this.props.min))
      });
      win.document.body.addEventListener("mousemove", this.onBodyMouseMove);
      win.document.body.addEventListener("mouseup", this.onBodyMouseUp);
    },
    onMouseMove : function(e) {
      if (this.state.started) {
        var x = e.clientX - offsetLeft;
        var newValue = this.state.value;
        if (e.clientX - offsetLeft > offsetWidth) {
          newValue = this.props.max;
        } else if (e.clientX - offsetLeft < 0) {
          newValue = this.props.min;
        } else {
          newValue = (x / offsetWidth) * (this.props.max - this.props.min) + parseInt(this.props.min);
        }
        this.setState({
          value : Math.round(newValue)
        });
        this.fireOnChange(Math.round(newValue));
      }
    },
    fireOnChange : function(value) {
      if (this.props.onChange) {
        this.props.onChange(value || this.state.value);
      }
    },
    onMouseUp : function(e) {
      if (this.state.started) {
        this.setState({
          started : false
        });
      }
    },
    onKeyDown : function(e) {
      var newValue = this.state.value;
      switch (e.keyCode) {
        case 37:
          newValue -= (this.props.step || 1);
          if (newValue < this.props.min) {
            newValue = this.props.min;
          }
          break;
        case 39:
          newValue += (this.props.step || 1);
          if (newValue > this.props.max) {
            newValue = this.props.max;
          }
          break;
      }
      if (newValue !== null) {
        this.setState({
          value : Math.round(newValue)
        });
        this.fireOnChange(Math.round(newValue));
      }
    },
    render : function() {
      if (this.state.nativeSlider) {
        return (
          <div>
            <input
              id="react-slider-root"
              type="range"
              min={this.props.min}
              max={this.props.max}
              value={this.state.value}
              onChange={this.onChange} />
          </div>
        );
      } else {
        var currentThumbStyle = simpleClone(thumbStyle);
        var x = (this.state.value - this.props.min) / (this.props.max - this.props.min) * offsetWidth;
        currentThumbStyle.left = x;
        var me = this;
        return (
          <div id="react-slider-root" style={rootStyle}
            ref="sliderRoot"
            onMouseDown={this.onMouseDown}>
            <div style={sliderStyle}>
              <button
                id="react-slider-thumb"
                autoFocus={true}
                onKeyDown={this.onKeyDown}
                ref="sliderThumb"
                style={currentThumbStyle}
                value={this.state.value} />
            </div>
          </div>
        );
      }
    }
  });

}(window));