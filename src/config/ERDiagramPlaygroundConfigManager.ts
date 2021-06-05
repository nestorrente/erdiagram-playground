import {
	AbstractComponentConfigManager,
	beanValidationTransformerConfigManager,
	classModelGeneratorConfigManager,
	ComponentConfigManager,
	databaseModelGeneratorConfigManager,
	entityRelationshipModelParserConfigManager,
	javaClassModelGeneratorConfigManager,
	jpaTransformerConfigManager,
	mysqlDialectConfigManager,
	nomnomlEntityRelationshipModelToDiagramCodeConverterConfigManager,
	oracleDialectConfigManager,
	postgresqlDialectConfigManager,
	sqliteDialectConfigManager,
	sqlServerDialectConfigManager,
	typescriptClassModelToCodeConverterConfigManager
} from '@nestorrente/erdiagram';
import ERDiagramPlaygroundConfig from '@/config/ERDiagramPlaygroundConfig';
import PartialERDiagramPlaygroundConfig from '@/config/PartialERDiagramPlaygroundConfig';
import {JsonAdapter, JsonAdapters} from 'true-json';

export const LAST_CONFIG_VERSION = '0.1.0-rc2-1622372997114';

export class ERDiagramPlaygroundConfigManager
		extends AbstractComponentConfigManager<ERDiagramPlaygroundConfig, PartialERDiagramPlaygroundConfig> {

	getDefaultConfig(): ERDiagramPlaygroundConfig {
		return {
			_version: LAST_CONFIG_VERSION,
			parser: entityRelationshipModelParserConfigManager.getDefaultConfig(),
			mysql: {
				databaseModel: databaseModelGeneratorConfigManager.getDefaultConfig(),
				dialectConfig: mysqlDialectConfigManager.getDefaultConfig()
			},
			oracle: {
				databaseModel: databaseModelGeneratorConfigManager.getDefaultConfig(),
				dialectConfig: oracleDialectConfigManager.getDefaultConfig()
			},
			postgresql: {
				databaseModel: databaseModelGeneratorConfigManager.getDefaultConfig(),
				dialectConfig: postgresqlDialectConfigManager.getDefaultConfig()
			},
			sqlite: {
				databaseModel: databaseModelGeneratorConfigManager.getDefaultConfig(),
				dialectConfig: sqliteDialectConfigManager.getDefaultConfig()
			},
			sqlserver: {
				databaseModel: databaseModelGeneratorConfigManager.getDefaultConfig(),
				dialectConfig: sqlServerDialectConfigManager.getDefaultConfig()
			},
			java: {
				classModel: classModelGeneratorConfigManager.getDefaultConfig(),
				code: javaClassModelGeneratorConfigManager.getDefaultConfig(),
				transformers: {
					validation: {
						enabled: false,
						config: beanValidationTransformerConfigManager.getDefaultConfig()
					},
					jpa: {
						enabled: false,
						databaseModel: databaseModelGeneratorConfigManager.getDefaultConfig(),
						config: jpaTransformerConfigManager.getDefaultConfig()
					}
				}
			},
			typescript: {
				classModel: classModelGeneratorConfigManager.getDefaultConfig(),
				code: typescriptClassModelToCodeConverterConfigManager.getDefaultConfig()
			},
			nomnoml: nomnomlEntityRelationshipModelToDiagramCodeConverterConfigManager.getDefaultConfig(),
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
				databaseModel: databaseModelGeneratorConfigManager.mergeConfigs(
						fullConfig.mysql.databaseModel,
						partialConfig?.mysql?.databaseModel
				),
				dialectConfig: mysqlDialectConfigManager.mergeConfigs(
						fullConfig.mysql.dialectConfig,
						partialConfig?.mysql?.dialectConfig
				)
			},
			oracle: {
				databaseModel: databaseModelGeneratorConfigManager.mergeConfigs(
						fullConfig.oracle.databaseModel,
						partialConfig?.oracle?.databaseModel
				),
				dialectConfig: oracleDialectConfigManager.mergeConfigs(
						fullConfig.oracle.dialectConfig,
						partialConfig?.oracle?.dialectConfig
				),
			},
			postgresql: {
				databaseModel: databaseModelGeneratorConfigManager.mergeConfigs(
						fullConfig.postgresql.databaseModel,
						partialConfig?.postgresql?.databaseModel
				),
				dialectConfig: postgresqlDialectConfigManager.mergeConfigs(
						fullConfig.postgresql.dialectConfig,
						partialConfig?.postgresql?.dialectConfig
				),
			},
			sqlite: {
				databaseModel: databaseModelGeneratorConfigManager.mergeConfigs(
						fullConfig.sqlite.databaseModel,
						partialConfig?.sqlite?.databaseModel
				),
				dialectConfig: sqliteDialectConfigManager.mergeConfigs(
						fullConfig.sqlite.dialectConfig,
						partialConfig?.sqlite?.dialectConfig
				),
			},
			sqlserver: {
				databaseModel: databaseModelGeneratorConfigManager.mergeConfigs(
						fullConfig.sqlserver.databaseModel,
						partialConfig?.sqlserver?.databaseModel
				),
				dialectConfig: sqlServerDialectConfigManager.mergeConfigs(
						fullConfig.sqlserver.dialectConfig,
						partialConfig?.sqlserver?.dialectConfig
				),
			},
			java: {
				classModel: classModelGeneratorConfigManager.mergeConfigs(
						fullConfig.java.classModel,
						partialConfig?.java?.classModel
				),
				code: javaClassModelGeneratorConfigManager.mergeConfigs(
						fullConfig.java.code,
						partialConfig?.java?.code
				),
				transformers: {
					validation: {
						enabled: partialConfig?.java?.transformers?.validation?.enabled ?? fullConfig.java.transformers.validation.enabled,
						config: beanValidationTransformerConfigManager.mergeConfigs(
								fullConfig.java.transformers.validation.config,
								partialConfig?.java?.transformers?.validation?.config
						)
					},
					jpa: {
						enabled: partialConfig?.java?.transformers?.jpa?.enabled ?? fullConfig.java.transformers.jpa.enabled,
						databaseModel: databaseModelGeneratorConfigManager.mergeConfigs(
								fullConfig.java.transformers.jpa.databaseModel,
								partialConfig?.java?.transformers?.jpa?.databaseModel
						),
						config: jpaTransformerConfigManager.mergeConfigs(
								fullConfig.java.transformers.jpa.config,
								partialConfig?.java?.transformers?.jpa?.config
						)
					}
				}
			},
			typescript: {
				classModel: classModelGeneratorConfigManager.mergeConfigs(
						fullConfig.typescript.classModel,
						partialConfig?.typescript?.classModel
				),
				code: typescriptClassModelToCodeConverterConfigManager.mergeConfigs(
						fullConfig.typescript.code,
						partialConfig?.typescript?.code
				)
			},
			nomnoml: nomnomlEntityRelationshipModelToDiagramCodeConverterConfigManager.mergeConfigs(
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
				databaseModel: useConfigManagerAsJsonAdapter(databaseModelGeneratorConfigManager),
				dialectConfig: useConfigManagerAsJsonAdapter(mysqlDialectConfigManager)
			}),
			oracle: JsonAdapters.object({
				databaseModel: useConfigManagerAsJsonAdapter(databaseModelGeneratorConfigManager),
				dialectConfig: useConfigManagerAsJsonAdapter(oracleDialectConfigManager)
			}),
			postgresql: JsonAdapters.object({
				databaseModel: useConfigManagerAsJsonAdapter(databaseModelGeneratorConfigManager),
				dialectConfig: useConfigManagerAsJsonAdapter(postgresqlDialectConfigManager)
			}),
			sqlite: JsonAdapters.object({
				databaseModel: useConfigManagerAsJsonAdapter(databaseModelGeneratorConfigManager),
				dialectConfig: useConfigManagerAsJsonAdapter(sqliteDialectConfigManager)
			}),
			sqlserver: JsonAdapters.object({
				databaseModel: useConfigManagerAsJsonAdapter(databaseModelGeneratorConfigManager),
				dialectConfig: useConfigManagerAsJsonAdapter(sqlServerDialectConfigManager)
			}),
			java: JsonAdapters.object({
				classModel: useConfigManagerAsJsonAdapter(classModelGeneratorConfigManager),
				code: useConfigManagerAsJsonAdapter(javaClassModelGeneratorConfigManager),
				transformers: JsonAdapters.object({
					validation: JsonAdapters.object({
						enabled: JsonAdapters.identity<boolean>(),
						config: useConfigManagerAsJsonAdapter(beanValidationTransformerConfigManager)
					}),
					jpa: JsonAdapters.object({
						enabled: JsonAdapters.identity<boolean>(),
						databaseModel: useConfigManagerAsJsonAdapter(databaseModelGeneratorConfigManager),
						config: useConfigManagerAsJsonAdapter(jpaTransformerConfigManager)
					})
				})
			}),
			typescript: JsonAdapters.object({
				classModel: useConfigManagerAsJsonAdapter(classModelGeneratorConfigManager),
				code: useConfigManagerAsJsonAdapter(typescriptClassModelToCodeConverterConfigManager)
			}),
			nomnoml: useConfigManagerAsJsonAdapter(nomnomlEntityRelationshipModelToDiagramCodeConverterConfigManager)
		});
	}

}

function useConfigManagerAsJsonAdapter<T>(configManager: ComponentConfigManager<T, any>): JsonAdapter<T> {
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
