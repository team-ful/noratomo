import {Center, Tooltip} from '@chakra-ui/react';
import {
  IoDesktopOutline,
  IoHelpOutline,
  IoPhonePortraitOutline,
  IoTabletPortraitOutline,
} from 'react-icons/io5';
import {Device, LoginHistoryUserElements} from '../../utils/types';

const DeviceIcon = ({item}: {item: LoginHistoryUserElements}) => {
  const deviceIcon = () => {
    switch (item.device_name) {
      case Device.Mobile:
        return (
          <Tooltip label="スマートフォン" placement="top">
            <Center>
              <IoPhonePortraitOutline size="25px" />
            </Center>
          </Tooltip>
        );
      case Device.Desktop:
        return (
          <Tooltip label="デスクトップ" placement="top">
            <Center>
              <IoDesktopOutline size="25px" />
            </Center>
          </Tooltip>
        );
      case Device.Tablet:
        return (
          <Tooltip label="タブレット" placement="top">
            <Center>
              <IoTabletPortraitOutline size="25px" />
            </Center>
          </Tooltip>
        );
      default:
        return (
          <Tooltip label="不明" placement="top">
            <Center>
              <IoHelpOutline size="25px" />
            </Center>
          </Tooltip>
        );
    }
  };
  return <>{deviceIcon()}</>;
};

export default DeviceIcon;
