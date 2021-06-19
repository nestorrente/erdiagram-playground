import {reactive} from 'vue';
import erModelSourceCodeGenerators from '@/common/output/erModelSourceCodeGenerators';
import erModelToDiagramConverters from '@/common/output/erModelToImageConverters';
import EntityRelationshipModelToImageConverter from '@/common/output/image/EntityRelationshipModelToImageConverter';
import {SourceCodeGenerator} from '@nestorrente/erdiagram';

export interface OutputFormat {
	id: string;
	name: string;
	type: string;
}

export interface CodeOutputFormat extends OutputFormat {
	type: 'code';
	codeBlockLang: string;
	erModelSourceCodeGenerator: SourceCodeGenerator;
	downloadFilename: string;
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
	codeBlockLang: 'sql',
	erModelSourceCodeGenerator: erModelSourceCodeGenerators.mysqlConverter,
	downloadFilename: 'creation_script.sql'
});

const oracleCodeOutputFormat: CodeOutputFormat = reactive({
	id: 'oracle',
	name: 'Oracle DB',
	type: 'code',
	codeBlockLang: 'sql',
	erModelSourceCodeGenerator: erModelSourceCodeGenerators.oracleConverter,
	downloadFilename: 'creation_script.sql'
});

const postgresqlCodeOutputFormat: CodeOutputFormat = reactive({
	id: 'postgresql',
	name: 'PostgreSQL',
	type: 'code',
	codeBlockLang: 'sql',
	erModelSourceCodeGenerator: erModelSourceCodeGenerators.postgresqlConverter,
	downloadFilename: 'creation_script.sql'
});

const sqliteCodeOutputFormat: CodeOutputFormat = reactive({
	id: 'sqlite',
	name: 'SQLite',
	type: 'code',
	codeBlockLang: 'sql',
	erModelSourceCodeGenerator: erModelSourceCodeGenerators.sqliteConverter,
	downloadFilename: 'creation_script.sql'
});

const sqlserverCodeOutputFormat: CodeOutputFormat = reactive({
	id: 'sqlserver',
	name: 'SQL Server',
	type: 'code',
	codeBlockLang: 'sql',
	erModelSourceCodeGenerator: erModelSourceCodeGenerators.sqlserverConverter,
	downloadFilename: 'creation_script.sql'
});

const javaCodeOutputFormat: CodeOutputFormat = reactive({
	id: 'java',
	name: 'Java',
	type: 'code',
	codeBlockLang: 'java',
	erModelSourceCodeGenerator: erModelSourceCodeGenerators.javaConverter,
	downloadFilename: 'model.zip'
});

const typescriptCodeOutputFormat: CodeOutputFormat = reactive({
	id: 'typescript',
	name: 'TypeScript',
	type: 'code',
	codeBlockLang: 'typescript',
	erModelSourceCodeGenerator: erModelSourceCodeGenerators.typescriptConverter,
	downloadFilename: 'model.ts'
});

const plantumlCodeOutputFormat: CodeOutputFormat = reactive({
	id: 'plantumlCode',
	name: 'PlantUML code',
	type: 'code',
	codeBlockLang: 'text',
	erModelSourceCodeGenerator: erModelSourceCodeGenerators.plantumlConverter,
	downloadFilename: 'diagram.puml'
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
	codeBlockLang: 'text',
	erModelSourceCodeGenerator: erModelSourceCodeGenerators.nomnomlConverter,
	downloadFilename: 'diagram.txt'
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
