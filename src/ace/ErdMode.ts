// @ts-ignore
import ace from 'ace-builds';

// @ts-ignore
ace.define('ace/mode/erd_outdent', ['require', 'exports'], function(require: any, exports: any) {
	exports.ErdOutdent = class ErdOutdent {

		checkOutdent(line: string, input: string) {
			if (!/^\s+$/.test(line))
				return false;

			console.log('checkOutdent()');
			console.log('Line:', line);
			console.log('Input:', input);
			return /^}/.test(input);
		}

		autoOutdent() {
			//
		}

	};
});

// @ts-ignore
ace.define('ace/mode/erd', ['require', 'exports', 'ace/lib/oop', 'ace/mode/text', 'ace/mode/custom_highlight_rules'], function(require: any, exports: any/*, module: any*/) {
	'use strict';

	const oop = require('../lib/oop');
	const TextMode = require('./text').Mode;
	const HighlightRules = require('./json_highlight_rules').JsonHighlightRules;
	const ErdOutdent = require('./erd_outdent').ErdOutdent;
	const CstyleBehaviour = require('./behaviour/cstyle').CstyleBehaviour;
	const CStyleFoldMode = require('./folding/cstyle').FoldMode;
	const WorkerClient = require('../worker/worker_client').WorkerClient;

	const Mode = function(this: any) {
		this.HighlightRules = HighlightRules;
		this.$outdent = new ErdOutdent();
		console.log('$outdent:', this.$outdent);
		this.$behaviour = new CstyleBehaviour();
		this.foldingRules = new CStyleFoldMode();
	};
	oop.inherits(Mode, TextMode);

	(function(this: any) {

		this.lineCommentStart = '//';
		// this.blockComment = {start: '/*', end: '*/'};

		// @ts-ignore
		this.getNextLineIndent = function(state, line, tab) {
			let indent = this.$getIndent(line);

			if (state == 'start') {
				// eslint-disable-next-line
				const match = line.match(/^.*[\{\(\[]\s*$/);
				if (match) {
					indent += tab;
				}
			}

			return indent;
		};

		// @ts-ignore
		this.checkOutdent = function(state, line, input) {
			console.log('Check outdent');
			console.log('$outdent:', this.$outdent);
			console.log('$outdent.checkOutdent:', this.$outdent.checkOutdent);
			return this.$outdent.checkOutdent(line, input);
		};

		// @ts-ignore
		this.autoOutdent = function(state, doc, row) {
			this.$outdent.autoOutdent(doc, row);
		};

		// @ts-ignore
		this.createWorker = function(session) {
			const worker = new WorkerClient(['ace'], 'ace/mode/json_worker', 'JsonWorker');
			worker.attachToDocument(session.getDocument());

			// @ts-ignore
			worker.on('annotate', function(e) {
				session.setAnnotations(e.data);
			});

			worker.on('terminate', function() {
				session.clearAnnotations();
			});

			return worker;
		};

		this.$id = 'ace/mode/custom';
	}).call(Mode.prototype);

	exports.Mode = Mode;
});
