import React from 'react';
import Divider from "@material-ui/core/Divider";
import Checkbox from '@material-ui/core/Checkbox';
import {preExistingDiseases, benifitsList} from './data';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';


const FilterOptions = (props) => {

    return (
        <div className="user-list d-flex flex-row card shadow">
            <div className="col-md-12">
              <div className="row"> 
                <div className="description col-md-12">
                    <h5 className="font-weight-bold">Pre-Existing Diseases</h5>
                    {preExistingDiseases.map((preExtDName, index) => (
                        <FormControlLabel
                        control={
                          <Checkbox color="primary"
                                    value="checkedA"
                          />
                        }
                        label={preExtDName}
                      />
                    ))}
                  </div>
              </div>
              <Divider inset/>
              <div className="row">&nbsp;</div>
              <div className="row"> 
                  <div className="description col-md-12">
                    <h5 className="font-weight-bold">Only show results with</h5>
                    {benifitsList.map((benifitName, index) => (
                        <FormControlLabel
                        className="w-100"
                        control={
                          <Checkbox color="primary"
                                    value="checkedA"
                          />
                        }
                        label={benifitName}
                      />
                    ))}
                  </div>
              </div>
              <Divider  inset/>
              <div className="row">&nbsp;</div>
              <div className="row"> 
                  <div className="description col-md-12">
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Medical Test?</FormLabel>
                      <RadioGroup
                        className="d-flex flex-row"
                        aria-label="Any pre existing disease?"
                        name="preExisting"
                      >
                        <FormControlLabel value="yes" control={<Radio color="primary"  />} label="I don't mind"/>
                        <FormControlLabel value="no" control={<Radio color="primary"  />} label="I'd like to avoid"/>
                      </RadioGroup>
                    </FormControl>
                  </div>
              </div>
              <Divider inset/>
            </div>
        </div>
    );
}

export default FilterOptions;