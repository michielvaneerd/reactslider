(function(win) {

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
          <ReactSlider className="my-slider" sliderLineColor="green" id="slider2" nativeSlider={false} min={50} max={100} step={1} value={this.state.value} onChange={this.onSliderChange} />
          <h4>Native slider when supported</h4>
          <ReactSlider min={50} max={100} step={1} value={this.state.value} onChange={this.onSliderChange} />
          <p>{this.state.value}</p>
          <p><button onClick={this.onClick}>OK</button></p>
        </div>
      );
    }
  });
  
  ReactDOM.render(<App />, document.getElementById("app"));
  
}(window));
