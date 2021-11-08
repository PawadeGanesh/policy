import React from 'react';
import clsx from 'clsx';
import Select from 'react-select';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import CancelIcon from '@material-ui/icons/Cancel';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import PropTypes from 'prop-types';

const suggestions = [
    {  label :'18 Years' },
    {  label :'19 Years' },
    {  label :'20 Years' },
    {  label :'21 Years' },
    {  label :'22 Years' },
    {  label :'23 Years' },
    {  label :'24 Years' },
    {  label :'25 Years' },
    {  label :'26 Years' },
    {  label :'27 Years' },
    {  label :'28 Years' },
    {  label :'29 Years' },
    {  label :'30 Years' },
    {  label :'31 Years' },
    {  label :'32 Years' },
    {  label :'33 Years' },
    {  label :'34 Years' },
    {  label :'35 Years' },
    {  label :'36 Years' },
    {  label :'37 Years' },
    {  label :'38 Years' },
    {  label :'39 Years' },
    {  label :'40 Years' },
    {  label :'41 Years' },
    {  label :'42 Years' },
    {  label :'43 Years' },
    {  label :'44 Years' },
    {  label :'45 Years' },
    {  label :'46 Years' },
    {  label :'47 Years' },
    {  label :'48 Years' },
    {  label :'49 Years' },
    {  label :'50 Years' },
    {  label :'51 Years' },
    {  label :'52 Years' },
    {  label :'53 Years' },
    {  label :'54 Years' },
    {  label :'55 Years' },
    {  label :'56 Years' },
    {  label :'57 Years' },
    {  label :'58 Years' },
    {  label :'59 Years' },
    {  label :'60 Years' },
    {  label :'61 Years' },
    {  label :'62 Years' },
    {  label :'63 Years' },
    {  label :'64 Years' },
    {  label :'65 Years' },
    {  label :'66 Years' },
    {  label :'67 Years' },
    {  label :'68 Years' },
    {  label :'69 Years' },
    {  label :'70 Years' },
    {  label :'71 Years' },
    {  label :'72 Years' },
    {  label :'73 Years' },
    {  label :'74 Years' },
    {  label :'75 Years' },
    {  label :'76 Years' },
    {  label :'77 Years' },
    {  label :'78 Years' },
    {  label :'79 Years' },
    {  label :'80 Years' },
    {  label :'81 Years' },
    {  label :'82 Years' },
    {  label :'83 Years' },
    {  label :'84 Years' },
    {  label :'85 Years' },
    {  label :'86 Years' },
    {  label :'87 Years' },
    {  label :'88 Years' },
    {  label :'89 Years' },
    {  label :'90 Years' },
    {  label :'91 Years' },
    {  label :'92 Years' },
    {  label :'93 Years' },
    {  label :'94 Years' },
    {  label :'95 Years' },
    {  label :'96 Years' },
    {  label :'97 Years' },
    {  label :'98 Years' },
    {  label :'99 Years' },    
].map(suggestion => ({
  value: suggestion.label,
  label: suggestion.label,
}));

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    height: 75,
  },
  input: {
    display: 'flex',
    padding: 0,
    height: 'auto',
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  chip: {
    margin: theme.spacing(0.5, 0.25),
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
      0.08,
    ),
  },
  noOptionsMessage: {
    padding: theme.spacing(1, 2),
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    bottom: 6,
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  divider: {
    height: theme.spacing(2),
  },
}));

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

NoOptionsMessage.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  selectProps: PropTypes.object.isRequired,
};

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

inputComponent.propTypes = {
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
};

function Control(props) {
  const {
    children,
    innerProps,
    innerRef,
    selectProps: { classes, TextFieldProps },
  } = props;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: classes.input,
          ref: innerRef,
          children,
          ...innerProps,
        },
      }}
      {...TextFieldProps}
    />
  );
}

Control.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  selectProps: PropTypes.object.isRequired,
};

function Option(props) {
  return (
    <MenuItem
      ref={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

Option.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  isFocused: PropTypes.bool,
  isSelected: PropTypes.bool,
};

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

Placeholder.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  selectProps: PropTypes.object.isRequired,
};

function SingleValue(props) {
  return (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

SingleValue.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  selectProps: PropTypes.object.isRequired,
};

function ValueContainer(props) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

ValueContainer.propTypes = {
  children: PropTypes.node,
  selectProps: PropTypes.object.isRequired,
};

function MultiValue(props) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={clsx(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused,
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  );
}

MultiValue.propTypes = {
  children: PropTypes.node,
  isFocused: PropTypes.bool,
  removeProps: PropTypes.object.isRequired,
  selectProps: PropTypes.object.isRequired,
};

function Menu(props) {
  return (
    <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
      {props.children}
    </Paper>
  );
}

Menu.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  selectProps: PropTypes.object,
};

const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};

function IntegrationReactSelect() {
  const classes = useStyles();
  const theme = useTheme();
  const [single, setSingle] = React.useState(null);
  const [multi, setMulti] = React.useState(null);

  function handleChangeSingle(value) {
    setSingle(value);
  }

  function handleChangeMulti(value) {
    setMulti(value);
  }

  const selectStyles = {
    input: base => ({
      ...base,
      color: theme.palette.text.primary,
      '& input': {
        font: 'inherit',
      },
    }),
  };

  return (
    <div className={classes.root}>
      <NoSsr>
        <Select
          classes={classes}
          styles={selectStyles}
          inputId="react-select-single"
          TextFieldProps={{
            label: 'Age',
            InputLabelProps: {
              htmlFor: 'react-select-single',
              shrink: true,
            },
            placeholder: 'Type in the age',
          }}
          options={suggestions}
          components={components}
          value={single}
          onChange={handleChangeSingle}
        />
      </NoSsr>
    </div>
  );
}

export default IntegrationReactSelect;