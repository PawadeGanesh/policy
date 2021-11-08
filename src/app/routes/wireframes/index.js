import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';

import asyncComponent from '../../../util/asyncComponent';



const Components = ({match}) => (
    <div className="app-wrapper">
      <Switch>
        <Route path={`${match.url}/health/data`} component={asyncComponent(() => import('./routes/saleFlows'))}/>
        <Route path={`${match.url}/health/quotes`} component={asyncComponent(() => import('./routes/productList'))}/>
        <Route path={`${match.url}/health/compare/:op1/:op2/:op3`} component={asyncComponent(() => import('./routes/productComparision'))}/>
        <Route path={`${match.url}/health/features/:idxValue`} component={asyncComponent(() => import('./routes/productFeatures'))}/>
        <Route path={`${match.url}/dashboard/agents`} component={asyncComponent(() => import('./routes/dashboardAgents'))}/>
        <Route path={`${match.url}/dashboard/managers`} component={asyncComponent(() => import('./routes/dashboardManagers'))}/>
        <Route path={`${match.url}/health/policy/info`} component={asyncComponent(() => import('./routes/saleFlows/PolicyInfo'))}/>
      </Switch>
  </div>
);

export default Components;
