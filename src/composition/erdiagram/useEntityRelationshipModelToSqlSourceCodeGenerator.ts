import {computed} from 'vue';
import {
	DatabaseModelConfig,
	SqlDialect,
	SqlSourceCodeGenerator
} from '@nestorrente/erdiagram';

export default function useEntityRelationshipModelToSqlSourceCodeGenerator(
		databaseModelConfigSupplier: () => DatabaseModelConfig,
		sqlDialectSupplier: () => SqlDialect
) {
	return computed(() => {
		return SqlSourceCodeGenerator.builder(sqlDialectSupplier())
				.configureDatabaseModel(databaseModelConfigSupplier())
				.build();
	});
}
