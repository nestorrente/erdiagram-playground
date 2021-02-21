import DeviceType from './DeviceType';
import getCurrentDeviceType from './getCurrentDeviceType';

export default function isMobileDevice(deviceType: DeviceType = getCurrentDeviceType()): boolean {
	return deviceType !== DeviceType.DESKTOP;
}
