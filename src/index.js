(function(win) {

  win.App = React.createClass({
    getInitialState : function() {
      return {value : 70}
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
      var style = {padding:20};
      return (
        <div style={style}>
          <ReactSlider nativeSlider={false} min={50} max={100} step={1} value={this.state.value} onChange={this.onSliderChange} />
          <p>{this.state.value}</p>
          <p><button onClick={this.onClick}>OK</button></p>
        </div>
      );
    }
  });
  
  ReactDOM.render(<App />, document.getElementById("app"));
  
}(window));
