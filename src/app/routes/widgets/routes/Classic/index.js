import React, {useState} from 'react';

import MonthlyRevenue from 'components/dashboard/default/MonthlyRevenue';
import {
  cardData,
  cardData1,
  cardData2,
  connections,
  data1,
  expanseData,
  todoData
} from 'app/routes/dashboard/routes/data'
import {VectorMap} from "react-jvectormap";
import ProductImage from 'components/dashboard/eCommerce/ProductImage';
import InfoCard from 'components/InfoCard/index';
import InFoWithBgImage from 'components/InFoWithBgImage/index';
import UserDetailCard from 'components/UserDetailCard/index';
import SimpleToDo from 'components/ToDoCard/index';
import ChartCard from 'components/dashboard/Common/ChartCard';
import {Line, LineChart, ResponsiveContainer,} from 'recharts';
import UserDetailTable from 'components/dashboard/Common/UserDetailTable';
import UserProfileCard from 'components/dashboard/Common/userProfileCard/UserProfileCard';
import MarketingTable from 'components/dashboard/Common/MarketingTable';
import PhotoCollage from 'components/dashboard/Common/PhotoCollage/index';
import LatestNotifications from 'components/dashboard/Common/LatestNotifications';
import RecentActivities from 'components/dashboard/Common/RecentActivities/index';
import {dailyFeedData, recentList} from 'app/routes/dashboard/routes/Intranet/data';
import ProjectsList from 'components/dashboard/Common/ProjectsList';
import YourDailyFeed from 'components/dashboard/Common/DailyFeed/index';
import TimerView from 'components/dashboard/Common/TimerView/index';
import ContactCard from 'components/Cards/Contact/index';
import SimpleCard from 'components/Cards/Sample/index';
import PopularProduct from 'components/dashboard/Common/PopularProduct';
import WeatherDetail from 'components/Weather/WeatherDetail';
import IconButton from '@material-ui/core/IconButton';
import LatestPosts from 'components/dashboard/Common/LatestPosts/index';
import {latestPostList, marketingData, products, projects} from 'app/routes/dashboard/routes/Misc/data';
import CustomerAroundWorld from 'components/dashboard/Common/CustomerAroundWorld';
import CafeCard from 'components/Cards/Cafe/index';
import Statistics from 'components/dashboard/default/Statistics';
import {announcementsNotification, appNotification} from '../../../dashboard/routes/News/data';
import CardMenu from 'components/dashboard/Common/CardMenu';
import ContainerHeader from 'components/ContainerHeader/index';
import CardHeader from 'components/dashboard/Common/CardHeader/index';
import CardBox from 'components/CardBox/index';
import SiteVisitor from 'components/dashboard/Common/SiteVisitor';
import IntlMessages from 'util/IntlMessages';
//import AuditInfo from './AuditInfo';

const ClassicWidget =(props)=> {

  const [anchorEl,setanchorEl]=useState();
  const [menuState,setMenuState]=useState(false);

  const onOptionMenuSelect = event => {
    setMenuState(true);
    setanchorEl(event.currentTarget);
  };

  const handleRequestClose = () => {
    setMenuState(false);
  };

    return (

      <div className="animated slideInUpTiny animation-duration-3">
        <ContainerHeader match={props.match} title={
          <IntlMessages id="sidebar.widgets"/>}/>
          {/* //<AuditInfo /> */}
          karthik

        </div>

    );
  }


export default ClassicWidget;
