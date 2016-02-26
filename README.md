React Slider is a React component that wraps the native range input element when supported and falls back to a custom slider when not supported (IE9). It's just a simple horizontal slider and can be styled as you wish.

```jsx
var App = React.createClass({
  getInitialState : function() {
    return {
      value : 70
    }
  },
  onSliderChange : function(value) {
    console.log("Value of slider is now " + value);
    this.setState({
      value : value
    });
  },
  render : function() {
    return (
      <ReactSlider min={50} max={100} step={1}
        value={this.state.value}
        onChange={this.onSliderChange} />
    );
  }
});

```

Modifications:
- ```nativeSlider=false``` To always force the custom slider even a native one is supported.
- ```className="my-slider"``` Use this as classname for root of slider element. By default it uses ```react-slider-root```.
- ```id="slider1"``` Set an id on the root element.
- ````sliderLineColor="green"``` Color of slider line - this is the only style property that has to be set as a prop, everything else can be set in CSS by using the ```className``` or ```id``` properties.
- ```min```, ```max``` and ```step``` as you would use on the native range input.
- ```onChange``` is a callback that will be handover the value like ```function(value)```. This will be the callback for both custom and native slider. Note that this is different than the "normal" callback fired by a input range element.

Example of a forced custom slider:
```jsx
<ReactSlider className="my-slider" sliderLineColor="green" id="slider2"
  nativeSlider={false} min={50} max={100} step={1}
  value={this.state.value} onChange={this.onSliderChange} />
```
