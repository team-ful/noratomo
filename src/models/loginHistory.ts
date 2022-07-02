import {Device} from '../base/base';

export interface LoginHistoryModel {
  id: number;
  user_id: number;
  ip_address: string;
  device_name: Device | null;
  os: string | null;
  is_phone: boolean | null;
  is_tablet: boolean | null;
  is_desktop: boolean | null;
  blowser_name: string | null;
  login_date: Date;
}

class LoginHistory implements LoginHistoryModel {
  readonly id: number;
  readonly user_id: number;
  readonly ip_address: string;
  readonly device_name: Device | null;
  readonly os: string | null;
  readonly is_phone: boolean | null;
  readonly is_tablet: boolean | null;
  readonly is_desktop: boolean | null;
  readonly blowser_name: string | null;
  readonly login_date: Date;

  constructor(init: {[key: string]: any}) {
    this.id = init.id;
    this.user_id = init.user_id;

    this.ip_address = init["INET6_NTOA(ip_address)"];
    this.device_name = this.parseDevice(init.device_name as string | null);
    this.os = init.os;

    this.is_phone = init.is_phone;
    this.is_desktop = init.is_desktop;
    this.is_tablet = init.is_tablet;

    this.blowser_name = init.blowser_name;
    this.login_date = new Date(init.login_date);
  }

  private parseDevice(d: string | null): Device | null {
    if (d === null) {
      return null;
    }

    switch (d) {
      case 'Console':
        return Device.Console;
      case 'Mobile':
        return Device.Mobile;
      case 'Tablet':
        return Device.Tablet;
      case 'Desktop':
        return Device.Desktop;
      case 'SmartTV':
        return Device.SmartTV;
      case 'Wearable':
        return Device.Wearable;
      case 'Embedded':
        return Device.Embedded;
      default:
        return Device.Desktop;
    }
  }
}

export default LoginHistory;
