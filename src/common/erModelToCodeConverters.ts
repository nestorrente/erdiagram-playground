import useEntityRelationshipModelToDatabaseCodeConverter
	from '@/composition/erdiagram/useEntityRelationshipModelToDatabaseCodeConverter';
import configStore from '@/store/configStore';
import {
	JavaClassModelToCodeConverter,
	MySqlDatabaseModelToCodeConverter,
	NomnomlEntityRelationshipModelToDiagramCodeConverter,
	OracleDatabaseModelToCodeConverter,
	PlantUmlEntityRelationshipModelToDiagramCodeConverter,
	SqlServerDatabaseModelToCodeConverter,
	TypeScriptClassModelToCodeConverter
} from '@nestorrente/erdiagram';
import useEntityRelationshipModelToClassCodeConverter
	from '@/composition/erdiagram/useEntityRelationshipModelToClassCodeConverter';
import {computed} from 'vue';

const mysqlConverter = useEntityRelationshipModelToDatabaseCodeConverter(
		() => configStore.config.mysql.databaseModelGeneratorConfig,
		() => new MySqlDatabaseModelToCodeConverter(configStore.config.mysql.databaseModelToCodeConverterConfig)
);

const sqlserverConverter = useEntityRelationshipModelToDatabaseCodeConverter(
		() => configStore.config.sqlserver.databaseModelGeneratorConfig,
		() => new SqlServerDatabaseModelToCodeConverter(configStore.config.sqlserver.databaseModelToCodeConverterConfig)
);

const oracleConverter = useEntityRelationshipModelToDatabaseCodeConverter(
		() => configStore.config.oracle.databaseModelGeneratorConfig,
		() => new OracleDatabaseModelToCodeConverter(configStore.config.oracle.databaseModelToCodeConverterConfig)
);

const javaConverter = useEntityRelationshipModelToClassCodeConverter(
		() => configStore.config.java.classModelGeneratorConfig,
		() => new JavaClassModelToCodeConverter(configStore.config.java.classModelToCodeConverterConfig)
);

const typescriptConverter = useEntityRelationshipModelToClassCodeConverter(
		() => configStore.config.typescript.classModelGeneratorConfig,
		() => new TypeScriptClassModelToCodeConverter(configStore.config.typescript.classModelToCodeConverterConfig)
);

const nomnomlConverter = computed(() => {
	return new NomnomlEntityRelationshipModelToDiagramCodeConverter(configStore.config.nomnoml);
});

const plantumlConverter = computed(() => {
	return new PlantUmlEntityRelationshipModelToDiagramCodeConverter(configStore.config.plantuml);
});

export default {
	mysqlConverter,
	sqlserverConverter,
	oracleConverter,
	javaConverter,
	typescriptConverter,
	nomnomlConverter,
	plantumlConverter
};
