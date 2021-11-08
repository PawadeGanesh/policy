import React, {useState} from 'react';
import IconButton from '@material-ui/core/IconButton'
import CardMenu from '../CardMenu';
import {
  ListItemIcon,
  Modal,
  CircularProgress,
  TableHead,
  TableFooter,
  TableCell,
  TableBody,
  FormControl,
  Select,
  Toolbar,
  Tooltip,
  TableRow,
  TableSortLabel,
  TablePagination,
  Button,
  TextField,
  Grid,
  Card,
  Table,
  Typography,
  CardContent,
  MenuItem,
  InputLabel,
} from "@material-ui/core";
import IntlMessages from "util/IntlMessages";
import { useHistory } from "react-router-dom";


const CardHeader = (props) => {

  const [anchorE1, setAnchorE1] = useState(undefined);
  const [menuState, setMenuState] = useState(false);


  const onOptionMenuSelect = event => {
    setMenuState(true);
    setAnchorE1(event.currentTarget);
  };

  const handleRequestClose = () => {
    setMenuState(false);
  };
  let history = useHistory();
  const redirectpage=(e)=>{
    const { handleToggle } = props;
    history.push('/app/widgets/AllNotificationForUser')
    handleToggle();
  }

  
  const {heading, subHeading} = props;
  let {styleName} = props;

  
  return (
    <div className={`jr-card-header d-flex align-items-start ${styleName}`}>
      <div className="mr-auto">
        <h3 className="card-heading">{heading}</h3>
        {subHeading && <p className="sub-heading">{subHeading}</p>}
      </div>

      {/* <IconButton className="icon-btn text-dark" onClick={onOptionMenuSelect}>
        <i className="zmdi zmdi-chevron-down"/>
      </IconButton> */}
<Button variant="contained" className="btn btn-sm  bg-primary text-white"
onClick={e=>redirectpage(e)}
>
                               <IntlMessages id="notificaton.button.name.viewall"/>
                                </Button>
      <CardMenu menuState={menuState} anchorEl={anchorE1}
                handleRequestClose={handleRequestClose}/>
    </div>
  )
};

export default CardHeader;
CardHeader.defaultProps = {
  styleName: '',
  subHeading: ''
};

