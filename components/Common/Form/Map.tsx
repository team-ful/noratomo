import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Skeleton,
  Text,
} from '@chakra-ui/react';
import {GoogleMap, Marker, useJsApiLoader} from '@react-google-maps/api';
import React from 'react';
import {useFormContext} from 'react-hook-form';

export interface MapForm {
  // dummy
  map: boolean;

  lat: number;
  lon: number;
}

interface Props {
  style: {
    width: string;
    height: string;
  };
  center?: {
    lat: number;
    lng: number;
  };
  zoom: number;

  children: React.ReactNode;
}

const Map: React.FC<Props> = props => {
  const [pinPosition, setPinPosition] =
    React.useState<google.maps.LatLngLiteral | null>(null);
  const {isLoaded} = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY || '',
  });

  const {
    setValue,
    formState: {errors},
  } = useFormContext<MapForm>();

  const onClick = React.useCallback((event: google.maps.MapMouseEvent) => {
    const latlon = event.latLng;
    if (latlon === null) return;

    const lat = latlon.lat();
    const lon = latlon.lng();

    setPinPosition({
      lat: lat,
      lng: lon,
    });
    setValue('map', true);
    setValue('lat', lat);
    setValue('lon', lon);
  }, []);

  return (
    <FormControl isInvalid={Boolean(errors.map)} mt="1rem">
      <FormLabel htmlFor="map">{props.children}</FormLabel>
      {isLoaded && typeof props.center !== 'undefined' ? (
        <GoogleMap
          mapContainerStyle={props.style}
          center={props.center}
          zoom={props.zoom}
          onClick={onClick}
        >
          {pinPosition && <Marker position={pinPosition} />}
        </GoogleMap>
      ) : (
        <Skeleton>
          <Box w={props.style.width} h={props.style.height}></Box>
        </Skeleton>
      )}
      {pinPosition ? (
        <Text>
          緯度: {pinPosition.lat}, 経度: {pinPosition.lng}
        </Text>
      ) : (
        <Text>ピン無し</Text>
      )}
      <FormErrorMessage>{errors.map && errors.map.message}</FormErrorMessage>
    </FormControl>
  );
};

export default Map;
