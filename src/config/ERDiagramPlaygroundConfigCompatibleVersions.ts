import ERDiagramPlaygroundConfig from '@/config/ERDiagramPlaygroundConfig.ts';

export type ERDiagramPlaygroundConfigVersionM1M1P0 = Omit<ERDiagramPlaygroundConfig, 'java' | 'typescript'> & {
	java: Omit<ERDiagramPlaygroundConfig['java'], 'classModel' | 'transformers'> & {
		classModel: Omit<ERDiagramPlaygroundConfig['java']['classModel'], 'enforceNotNullLists'>;
		transformers: Omit<ERDiagramPlaygroundConfig['java']['transformers'], 'shared'>;
	};
	typescript: Omit<ERDiagramPlaygroundConfig['typescript'], 'classModel'> & {
		classModel: Omit<ERDiagramPlaygroundConfig['typescript']['classModel'], 'enforceNotNullLists'>;
	};
}

export type ERDiagramPlaygroundConfigVersionM1M0P0 = Omit<ERDiagramPlaygroundConfigVersionM1M1P0, 'java'> & {
	java: Omit<ERDiagramPlaygroundConfig['java'], 'transformers'> & {
		transformers: Omit<ERDiagramPlaygroundConfig['java']['transformers'], 'lombok'>;
	};
}
