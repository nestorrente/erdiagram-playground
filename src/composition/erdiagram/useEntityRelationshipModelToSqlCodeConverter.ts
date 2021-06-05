import {computed} from 'vue';
import {
	DatabaseModelGeneratorConfig,
	SqlDialect,
	SqlSourceCodeGenerator
} from '@nestorrente/erdiagram';

export default function useEntityRelationshipModelToSqlCodeConverter(
		databaseModelGeneratorConfigSupplier: () => DatabaseModelGeneratorConfig,
		sqlDialectSupplier: () => SqlDialect
) {
	return computed(() => {
		return SqlSourceCodeGenerator.builder()
				.useDialect(sqlDialectSupplier())
				.configureDatabaseModel(databaseModelGeneratorConfigSupplier())
				.build();
	});
}
