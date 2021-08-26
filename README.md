# vue-cli-plugin-generate-build-id
Automatically generates integer `build_id` after production compiled

在编译生产环境的项目后自动生成 Build ID

支持普通网页项目和 Electron 项目

Support common Vue web project and Electron app project

## 安装 Installation
```
    npm i vue-cli-plugin-generate-build-id
```
or
```
    yarn add -D vue-cli-plugin-generate-build-id
```

## 功能 Features
安装插件后的首次编译时会在项目的根目录建立 `version.json`

The first time you build the project for production,
the plugin will create `version.json` in the root dir of the project.

#### version.json
```
{
    "version" : "1.0", // `version` in `packages.json`
    "build_id": 1,
    "total_build": 1,
}
```

### 开发环境 Development mode
你可以在项目中通过调用 `process.env.VUE_APP_VERSION` 获取到当前的版本号。

You can use `process.env.VUE_APP_VERSION` to get the current version of the `package.json` in your project.

### 生产环境 Production mode
可通过 `process.env.VUE_APP_VERSION` 获取到当前的版本号
可通过 `process.env.VUE_APP_BUILD_ID` 获取当前版本的 `build_id`
可通过 `process.env.VUE_APP_TOTAL_BUILD` 获取历史编译次数 `total_build`

Use `process.env.VUE_APP_VERSION` to get the current version of the `package.json` in your project.
Use `process.env.VUE_APP_BUILD_ID` to get the current `build_id`
Use `process.env.VUE_APP_TOTAL_BUILD` to get the current total build times (`total_build`)


项目编译完成后，插件会将根目录下的 `version.json` 复制到产物的根目录。


注意：修改 `packages.json` 内的 `version` 的值使 `build_id` 清零，
删除根目录的 `version.json` 则将 `build_id` 和 `total_build` 清零。

Caution：change the value of `verison` in `package.json` will reset the `build_id` in `version.json`,
delete the `version.json` in project root will reset `build_id` and `total_build`.

#### 生产环境检测版本文件 Check version.json in production mode
````
router.beforeEach((to, from, next) => {

    ...
    if (process.env.NODE_ENV === 'production') {
        axios.get('/version.json?' + Date.now()).then(r => {
            if (!(process.env.VUE_APP_VERSION === r.data.version
                && Number(process.env.VUE_APP_BUILD_ID) === r.data.build_id)) {

                // 发现新版本后的业务逻辑
                // verison.json changed
                // ...
            }
        })
    }
    ...
}
````

# LICENSE
MIT
