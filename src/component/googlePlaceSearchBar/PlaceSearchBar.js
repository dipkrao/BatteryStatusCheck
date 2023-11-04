import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const GOOGLE_PLACES_API_KEY = 'AIzaSyCnZBgYngvXzzdd5wTPBhluSBjOP2w7n4M'; 

const GooglePlacesSearch = (props) => {
const [pickupAddressLatitude, setPickupAddressLatitude] = useState(null);
const [pickupAddressLongitude, setPickupAddressLongitude] = useState(null);

const handleInputChange = (e) => {
  // Call the callback function to send data to the parent
  props.sendDataToParent(e);
};

  return (
    <View style={{ flex: 1 }}>
          <GooglePlacesAutocomplete
                placeholder="Search your address"
                fetchDetails={true}
                query={{
                  key: GOOGLE_PLACES_API_KEY,
                  language: 'en', // language of the results
                }}
                onPress={(data, details = null) => {
                  setPickupAddressLatitude(
                    JSON.stringify(details.geometry.location.lat),
                  );
                  setPickupAddressLongitude(
                    JSON.stringify(details.geometry.location.lng),
                  );
                  handleInputChange(details.geometry.location)
                }}
                styles={{
                  poweredContainer: {
                    display: 'none',
                  },
                  textInputContainer: {
                    width: '100%',
                  },
                  textInput: {
                    backgroundColor: 'white',
                    height: 45,
                    borderRadius: 5,
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    fontSize: 15,
                    flex: 1,
                  },
                }}
              />
    </View>
  );
};

export default GooglePlacesSearch;
