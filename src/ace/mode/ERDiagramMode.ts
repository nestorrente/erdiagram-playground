// @ts-ignore
import ace, {Ace, Range as RangeType} from 'ace-builds';
// import erdiagramModeWorkerSourceCode from '@/ace/mode/erdiagram-mode-worker.js?raw';

type RequireFn = <T = any>(module: string) => T;
type Exports = any;

// @ts-ignore
ace.define('ace/mode/folding/erdiagram', ['require', 'exports'], function (require: RequireFn, exports: Exports) {

	const Range = require('../../range').Range as typeof RangeType;
	const BaseFoldMode = require('./fold_mode').FoldMode;

	const EMPTY_LINE_REGEX = /^\s*$/;
	const COMMENTED_LINE_REGEX = /^\s*#/;
	const INDENTED_LINE_REGEX = /^[ \t]/;

	exports.FoldMode = class FoldMode extends BaseFoldMode {

		// regular expressions that identify starting and stopping points
		public foldingStartMarker = /^[A-Za-z_][A-Za-z_0-9]*$/;

		public getFoldWidgetRange(session: Ace.EditSession, _foldStyle: string, startRow: number) {

			const startLine = session.getLine(startRow);
			const allLines = session.getDocument().getAllLines();

			const entityEndRow = this.findEntityEndRow(startRow, allLines);

			if (entityEndRow === startRow) {
				return new Range(startRow, startLine.length, startRow, startLine.length);
			}

			return new Range(startRow, startLine.length, entityEndRow, allLines[entityEndRow].length);

		}

		private findEntityEndRow(startRow: number, allLines: string[]): number {

			let entityEndRow = startRow;

			for (let currentRow = startRow + 1; currentRow < allLines.length; ++currentRow) {

				const currentLine = allLines[currentRow];

				if (EMPTY_LINE_REGEX.test(currentLine) || COMMENTED_LINE_REGEX.test(currentLine)) {
					// Empty line or comment
				} else if (INDENTED_LINE_REGEX.test(currentLine)) {
					// Indented line - still part of the entity
					entityEndRow = currentRow;
				} else {
					break;
				}

			}

			return entityEndRow;

		}

	};

});

interface SyntaxHighlightRule {
	token?: string | string[] | ((text: string) => string | string[]);
	regex: RegExp;
	next?: string;
}

// @ts-ignore
ace.define('ace/mode/erdiagram_highlight_rules', ['require', 'exports'], function (require: RequireFn, exports: Exports) {

	const TextHighlightRules = require('./text_highlight_rules').TextHighlightRules;

	exports.ErdHighlightRules = class ErdHighlightRules extends TextHighlightRules {
		constructor() {
			super();
			this.$rules = this.getRules();
		}

		private getRules(): Record<string, SyntaxHighlightRule[]> {
			const EMPTY_LINE_RULE = {
				token: 'text',
				regex: /^\s+$/,
			};
			const COMMENT_RULE = {
				token: ['text', 'comment.line.number-sign'],
				regex: /^(\s*)(#.*)$/,
				next: 'start'
			};
			const DEFAULT_INVALID_RULE = {
				token: 'invalid.illegal',
				regex: /.*$/,
				next: 'start'
			};
			return {
				'start': [
					{
						// Entity name (only)
						token: ['storage.type', 'text', 'comment.line.number-sign'], // String, Array, or Function: the CSS token to apply
						regex: /^([A-Za-z_][A-Za-z_0-9]*)(\s*)(#.*)?$/
					},
					{
						// Entity name (and something more)
						token: ['storage.type', 'text'],
						regex: /^([A-Za-z_][A-Za-z_0-9]*)(\s*)/,
						next: 'afterEntityName'
					},
					COMMENT_RULE,
					EMPTY_LINE_RULE,
					{
						token: 'text',
						regex: /^\s+/,
						next: 'entityPropertyName'
					},
					DEFAULT_INVALID_RULE,
				],
				afterEntityName: [
					{
						// token: ['markup.other', 'markup.italic', 'constant.language', 'markup.italic', 'markup.other'],
						token: ['variable.other', 'constant.language'],
						regex: /([A-Za-z_][A-Za-z_0-9]*\s+)?([?!]*[*1]?(?:->|<->?)[*1]?[?!]*)/,
						next: 'waitingRelationshipRightEntity'
					},
					DEFAULT_INVALID_RULE,
				],
				waitingRelationshipRightEntity: [
					{
						token: ['text', 'storage.type', 'variable.other', 'text', 'comment.line.number-sign'],
						regex: /(\s*)([A-Za-z_][A-Za-z_0-9]*)(\s+[A-Za-z_][A-Za-z_0-9]*)?(\s*)(#.*)?$/,
						next: 'start'
					},
					{
						token: ['text', 'storage.type', 'variable.other', 'text'],
						regex: /(\s*)([A-Za-z_][A-Za-z_0-9]*)(\s+[A-Za-z_][A-Za-z_0-9]*)?(\s*)/,
						next: 'waitingRelationshipName'
					},
					DEFAULT_INVALID_RULE,
				],
				waitingRelationshipName: [
					{
						token: ['text', 'variable.other', 'text', 'comment.line.number-sign'],
						regex: /(\()([A-Za-z_][A-Za-z_0-9]*)(\)\s*)(#.*)?$/,
						next: 'start'
					},
					DEFAULT_INVALID_RULE,
				],
				entityPropertyName: [
					{
						token: ['variable.other', 'constant.language'],
						regex: /([A-Za-z_][A-Za-z_0-9]*)([?!+]*)/,
						next: 'entityPropertyType'
					},
					DEFAULT_INVALID_RULE,
				],
				entityPropertyType: [
					{
						// Type without length
						token: ['text', 'keyword.other', 'text', 'comment.line.number-sign'],
						regex: /(\s+)\b(bool|short|int|long|decimal|text|date|time|datetime|blob|identity)\b(\s*)(#.*)?$/,
						next: 'start'
					},
					{
						// Uknown type without length
						token: ['text', 'invalid.other', 'text', 'comment.line.number-sign'],
						regex: /(\s+)\b([A-Za-z_][A-Za-z_0-9]*)\b(\s*)(#.*)?$/,
						next: 'start'
					},
					{
						// Type with length
						token: ['text', 'keyword.other'],
						regex: /(\s+)\b(bool|short|int|long|decimal|text|date|time|datetime|blob|identity)\b/,
						next: 'entityPropertyTypeLengthStart'
					},
					{
						// Uknown type with length
						token: ['text', 'invalid.other'],
						regex: /(\s+)\b([A-Za-z_][A-Za-z_0-9]*)\b/,
						next: 'entityPropertyTypeLengthStart'
					},
					DEFAULT_INVALID_RULE,
				],
				entityPropertyTypeLengthStart: [
					{
						token: 'text',
						regex: /\(\s*/,
						next: 'entityPropertyTypeLengthNumber'
					},
					DEFAULT_INVALID_RULE,
				],
				entityPropertyTypeLengthNumber: [
					{
						token: 'constant.numeric',
						regex: /\b\d+\b/,
						next: 'entityPropertyTypeLengthAfterNumber'
					},
					{
						token: 'invalid.error',
						regex: /\b[a-zA-Z_0-9]+\b/,
						next: 'entityPropertyTypeLengthAfterNumber'
					},
					DEFAULT_INVALID_RULE,
				],
				entityPropertyTypeLengthAfterNumber: [
					{
						token: ['text', 'constant.numeric'],
						regex: /(\s*,\s*)(\d+)/
					},
					{
						token: ['text', 'comment.line.number-sign'],
						regex: /(\s*\)\s*)(#.*)?$/,
						next: 'start'
					},
					{
						token: ['text', 'invalid.other'],
						regex: /(\s*\)\s*)(.*)/,
						next: 'start'
					},
					DEFAULT_INVALID_RULE,
				]
			};
		}
	};

});

// @ts-ignore
ace.define('ace/mode/erdiagram', ['require', 'exports'], function (require: RequireFn, exports: Exports) {
	'use strict';

	const TextMode = require('./text').Mode;
	const ErdHighlightRules = require('./erdiagram_highlight_rules').ErdHighlightRules;
	// const CstyleBehaviour = require('./behaviour/cstyle').CstyleBehaviour;
	const ErdFoldMode = require('./folding/erdiagram').FoldMode;
	// const WorkerClient = require('../worker/worker_client').WorkerClient;

	exports.Mode = class Mode extends TextMode {

		public $id = 'ace/mode/erdiagram';
		public lineCommentStart = '#';

		constructor() {
			super();
			this.HighlightRules = ErdHighlightRules;
			// this.$behaviour = new CstyleBehaviour();
			this.$behaviour = null;
			this.foldingRules = new ErdFoldMode();
		}

		getNextLineIndent(state: string, line: string, tab: string) {
			const indent = this.$getIndent(line);

			// eslint-disable-next-line
			if (state == 'start' && line.match(/^.*[{(\[]\s*$/)) {
				return indent + tab;
			} else {
				return indent;
			}
		}

		// createWorker(session: Ace.EditSession) {
		// 	setTimeout(() => {
		// 		// session.setAnnotations()
		// 		session.setAnnotations([
		// 			{
		// 				row: 4,
		// 				column: 8,
		// 				type: 'warning',
		// 				text: 'La vida es dura para todos'
		// 			}
		// 		]);
		// 	}, 5000);
		// 	// const worker = new WorkerClient(['ace'], 'ace/mode/json_worker', 'JsonWorker');
		// 	const theWorker = new Worker(URL.createObjectURL(new Blob([erdiagramModeWorkerSourceCode])));
		// 	const worker = new WorkerClient(theWorker);
		// 	worker.attachToDocument(session.getDocument());
		//
		// 	worker.on('annotate', function (e: any) {
		// 		// console.log('EVENT:', e);
		// 		session.setAnnotations(e.data);
		// 	});
		//
		// 	worker.on('terminate', function () {
		// 		console.log('Se acabó');
		// 		session.clearAnnotations();
		// 	});
		//
		// 	return worker;
		// }

	};

});
