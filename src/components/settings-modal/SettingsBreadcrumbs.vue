<template>
    <nav class="breadcrumb" aria-label="breadcrumbs">
        <ul>
            <li
                    v-for="step in currentPathSteps"
                    :key="step.path"
                    :class="{'is-active': step === lastPathStep}"
            >
                <a
                        :href="'#' + step.path"
                        :aria-current="step === lastPathStep ? 'page' : undefined"
                >
                    {{ step.text }}
                </a>
            </li>
        </ul>
    </nav>
</template>

<script lang="ts">
    import {computed, defineComponent} from 'vue';

    interface BreadcrumbNode {
        text: string;
        children: Record<string, BreadcrumbNode | string>;
    }

    interface BreadcrumbPathStep {
        path: string;
        text: string;
    }

    export default defineComponent({
        name: 'SettingsBreadcrumbs',
        emits: [],
        components: {},
        props: {
            currentPath: {
                type: String,
                required: false
            }
        },
        setup(props) {

            const breadcrumbRoot: BreadcrumbNode = {
                text: 'All settings',
                children: {
                    parser: 'Parser',
                    sql: {
                        text: 'SQL',
                        children: {
                            mysql: {
                                text: 'MySQL',
                                children: {
                                    typeBindings: 'Type bindings'
                                }
                            },
                            oracle: {
                                text: 'Oracle DB',
                                children: {
                                    typeBindings: 'Type bindings'
                                }
                            },
                            postgresql: {
                                text: 'PostgreSQL',
                                children: {
                                    typeBindings: 'Type bindings'
                                }
                            },
                            sqlite: {
                                text: 'SQLite',
                                children: {
                                    typeBindings: 'Type bindings'
                                }
                            },
                            sqlserver: {
                                text: 'SQL Server',
                                children: {
                                    typeBindings: 'Type bindings'
                                }
                            }
                        }
                    },
                    java: {
                        text: 'Java',
                        children: {
                            validation: 'Java Bean Validation (JSR-303)',
                            jpa: 'Java Persistence API',
                            typeBindings: 'Type bindings'
                        }
                    },
                    typescript: {
                        text: 'TypeScript',
                        children: {
                            typeBindings: 'Type bindings'
                        }
                    },
                    diagram: {
                        text: 'Diagram',
                        children: {
                            nomnoml: 'Nomnoml',
                            plantuml: 'PlantUML'
                        }
                    }
                },
            };

            const currentPathStepsIds = computed((): string[] => {
                return props.currentPath?.split('.') ?? [];
            });

            const currentPathSteps = computed((): BreadcrumbPathStep[] => {
                return [
                    {
                        path: '',
                        text: breadcrumbRoot.text
                    },
                    ...getBreadcrumbPathFromStepsIds(breadcrumbRoot, [], currentPathStepsIds.value)
                ];
            });

            function getBreadcrumbPathFromStepsIds(breadcrumbNode: BreadcrumbNode, previousStepsIds: string[], remainingStepsIds: string[]): BreadcrumbPathStep[] {

                const [currentStepId, ...nextStepsIds] = remainingStepsIds;

                if (!breadcrumbNode.children.hasOwnProperty(currentStepId)) {
                    throw new Error(`Invalid breadcrumb step ID: ${currentStepId}`);
                }

                const nodeOrText = breadcrumbNode.children[currentStepId];
                const pathStep = convertNodeOrTextToPathStep(previousStepsIds, currentStepId, nodeOrText);

                const processedStepsIds = [...previousStepsIds, currentStepId];

                if (nextStepsIds.length === 0) {
                    return [pathStep];
                }

                if (typeof nodeOrText === 'string') {
                    throw new Error('Invalid path: no more children');
                }

                return [pathStep, ...getBreadcrumbPathFromStepsIds(nodeOrText, processedStepsIds, nextStepsIds)];

            }

            function convertNodeOrTextToPathStep(previousStepsIds: string[], currentStepId: string, nodeOrText: BreadcrumbNode | string): BreadcrumbPathStep {
                return {
                    path: [...previousStepsIds, currentStepId].join('.'),
                    text: typeof nodeOrText === 'string' ? nodeOrText : nodeOrText.text
                };
            }

            const lastPathStep = computed((): BreadcrumbPathStep => {
                return currentPathSteps.value[currentPathSteps.value.length - 1];
            });

            return {
                breadcrumbRootText: breadcrumbRoot.text,
                currentPathSteps,
                lastPathStep
            };

        }
    });
</script>
