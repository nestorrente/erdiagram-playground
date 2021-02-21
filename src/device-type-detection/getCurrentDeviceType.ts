import DeviceType from './DeviceType';

const userAgent: string = navigator.userAgent
		|| navigator.vendor
		// @ts-expect-error
		|| window.opera
;

const currentDeviceType: DeviceType = (() => {

	if (/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(userAgent)) {
		return DeviceType.TABLET;
	}

	if (/(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|nintendo ds|archos|skyfire|puffin|blazer|bolt|gobrowser|iris|maemo|semc|teashark|uzard)/i.test(userAgent)) {
		return DeviceType.PHONE;
	}

	return DeviceType.DESKTOP;

})();

export default function getCurrentDeviceType(): DeviceType {
	return currentDeviceType;
}
