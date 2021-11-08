import React, { Component } from "react";
class CarInsurance extends Component {
  render() {
    return (
      <div>
        <h1>Car insurance</h1>
        <div class="input-group input-group-lg">
          <input
            type="text"
            class="form-control"
            aria-label="Large"
            aria-describedby="inputGroup-sizing-sm"
          />
          <div class="input-group-prepend">
            <button class="input-group-text" id="inputGroup-sizing-lg">
              View Prices
            </button>
          </div>
        </div>
        <div class="col-lg-8 mx-auto">
          <div class="mb-4">
            <hr class="solid" />
          </div>
        </div>
        <button type="button" class="btn btn-primary btn-lg btn-block">
          Proceed with car number
        </button>
        <div class="col-lg-8 mx-auto">
          <div class="mb-4">
            <hr class="solid" />
          </div>
        </div>
        <a class="btn btn-primary" href="#" role="button">
          Brand new car?
        </a>
      </div>
    );
  }
}
export default CarInsurance;
