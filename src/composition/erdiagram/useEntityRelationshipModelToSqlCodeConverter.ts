import {computed} from 'vue';
import {
	DatabaseModelConfig,
	SqlDialect,
	SqlSourceCodeGenerator
} from '@nestorrente/erdiagram';

export default function useEntityRelationshipModelToSqlCodeConverter(
		databaseModelConfigSupplier: () => DatabaseModelConfig,
		sqlDialectSupplier: () => SqlDialect
) {
	return computed(() => {
		return SqlSourceCodeGenerator.builder()
				.useDialect(sqlDialectSupplier())
				.configureDatabaseModel(databaseModelConfigSupplier())
				.build();
	});
}
