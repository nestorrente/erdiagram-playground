import {reactive} from 'vue';
import erModelSourceCodeGenerators from '@/common/output/erModelSourceCodeGenerators';
import erModelToDiagramConverters from '@/common/output/erModelToImageConverters';
import EntityRelationshipModelToImageConverter from '@/common/output/image/EntityRelationshipModelToImageConverter';
import {EntityRelationshipModelSourceCodeGenerator} from '@nestorrente/erdiagram';

export interface OutputFormat {
	id: string;
	name: string;
	type: string;
}

export interface CodeOutputFormat extends OutputFormat {
	type: 'code';
	codeBlockLang: string;
	erModelSourceCodeGenerator: EntityRelationshipModelSourceCodeGenerator;
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
	erModelSourceCodeGenerator: erModelSourceCodeGenerators.mysqlConverter
});

const oracleCodeOutputFormat: CodeOutputFormat = reactive({
	id: 'oracle',
	name: 'Oracle DB',
	type: 'code',
	codeBlockLang: 'sql_more',
	erModelSourceCodeGenerator: erModelSourceCodeGenerators.oracleConverter
});

const postgresqlCodeOutputFormat: CodeOutputFormat = reactive({
	id: 'postgresql',
	name: 'PostgreSQL',
	type: 'code',
	codeBlockLang: 'sql_more',
	erModelSourceCodeGenerator: erModelSourceCodeGenerators.postgresqlConverter
});

const sqliteCodeOutputFormat: CodeOutputFormat = reactive({
	id: 'sqlite',
	name: 'SQLite',
	type: 'code',
	codeBlockLang: 'sql_more',
	erModelSourceCodeGenerator: erModelSourceCodeGenerators.sqliteConverter
});

const sqlserverCodeOutputFormat: CodeOutputFormat = reactive({
	id: 'sqlserver',
	name: 'SQL Server',
	type: 'code',
	codeBlockLang: 'sql_more',
	erModelSourceCodeGenerator: erModelSourceCodeGenerators.sqlserverConverter
});

const javaCodeOutputFormat: CodeOutputFormat = reactive({
	id: 'java',
	name: 'Java POJO',
	type: 'code',
	codeBlockLang: 'java',
	erModelSourceCodeGenerator: erModelSourceCodeGenerators.javaConverter
});

const typescriptCodeOutputFormat: CodeOutputFormat = reactive({
	id: 'typescript',
	name: 'TypeScript',
	type: 'code',
	codeBlockLang: 'typescript',
	erModelSourceCodeGenerator: erModelSourceCodeGenerators.typescriptConverter
});

const plantumlCodeOutputFormat: CodeOutputFormat = reactive({
	id: 'plantumlCode',
	name: 'PlantUML code',
	type: 'code',
	codeBlockLang: 'plaintext',
	erModelSourceCodeGenerator: erModelSourceCodeGenerators.plantumlConverter
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
	erModelSourceCodeGenerator: erModelSourceCodeGenerators.nomnomlConverter
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
