import React from 'react';
import ControlledExpansionPanels from './Acc';



class ProductCompare extends React.Component {
  render() {

      console.log("op1===="+this.props.match.params.op1)
      console.log("op2===="+this.props.match.params.op2)
      console.log("op3===="+this.props.match.params.op3)
      return (
        <div>               
          <div className="row">
              <ControlledExpansionPanels 
                  op1={this.props.match.params.op1}
                  op2={this.props.match.params.op2}
                  op3={this.props.match.params.op3}
              />
          </div>

        </div>
      );
  }
}

export default ProductCompare;