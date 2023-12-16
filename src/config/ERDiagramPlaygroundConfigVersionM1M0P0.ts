import ERDiagramPlaygroundConfig from '@/config/ERDiagramPlaygroundConfig.ts';

type ERDiagramPlaygroundConfigVersionM1M0P0 = Omit<ERDiagramPlaygroundConfig, 'java'> & {
	java: Omit<ERDiagramPlaygroundConfig['java'], 'transformers'> & {
		transformers: Omit<ERDiagramPlaygroundConfig['java']['transformers'], 'lombok'>;
	};
}

export default ERDiagramPlaygroundConfigVersionM1M0P0;
