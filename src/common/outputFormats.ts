import {reactive} from 'vue';
import {
	EntityRelationshipModelToCodeConverter,
	EntityRelationshipModelToDiagramConverter
} from '@nestorrente/erdiagram';
import erModelToCodeConverters from '@/common/erModelToCodeConverters';
import erModelToDiagramConverters from '@/common/erModelToDiagramConverters';

export interface OutputFormat {
	id: string;
	name: string;
	type: string;
}

export interface CodeOutputFormat extends OutputFormat {
	type: 'code';
	codeBlockLang: string;
	erModelToCodeConverter: EntityRelationshipModelToCodeConverter;
}

export function isCodeOutputFormat(outputFormat: OutputFormat): outputFormat is CodeOutputFormat {
	return outputFormat.type === 'code';
}

export interface DiagramOutputFormat extends OutputFormat {
	type: 'diagram';
	erModelToDiagramConverter: EntityRelationshipModelToDiagramConverter;
}

export function isDiagramOutputFormat(outputFormat: OutputFormat): outputFormat is DiagramOutputFormat {
	return outputFormat.type === 'diagram';
}

const mysqlCodeOutputFormat: CodeOutputFormat = reactive({
	id: 'mysql',
	name: 'MySQL',
	type: 'code',
	codeBlockLang: 'sql_more',
	erModelToCodeConverter: erModelToCodeConverters.mysqlConverter
});

const oracleCodeOutputFormat: CodeOutputFormat = reactive({
	id: 'oracle',
	name: 'Oracle DB',
	type: 'code',
	codeBlockLang: 'sql_more',
	erModelToCodeConverter: erModelToCodeConverters.oracleConverter
});

const sqlserverCodeOutputFormat: CodeOutputFormat = reactive({
	id: 'sqlserver',
	name: 'SQL Server',
	type: 'code',
	codeBlockLang: 'sql_more',
	erModelToCodeConverter: erModelToCodeConverters.sqlserverConverter
});

const javaCodeOutputFormat: CodeOutputFormat = reactive({
	id: 'java',
	name: 'Java POJO',
	type: 'code',
	codeBlockLang: 'java',
	erModelToCodeConverter: erModelToCodeConverters.javaConverter
});

const typescriptCodeOutputFormat: CodeOutputFormat = reactive({
	id: 'typescript',
	name: 'TypeScript',
	type: 'code',
	codeBlockLang: 'typescript',
	erModelToCodeConverter: erModelToCodeConverters.typescriptConverter
});

const nomnomlCodeOutputFormat: CodeOutputFormat = reactive({
	id: 'nomnomlCode',
	name: 'Nomnoml (code)',
	type: 'code',
	codeBlockLang: 'plaintext',
	erModelToCodeConverter: erModelToCodeConverters.nomnomlConverter
});

const nomnomlDiagramOutputFormat: DiagramOutputFormat = reactive({
	id: 'nomnomlDiagram',
	name: 'Nomnoml (SVG)',
	type: 'diagram',
	erModelToDiagramConverter: erModelToDiagramConverters.nomnomlConverter
});

const plantumlCodeOutputFormat: CodeOutputFormat = reactive({
	id: 'plantumlCode',
	name: 'PlantUML (code)',
	type: 'code',
	codeBlockLang: 'plaintext',
	erModelToCodeConverter: erModelToCodeConverters.plantumlConverter
});

const plantumlDiagramOutputFormat: DiagramOutputFormat = reactive({
	id: 'plantumlDiagram',
	name: 'PlantUML (SVG)',
	type: 'diagram',
	erModelToDiagramConverter: erModelToDiagramConverters.plantumlConverter
});

export default {
	[mysqlCodeOutputFormat.id]: mysqlCodeOutputFormat,
	[oracleCodeOutputFormat.id]: oracleCodeOutputFormat,
	[sqlserverCodeOutputFormat.id]: sqlserverCodeOutputFormat,
	[javaCodeOutputFormat.id]: javaCodeOutputFormat,
	[typescriptCodeOutputFormat.id]: typescriptCodeOutputFormat,
	[nomnomlCodeOutputFormat.id]: nomnomlCodeOutputFormat,
	[nomnomlDiagramOutputFormat.id]: nomnomlDiagramOutputFormat,
	[plantumlCodeOutputFormat.id]: plantumlCodeOutputFormat,
	[plantumlDiagramOutputFormat.id]: plantumlDiagramOutputFormat
};
