import {
	AbstractComponentConfigManager,
	databaseModelGeneratorConfigManager,
	entityRelationshipModelParserConfigManager,
	javaClassModelToCodeConverterConfigManager,
	mysqlDatabaseModelToCodeConverterConfigManager,
	oracleDatabaseModelToCodeConverterConfigManager,
	sqlServerDatabaseModelToCodeConverterConfigManager,
	typescriptClassModelToCodeConverterConfigManager
} from '@nestorrente/erdiagram';
import ERDiagramPlaygroundConfig from '@/config/ERDiagramPlaygroundConfig';
import ERDiagramPlaygroundSerializedConfig from '@/config/ERDiagramPlaygroundSerializedConfig';

export class ERDiagramPlaygroundConfigManager
		extends AbstractComponentConfigManager<ERDiagramPlaygroundConfig, Partial<ERDiagramPlaygroundConfig>, ERDiagramPlaygroundSerializedConfig> {

	getDefaultConfig(): ERDiagramPlaygroundConfig {
		return {
			erModel: entityRelationshipModelParserConfigManager.getDefaultConfig(),
			mysqlDatabaseModel: databaseModelGeneratorConfigManager.getDefaultConfig(),
			mysql: mysqlDatabaseModelToCodeConverterConfigManager.getDefaultConfig(),
			sqlServerDatabaseModel: databaseModelGeneratorConfigManager.getDefaultConfig(),
			sqlserver: sqlServerDatabaseModelToCodeConverterConfigManager.getDefaultConfig(),
			oracleDatabaseModel: databaseModelGeneratorConfigManager.getDefaultConfig(),
			oracle: oracleDatabaseModelToCodeConverterConfigManager.getDefaultConfig(),
			java: javaClassModelToCodeConverterConfigManager.getDefaultConfig(),
			typescript: typescriptClassModelToCodeConverterConfigManager.getDefaultConfig()
		};
	}

	mergeConfigs(fullConfig: ERDiagramPlaygroundConfig, partialConfig?: Partial<ERDiagramPlaygroundConfig>): ERDiagramPlaygroundConfig {
		return {
			erModel: entityRelationshipModelParserConfigManager.mergeConfigs(fullConfig.erModel, partialConfig?.erModel),
			mysqlDatabaseModel: databaseModelGeneratorConfigManager.mergeConfigs(fullConfig.mysqlDatabaseModel, partialConfig?.mysqlDatabaseModel),
			mysql: mysqlDatabaseModelToCodeConverterConfigManager.mergeConfigs(fullConfig.mysql, partialConfig?.mysql),
			sqlServerDatabaseModel: databaseModelGeneratorConfigManager.mergeConfigs(fullConfig.sqlServerDatabaseModel, partialConfig?.sqlServerDatabaseModel),
			sqlserver: sqlServerDatabaseModelToCodeConverterConfigManager.mergeConfigs(fullConfig.sqlserver, partialConfig?.sqlserver),
			oracleDatabaseModel: databaseModelGeneratorConfigManager.mergeConfigs(fullConfig.oracleDatabaseModel, partialConfig?.oracleDatabaseModel),
			oracle: oracleDatabaseModelToCodeConverterConfigManager.mergeConfigs(fullConfig.oracle, partialConfig?.oracle),
			java: javaClassModelToCodeConverterConfigManager.mergeConfigs(fullConfig.java, partialConfig?.java),
			typescript: typescriptClassModelToCodeConverterConfigManager.mergeConfigs(fullConfig.typescript, partialConfig?.typescript)
		};
	}

	convertToSerializableObject(fullConfig: ERDiagramPlaygroundConfig): ERDiagramPlaygroundSerializedConfig {
		return {
			erModel: entityRelationshipModelParserConfigManager.convertToSerializableObject(fullConfig.erModel),
			mysqlDatabaseModel: databaseModelGeneratorConfigManager.convertToSerializableObject(fullConfig.mysqlDatabaseModel),
			mysql: mysqlDatabaseModelToCodeConverterConfigManager.convertToSerializableObject(fullConfig.mysql),
			sqlServerDatabaseModel: databaseModelGeneratorConfigManager.convertToSerializableObject(fullConfig.sqlServerDatabaseModel),
			sqlserver: sqlServerDatabaseModelToCodeConverterConfigManager.convertToSerializableObject(fullConfig.sqlserver),
			oracleDatabaseModel: databaseModelGeneratorConfigManager.convertToSerializableObject(fullConfig.oracleDatabaseModel),
			oracle: oracleDatabaseModelToCodeConverterConfigManager.convertToSerializableObject(fullConfig.oracle),
			java: javaClassModelToCodeConverterConfigManager.convertToSerializableObject(fullConfig.java),
			typescript: typescriptClassModelToCodeConverterConfigManager.convertToSerializableObject(fullConfig.typescript)
		};
	}

	convertFromSerializableObject(serializedConfig: ERDiagramPlaygroundSerializedConfig): ERDiagramPlaygroundConfig {
		return {
			erModel: entityRelationshipModelParserConfigManager.convertFromSerializableObject(serializedConfig.erModel),
			mysqlDatabaseModel: databaseModelGeneratorConfigManager.convertFromSerializableObject(serializedConfig.mysqlDatabaseModel),
			mysql: mysqlDatabaseModelToCodeConverterConfigManager.convertFromSerializableObject(serializedConfig.mysql),
			sqlServerDatabaseModel: databaseModelGeneratorConfigManager.convertFromSerializableObject(serializedConfig.sqlServerDatabaseModel),
			sqlserver: sqlServerDatabaseModelToCodeConverterConfigManager.convertFromSerializableObject(serializedConfig.sqlserver),
			oracleDatabaseModel: databaseModelGeneratorConfigManager.convertFromSerializableObject(serializedConfig.oracleDatabaseModel),
			oracle: oracleDatabaseModelToCodeConverterConfigManager.convertFromSerializableObject(serializedConfig.oracle),
			java: javaClassModelToCodeConverterConfigManager.convertFromSerializableObject(serializedConfig.java),
			typescript: typescriptClassModelToCodeConverterConfigManager.convertFromSerializableObject(serializedConfig.typescript)
		};
	}

}

const erdiagramPlaygroundConfigManager = new ERDiagramPlaygroundConfigManager();
export default erdiagramPlaygroundConfigManager;
