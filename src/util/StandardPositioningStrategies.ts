import {getTranslatePosition, parsePixelsAmount} from '@/util/css-utils';
import PositioningStrategy from '@/util/PositioningStrategy';

const scrollPositiningStrategy: PositioningStrategy = {
	getElementPosition(element) {
		return {
			x: -element.scrollLeft,
			y: -element.scrollTop,
		};
	},
	setElementPosition(element, newPosition) {
		element.scrollLeft = -newPosition.x;
		element.scrollTop = -newPosition.y;
	}
};

const transformPositiningStrategy: PositioningStrategy = {
	getElementPosition(element) {
		return getTranslatePosition(element);
	},
	setElementPosition(element, newPosition) {
		element.style.transform = `translate(${newPosition.x}px, ${newPosition.y}px)`;
	}
};

const POSITION_X_CSS_PROPERTY = '--position-x';
const POSITION_Y_CSS_PROPERTY = '--position-y';

const cssVariablePositioningStrategy: PositioningStrategy = {
	getElementPosition(element) {
		return {
			x: parsePixelsAmount(getComputedStyle(element).getPropertyValue(POSITION_X_CSS_PROPERTY)),
			y: parsePixelsAmount(getComputedStyle(element).getPropertyValue(POSITION_Y_CSS_PROPERTY))
		};
	},
	setElementPosition(element, newPosition) {
		element.style.setProperty(POSITION_X_CSS_PROPERTY, `${newPosition.x}px`);
		element.style.setProperty(POSITION_Y_CSS_PROPERTY, `${newPosition.y}px`);
	}
};

const StandardPositioningStrategies = {
	SCROLL: scrollPositiningStrategy,
	TRANSFORM: transformPositiningStrategy,
	CSS_VARIABLE: cssVariablePositioningStrategy
};

export default StandardPositioningStrategies;
