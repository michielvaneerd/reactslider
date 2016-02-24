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
      console.log(value);
    },
    render : function() {
      var style = {padding:20};
      return (
        <div style={style}>
          <Slider min={50} max={100} step={10} value={this.state.value} onChange={this.onSliderChange} />
          <button onClick={this.onClick}>OK</button>
        </div>
      );
    }
  });
  
  ReactDOM.render(<App />, document.getElementById("app"));
  
}(window));