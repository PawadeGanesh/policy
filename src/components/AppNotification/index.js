import React from 'react';

import NotificationItem from './NotificationItem';
// eslint-disable-next-line no-unused-vars
import {notifications} from './data';
import CustomScrollbars from 'util/CustomScrollbars';

const AppNotification = () => {
  return (
    <CustomScrollbars className="messages-list scrollbar" style={{height: 280}}>
      <ul className="list-unstyled">
        {/* {notifications.map((notification, index) => <NotificationItem key={index} notification={notification}/>) */}
        <NotificationItem />
      </ul>
    </CustomScrollbars>
  )
};

export default AppNotification;

