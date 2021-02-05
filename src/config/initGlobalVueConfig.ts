import {markRaw} from 'vue';
import {StandardCaseFormats} from '@nestorrente/erdiagram';

export default function initGlobalVueConfig() {
	markStandardCaseFormatsAsRaw();
}

function markStandardCaseFormatsAsRaw() {
	Object.values(StandardCaseFormats).map(caseFormat => markRaw(caseFormat));
}
