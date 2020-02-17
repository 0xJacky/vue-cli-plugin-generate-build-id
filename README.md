# vue-cli-plugin-generate-build-id
在编译生产环境的项目时自动生成 Build ID

## 前言
几年前玩过 theos，在编译代码的时候会自动 ++Build ID，修改大版本号后 Build ID 会从 1 开始计算。
然后最近在搞前端开发，想给线上加一个「检测到新版本就提示用户刷新页面」的需求，于是就花了点时间做了个 Vue CLI 的插件。

## 安装
```
    npm i vue-cli-plugin-generate-build-id
```

## 插件功能
安装插件后的首次编译时会在项目的根目录建立 `version.json`

#### version.json
```
{
    "version" : "1.0", // 对应 `packages.json` 文件内的 `version`
    "build_id": 1
}
```

当使用 vue-cli-service 编译时，插件会读取项目根目录内的 `packages.json` 文件内 `version` 的值作为 `process.env.VUE_APP_VERSION`

(编译生产环境的项目时)会读取 `version.json` 内 `build_id` 的值并对其+1 作为 `process.env.VUE_APP_BUILD_ID`

也就是说在开发环境下您可以直接调用 `process.env.VUE_APP_VERSION`
在生产模式下可以调用 `process.env.VUE_APP_VERSION` 和 `process.env.VUE_APP_BUILD_ID`

最后，插件会将根目录下的 `version.json` 复制到产品的根目录。

注意：修改 `packages.json` 内的 `version` 的值，或删除根目录的 `version.json` 均会使 `build_id` 从 1 开始计算。

#### 前端检测版本更新
````
router.beforeEach((to, from, next) => {
   
    ...
    if (process.env.NODE_ENV === 'production') {
        axios.get('/version.json?' + Date.now()).then(r => {
            if (!(process.env.VUE_APP_VERSION === r.data.version
                && Number(process.env.VUE_APP_BUILD_ID) === r.data.build_id)) {
                
                // 发现新版本后的业务逻辑
                
            }
        })
    }
    ...
}
````

## Todo
English translation

# LICENSE
MIT
