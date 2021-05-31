import {computed} from 'vue';
import {
	DatabaseModelGeneratorConfig,
	SqlDialect,
	SqlEntityRelationshipModelSourceCodeGenerator
} from '@nestorrente/erdiagram';

export default function useEntityRelationshipModelToSqlCodeConverter(
		databaseModelGeneratorConfigSupplier: () => DatabaseModelGeneratorConfig,
		sqlDialectSupplier: () => SqlDialect
) {
	return computed(() => {
		return SqlEntityRelationshipModelSourceCodeGenerator.builder()
				.useDialect(sqlDialectSupplier())
				.configureDatabaseModel(databaseModelGeneratorConfigSupplier())
				.build();
	});
}
