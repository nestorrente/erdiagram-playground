import ERDiagramPlaygroundConfig from '@/config/ERDiagramPlaygroundConfig.ts';

export type ERDiagramPlaygroundConfigVersionM1M1P0 = Omit<ERDiagramPlaygroundConfig, 'java'> & {
	java: Omit<ERDiagramPlaygroundConfig['java'], 'transformers'> & {
		transformers: Omit<ERDiagramPlaygroundConfig['java']['transformers'], 'shared'>;
	};
}

export type ERDiagramPlaygroundConfigVersionM1M0P0 = Omit<ERDiagramPlaygroundConfigVersionM1M1P0, 'java'> & {
	java: Omit<ERDiagramPlaygroundConfig['java'], 'transformers'> & {
		transformers: Omit<ERDiagramPlaygroundConfig['java']['transformers'], 'lombok'>;
	};
}
