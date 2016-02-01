import React from 'react';

import Catalyst from 'react-catalyst';
import Rebase from 're-base';
import reactMixin from 'react-mixin';
import autobind from 'autobind-decorator';

import Header from './Header';
import Fish from './Fish';
import Inventory from './Inventory';
import Order from './Order';

var base = Rebase.createClass('https://catch-of-the-day93.firebaseio.com/');

@autobind
class App extends React.Component {

  constructor() {
    super();
    this.state = {
      fishes: {},
      order: {}
    }
  }

  componentDidMount() {
    base.syncState(this.props.params.storeId + '/fishes', {
      context: this,
      state: 'fishes'
    });

    var localStorageRef = localStorage.getItem('order-' + this.props.params.storeId);

    if(localStorageRef){
      this.setState({
        order: JSON.parse(localStorageRef)
      });
    }
  }

  componentDidUpdate(nextProps, nextState) {
    localStorage.setItem('order-' + this.props.params.storeId, JSON.stringify(nextState.order))
  }

  addFish(fish) {
    var timestamp = (new Date()).getTime();
    // update state object
    this.state.fishes['fish-' + timestamp] = fish;
    // set the state
    this.setState({fishes: this.state.fishes});
  }

  removeFish(key) {
    if(confirm('Are you sure you want to remove thsi fish?')){
      this.state.fishes[key] = null;
      this.setState({
        fishes: this.state.fishes
      })}
  }

  addToOrder(key) {
    this.state.order[key] = this.state.order[key] + 1 || 1;
    this.setState({order: this.state.order});
  }

  removeFromOrder(key) {
    delete this.state.order[key];
    this.setState({
      order: this.state.order
    })
  }

  loadSamples() {
    this.setState({
      fishes: require('../sample-fishes')
    });
  }

  renderFish(key) {
    return (
      <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder}/>
    )
  }

  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market"/>
          <ul className="list-of-fishes">
            {Object.keys(this.state.fishes).map(this.renderFish)}
          </ul>
        </div>
        <Order fishes={this.state.fishes} order={this.state.order} removeFromOrder={this.removeFromOrder}/>
        <Inventory fishes={this.state.fishes} addFish={this.addFish} removeFish={this.removeFish} loadSamples={this.loadSamples} linkState={this.linkState.bind(this)}{...this.props}/>
      </div>
    )
  }
}

reactMixin.onClass(App, Catalyst.LinkedStateMixin);

export default App;
