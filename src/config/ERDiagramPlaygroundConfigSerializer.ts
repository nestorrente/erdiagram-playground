import ERDiagramPlaygroundConfig from '@/config/ERDiagramPlaygroundConfig';
import {
	CaseFormat,
	DatabaseModelGeneratorConfig,
	EntityRelationshipModelParserConfig,
	JavaClassModelToCodeConverterConfig,
	parseJavaType,
	parseTypeScriptType,
	StandardCaseFormats,
	StandardIdNamingStrategies,
	TypeScriptClassModelToCodeConverterConfig
} from '@nestorrente/erdiagram';
import IdNamingStrategy
	from '@nestorrente/erdiagram/dist/erdiagram/generator/common/id-naming-strategy/IdNamingStrategy';
import {EntityPropertyType} from '@nestorrente/erdiagram/dist/erdiagram/parser/entity-relationship-model-types';
import DatabaseModelToCodeConverterConfig
	from '@nestorrente/erdiagram/dist/erdiagram/generator/database/code-converter/DatabaseModelToCodeConverterConfig';

export class ERDiagramPlaygroundConfigSerializer {

	serialize(config: ERDiagramPlaygroundConfig): string {
		return JSON.stringify(convertToSerializedConfig(config));
	}

	deserialize(serializedConfig: string): ERDiagramPlaygroundConfig {
		return convertToDeserializedConfig(JSON.parse(serializedConfig) as ERDiagramPlaygroundSerializedConfig);
	}

}

function convertToSerializedConfig(config: ERDiagramPlaygroundConfig): ERDiagramPlaygroundSerializedConfig {
	return {
		erModel: serializeEntityRelationshipModelParserConfig(config.erModel),
		mysqlDatabaseModel: serializeDatabaseModelGeneratorConfig(config.mysqlDatabaseModel),
		mysql: serializeDatabaseModelToCodeConverterConfig(config.mysql),
		sqlServerDatabaseModel: serializeDatabaseModelGeneratorConfig(config.sqlServerDatabaseModel),
		sqlserver: serializeDatabaseModelToCodeConverterConfig(config.sqlserver),
		oracleDatabaseModel: serializeDatabaseModelGeneratorConfig(config.oracleDatabaseModel),
		oracle: serializeDatabaseModelToCodeConverterConfig(config.oracle),
		java: serializeJavaClassModelToCodeConverterSerializedConfig(config.java),
		typescript: serializeTypeScriptClassModelToCodeConverterSerializedConfig(config.typescript),
	};
}

function convertToDeserializedConfig(serializedConfig: ERDiagramPlaygroundSerializedConfig): ERDiagramPlaygroundConfig {
	return {
		erModel: deserializeEntityRelationshipModelParserConfig(serializedConfig.erModel),
		mysqlDatabaseModel: deserializeDatabaseModelGeneratorConfig(serializedConfig.mysqlDatabaseModel),
		mysql: deserializeDatabaseModelToCodeConverterConfig(serializedConfig.mysql, StandardCaseFormats.UPPER_CAMEL, StandardCaseFormats.LOWER_CAMEL),
		sqlServerDatabaseModel: deserializeDatabaseModelGeneratorConfig(serializedConfig.sqlServerDatabaseModel),
		sqlserver: deserializeDatabaseModelToCodeConverterConfig(serializedConfig.sqlserver, StandardCaseFormats.UPPER_CAMEL, StandardCaseFormats.UPPER_CAMEL),
		oracleDatabaseModel: deserializeDatabaseModelGeneratorConfig(serializedConfig.oracleDatabaseModel),
		oracle: deserializeDatabaseModelToCodeConverterConfig(serializedConfig.oracle, StandardCaseFormats.UPPER_UNDERSCORE, StandardCaseFormats.UPPER_UNDERSCORE),
		java: deserializeJavaClassModelToCodeConverterSerializedConfig(serializedConfig.java),
		typescript: deserializeTypeScriptClassModelToCodeConverterSerializedConfig(serializedConfig.typescript),
	};
}

/* EntityRelationshipModelParserConfig */

function serializeEntityRelationshipModelParserConfig(config: EntityRelationshipModelParserConfig): EntityRelationshipModelParserSerializedConfig {
	return {
		...config
	};
}

function deserializeEntityRelationshipModelParserConfig(config: EntityRelationshipModelParserSerializedConfig): EntityRelationshipModelParserConfig {
	return {
		...config
	};
}

/* DatabaseModelGeneratorConfig */

function serializeDatabaseModelGeneratorConfig(config: DatabaseModelGeneratorConfig): DatabaseModelGeneratorSerializedConfig {
	return {
		...config,
		idNamingStrategy: serializeIdNamingStrategy(config.idNamingStrategy)
	};
}

function deserializeDatabaseModelGeneratorConfig(config: DatabaseModelGeneratorSerializedConfig): DatabaseModelGeneratorConfig {
	return {
		...config,
		idNamingStrategy: deserializeIdNamingStrategy(config.idNamingStrategy)
	};
}

/* IdNamingStrategy */

function serializeIdNamingStrategy(idNamingStrategy: IdNamingStrategy) {
	return serializeComplexEnumValue(StandardIdNamingStrategies, idNamingStrategy);
}

function deserializeIdNamingStrategy(idNamingStrategy: string | undefined) {
	return deserializeComplexEnumValue(StandardIdNamingStrategies, idNamingStrategy, StandardIdNamingStrategies.DEFAULT);
}

/* Complex enum */

function serializeComplexEnumValue<T>(enumValues: Record<string, T>, value: T): string | undefined {
	const entry = Object.entries(enumValues).find(entry => value === entry[1]);
	return entry?.[0];
}

function deserializeComplexEnumValue<T>(enumValues: Record<string, T>, value: string | undefined): T | undefined
function deserializeComplexEnumValue<T>(enumValues: Record<string, T>, value: string | undefined, defaultValue: T): T
function deserializeComplexEnumValue<T>(enumValues: Record<string, T>, value: string | undefined, defaultValue?: T): T | undefined {
	return value == null ? defaultValue : enumValues[value];
}

/* DatabaseModelToCodeConverterConfig */

function serializeDatabaseModelToCodeConverterConfig(config: DatabaseModelToCodeConverterConfig): DatabaseModelToCodeConverterSerializedConfig {
	return {
		...config,
		tableNameCaseFormat: serializeComplexEnumValue(StandardCaseFormats, config.tableNameCaseFormat),
		columnNameCaseFormat: serializeComplexEnumValue(StandardCaseFormats, config.columnNameCaseFormat),
	};
}

function deserializeDatabaseModelToCodeConverterConfig(
		config: DatabaseModelToCodeConverterSerializedConfig,
		defaultTableNameCaseFormat: CaseFormat,
		defaultColumnNameCaseFormat: CaseFormat
): DatabaseModelToCodeConverterConfig {
	return {
		...config,
		tableNameCaseFormat: deserializeComplexEnumValue(StandardCaseFormats, config.tableNameCaseFormat, defaultTableNameCaseFormat),
		columnNameCaseFormat: deserializeComplexEnumValue(StandardCaseFormats, config.columnNameCaseFormat, defaultColumnNameCaseFormat),
	};
}

/* JavaClassModelToCodeConverterConfig */

function serializeJavaClassModelToCodeConverterSerializedConfig(config: JavaClassModelToCodeConverterConfig): JavaClassModelToCodeConverterSerializedConfig {
	return {
		...config,
		typeMappings: mapValues(config.typeMappings, javaType => javaType!.formatCanonical()),
	};
}

function deserializeJavaClassModelToCodeConverterSerializedConfig(config: JavaClassModelToCodeConverterSerializedConfig): JavaClassModelToCodeConverterConfig {
	return {
		...config,
		typeMappings: mapValues(config.typeMappings, parseJavaType),
	};
}

/* TypeScriptClassModelToCodeConverterConfig */

function serializeTypeScriptClassModelToCodeConverterSerializedConfig(config: TypeScriptClassModelToCodeConverterConfig): TypeScriptClassModelToCodeConverterSerializedConfig {
	return {
		...config,
		typeMappings: mapValues(config.typeMappings, typeScriptType => typeScriptType!.format()),
	};
}

function deserializeTypeScriptClassModelToCodeConverterSerializedConfig(config: TypeScriptClassModelToCodeConverterSerializedConfig): TypeScriptClassModelToCodeConverterConfig {
	return {
		...config,
		typeMappings: mapValues(config.typeMappings, parseTypeScriptType),
	};
}

/* Utilities */

function mapValues<T, U>(object: Record<string, T>, mapper: (value: T) => U): Record<string, U> {
	return Object.fromEntries(Object.entries(object).map(([key, value]) => [key, mapper(value)]));
}

/* Type interfaces */

interface ERDiagramPlaygroundSerializedConfig {
	erModel: EntityRelationshipModelParserSerializedConfig;
	mysqlDatabaseModel: DatabaseModelGeneratorSerializedConfig;
	mysql: MySqlDatabaseModelToCodeConverterSerializedConfig;
	sqlServerDatabaseModel: DatabaseModelGeneratorSerializedConfig;
	sqlserver: SqlServerDatabaseModelToCodeConverterSerializedConfig;
	oracleDatabaseModel: DatabaseModelGeneratorSerializedConfig;
	oracle: OracleDatabaseModelToCodeConverterSerializedConfig;
	java: JavaClassModelToCodeConverterSerializedConfig;
	typescript: TypeScriptClassModelToCodeConverterSerializedConfig;
}

type EntityRelationshipModelParserSerializedConfig = EntityRelationshipModelParserConfig;

interface DatabaseModelToCodeConverterSerializedConfig {
	idColumnType: EntityPropertyType;
	typeMappings: Partial<Record<EntityPropertyType, string>>;
	tableNameCaseFormat?: string;
	columnNameCaseFormat?: string;
}

interface MySqlDatabaseModelToCodeConverterSerializedConfig extends DatabaseModelToCodeConverterSerializedConfig {

}

interface SqlServerDatabaseModelToCodeConverterSerializedConfig extends DatabaseModelToCodeConverterSerializedConfig {

}

interface OracleDatabaseModelToCodeConverterSerializedConfig extends DatabaseModelToCodeConverterSerializedConfig {

}

interface ClassModelToCodeConverterSerializedConfig {
	typeMappings: Record<EntityPropertyType, string>;
}

interface JavaClassModelToCodeConverterSerializedConfig extends ClassModelToCodeConverterSerializedConfig {
	generatedClassesPackage?: string;
	useSpringNullabilityAnnotations: boolean;
}

interface TypeScriptClassModelToCodeConverterSerializedConfig extends ClassModelToCodeConverterSerializedConfig {

}

interface DatabaseModelGeneratorSerializedConfig {
	usePluralTableNames: boolean;
	idNamingStrategy?: string;
}

const erdiagramPlaygroundConfigSerializer = new ERDiagramPlaygroundConfigSerializer();
export default erdiagramPlaygroundConfigSerializer;
