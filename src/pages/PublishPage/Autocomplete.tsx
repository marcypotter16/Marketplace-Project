import {useState} from "react";
import {province} from "../../Utils/province-sigle.ts";
import Autocomplete from "react-autocomplete";

export const AutocompleteProvince = () => {
  const [value, setValue] = useState('');
  const suggestionsData = province.map((provincia) => provincia.provincia);
    const [suggestions, setSuggestions] = useState(suggestionsData);
  // Function to handle input value change
  const handleChange = (e) => {
    setValue(e.target.value);
    fetchSuggestions(e.target.value)
  };

  // Function to handle suggestion selection
  const handleSelect = (value) => {
    setValue(value);
  };

  // Function to fetch suggestions based on input value
  const fetchSuggestions = (value) => {
    // Implement your logic to fetch suggestions from an API or data source
    // Update the `suggestions` state with the fetched suggestions
    const filteredSuggestions = suggestionsData.filter((suggestion) =>
        suggestion.toLowerCase().startsWith(value.trim().toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  };

  return (
    <Autocomplete
      value={value}
      items={suggestions}
      inputProps={{ className: 'border rounded-l w-5/6 p-1 px-2 mx-1 text-white' }}
      getItemValue={(item) => item}
      onChange={handleChange}
      onSelect={handleSelect}
      onMenuVisibilityChange={(isOpen) => {
        if (isOpen) {
          fetchSuggestions(value);
        }
      }}
      renderItem={(item, isHighlighted) => (
        <div
          key={item}
          className={`text-slate-400 text-sm py-1 px-2 ${ isHighlighted ? 'bg-gray-500' : '' }`}
        >
          {item}
        </div>
      )}
    />
  );
};
