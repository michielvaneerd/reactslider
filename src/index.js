(function(win) {

  var labelStyle = {
    display: "block",
    float: "left",
    height: 50,
    lineHeight: "50px",
    marginRight: 30
  }

  var floatStyle = {
    display: "inline-block",
    width: 140
  };

  win.App = React.createClass({
    getInitialState : function() {
      return {value : 70, useNativeSlider : false}
    },
    onClick : function() {
      this.setState({
        value : 90
      });
    },
    onSliderChange : function(value) {
      this.setState({
        value : value
      });
    },
    render : function() {
      return (
        <div>
          <h3>Default React Slider</h3>
          <ReactSlider id="slider1" nativeSlider={false} min={50} max={100} step={1} value={this.state.value} onChange={this.onSliderChange} />
          <h3>React Slider with some modifications</h3>
          <ReactSlider className="my-slider" sliderLineColor="green" id="slider2" nativeSlider={false} min={50} max={100} step={10} value={this.state.value} onChange={this.onSliderChange} />
          <h4>Native slider when supported</h4>
          <ReactSlider min={50} max={100} step={1} value={this.state.value} onChange={this.onSliderChange} />
          <h4>Slider with label and float to left</h4>
          <label style={labelStyle} htmlFor="floatSlider">Float slider</label>
          <div style={floatStyle}>
            <ReactSlider thumbId="floatSlider" nativeSlider={false} min={50} max={100} step={1} value={this.state.value} onChange={this.onSliderChange} />
          </div>
          <p>{this.state.value}</p>
          <p><button onClick={this.onClick}>OK</button></p>
        </div>
      );
    }
  });
  
  ReactDOM.render(<App />, document.getElementById("app"));
  
}(window));
