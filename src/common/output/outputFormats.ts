import {reactive} from 'vue';
import {EntityRelationshipModelToCodeConverter} from '@nestorrente/erdiagram';
import erModelToCodeConverters from '@/common/output/erModelToCodeConverters';
import erModelToDiagramConverters from '@/common/output/erModelToImageConverters';
import EntityRelationshipModelToImageConverter from '@/common/output/image/EntityRelationshipModelToImageConverter';

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

export interface ImageOutputFormat extends OutputFormat {
	type: 'image';
	erModelToImageConverter: EntityRelationshipModelToImageConverter;
}

export function isImageOutputFormat(outputFormat: OutputFormat): outputFormat is ImageOutputFormat {
	return outputFormat.type === 'image';
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

const postgresqlCodeOutputFormat: CodeOutputFormat = reactive({
	id: 'postgresql',
	name: 'PostgreSQL',
	type: 'code',
	codeBlockLang: 'sql_more',
	erModelToCodeConverter: erModelToCodeConverters.postgresqlConverter
});

const sqliteCodeOutputFormat: CodeOutputFormat = reactive({
	id: 'sqlite',
	name: 'SQLite',
	type: 'code',
	codeBlockLang: 'sql_more',
	erModelToCodeConverter: erModelToCodeConverters.sqliteConverter
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

const plantumlCodeOutputFormat: CodeOutputFormat = reactive({
	id: 'plantumlCode',
	name: 'PlantUML code',
	type: 'code',
	codeBlockLang: 'plaintext',
	erModelToCodeConverter: erModelToCodeConverters.plantumlConverter
});

const plantumlDiagramOutputFormat: ImageOutputFormat = reactive({
	id: 'plantumlDiagram',
	name: 'PlantUML image',
	type: 'image',
	erModelToImageConverter: erModelToDiagramConverters.plantumlConverter
});

const nomnomlCodeOutputFormat: CodeOutputFormat = reactive({
	id: 'nomnomlCode',
	name: 'Nomnoml code',
	type: 'code',
	codeBlockLang: 'plaintext',
	erModelToCodeConverter: erModelToCodeConverters.nomnomlConverter
});

const nomnomlDiagramOutputFormat: ImageOutputFormat = reactive({
	id: 'nomnomlDiagram',
	name: 'Nomnoml image',
	type: 'image',
	erModelToImageConverter: erModelToDiagramConverters.nomnomlConverter
});

export default {
	[mysqlCodeOutputFormat.id]: mysqlCodeOutputFormat,
	[oracleCodeOutputFormat.id]: oracleCodeOutputFormat,
	[postgresqlCodeOutputFormat.id]: postgresqlCodeOutputFormat,
	[sqliteCodeOutputFormat.id]: sqliteCodeOutputFormat,
	[sqlserverCodeOutputFormat.id]: sqlserverCodeOutputFormat,
	[javaCodeOutputFormat.id]: javaCodeOutputFormat,
	[typescriptCodeOutputFormat.id]: typescriptCodeOutputFormat,
	[plantumlCodeOutputFormat.id]: plantumlCodeOutputFormat,
	[plantumlDiagramOutputFormat.id]: plantumlDiagramOutputFormat,
	[nomnomlCodeOutputFormat.id]: nomnomlCodeOutputFormat,
	[nomnomlDiagramOutputFormat.id]: nomnomlDiagramOutputFormat
};
