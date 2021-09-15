// 初始化数据
import Taro from '@tarojs/taro'
import { setStorage } from './updateData'
import { getTimeStr, showToast } from './index'

// 获取单个 uuid v4
const getUuid = () => {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
		let r = Math.random() * 16 | 0, // 随机数取整
			v = c == 'x' ? r : (r & 0x3 | 0x8)
		return v.toString(16)
	})
}

// 初始化数据
const initData = async () => {
    // const { setDownloadData } = require('./cloudSync')
    // await setDownloadData(2, true)
    let tagList = Taro.getStorageSync('tagList') || []
    if (!tagList.length) tagList = await initTagList()
    return tagList
}

// 初始化标签列表
const initTagList = async () => {
    const tagId1 = getUuid(), tagId2 = getUuid()
    const tagList = [
        {
            id: 'all',
            name: '全部账号'
        },
        {
            id: tagId1,
            name: '社交'
        },
        {
            id: tagId2,
            name: '购物'
        },
        {
            id: getUuid(),
            name: '学习'
        }
    ]
    const data = await setStorage('tagList', tagList)
    await initAccount(tagId1, tagId2)
    return data
}

// 初始化一个示例账号
const initAccount = async (tagId1, tagId2) => {
    const accountList = [
        {
            id: getUuid(),
            name: '社交账号 Demo',
            username: '12345678@qq.com',
            password: 'Aa123456',
            note: '这是一个社交示例账号',
            tagIdList: [tagId1],
            time: getTimeStr(),
            encrypted: false
        },
        {
            id: getUuid(),
            name: '购物账号 Demo',
            username: '87654321',
            password: '123456',
            note: '这是一个购物示例账号',
            tagIdList: [tagId2],
            time: getTimeStr(),
            encrypted: false
        }
    ]
    await setStorage('accountList', accountList)
}

// 清理本地数据
const clearLocalData = async () => {
    const tagList = [
        {
            id: 'all',
            name: '全部账号'
        }
    ]
    await setStorage('tagList', tagList)
    await setStorage('accountList', [])
}

// 清理云端数据
const clearCloudData = async () => {
    const { updateCloudData } = require('./cloudSync')
    Taro.showLoading({ title: '清理中...', mask: true })
    const { result: _openid } = await Taro.cloud.callFunction({ name: 'getOpenId' })
    try {
        await updateCloudData('tagList', [], _openid)
        await updateCloudData('accountList', [], _openid)
    } catch (err) {
        const msg = '清理失败，请稍后重试'
        console.log(msg, err)
        showToast(msg)
    }
}

export {
    getUuid,
    initData,
    clearLocalData,
    clearCloudData
}
