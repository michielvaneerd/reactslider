(function(win) {

  var rootStyle = {
    position: "relative",
    minWidth: 50,
    minHeight: 10, // does not work with table-cell display...
    display: "table-cell",
    verticalAlign: "middle"
  };
  
  var sliderStyle = {
    width: "100%",
    minHeight: 1
  };
  
  var thumbStyle = {
    position: "absolute",
    height: "100%",
    top: 0,
    left: 0,
    border: "none",
    padding: 0,
    minWidth: 10
  };
  
  var offsetLeft = 0;
  var offsetWidth = 0;
  var halfStep = 0; 
 
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
      return {value : parseInt(this.props.value), nativeSlider : this.props.nativeSlider}
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
        max : 10,
        step : 1,
        nativeSlider : true
      }
    },
    componentWillMount : function() {
      if (this.props.nativeSlider) {
        var el = document.createElement("input");
        el.setAttribute("type", "range");
        this.setState({nativeSlider : el.type === "range"});
      }
    },
    componentDidMount : function() {
      if (!this.state.nativeSlider) {
        
        var parent = this.refs.sliderRoot;
        while (parent) {
          offsetLeft += parent.offsetLeft;
          parent = parent.offsetParent;
        }
        offsetLeft += this.refs.sliderThumb.clientWidth / 2;
        offsetWidth = parseFloat(this.refs.sliderRoot.clientWidth - this.refs.sliderThumb.clientWidth);
        halfStep = Math.round(this.props.step / 2);
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
      this.setState({
        started : true,
        value : this.getNewValue(e.clientX)
      });
      win.document.body.addEventListener("mousemove", this.onBodyMouseMove);
      win.document.body.addEventListener("mouseup", this.onBodyMouseUp);
    },
    handleChange : function(newValue, suppressFire) {
      this.setState({
        value : newValue
      });
      if (!suppressFire) {
        this.fireOnChange(newValue);
      }
    },
    getNewValue : function(clientX) {
      
      var x = clientX - offsetLeft;
      
      if (x > offsetWidth) {
        return this.props.max;
      }
      
      if (x < 0) {
        return this.props.min;
      }
      
      var oldValue = this.state.value;
      var newValue = Math.round((x / offsetWidth) * (this.props.max - this.props.min)
        + this.props.min);
        
      if (newValue == oldValue || this.props.step == 1) {
        return newValue;
      }

      if (newValue < oldValue && oldValue - newValue > halfStep) {
        newValue = oldValue - this.props.step;
        if (newValue < this.props.min) {
          return this.props.min;
        }
        return newValue;
      }

      if (newValue > oldValue && newValue - oldValue > halfStep) {
        newValue = oldValue + this.props.step;
        if (newValue > this.props.max) {
          return this.props.max;
        }
        return newValue;
      }
      
      return newValue;
      
    },
    onMouseMove : function(e) {
      if (this.state.started) {
        this.handleChange(this.getNewValue(e.clientX));
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
    render : function() {
      if (this.state.nativeSlider) {
        return (
          <div>
            <input
              className="react-slider-root"
              type="range"
              min={this.props.min}
              max={this.props.max}
              step={this.props.step}
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
          <div className="react-slider-root" style={rootStyle}
            ref="sliderRoot"
            onMouseDown={this.onMouseDown}>
            <div className="react-slider-line" style={sliderStyle} />
            <button
                className="react-slider-thumb"
                autoFocus={true}
                onKeyDown={this.onKeyDown}
                ref="sliderThumb"
                style={currentThumbStyle}
                value={this.state.value} />
          </div>
        );
      }
    }
  });

}(window));
