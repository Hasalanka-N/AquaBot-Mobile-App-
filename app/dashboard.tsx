import BottomNavBar from '@/components/NavBar';
import SensorCard from '@/components/SensorCard';
import { FontAwesome5 } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';

import { onValue, ref } from 'firebase/database';
import { database } from './firebaseConfig';

export const unstable_settings = { headerShown: false };

type BoatLocation = {
  latitude: number;
  longitude: number;
};

type SensorData = {
  turbidity: number;
  tds: number;
};

type user = {
  name: string;
}

export default function Dashboard() {
  const [boatLocation, setBoatLocation] = useState<BoatLocation>({
    latitude: 6.927155,
    longitude: 79.861255,
  });

  const [sensorData, setSensorData] = useState<SensorData>({
    turbidity: 0,
    tds: 0,
  });

    const [user, setuser] = useState<user>({
    name: '',
  });

  useEffect(() => {
    // Reference to robot location
    const locationRef = ref(database, 'robot/location');
    onValue(locationRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setBoatLocation({
          latitude: data.latitude,
          longitude: data.longitude,
        });
      }
    });

    // Reference to robot sensors
    const sensorsRef = ref(database, 'robot/sensors');
    onValue(sensorsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSensorData({
          turbidity: data.turbidity,
          tds: data.tds,
        });
      }
    });

    const userRef = ref(database, 'robot/user');
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setuser({
          name: data.name,
        });
      }
    });
    
  }, []);

  const isTurbiditySafe = sensorData.turbidity <= 5;
  const isTDSSafe = sensorData.tds <= 500;

  const region: Region = {
    latitude: boatLocation.latitude,
    longitude: boatLocation.longitude,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  return (
    <View style={styles.container}>
      <ImageBackground
          source={require('../assets/images/bg.jpg')}
          style={styles.statusBar}
          resizeMode="cover">
      <View style={styles.statusBar}>
        <ImageBackground
          source={require('../assets/images/bg.jpg')}
          style={styles.statusBar}
          resizeMode="cover"
        >
          <View style={styles.userdataview}>
            <Text style={styles.userdata}>Welcome</Text>
            <Text style={styles.username}>{user.name}</Text>
          </View>

          <View style={styles.mapcon}>
            <MapView style={styles.map} initialRegion={region} region={region}>
              <Marker coordinate={boatLocation}>
                <FontAwesome5 name="ship" size={32} color="#1E90FF" />
              </Marker>
            </MapView>
          </View>
        </ImageBackground>
      </View>

      <View style={styles.content}>
        <View style={styles.cardsection}>
        <SensorCard
          iconName="water-outline"
          label="Turbidity"
          value={sensorData.turbidity}
          unit="NTU"
          isSafe={isTurbiditySafe}
        />

        <SensorCard
          iconName="chemical-weapon"
          label="TDS"
          value={sensorData.tds}
          unit="ppm"
          isSafe={isTDSSafe}
        />
        </View>
      </View>

      <BottomNavBar />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(178, 231, 247, 0.95)',
  },
  statusBar: {
    padding: 0,
    flex:1.8,
    justifyContent: 'flex-end',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    gap: '4%',
  },
  cardsection: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 50,
    flexDirection: 'row',
    gap: '4%',
    backgroundColor: 'rgba(255, 255, 255, 0.76)',
    borderBottomLeftRadius: 65,
    borderBottomRightRadius: 65,
    overflow: 'hidden',
    marginBottom:20
  },
  userdata: {
    fontSize: 18,
    fontWeight: '600',
  },
  username: {
    fontSize: 28,
    fontWeight: '900',
  },
  userdataview: {
    paddingTop: 25,
    paddingRight: 25,
    paddingBottom: 15,
    paddingLeft: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.76)',
    margin: 15,
    marginTop: 25,
    borderRadius: 15,
  },
  map: {
    width: '100%',
    height: 280,
    borderRadius: 12,
  },
  mapcon: {
    backgroundColor: '#fff',
    marginTop: 70,
    borderTopLeftRadius: 65,
    borderTopRightRadius: 65,
    overflow: 'hidden',
  },
});
