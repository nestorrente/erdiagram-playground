import {
	AbstractConfigManager,
	beanValidationConfigManager,
	classModelConfigManager,
	ConfigManager,
	databaseModelConfigManager,
	entityRelationshipModelParserConfigManager,
	javaClassModelConfigManager,
	jpaConfigManager,
	mysqlDialectConfigManager,
	nomnomlConfigManager,
	oracleDialectConfigManager,
	postgresqlDialectConfigManager,
	sqliteDialectConfigManager,
	sqlServerDialectConfigManager,
	typescriptConfigManager
} from '@nestorrente/erdiagram';
import ERDiagramPlaygroundConfig from '@/config/ERDiagramPlaygroundConfig';
import PartialERDiagramPlaygroundConfig from '@/config/PartialERDiagramPlaygroundConfig';
import {JsonAdapter, JsonAdapters} from 'true-json';

export const LAST_CONFIG_VERSION = '0.1.0-rc2-1622372997114';

export class ERDiagramPlaygroundConfigManager
		extends AbstractConfigManager<ERDiagramPlaygroundConfig, PartialERDiagramPlaygroundConfig> {

	getDefaultConfig(): ERDiagramPlaygroundConfig {
		return {
			_version: LAST_CONFIG_VERSION,
			parser: entityRelationshipModelParserConfigManager.getDefaultConfig(),
			mysql: {
				databaseModel: databaseModelConfigManager.getDefaultConfig(),
				dialectConfig: mysqlDialectConfigManager.getDefaultConfig()
			},
			oracle: {
				databaseModel: databaseModelConfigManager.getDefaultConfig(),
				dialectConfig: oracleDialectConfigManager.getDefaultConfig()
			},
			postgresql: {
				databaseModel: databaseModelConfigManager.getDefaultConfig(),
				dialectConfig: postgresqlDialectConfigManager.getDefaultConfig()
			},
			sqlite: {
				databaseModel: databaseModelConfigManager.getDefaultConfig(),
				dialectConfig: sqliteDialectConfigManager.getDefaultConfig()
			},
			sqlserver: {
				databaseModel: databaseModelConfigManager.getDefaultConfig(),
				dialectConfig: sqlServerDialectConfigManager.getDefaultConfig()
			},
			java: {
				classModel: classModelConfigManager.getDefaultConfig(),
				code: javaClassModelConfigManager.getDefaultConfig(),
				transformers: {
					validation: {
						enabled: false,
						config: beanValidationConfigManager.getDefaultConfig()
					},
					jpa: {
						enabled: false,
						databaseModel: databaseModelConfigManager.getDefaultConfig(),
						config: jpaConfigManager.getDefaultConfig()
					}
				}
			},
			typescript: {
				classModel: classModelConfigManager.getDefaultConfig(),
				code: typescriptConfigManager.getDefaultConfig()
			},
			nomnoml: nomnomlConfigManager.getDefaultConfig(),
		};
	}

	mergeConfigs(fullConfig: ERDiagramPlaygroundConfig, partialConfig?: PartialERDiagramPlaygroundConfig): ERDiagramPlaygroundConfig {
		return {
			_version: fullConfig._version,
			parser: entityRelationshipModelParserConfigManager.mergeConfigs(
					fullConfig.parser,
					partialConfig?.parser
			),
			mysql: {
				databaseModel: databaseModelConfigManager.mergeConfigs(
						fullConfig.mysql.databaseModel,
						partialConfig?.mysql?.databaseModel
				),
				dialectConfig: mysqlDialectConfigManager.mergeConfigs(
						fullConfig.mysql.dialectConfig,
						partialConfig?.mysql?.dialectConfig
				)
			},
			oracle: {
				databaseModel: databaseModelConfigManager.mergeConfigs(
						fullConfig.oracle.databaseModel,
						partialConfig?.oracle?.databaseModel
				),
				dialectConfig: oracleDialectConfigManager.mergeConfigs(
						fullConfig.oracle.dialectConfig,
						partialConfig?.oracle?.dialectConfig
				),
			},
			postgresql: {
				databaseModel: databaseModelConfigManager.mergeConfigs(
						fullConfig.postgresql.databaseModel,
						partialConfig?.postgresql?.databaseModel
				),
				dialectConfig: postgresqlDialectConfigManager.mergeConfigs(
						fullConfig.postgresql.dialectConfig,
						partialConfig?.postgresql?.dialectConfig
				),
			},
			sqlite: {
				databaseModel: databaseModelConfigManager.mergeConfigs(
						fullConfig.sqlite.databaseModel,
						partialConfig?.sqlite?.databaseModel
				),
				dialectConfig: sqliteDialectConfigManager.mergeConfigs(
						fullConfig.sqlite.dialectConfig,
						partialConfig?.sqlite?.dialectConfig
				),
			},
			sqlserver: {
				databaseModel: databaseModelConfigManager.mergeConfigs(
						fullConfig.sqlserver.databaseModel,
						partialConfig?.sqlserver?.databaseModel
				),
				dialectConfig: sqlServerDialectConfigManager.mergeConfigs(
						fullConfig.sqlserver.dialectConfig,
						partialConfig?.sqlserver?.dialectConfig
				),
			},
			java: {
				classModel: classModelConfigManager.mergeConfigs(
						fullConfig.java.classModel,
						partialConfig?.java?.classModel
				),
				code: javaClassModelConfigManager.mergeConfigs(
						fullConfig.java.code,
						partialConfig?.java?.code
				),
				transformers: {
					validation: {
						enabled: partialConfig?.java?.transformers?.validation?.enabled ?? fullConfig.java.transformers.validation.enabled,
						config: beanValidationConfigManager.mergeConfigs(
								fullConfig.java.transformers.validation.config,
								partialConfig?.java?.transformers?.validation?.config
						)
					},
					jpa: {
						enabled: partialConfig?.java?.transformers?.jpa?.enabled ?? fullConfig.java.transformers.jpa.enabled,
						databaseModel: databaseModelConfigManager.mergeConfigs(
								fullConfig.java.transformers.jpa.databaseModel,
								partialConfig?.java?.transformers?.jpa?.databaseModel
						),
						config: jpaConfigManager.mergeConfigs(
								fullConfig.java.transformers.jpa.config,
								partialConfig?.java?.transformers?.jpa?.config
						)
					}
				}
			},
			typescript: {
				classModel: classModelConfigManager.mergeConfigs(
						fullConfig.typescript.classModel,
						partialConfig?.typescript?.classModel
				),
				code: typescriptConfigManager.mergeConfigs(
						fullConfig.typescript.code,
						partialConfig?.typescript?.code
				)
			},
			nomnoml: nomnomlConfigManager.mergeConfigs(
					fullConfig.nomnoml,
					partialConfig?.nomnoml
			)
		};
	}

	protected getJsonAdapter(): JsonAdapter<ERDiagramPlaygroundConfig> {
		return JsonAdapters.object({
			_version: JsonAdapters.identity<string>(),
			parser: useConfigManagerAsJsonAdapter(entityRelationshipModelParserConfigManager),
			mysql: JsonAdapters.object({
				databaseModel: useConfigManagerAsJsonAdapter(databaseModelConfigManager),
				dialectConfig: useConfigManagerAsJsonAdapter(mysqlDialectConfigManager)
			}),
			oracle: JsonAdapters.object({
				databaseModel: useConfigManagerAsJsonAdapter(databaseModelConfigManager),
				dialectConfig: useConfigManagerAsJsonAdapter(oracleDialectConfigManager)
			}),
			postgresql: JsonAdapters.object({
				databaseModel: useConfigManagerAsJsonAdapter(databaseModelConfigManager),
				dialectConfig: useConfigManagerAsJsonAdapter(postgresqlDialectConfigManager)
			}),
			sqlite: JsonAdapters.object({
				databaseModel: useConfigManagerAsJsonAdapter(databaseModelConfigManager),
				dialectConfig: useConfigManagerAsJsonAdapter(sqliteDialectConfigManager)
			}),
			sqlserver: JsonAdapters.object({
				databaseModel: useConfigManagerAsJsonAdapter(databaseModelConfigManager),
				dialectConfig: useConfigManagerAsJsonAdapter(sqlServerDialectConfigManager)
			}),
			java: JsonAdapters.object({
				classModel: useConfigManagerAsJsonAdapter(classModelConfigManager),
				code: useConfigManagerAsJsonAdapter(javaClassModelConfigManager),
				transformers: JsonAdapters.object({
					validation: JsonAdapters.object({
						enabled: JsonAdapters.identity<boolean>(),
						config: useConfigManagerAsJsonAdapter(beanValidationConfigManager)
					}),
					jpa: JsonAdapters.object({
						enabled: JsonAdapters.identity<boolean>(),
						databaseModel: useConfigManagerAsJsonAdapter(databaseModelConfigManager),
						config: useConfigManagerAsJsonAdapter(jpaConfigManager)
					})
				})
			}),
			typescript: JsonAdapters.object({
				classModel: useConfigManagerAsJsonAdapter(classModelConfigManager),
				code: useConfigManagerAsJsonAdapter(typescriptConfigManager)
			}),
			nomnoml: useConfigManagerAsJsonAdapter(nomnomlConfigManager)
		});
	}

}

function useConfigManagerAsJsonAdapter<T>(configManager: ConfigManager<T, any>): JsonAdapter<T> {
	return JsonAdapters.custom({
		adaptToJson(value) {
			return configManager.convertToSerializableObject(value);
		},
		recoverFromJson(value) {
			return configManager.convertFromSerializableObject(value);
		}
	});
}

const erdiagramPlaygroundConfigManager = new ERDiagramPlaygroundConfigManager();
export default erdiagramPlaygroundConfigManager;
