import {
	AbstractConfigManager,
	beanValidationConfigManager,
	classModelConfigManager,
	ConfigManager,
	databaseModelConfigManager,
	entityRelationshipModelParserConfigManager,
	javaClassModelConfigManager,
	JavaExtendedPackage,
	jpaConfigManager,
	lombokConfigManager,
	mysqlDialectConfigManager,
	nomnomlConfigManager,
	oracleDialectConfigManager,
	plantUmlConfigManager,
	postgresqlDialectConfigManager,
	sqliteDialectConfigManager,
	sqlServerDialectConfigManager,
	typescriptConfigManager
} from '@nestorrente/erdiagram';
import ERDiagramPlaygroundConfig from '@/config/ERDiagramPlaygroundConfig';
import PartialERDiagramPlaygroundConfig from '@/config/PartialERDiagramPlaygroundConfig';
import {JsonAdapter, JsonAdapters} from 'true-json';
import {APP_VERSION} from "@/AppInfo.ts";

export class ERDiagramPlaygroundConfigManager
		extends AbstractConfigManager<ERDiagramPlaygroundConfig, PartialERDiagramPlaygroundConfig> {

	getDefaultConfig(): ERDiagramPlaygroundConfig {
		return {
			_version: APP_VERSION,
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
					shared: {
						javaExtendedPackage: jpaConfigManager.getDefaultConfig().javaExtendedPackage
					},
					validation: {
						enabled: true,
						config: beanValidationConfigManager.getDefaultConfig()
					},
					jpa: {
						enabled: true,
						databaseModel: databaseModelConfigManager.getDefaultConfig(),
						config: jpaConfigManager.getDefaultConfig()
					},
					lombok: lombokConfigManager.mergeWithDefaultConfig({
						getterAnnotation: true,
						setterAnnotation: true
					})
				}
			},
			typescript: {
				classModel: classModelConfigManager.getDefaultConfig(),
				code: typescriptConfigManager.getDefaultConfig()
			},
			nomnoml: nomnomlConfigManager.getDefaultConfig(),
			plantuml: plantUmlConfigManager.getDefaultConfig()
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
					shared: {
						javaExtendedPackage: partialConfig?.java?.transformers?.shared?.javaExtendedPackage
								?? fullConfig.java.transformers.shared.javaExtendedPackage
					},
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
					},
					lombok: lombokConfigManager.mergeConfigs(
						fullConfig.java.transformers.lombok,
						partialConfig?.java?.transformers?.lombok,
					)
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
			),
			plantuml: plantUmlConfigManager.mergeConfigs(
					fullConfig.plantuml,
					partialConfig?.plantuml
			)
		};
	}

	protected getJsonAdapter(): JsonAdapter<ERDiagramPlaygroundConfig> {
		return JsonAdapters.object({
			_version: JsonAdapters.identity<string>(),
			parser: adaptConfigManagerToJsonAdapter(entityRelationshipModelParserConfigManager),
			mysql: JsonAdapters.object({
				databaseModel: adaptConfigManagerToJsonAdapter(databaseModelConfigManager),
				dialectConfig: adaptConfigManagerToJsonAdapter(mysqlDialectConfigManager)
			}),
			oracle: JsonAdapters.object({
				databaseModel: adaptConfigManagerToJsonAdapter(databaseModelConfigManager),
				dialectConfig: adaptConfigManagerToJsonAdapter(oracleDialectConfigManager)
			}),
			postgresql: JsonAdapters.object({
				databaseModel: adaptConfigManagerToJsonAdapter(databaseModelConfigManager),
				dialectConfig: adaptConfigManagerToJsonAdapter(postgresqlDialectConfigManager)
			}),
			sqlite: JsonAdapters.object({
				databaseModel: adaptConfigManagerToJsonAdapter(databaseModelConfigManager),
				dialectConfig: adaptConfigManagerToJsonAdapter(sqliteDialectConfigManager)
			}),
			sqlserver: JsonAdapters.object({
				databaseModel: adaptConfigManagerToJsonAdapter(databaseModelConfigManager),
				dialectConfig: adaptConfigManagerToJsonAdapter(sqlServerDialectConfigManager)
			}),
			java: JsonAdapters.object({
				classModel: adaptConfigManagerToJsonAdapter(classModelConfigManager),
				code: adaptConfigManagerToJsonAdapter(javaClassModelConfigManager),
				transformers: JsonAdapters.object({
					shared: JsonAdapters.object({
						javaExtendedPackage: JsonAdapters.identity<JavaExtendedPackage>()
					}),
					validation: JsonAdapters.object({
						enabled: JsonAdapters.identity<boolean>(),
						config: adaptConfigManagerToJsonAdapter(beanValidationConfigManager)
					}),
					jpa: JsonAdapters.object({
						enabled: JsonAdapters.identity<boolean>(),
						databaseModel: adaptConfigManagerToJsonAdapter(databaseModelConfigManager),
						config: adaptConfigManagerToJsonAdapter(jpaConfigManager)
					}),
					lombok: adaptConfigManagerToJsonAdapter(lombokConfigManager)
				})
			}),
			typescript: JsonAdapters.object({
				classModel: adaptConfigManagerToJsonAdapter(classModelConfigManager),
				code: adaptConfigManagerToJsonAdapter(typescriptConfigManager)
			}),
			nomnoml: adaptConfigManagerToJsonAdapter(nomnomlConfigManager),
			plantuml: adaptConfigManagerToJsonAdapter(plantUmlConfigManager)
		});
	}

}

function adaptConfigManagerToJsonAdapter<T>(configManager: ConfigManager<T, any>): JsonAdapter<T> {
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
