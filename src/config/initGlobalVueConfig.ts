import {markRaw} from 'vue';
import {StandardCaseFormats, StandardIdNamingStrategies} from '@nestorrente/erdiagram';

export default function initGlobalVueConfig() {
	markStandardCaseFormatsAsRaw();
}

function markStandardCaseFormatsAsRaw() {
	Object.values(StandardIdNamingStrategies).map(caseFormat => markRaw(caseFormat));
	Object.values(StandardCaseFormats).map(caseFormat => markRaw(caseFormat));
}
