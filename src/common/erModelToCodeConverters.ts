import useEntityRelationshipModelToDatabaseCodeConverter
	from '@/composition/erdiagram/useEntityRelationshipModelToDatabaseCodeConverter';
import configStore from '@/store/configStore';
import {
	JavaClassModelToCodeConverter,
	MySqlDatabaseModelToCodeConverter,
	NomnomlEntityRelationshipModelToDiagramCodeConverter,
	OracleDatabaseModelToCodeConverter,
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

// TODO add Nomnoml Diagram config to ERDiagramConfig and use it here
const nomnomlConverter = computed(() => new NomnomlEntityRelationshipModelToDiagramCodeConverter());

export default {
	mysqlConverter,
	sqlserverConverter,
	oracleConverter,
	javaConverter,
	typescriptConverter,
	nomnomlConverter
};
