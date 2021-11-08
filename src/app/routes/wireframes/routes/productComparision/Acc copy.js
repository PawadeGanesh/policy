import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
});

class ControlledExpansionPanels extends Component {
  state = {
    expanded: null,
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  render() {
    const {classes} = this.props;
    const {expanded} = this.state;

    return (
      <div className={classes.root}>
        <ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handleChange('panel1')}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
            <Typography className={classes.heading}>Top Features</Typography>
            <Typography className={classes.secondaryHeading}></Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
                <div>
                    <div className="row">
                        <div className=" col-md-3">Feature 1</div>
                        <div className=" col-md-3">Data comes here </div>
                        <div className=" col-md-3">Data comes here </div>
                        <div className=" col-md-3">Data comes here </div>
                    </div>
                    <Divider inset/>
                    <div className="row">
                        <div className=" col-md-3">Feature 2</div>
                        <div className=" col-md-3">Data comes here </div>
                        <div className=" col-md-3">Data comes here </div>
                        <div className=" col-md-3">Data comes here </div>
                    </div>
                </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel expanded={expanded === 'panel2'} onChange={this.handleChange('panel2')}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
            <Typography className={classes.heading}>In-patient Care</Typography>
            <Typography className={classes.secondaryHeading}>
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            
          <List className="w-100">
                <ListItem button>      
                    <div className="row w-100">  
                        <ListItemAvatar className=" col-md-3" >
                            <Avatar>
                                <i className="zmdi zmdi-collection-folder-image zmdi-hc-fw text-white"/>
                            </Avatar>
                        </ListItemAvatar>          
                        <ListItemText className=" col-md-3" primary="Work" secondary="Jan 28, 2017"/>
                        <ListItemText className=" col-md-3" primary="Work" secondary="Jan 28, 2017"/>
                        <ListItemText className=" col-md-3" primary="Work" secondary="Jan 28, 2017"/>
                    </div>  
                </ListItem>
                <Divider inset/>
                <ListItem button>  
                    <div className="row w-100">   
                        <ListItemAvatar className=" col-md-3" >
                            <Avatar>
                                <i className="zmdi zmdi-collection-folder-image zmdi-hc-fw text-white"/>
                            </Avatar>
                        </ListItemAvatar>           
                        <ListItemText className=" col-md-3" primary="Work" secondary="Jan 28, 2017"/>
                        <ListItemText className=" col-md-3" primary="Work" secondary="Jan 28, 2017"/>
                        <ListItemText className=" col-md-3" primary="Work" secondary="Jan 28, 2017"/>
                    </div> 
                </ListItem>
                <Divider inset/>
                <ListItem button>  
                    <div className="row w-100">    
                        <ListItemAvatar className=" col-md-3" >
                            <Avatar>
                                <i className="zmdi zmdi-collection-folder-image zmdi-hc-fw text-white"/>
                            </Avatar>
                        </ListItemAvatar>          
                        <ListItemText className=" col-md-3" primary="Work" secondary="Jan 28, 2017"/>
                        <ListItemText className=" col-md-3" primary="Work" secondary="Jan 28, 2017"/>
                        <ListItemText className=" col-md-3" primary="Work" secondary="Jan 28, 2017"/>
                    </div> 
                </ListItem>
            </List>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel expanded={expanded === 'panel3'} onChange={this.handleChange('panel3')}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
            <Typography className={classes.heading}>Emergency Coverage</Typography>
            <Typography className={classes.secondaryHeading}>
              
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit amet egestas
              eros, vitae egestas augue. Duis vel est augue.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

ControlledExpansionPanels.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ControlledExpansionPanels);