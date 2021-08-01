## account-notebook-wechat | <a href="src/components/ChangeLog/index.jsx#L9" target="_black">CHANGELOG</a>

### 账号簿 - 微信小程序扫码体验

![](https://liuxy0551.gitee.io/image-hosting/posts/account-notebook/share.jpg)


#### 用途说明

&emsp;&emsp;『账号簿』用来记录个人的账号密码，数据保存在本地，清除微信数据或缓存以及删除小程序都会丢失本地数据。提供了云同步的功能，可以在更换手机前将数据加密（AES 加密后再经过 BASE64 编码）后备份到云端，更换手机后下载备份即可恢复。因云同步功能会使用云数据库读写次数，可以在支持开发者后联系开发者开通此功能。
&emsp;&emsp;**如果对安全不放心，可以联系开发者进行私有化部署，让你拥有一个属于自己的账号管理小程序！**

![](https://liuxy0551.gitee.io/image-hosting/posts/account-notebook/wechat-qrcode.png)

#### 技术说明

* <a href="https://docs.taro.zone/docs/README" target="_black">Taro 3.x</a>
* React 17.x
* <a href="https://taro-ui.taro.zone/#/" target="_black">taro-ui 最新版</a>
* <a href="https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html" target="_black">微信小程序 - 云开发</a>
* <a href="https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/capabilities.html#%E4%BA%91%E5%87%BD%E6%95%B0" target="_black">微信小程序 - 云函数</a>

&emsp;&emsp;基于 Taro 3.x 使用 React 语法和 Taro UI 的部分组件开发了“账号簿”微信小程序，使用到了微信小程序的云开发和云函数，免费版数据库读写次数有限。

