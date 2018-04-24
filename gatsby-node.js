exports.modifyWebpackConfig = ({config, stage}) => {
    config.loader('svg', {
       test: /\.(svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
       loader: 'file-loader',
    });

    return config
};