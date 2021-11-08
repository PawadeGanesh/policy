/* eslint-disable react/prop-types */
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import asyncComponent from "../../../util/asyncComponent";

const Dashboard = ({ match }) => (
  <div className="app-wrapper">
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/classic`} />
      <Route
        path={`${match.url}/classic`}
        component={asyncComponent(() => import("./routes/Classic"))}
      />
      <Route
        path={`${match.url}/modern`}
        component={asyncComponent(() => import("./routes/Modern"))}
      />
      <Route
        path={`${match.url}/AuditEvents`}
        component={asyncComponent(() => import("./routes/AuditEvents"))}
      />
      <Route
        path={`${match.url}/NotificationEvents`}
        component={asyncComponent(() => import("./routes/NotificationEvents"))}
      />
      <Route
        path={`${match.url}/NotificationTemplate`}
        component={asyncComponent(() =>
          import("./routes/NotificationTemplate")
        )}
      />
      <Route
        path={`${match.url}/EditNotificationTemplate`}
        component={asyncComponent(() =>
          import("./routes/EditNotificationTemplate")
        )}
      />
      <Route
        path={`${match.url}/NotificationDetails`}
        component={asyncComponent(() => import("./routes/NotificationDetails"))}
      />
      <Route
        path={`${match.url}/UserNotifications`}
        component={asyncComponent(() => import("./routes/UserNotifications"))}
      />
      <Route
        path={`${match.url}/AuditMaster`}
        component={asyncComponent(() => import("./routes/AuditMaster"))}
      />
      <Route
        path={`${match.url}/InputFields`}
        component={asyncComponent(() => import("./routes/InputFields"))}
      />
      <Route
        path={`${match.url}/ProductMaster`}
        component={asyncComponent(() => import("./routes/ProductMaster"))}
      />
      <Route
        path={`${match.url}/AgentFeedback`}
        component={asyncComponent(() => import("./routes/AgentFeedback"))}
      />
      <Route
        path={`${match.url}/SuccessPage`}
        component={asyncComponent(() => import("./routes/SuccessPage"))}
      />
      <Route
        path={`${match.url}/AddProductMaster`}
        component={asyncComponent(() => import("./routes/AddProductMaster"))}
      />
      <Route
        path={`${match.url}/UserProfile`}
        component={asyncComponent(() => import("./routes/UserProfile"))}
      />
      <Route
        path={`${match.url}/EditProductMaster`}
        component={asyncComponent(() => import("./routes/EditProductMaster"))}
      />
      <Route
        path={`${match.url}/AllNotificationForUser`}
        component={asyncComponent(() =>
          import("./routes/AllNotificationForUser")
        )}
      />
      <Route
        path={`${match.url}/AgentList`}
        component={asyncComponent(() => import("./routes/AgentList"))}
      />
      <Route
        path={`${match.url}/MyTraining`}
        component={asyncComponent(() => import("./routes/MyTraining"))}
      />
      <Route
        path={`${match.url}/EnquiryList`}
        component={asyncComponent(() => import("./routes/EnquiryList"))}
      />
      <Route
        path={`${match.url}/MyEnquiries`}
        component={asyncComponent(() => import("./routes/EnquiryList"))}
      />
      <Route
        path={`${match.url}/MyBookings`}
        component={asyncComponent(() => import("./routes/EnquiryList"))}
      />
      <Route
        path={`${match.url}/ThirdPartyCall`}
        component={asyncComponent(() => import("./routes/ThirdPartyCall"))}
      />

      <Route
        path={`${match.url}/ListOfCustomer`}
        component={asyncComponent(() => import("./routes/ListOfCustomer"))}
      />
      <Route
        path={`${match.url}/MyCustomers`}
        component={asyncComponent(() => import("./routes/ListOfCustomer"))}
      />
      
      <Route
        path={`${match.url}/ManageTraining`}
        component={asyncComponent(() => import("./routes/ManageTraining"))}
      />
      <Route
        path={`${match.url}/ListOfPolicies`}
        component={asyncComponent(() => import("./routes/ListOfPolicies"))}
      />
      <Route
        path={`${match.url}/Reports`}
        component={asyncComponent(() => import("./routes/Reports"))}
      />
      <Route
        path={`${match.url}/MyPolicies`}
        component={asyncComponent(() => import("./routes/ListOfPolicies"))}
      />
      <Route
        path={`${match.url}/UserManagement`}
        component={asyncComponent(() => import("./routes/UserManagement"))}
      />
      <Route
        path={`${match.url}/AddUserManagement`}
        component={asyncComponent(() => import("./routes/AddUserManagement"))}
      />
      <Route
        path={`${match.url}/EditUserManagement`}
        component={asyncComponent(() => import("./routes/EditUserManagement"))}
      />
      <Route
        path={`${match.url}/RoleManagement`}
        component={asyncComponent(() => import("./routes/RoleManagement"))}
      />
      <Route
        path={`${match.url}/AddRoleManagement`}
        component={asyncComponent(() => import("./routes/AddRoleManagement"))}
      />
      <Route
        path={`${match.url}/EditRoleManagement`}
        component={asyncComponent(() => import("./routes/EditRoleManagement"))}
      />
      <Route
        path={`${match.url}/agentmapping`}
        component={asyncComponent(() => import("./routes/AgentMapping"))}
      />
      <Route
        path={`${match.url}/EditAgentMapping`}
        component={asyncComponent(() => import("./routes/EditAgentMapping"))}
      />
      <Route
        path={`${match.url}/CommissionManagement`}
        component={asyncComponent(() =>
          import("./routes/CommissionManagement")
        )}
      />
      <Route
        path={`${match.url}/CommissionLedger`}
        component={asyncComponent(() => import("./routes/CommissionLedger"))}
      />
      <Route
        path={`${match.url}/ProductTypes`}
        component={asyncComponent(() => import("./routes/ProductTypes"))}
      />
      <Route
        path={`${match.url}/SubCategoryMaster`}
        component={asyncComponent(() => import("./routes/SubCategoryMaster"))}
      />
      <Route
        path={`${match.url}/TicketingSystem`}
        component={asyncComponent(() => import("./routes/TicketingSystem"))}
      />
      <Route
        path={`${match.url}/Settings`}
        component={asyncComponent(() => import("./routes/Settings"))}
      />
      <Route
        path={`${match.url}/Configuration`}
        component={asyncComponent(() => import("./routes/Configuration"))}
      />
      <Route
        path={`${match.url}/InsuranceProviders`}
        component={asyncComponent(() => import("./routes/InsuranceProviders"))}
      />
      <Route
        path={`${match.url}/AddInsuranceProvider`}
        component={asyncComponent(() =>
          import("./routes/AddInsuranceProvider")
        )}
      />
      <Route
        path={`${match.url}/EditInsuranceProvider`}
        component={asyncComponent(() =>
          import("./routes/EditInsuranceProvider")
        )}
      />
      <Route
        path={`${match.url}/CoreDataTypes`}
        component={asyncComponent(() => import("./routes/CoreDataTypes"))}
      />
      <Route
        component={asyncComponent(() =>
          import("app/routes/extraPages/routes/404")
        )}
      />
    </Switch>
  </div>
);

export default Dashboard;
