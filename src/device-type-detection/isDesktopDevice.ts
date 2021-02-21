import DeviceType from './DeviceType';
import getCurrentDeviceType from './getCurrentDeviceType';

export default function isDesktopDevice(deviceType: DeviceType = getCurrentDeviceType()): boolean {
	return deviceType === DeviceType.DESKTOP;
}
