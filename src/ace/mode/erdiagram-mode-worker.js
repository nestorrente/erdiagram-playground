onmessage = (oEvent) => {

    if (oEvent.type !== 'message' || oEvent.data == null) {
        return;
    }

    if (oEvent.data.event === 'change') {
        // console.log('A ver:', oEvent.data.data);

        // Si se borra: [position, position]
        // Si se añade: [position, lines]
        // Si se añade sobrescribiendo (selección + escribir/pegar): [position, position, position, lines] --> TODO
        const changeEventData = oEvent.data.data.data;

        const isDeletion = !Array.isArray(changeEventData[1]);

        if (isDeletion) {
            const fromPosition = changeEventData[0];
            const toPosition = changeEventData[1];
            // console.log('[Worker] Deleted:', fromPosition, toPosition);
        } else {
            const position = changeEventData[0];
            const lines = changeEventData[1];
            // console.log('[Worker] Added:', position, lines.join('\n'));
        }

        postMessage({
                        type: 'event',
                        name: 'annotate',
                        data: [{row: Math.floor(10 * Math.random()), column: 3, type: 'error', text: 'Pepe'}]
                    });
    } else if (oEvent.data.command === 'setValue') {
        const code = oEvent.data.args[0];
        // console.log('[Worker] Code changed:', code);

        postMessage({
                        type: 'event',
                        name: 'annotate',
                        data: [{row: Math.floor(10 * Math.random()), column: 3, type: 'error', text: 'Pepe'}]
                    });
    }

};
