import {Device} from '../base/base';
import {DefaultObject} from '../db/operator';

export interface LoginHistoryModel {
  id: number;
  user_id: number;
  ip_address: string;
  device_name: Device | null;
  os: string | null;
  is_phone: boolean | null;
  is_tablet: boolean | null;
  is_desktop: boolean | null;
  browser_name: string | null;
  login_date: Date;

  'INET6_NTOA(ip_address)'?: string;
}

interface LoginHistoryUserInfo {
  id: number;
  ip_address: string;
  device_name: Device | null;
  os: string | null;
  is_phone: boolean | null;
  is_desktop: boolean | null;
  is_tablet: boolean | null;
  browser_name: string | null;
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
  readonly browser_name: string | null;
  readonly login_date: Date;

  constructor(init: DefaultObject | LoginHistoryModel) {
    this.id = init.id as number;
    this.user_id = init.user_id as number;

    this.ip_address = init['INET6_NTOA(ip_address)'] as string;
    this.device_name = this.parseDevice(init.device_name as string | null);
    this.os = init.os as string;

    this.is_phone = init.is_phone as boolean;
    this.is_desktop = init.is_desktop as boolean;
    this.is_tablet = init.is_tablet as boolean;

    this.browser_name = init.browser_name as string;
    this.login_date = new Date(init.login_date as Date);
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

  public json(): LoginHistoryUserInfo {
    return {
      id: this.id,
      ip_address: this.ip_address,
      device_name: this.device_name,
      os: this.os,
      is_phone: this.is_phone,
      is_desktop: this.is_desktop,
      is_tablet: this.is_tablet,
      browser_name: this.browser_name,
      login_date: this.login_date,
    };
  }
}

export default LoginHistory;
