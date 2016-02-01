import React from 'react';
import reactMixin from 'react-mixin';
import autobind from 'autobind-decorator';
import { History } from 'react-router';
import h from '../helpers';

@autobind
class StorePicker extends React.Component {

  goToStore(event) {
    event.preventDefault();

    var storeId = this.refs.storeId.value;
    this.history.pushState(null, '/store/' + storeId);

  }

  render() {
    var name = "Anthony";
    return (
      <form className="store-selector" onSubmit={this.goToStore}>
        <h2>Please Enter A Store {name}</h2>
        <input type="text" ref="storeId" defaultValue={h.getFunName()} required />
        <input type="submit"/>
      </form>
    )
  }

}

reactMixin.onClass(StorePicker, History);

export default StorePicker;
