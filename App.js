
import React, { useEffect, useState } from 'react';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { enableLatestRenderer } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import BatterySaveModule from './src/component/batteryStatus/CheckBatteryStatus';
import GooglePlacesSearch from './src/component/googlePlaceSearchBar/PlaceSearchBar';

enableLatestRenderer();

function App() {
  const api_key = 'AIzaSyCaoW8YBv--CexPs_s10Z2eu-nMrkWa_p8';

  const [batteryMode, setBatteryMode] = useState(null);
  const [dataFromChild, setDataFromChild] = useState('');

  // Callback function to receive data from the child component
  const handleDataFromChild = (data) => {
    setDataFromChild(data);
  };
 
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [latitude, setlatitude] = useState(0);
  const [longitude, setlongitude] = useState(0);

// Here used Geolocation to fetch current location
  const locateCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      position => {
        setlatitude(position.coords.latitude);
        setlongitude(position.coords.longitude);
      },
    )
  }

  useEffect(() => {
    locateCurrentPosition();
  }, [])


  const batteryStatus =()=>{
    const onSuccess = (isEnabled) => {
      if (isEnabled) {
        setBatteryMode(true)
      } else {
        setBatteryMode(false)
      }
    };

    const onFailure = (error) => {
      console.error('Error checking power save mode:', error);
    };

        BatterySaveModule.isPowerSaveModeEnabled(onSuccess, onFailure);
  }
           
  const [currentLongitude, setCurrentLongitude] = useState('...');
  const [currentLatitude,setCurrentLatitude] = useState('...');
  const [locationStatus,setLocationStatus] = useState('');
  const pinColor = '#000000';
  const anotherregion = {
    latitude: dataFromChild?.lat || 28.6090,
    longitude:  dataFromChild?.lng || 76.9855,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };
  const currentregion = {
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };
  
  // Permission request when app is open
  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        getOneTimeLocation();
        subscribeLocationLocation();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: "Location Access Required",
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            getOneTimeLocation();
            subscribeLocationLocation();
          } else {
            setLocationStatus('Permission Denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };
    requestLocationPermission();
    return () => {
      Geolocation.clearWatch(watchID);
    };
  }, []);

// to fetch latitude and longitude
  const getOneTimeLocation = () => {
    setLocationStatus('Location ...');
    Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
        setLocationStatus('Current Longitude and Latitude');

        //getting the Longitude from the location json
        const currentLongitude =
          JSON.stringify(position.coords.longitude);
        // Alert.alert(JSON.stringify(position.coords.longitude));

        //getting the Latitude from the location json
        const currentLatitude =
          JSON.stringify(position.coords.latitude);
        
        // Alert.alert(JSON.stringify(position.coords.latitude));

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Longitude state
        setCurrentLatitude(currentLatitude);
      },
      (error) => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000
      },
    );
  };

  // after every 10 mins alert will be given of latitude and longitude
  useEffect(() => {
    const interval = setInterval(() => {
      getOneTimeLocation();
    }, 10000);
    return () => clearInterval(interval);
  })
  
  useEffect(() => {
    const interval = setInterval(() => {
      batteryStatus();
    }, 1000);
    return () => clearInterval(interval);
  })

  const subscribeLocationLocation = () => {
    watchID = Geolocation.watchPosition(
      (position) => {
        //Will give you the location on location change

        setLocationStatus('Current Location');
        console.log(position);

        //getting the Longitude from the location json        
        const currentLongitude =
          JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude =
          JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Latitude state
        setCurrentLatitude(currentLatitude);
      },
      (error) => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 1000
      },
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}> 
      <View style={styles.container}>
        <MapView
          style={{ flex: 1, width: "100%" }}
          zoomControlEnabled={true}
          initialRegion={{
            latitude: 28.6090,
            longitude: 76.9855,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onRegionChangeComplete={(region) => setRegion(region)}
          region={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            draggable
            coordinate={{latitude: latitude,longitude: longitude,}}
            onDragEnd={(e) => Alert.alert(JSON.stringify(e.nativeEvent.coordinate))}
          />

          <Marker coordinate={anotherregion} pinColor={pinColor} />
         
          {/* <Polyline
            coordinates={[currentregion, anotherregion]} //specify our coordinates
            strokeColor={'#FF000'} 
            strokeWidth={3}
          /> */}
         
        <MapViewDirections
            origin={currentregion}
            destination={anotherregion}
            apikey={api_key}
            strokeWidth={2}
            strokeColor="red"
          />
        </MapView>
        <View style={{flex:1,position:'absolute',width:'90%',top:10}}>
        <GooglePlacesSearch sendDataToParent={handleDataFromChild}/>
        </View>
      <View style={styles.locationrow}>
          <Text style={styles.boldText}>{locationStatus}</Text>
          <Text style={styles.boldText}>Power Saving Mode: {batteryMode ? 'on' : 'off'}</Text>
     </View>
     <View style={{flexDirection:'row'}}>

        <Text
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 5,
          }}>
          Long: {currentLongitude}
        </Text>
        <Text>{'   '}</Text>
        <Text
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 5
          }}>
          Lat: {currentLatitude}
        </Text>
     </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  locationrow:{
    // flexDirection:'row',
    justifyContent:'space-between'
},
  boldText: {
    fontSize: 15,
    color: '#000000',
    marginVertical: 16,
    textAlign: 'center'
  },
});

export default App;
