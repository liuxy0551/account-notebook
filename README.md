## 账号簿 | <a href="src/components/ChangeLog/index.jsx#L9" target="_black">CHANGELOG</a>


### 一、相关随笔

&emsp;&emsp;<a href="https://liuxianyu.cn/article/account-notebook.html" target="_black">账号簿（微信小程序）的开发过程</a>  
&emsp;&emsp;<a href="https://liuxianyu.cn/article/account-notebook-a.html" target="_black">账号簿开发（一）—— 微信小程序 AES 加密解密</a>  
&emsp;&emsp;<a href="https://liuxianyu.cn/article/account-notebook-b.html" target="_black">账号簿开发（二）—— 微信小程序检查更新及调试</a>  
&emsp;&emsp;<a href="https://liuxianyu.cn/article/account-notebook-c.html" target="_black">账号簿开发（三）—— 微信小程序的云开发</a>  


### 二、实现效果

#### 2.1、微信扫码体验

![](https://liuxy0551.gitee.io/image-hosting/posts/account-notebook/share.jpg)


#### 2.2、小程序截图

![](https://liuxy0551.gitee.io/image-hosting/posts/account-notebook/1.png)


#### 2.3、云端数据截图

&emsp;&emsp; 账号密码均为加密后的密文，无法查看明文

![](https://liuxy0551.gitee.io/image-hosting/posts/account-notebook/2.png)


### 三、相关说明

#### 3.1、功能点

- [x] 标签管理
- [x] 账号管理
- [x] 安全密码
- [x] 检查更新
- [x] 指纹解锁
- [x] 云同步及权限管理
- [x] 分享、友情链接
- [x] 代码开源
- [ ] 系列文章
- [ ] 云同步记录

#### 3.2、使用说明

- 开发者承诺不会自动上传账号密码到云端，仅在用户主动点击备份时才会**加密（AES 加密后再经过 BASE64 编码）**账号密码后上传到云端，数据库为腾讯云专门为微信小程序提供的云数据库，任何人无法查看账号密码的明文，均为加密后的密文。用户账号密码保存在手机本地数据中。
- 清除微信数据或微信缓存以及删除小程序都会丢失本地数据，建议进行这些操作前使用**云同步**功能备份账号密码。
- 开发『账号簿』的目的是方便个人密码的保存和查看，是为了保存个人账号密码而开发的，分享给有需要的人使用。
- 如遇到问题或想二次开发的，请联系开发者。邮箱：<a href="http://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=MFxZRUhJAAUFAXBBQR5TX10" target="_black">liuxy0551@qq.com</a>
- 开发者尽最大可能保障数据安全，但不承担任何责任。


#### 3.3、用途说明

&emsp;&emsp;『账号簿』用来记录个人的账号密码，数据保存在本地，清除微信数据或微信缓存以及删除小程序都会丢失本地数据。提供了云同步的功能，可以在更换手机前将数据加密（AES 加密后再经过 BASE64 编码）后备份到云端，更换手机后下载备份即可恢复。因云同步功能会使用云数据库读写次数，可以在支持开发者后联系开发者开通此功能。

&emsp;&emsp;**如果对安全不放心，可以联系开发者进行私有化部署，让你拥有一个属于自己的账号管理小程序！**

![](https://liuxy0551.gitee.io/image-hosting/posts/account-notebook/wechat-qrcode.png)


#### 3.4、技术说明

* <a href="https://docs.taro.zone/docs/README" target="_black">Taro 3.x</a>
* React 17.x
* <a href="https://taro-ui.taro.zone/#/" target="_black">taro-ui 最新版</a>
* <a href="https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html" target="_black">微信小程序 - 云开发</a>
* <a href="https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/capabilities.html#%E4%BA%91%E5%87%BD%E6%95%B0" target="_black">微信小程序 - 云函数</a>

&emsp;&emsp;基于 Taro 3.x 使用 React 语法和 Taro UI 的部分组件开发了“账号簿”微信小程序，使用到了微信小程序的云开发和云函数，免费版数据库读写次数有限。


#### 3.5、代码结构

```
account-notebook
├─package.json
├─src
|  ├─app.config.js  公用配置项
|  ├─app.js  全局入口
|  ├─app.scss  全局样式
|  ├─index.html
|  ├─utils  工具方法
|  ├─pages
|  |   ├─tag
|  |   |  ├─list  标签列表页面
|  |   |  └─form  标签表单页面
|  |   ├─personal
|  |   |    ├─unlock  输入安全密码页面
|  |   |    ├─password  设置安全密码页面
|  |   |    ├─grid  个人页面
|  |   |    ├─cloudSync  云同步页面
|  |   |    └─about  关于页面
|  |   ├─home  首页
|  |   └─account
|  |        └─form  账号表单页面
|  ├─components
|  |     ├─TopBar  自定义状态栏组件
|  |     ├─Empty  空数据组件
|  |     └─ChangeLog  更新日志浮框
|  ├─assets
|  |   ├─style  样式文件
|  |   └─images  图片资源
├─config  配置文件
└─cloud  云开发
   └─getOpenId  云函数
```


### 四、开发

```
git clone https://github.com/liuxy0551/account-notebook.git
cd account-notebook
yarn
yarn dev:weapp
```

&emsp;&emsp;在微信开发者工具导入项目即可查看效果。
