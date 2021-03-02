import {ComputedRef} from 'vue';
import {EntityRelationshipModelToCodeConverter} from '@nestorrente/erdiagram';
import erModelToCodeConverters from '@/common/erModelToCodeConverters';

export interface OutputFormat {
	id: string;
	name: string;
	codeBlockLang: string;
	erModelToCodeConverter: ComputedRef<EntityRelationshipModelToCodeConverter>;
}

const mysqlOutputFormat: OutputFormat = {
	id: 'mysql',
	name: 'MySQL',
	codeBlockLang: 'sql_more',
	erModelToCodeConverter: erModelToCodeConverters.mysqlConverter
};

const oracleOutputFormat: OutputFormat = {
	id: 'oracle',
	name: 'Oracle DB',
	codeBlockLang: 'sql_more',
	erModelToCodeConverter: erModelToCodeConverters.oracleConverter
};

const sqlserverOutputFormat: OutputFormat = {
	id: 'sqlserver',
	name: 'SQL Server',
	codeBlockLang: 'sql_more',
	erModelToCodeConverter: erModelToCodeConverters.sqlserverConverter
};

const javaOutputFormat: OutputFormat = {
	id: 'java',
	name: 'Java POJO',
	codeBlockLang: 'java',
	erModelToCodeConverter: erModelToCodeConverters.javaConverter
};

const typescriptOutputFormat: OutputFormat = {
	id: 'typescript',
	name: 'TypeScript',
	codeBlockLang: 'typescript',
	erModelToCodeConverter: erModelToCodeConverters.typescriptConverter
};

export default {
	[mysqlOutputFormat.id]: mysqlOutputFormat,
	[oracleOutputFormat.id]: oracleOutputFormat,
	[sqlserverOutputFormat.id]: sqlserverOutputFormat,
	[javaOutputFormat.id]: javaOutputFormat,
	[typescriptOutputFormat.id]: typescriptOutputFormat
};
