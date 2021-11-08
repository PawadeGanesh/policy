import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import {withStyles} from '@material-ui/core/styles';

const suggestions = [
  {label : 'Mumbai'},
  {label : 'Delhi'},
  {label : 'Bangalore'},
  {label : 'Hyderabad'},
  {label : 'Ahmedabad'},
  {label : 'Chennai'},
  {label : 'Kolkata'},
  {label : 'Surat'},
  {label : 'Pune'},
  {label : 'Jaipur'},
  {label : 'Lucknow'},
  {label : 'Kanpur'},
  {label : 'Nagpur'},
  {label : 'Indore'},
  {label : 'Thane'},
  {label : 'Bhopal'},
  {label : 'Visakhapatnam'},
  {label : 'Pimpri-Chinchwad'},
  {label : 'Patna'},
  {label : 'Vadodara'},
  {label : 'Ghaziabad'},
  {label : 'Ludhiana'},
  {label : 'Agra'},
  {label : 'Nashik'},
  {label : 'Ranchi'},
  {label : 'Faridabad'},
  {label : 'Meerut'},
  {label : 'Rajkot'},
  {label : 'Kalyan-Dombivli'},
  {label : 'Vasai-Virar'},
  {label : 'Varanasi'},
  {label : 'Srinagar'},
  {label : 'Aurangabad'},
  {label : 'Dhanbad'},
  {label : 'Amritsar'},
  {label : 'Navi Mumbai'},
  {label : 'Allahabad'},
  {label : 'Howrah'},
  {label : 'Gwalior'},
  {label : 'Jabalpur'},
  {label : 'Coimbatore'},
  {label : 'Vijayawada'},
  {label : 'Jodhpur'},
  {label : 'Madurai'},
  {label : 'Raipur'},
  {label : 'Chandigarh'},
  {label : 'Guwahati'},
  {label : 'Solapur'},
  {label : 'Hubli–Dharwad'},
  {label : 'Mysore'},
  {label : 'Tiruchirappalli'},
  {label : 'Bareilly'},
  {label : 'Aligarh'},
  {label : 'Tiruppur'},
  {label : 'Gurgaon'},
  {label : 'Moradabad'},
  {label : 'Jalandhar'},
  {label : 'Bhubaneswar'},
  {label : 'Salem'},
  {label : 'Warangal'},
  {label : 'Mira-Bhayandar'},
  {label : 'Jalgaon'},
  {label : 'Kota'},
  {label : 'Guntur'},
  {label : 'Thiruvananthapuram'},
  {label : 'Bhiwandi'},
  {label : 'Saharanpur'},
  {label : 'Gorakhpur'},
  {label : 'Bikaner'},
  {label : 'Amravati'},
  {label : 'Noida'},
  {label : 'Jamshedpur'},
  {label : 'Bhilai'},
  {label : 'Cuttack'},
  {label : 'Firozabad'},
  {label : 'Kochi'},
  {label : 'Nellore'},
  {label : 'Bhavnagar'},
  {label : 'Dehradun'},
  {label : 'Durgapur'},
  {label : 'Asansol'},
  {label : 'Rourkela'},
  {label : 'Nanded'},
  {label : 'Kolhapur'},
  {label : 'Ajmer'},
  {label : 'Akola'},
  {label : 'Gulbarga'},
  {label : 'Jamnagar'},
  {label : 'Ujjain'},
  {label : 'Loni'},
  {label : 'Siliguri'},
  {label : 'Jhansi'},
  {label : 'Ulhasnagar'},
  {label : 'Jammu'},
  {label : 'Sangli-Miraj & Kupwad'},
  {label : 'Mangalore'},
  {label : 'Erode'},
  {label : 'Belgaum'},
  {label : 'Ambattur'},
  {label : 'Tirunelveli'},
  {label : 'Malegaon'},
  {label : 'Gaya'},
  {label : 'Udaipur'},
  {label : 'Kakinada'},
  {label : 'Davanagere'},
  {label : 'Kozhikode'},
  {label : 'Maheshtala'},
  {label : 'Rajpur Sonarpur'},
  {label : 'Rajahmundry'},
  {label : 'Bokaro'},
  {label : 'South Dumdum'},
  {label : 'Bellary'},
  {label : 'Patiala'},
  {label : 'Gopalpur'},
  {label : 'Agartala'},
  {label : 'Bhagalpur'},
  {label : 'Muzaffarnagar'},
  {label : 'Bhatpara'},
  {label : 'Panihati'},
  {label : 'Latur'},
  {label : 'Dhule'},
  {label : 'Tirupati'},
  {label : 'Rohtak'},
  {label : 'Sagar'},
  {label : 'Korba'},
  {label : 'Bhilwara'},
  {label : 'Berhampur'},
  {label : 'Muzaffarpur'},
  {label : 'Ahmednagar'},
  {label : 'Mathura'},
  {label : 'Kollam'},
  {label : 'Avadi'},
  {label : 'Kadapa'},
  {label : 'Kamarhati'},
  {label : 'Sambalpur'},
  {label : 'Bilaspur'},
  {label : 'Shahjahanpur'},
  {label : 'Satara'},
  {label : 'Bijapur'},
  {label : 'Kurnool'},
  {label : 'Rampur'},
  {label : 'Shimoga'},
  {label : 'Chandrapur'},
  {label : 'Junagadh'},
  {label : 'Thrissur'},
  {label : 'Alwar'},
  {label : 'Bardhaman'},
  {label : 'Kulti'},
  {label : 'Nizamabad'},
  {label : 'Parbhani'},
  {label : 'Tumkur'},
  {label : 'Khammam'},
  {label : 'Ozhukarai'},
  {label : 'Bihar Sharif'},
  {label : 'Panipat'},
  {label : 'Darbhanga'},
  {label : 'Bally'},
  {label : 'Aizawl'},
  {label : 'Dewas'},
  {label : 'Ichalkaranji'},
  {label : 'Karnal'},
  {label : 'Bathinda'},
  {label : 'Jalna'},
  {label : 'Eluru'},
  {label : 'Barasat'},
  {label : 'Kirari Suleman Nagar'},
  {label : 'Purnia'},
  {label : 'Satna'},
  {label : 'Mau'},
  {label : 'Sonipat'},
  {label : 'Farrukhabad'},
  {label : 'Durg'},
  {label : 'Imphal'},
  {label : 'Ratlam'},
  {label : 'Hapur'},
  {label : 'Arrah'},
  {label : 'Anantapur'},
  {label : 'Karimnagar'},
  {label : 'Etawah'},
  {label : 'Ambarnath'},
  {label : 'North Dumdum'},
  {label : 'Bharatpur'},
  {label : 'Begusarai'},
  {label : 'New Delhi'},
  {label : 'Gandhidham'},
  {label : 'Baranagar'},
  {label : 'Tiruvottiyur'},
  {label : 'Pondicherry'},
  {label : 'Sikar'},
  {label : 'Thoothukudi'},
  {label : 'Rewa'},
  {label : 'Mirzapur'},
  {label : 'Raichur'},
  {label : 'Pali'},
  {label : 'Ramagundam'},
  {label : 'Silchar'},
  {label : 'Haridwar'},
  {label : 'Vijayanagaram'},
  {label : 'Tenali'},
  {label : 'Nagercoil'},
  {label : 'Sri Ganganagar'},
  {label : 'Karawal Nagar'},
  {label : 'Mango'},
  {label : 'Thanjavur'},
  {label : 'Bulandshahr'},
  {label : 'Uluberia'},
  {label : 'Katni'},
  {label : 'Sambhal'},
  {label : 'Singrauli'},
  {label : 'Nadiad'},
  {label : 'Secunderabad'},
  {label : 'Naihati'},
  {label : 'Yamunanagar'},
  {label : 'Bidhannagar'},
  {label : 'Pallavaram'},
  {label : 'Bidar'},
  {label : 'Munger'},
  {label : 'Panchkula'},
  {label : 'Burhanpur'},
  {label : 'Raurkela Industrial Township'},
  {label : 'Kharagpur'},
  {label : 'Dindigul'},
  {label : 'Gandhinagar'},
  {label : 'Hospet'},
  {label : 'Nangloi Jat'},
  {label : 'Malda'},
  {label : 'Ongole'},
  {label : 'Deoghar'},
  {label : 'Chapra'},
  {label : 'Haldia'},
  {label : 'Khandwa'},
  {label : 'Nandyal'},
  {label : 'Morena'},
  {label : 'Amroha'},
  {label : 'Anand'},
  {label : 'Bhind'},
  {label : 'Bhalswa Jahangir Pur'},
  {label : 'Madhyamgram'},
  {label : 'Bhiwani'},
  {label : 'Berhampore'},
  {label : 'Ambala'},
  {label : 'Morbi'},
  {label : 'Fatehpur'},
  {label : 'Raebareli'},
  {label : 'Khora, Ghaziabad'},
  {label : 'Chittoor'},
  {label : 'Bhusawal'},
  {label : 'Orai'},
  {label : 'Bahraich'},
  {label : 'Phusro'},
  {label : 'Vellore'},
  {label : 'Mehsana'},
  {label : 'Raiganj'},
  {label : 'Sirsa'},
  {label : 'Danapur'},
  {label : 'Serampore'},
  {label : 'Sultan Pur Majra'},
  {label : 'Guna'},
  {label : 'Jaunpur'},
  {label : 'Panvel'},
  {label : 'Shivpuri'},
  {label : 'Surendranagar Dudhrej'},
  {label : 'Unnao'},
  {label : 'Chinsurah'},
  {label : 'Alappuzha'},
  {label : 'Kottayam'},
  {label : 'Machilipatnam'},
  {label : 'Shimla'},
  {label : 'Adoni'},
  {label : 'Udupi'},
  {label : 'Katihar'},
  {label : 'Proddatur'},
  {label : 'Mahbubnagar'},
  {label : 'Saharsa'},
  {label : 'Dibrugarh'},
  {label : 'Jorhat'},
  {label : 'Hazaribagh'},
  {label : 'Hindupur'},
  {label : 'Nagaon'},
  {label : 'Sasaram'},
  {label : 'Hajipur'},
  {label : 'Giridih'},
  {label : 'Bhimavaram'},
  {label : 'Kumbakonam'},
  {label : 'Bongaigaon'},
  {label : 'Dehri'},
  {label : 'Madanapalle'},
  {label : 'Siwan'},
  {label : 'Bettiah'},
  {label : 'Ramgarh'},
  {label : 'Tinsukia'},
  {label : 'Guntakal'},
  {label : 'Srikakulam'},
  {label : 'Motihari'},
  {label : 'Dharmavaram'},
  {label : 'Medininagar'},
  {label : 'Gudivada'},
  {label : 'Phagwara'},
  {label : 'Pudukkottai'},
  {label : 'Hosur'},
  {label : 'Narasaraopet'},
  {label : 'Suryapet'},
  {label : 'Miryalaguda'},
  {label : 'Tadipatri'},
  {label : 'Karaikudi'},
  {label : 'Kishanganj'},
  {label : 'Jamalpur'},
  {label : 'Ballia'},
  {label : 'Kavali'},
  {label : 'Tadepalligudem'},
  {label : 'Amaravati'},
  {label : 'Buxar'},
  {label : 'Tezpur'},
  {label : 'Jehanabad'},
  {label : 'Aurangabad'},
  {label : 'Gangtok'},
];

function renderInput(inputProps) {
  const {classes, ref, ...other} = inputProps;

  return (
    <TextField
      fullWidth
      inputref={ref}
      InputProps={{
        classes: {
          input: classes.input,
        },
        ...other,
      }}
    />
  );
}

function renderSuggestion(suggestion, {query, isHighlighted}) {
  const matches = match(suggestion.label, query);
  const parts = parse(suggestion.label, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) => {
          return part.highlight ? (
            <span key={String(index)} style={{fontWeight: 300}}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{fontWeight: 500}}>
              {part.text}
            </strong>
          );
        })}
      </div>
    </MenuItem>
  );
}

function renderSuggestionsContainer(options) {
  const {containerProps, children} = options;

  return (
    <div className="position-relative z-index-20">
      <Paper {...containerProps} square>
        {children}
      </Paper>
    </div>
  );
}

function getSuggestionValue(suggestion) {
  return suggestion.label;
}

function getSuggestions(value) {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : suggestions.filter(suggestion => {
      const keep =
        count < 5 && suggestion.label.toLowerCase().slice(0, inputLength) === inputValue;

      if (keep) {
        count += 1;
      }

      return keep;
    });
}

const styles = theme => ({
  container: {
    flexGrow: 1,
    position: 'relative',
    height: 100,
    width: '60%',
    margin: 'auto',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 3,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
});

class IntegrationAutosuggest extends React.Component {
  state = {
    value: '',
    suggestions: [],
  };

  handleSuggestionsFetchRequested = ({value}) => {
    this.setState({
      suggestions: getSuggestions(value),
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  handleChange = (event, {newValue}) => {
    this.setState({
      value: newValue,
    });
  };

  render() {
    const {classes} = this.props;

    return (
      <Autosuggest
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion,
        }}
        renderInputComponent={renderInput}
        suggestions={this.state.suggestions}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        renderSuggestionsContainer={renderSuggestionsContainer}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={{
          classes,
          placeholder: 'Search a city, Start typing',
          value: this.state.value,
          onChange: this.handleChange,
        }}
      />
    );
  }
}

IntegrationAutosuggest.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(IntegrationAutosuggest);