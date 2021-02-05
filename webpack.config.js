module.exports = {
    module: {
        rules: [
            {
                test: /\.(txt|erd)$/i,
                use: 'raw-loader',
            },
        ],
    },
};
