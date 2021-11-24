const CracoLessPlugin = require('craco-less');
const TerserPlugin = require('terser-webpack-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
const isPro = process.env.NODE_ENV === 'production';
const pathResolve = pathUrl => path.join(__dirname, pathUrl) 
module.exports = { 
    webpack: { 
        alias: { 
//             '@@': pathResolve('.'), 
            '@': pathResolve('src'), 
//             '@assets': pathResolve('src/assets'), 
//             '@common': pathResolve('src/common'), 
//             '@components': pathResolve('src/components'), 
//             '@hooks': pathResolve('src/hooks'), 
//             '@pages': pathResolve('src/pages'), 
//             '@store': pathResolve('src/store'), 
//             '@utils': pathResolve('src/utils')
// // 此处是一个示例，实际可根据各自需求配置 
        }, 
        plugins: [ 
            new TerserPlugin({
                terserOptions: {
                    compress:{
                        // drop_console: isPro,   //移除console 注意会移除所有的console.*
                        drop_debugger: isPro,  //移除debugger
                        pure_funcs: isPro ? ['console.log'] : null,   // 移除console.log函数
                    }
                },
            })
        ]
    },
    eslint: {
        enable: false /* (default value) */,
    },
    babel: { 
        plugins: [ 
            ['import', { libraryName: 'antd', style: true }], 
            ['@babel/plugin-proposal-decorators', { legacy: true }] // 使用装饰器模式，装饰器模式只能 用于Class组件 
        ] 
    },// craco的插件，webpack的插件在webpack对象中配置，具体配置参考官方文档 
    plugins: [ 
        { 
            plugin: CracoLessPlugin, 
            options: { // 此处根据 less-loader 版本的不同会有不同的配置，详见 less-loader 官方文档 
                lessLoaderOptions: { 
                    lessOptions: { 
                        modifyVars: { '@primary-color': 'red' }, 
                        javascriptEnabled: true 
                    } 
                } 
            } 
        }
    ] 
}