import {
  Skeleton,
  Box,
  Select,
  FormControl,
  FormLabel,
  Button,
  FormErrorMessage,
} from '@chakra-ui/react';
import {
  GoogleMap,
  Marker,
  Circle,
  useJsApiLoader,
} from '@react-google-maps/api';
import {useRouter} from 'next/router';
import React from 'react';
import {useForm, SubmitHandler} from 'react-hook-form';

interface Props {
  style: {
    width: string;
    height: string;
  };
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
}

interface Form {
  map: boolean;
  lat: number;
  lon: number;
  range: number;
}

const SearchLatLon: React.FC<Props> = props => {
  const [pinPosition, setPinPosition] =
    React.useState<google.maps.LatLngLiteral>();
  const [range, setRange] = React.useState(3);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: {errors, isSubmitting},
  } = useForm<Form>();
  const router = useRouter();
  const {isLoaded} = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY || '',
  });

  const onClick = React.useCallback((event: google.maps.MapMouseEvent) => {
    const latlon = event.latLng;
    if (latlon === null) return;

    const lat = latlon.lat();
    const lon = latlon.lng();

    setPinPosition({
      lat: lat,
      lng: lon,
    });
    setValue('lat', lat);
    setValue('lon', lon);
    setValue('map', true);

    clearErrors('map');
  }, []);

  const onSubmit: SubmitHandler<Form> = data => {
    if (!data.map) {
      setError('map', {
        message: 'ピンを刺してください',
      });
      return;
    }

    router.push(
      `/entry/create/search?lat=${encodeURIComponent(
        data.lat
      )}&lon=${encodeURIComponent(data.lon)}&range=${encodeURIComponent(
        data.range
      )}`
    );
  };

  const getRadius = (): number => {
    switch (range) {
      case 1:
        return 300;
      case 2:
        return 500;
      case 3:
        return 1000;
      case 4:
        return 2000;
      case 5:
        return 3000;
      default:
        return 0;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={Boolean(errors.map)}>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={props.style}
            center={props.center}
            zoom={props.zoom}
            onClick={onClick}
          >
            {pinPosition && <Pin position={pinPosition} radius={getRadius()} />}
          </GoogleMap>
        ) : (
          <Skeleton>
            <Box w={props.style.width} h={props.style.height}></Box>
          </Skeleton>
        )}
        <FormErrorMessage>{errors.map && errors.map.message}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={Boolean(errors.range)} mt="1rem">
        <FormLabel htmlFor="range">半径</FormLabel>
        <Select
          placeholder="半径を指定"
          {...register('range')}
          onChange={v => {
            setRange(parseInt(v.target.value));
          }}
          value={range}
        >
          <option value="1">300m</option>
          <option value="2">500m</option>
          <option value="3">1000m</option>
          <option value="4">2000m</option>
          <option value="5">3000m</option>
        </Select>
        <FormErrorMessage>
          {errors.range && errors.range.message}
        </FormErrorMessage>
      </FormControl>
      <Button
        mt="1rem"
        type="submit"
        w="100%"
        isLoading={isSubmitting}
        colorScheme="gray"
      >
        検索する
      </Button>
    </form>
  );
};

const Pin = React.memo<{
  position: google.maps.LatLngLiteral;
  radius: number;
}>(({position, radius}) => {
  console.log('rend');
  return (
    <>
      <Marker position={position} noClustererRedraw={true} />
      <Circle
        center={position}
        radius={radius}
        options={{
          fillColor: '#FC8181',
          strokeColor: '#C53030',
        }}
      />
    </>
  );
});

Pin.displayName = 'pin';

export default SearchLatLon;
