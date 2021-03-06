(function(win) {

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
 
  var simpleClone = function() {
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
    
    // Internal properties (computed properties):
    sliderLineStyle : {},
    offsetLeft : 0,
    offsetWidth : 0,
    halfStep : 0,
    getInitialState : function() {
      return {
        value : parseInt(this.props.value),
        nativeSlider : this.props.nativeSlider
      }
    },
    componentWillReceiveProps : function(nextProps) {
      this.setState({
        value : nextProps.value ? parseInt(nextProps.value) : 0
      });
    },
    getDefaultProps : function() {
      return {
        min : 0,
        max : 10,
        step : 1,
        nativeSlider : true,
        id : "",
        className : "react-slider-root",
        sliderLineColor : "gray",
        thumbId : ""
      }
    },
    componentWillMount : function() {
      if (this.props.nativeSlider) {
        var el = document.createElement("input");
        el.setAttribute("type", "range");
        this.setState({nativeSlider : el.type === "range"});
      }
      this.sliderLineStyle = simpleClone(sliderLineStyle,
        {backgroundColor : this.props.sliderLineColor});
    },
    componentWillUnmount : function() {
      win.document.body.removeEventListener("mousemove", this.onMouseMove);
      win.document.body.removeEventListener("mouseup", this.onMouseUp);
      if (this.refs.nativeInput) {
        this.refs.nativeInput.removeEventListener("change",
          this.onNativeSliderChangeIE);
      }
    },
    componentDidMount : function() {
      if (!this.state.nativeSlider) {
        
        var parent = this.refs.sliderRoot;
        while (parent) {
          this.offsetLeft += parent.offsetLeft;
          parent = parent.offsetParent;
        }
        this.offsetLeft += this.refs.sliderThumb.offsetWidth / 2;
        
        this.offsetWidth = parseFloat(this.refs.sliderRoot.offsetWidth
          - this.refs.sliderThumb.offsetWidth);
        this.halfStep = Math.round(this.props.step / 2);
        this.refs.sliderLine.style.top = parseFloat((this.refs.sliderRoot.offsetHeight / 2)
          - (this.refs.sliderLine.offsetHeight / 2)) + "px";
        this.refs.sliderThumb.style.top = parseFloat((this.refs.sliderRoot.offsetHeight / 2)
          - (this.refs.sliderThumb.offsetHeight / 2)) + "px";
      }
      
      // Native onChange event on input type=range:
      // Only fires when vale has changed and after mouse up event / key up event.
      // React onChange event on input type=range fires always! Except in IE10 and 11 never.
      // So it's no problem if we set this native onChange event also for Edge / Chrome and Firefox
      // because it will only fire once.
      if (this.refs.nativeInput) {
        this.refs.nativeInput.addEventListener("change", this.onNativeSliderChange);
      }
      
      this.setState({
        value : this.state.value
      });
    },
    onNativeSliderChange : function(e) {
      this.handleChange(e.target.value);
    },
    onMouseDown : function(e) {
      e.stopPropagation();
      if ("changedTouches" in e) {
        var newValue = this.getNewValue(e.changedTouches[0].clientX);
        this.setState({
          started : true,
          value : newValue
        });
        this.fireOnChange(newValue);
        win.document.body.addEventListener("touchmove", this.onTouchMove);
        win.document.body.addEventListener("touchend", this.onTouchEnd);
      } else {
        var newValue = this.getNewValue(e.clientX);
        this.setState({
          started : true,
          value : newValue
        });
        this.fireOnChange(newValue);
        win.document.body.addEventListener("mousemove", this.onMouseMove);
        win.document.body.addEventListener("mouseup", this.onMouseUp);
      }
      
    },
    handleChange : function(newValue) {
      this.setState({
        value : newValue
      });
      this.fireOnChange(newValue);
    },
    getNewValue : function(clientX) {
      
      var x = clientX - this.offsetLeft;
      
      if (x > this.offsetWidth) {
        return this.props.max;
      }
      
      if (x < 0) {
        return this.props.min;
      }
      
      var oldValue = this.state.value;
      var newValue = Math.round((x / this.offsetWidth) * (this.props.max - this.props.min)
        + this.props.min);
        
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
      
      return oldValue;
      
    },
    onMouseMove : function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (this.state.started) {
        this.handleChange(this.getNewValue(e.clientX));
      }
    },
    onTouchMove : function(e) {
      e.stopPropagation();
      e.preventDefault();
      if (this.state.started && e.changedTouches) {
        this.handleChange(this.getNewValue(e.changedTouches[0].clientX));
      }
    },
    fireOnChange : function(value) {
      if (this.props.onChange) {
        this.props.onChange(value);
      }
    },
    onMouseUp : function(e) {
      if (this.state.started) {
        this.setState({
          started : false
        });
      }
      win.document.body.removeEventListener("mousemove", this.onMouseMove);
      win.document.body.removeEventListener("mouseup", this.onMouseUp);
    },
    onTouchEnd : function(e) {
      if (this.state.started) {
        this.setState({
          started : false
        });
      }
      win.document.body.removeEventListener("touchmove", this.onTouchMove);
      win.document.body.removeEventListener("touchend", this.onTouchEnd);
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
              ref="nativeInput"
              style={nativeStyle}
              className={this.props.className}
              id={this.props.id}
              type="range"
              min={this.props.min}
              max={this.props.max}
              step={this.props.step}
              value={this.state.value}
              onChange={this.onNativeSliderChange} />
          </div>
        );
      } else {
        var currentThumbStyle = simpleClone(thumbStyle);
        var x = (this.state.value - this.props.min) / (this.props.max - this.props.min) * this.offsetWidth;
        currentThumbStyle.left = x;
        var me = this;
        return (
          <div className={this.props.className}
            tabIndex={0}
            id={this.props.id}
            onKeyDown={this.onKeyDown}
            style={rootStyle}
            ref="sliderRoot"
            onTouchStart={this.onMouseDown}
            onMouseDown={this.onMouseDown}>
            <div ref="sliderLine" className="react-slider-line" style={this.sliderLineStyle} />
            <button
                id={this.props.thumbId}
                tabIndex={-1}
                className="react-slider-thumb"
                ref="sliderThumb"
                style={currentThumbStyle}
                value={this.state.value} />
          </div>
        );
      }
    }
  });

}(window));
