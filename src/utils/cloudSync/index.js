import Taro from '@tarojs/taro'
import { getTimeStr, showToast } from '../index'
import { setStorage } from '../updateData'
import { aesEncrypt, aesDecrypt } from './crypto'

const DB = Taro.cloud.database()

// 备份需要加密账号和密码
const setBackupData = async (list = ['tagList', 'accountList']) => {
    list.length === 2 && Taro.showLoading({ title: '备份中...', mask: true })
    try {
        const { result: _openid } = await Taro.cloud.callFunction({ name: 'getOpenId' })

        let tagList, accountList
        if (list.includes('tagList')) {
            tagList = Taro.getStorageSync('tagList') || []
            tagList = tagList.filter(item => item.id !== 'all')
            await updateCloudData('tagList', tagList, _openid)
        }
        if (list.includes('accountList')) {
            accountList = Taro.getStorageSync('accountList') || []
            accountList = accountList.map(item => {
                return {
                    ...item,
                    username: aesEncrypt(item.username),
                    password: aesEncrypt(item.password),
                    encrypted: true
                }
            })
            await updateCloudData('accountList', accountList, _openid)
        }
        list.length === 2 && showToast('备份成功')
    } catch (err) {
        const msg = '备份失败，请稍后重试'
        console.log(msg, err)
        showToast(msg)
    }
}

// 更新数据
const updateCloudData = async (key, value, _openid) => {
    const { nickName = '' } = Taro.getStorageSync('userInfo') || {}
    const data = {
        [key]: value,
        nickName,
        updateTime: getTimeStr()
    }
    const res = await DB.collection(key).where({
        _openid
    }).update({
        data
    })

    if (res?.stats?.updated !== 0) return
    // 没有备份记录
    await DB.collection(key).add({
        data
    })
}

// 下载后解密账号和密码 isFrst 为 true 的时候，是第一次进入小程序下载远程数据
const setDownloadData = async (index, isFrst = false) => {
    !isFrst && Taro.showLoading({ title: '下载中...', mask: true })
    try {
        const { result: _openid } = await Taro.cloud.callFunction({ name: 'getOpenId' })

        const { data: tagListData = [] } = await DB.collection('tagList').where({ _openid }).get()
        const { data: accountListData = [] } = await DB.collection('accountList').where({ _openid }).get()

        if (!tagListData.length && !accountListData.length) {
            !isFrst && showToast('没有备份记录，请先备份')
        } else {
            const { tagList } = tagListData[0]
            const { accountList } = accountListData[0]
            await setDataStorage(index, tagList, accountList)
            !isFrst && showToast(`${ index === 2 ? '下载' : '合并' }成功`).then(() => {
                Taro.navigateBack({ delta: 2 })
            })
        }
    } catch (err) {
        const msg = `${ index === 2 ? '下载' : '合并' }失败`
        console.log(msg, err)
        showToast(msg)
    }
}

// 保存到本地
const setDataStorage = async (index, cloudTagList, cloudAccountList) => {
    let tagList = [], accountList = []

    switch (index) {
        case 0: // 以本地数据为主合并
            tagList = Taro.getStorageSync('tagList') || []
            accountList = Taro.getStorageSync('accountList') || []
            const localTagIdList = tagList.map(item => item.id)
            const localAccountIdList = accountList.map(item => item.id)

            for (let cloudTag of cloudTagList) {
                !localTagIdList.includes(cloudTag.id) && tagList.push(cloudTag)
            }
            for (let cloudAccount of cloudAccountList) {
                !localAccountIdList.includes(cloudAccount.id) && accountList.push(cloudAccount)
            }
            break
        case 1: // 以云端数据为主合并
            let localTagList = Taro.getStorageSync('tagList') || []
            let localAccountList = Taro.getStorageSync('accountList') || []
            const cloudTagIdList = cloudTagList.map(item => item.id)
            const cloudAccountIdList = cloudAccountList.map(item => item.id)
            
            tagList = cloudTagList
            accountList = cloudAccountList
            for (let localTag of localTagList) {
                // 把全部账号放在最前面
                !cloudTagIdList.includes(localTag.id) && (localTag.id === 'all' ? tagList.unshift(localTag) : tagList.push(localTag))
            }
            for (let localAccount of localAccountList) {
                !cloudAccountIdList.includes(localAccount.id) && accountList.push(localAccount)
            }
            break
        case 2: // 清除本地数据再下载备份
            tagList = cloudTagList
            tagList.unshift({ id: 'all', name: '全部账号' }) // // 把全部账号放在最前面
            accountList = cloudAccountList
            break
        default:
            break
    }

    await setStorage('tagList', tagList)
    await setStorage('accountList', accountList.map(item => {
        return {
            ...item,
            username: item.encrypted ? aesDecrypt(item.username) : item.username,
            password: item.encrypted ? aesDecrypt(item.password) : item.password,
            encrypted: false
        }
    }))
}

// 更新用户自动同步的配置项
const updateUserAutoSync = async (autoSync) => {
    const { result: _openid } = await Taro.cloud.callFunction({ name: 'getOpenId' })
    const data = {
        autoSync,
        updateTime: getTimeStr()
    }

    const res = await DB.collection('userList').where({
        _openid
    }).update({
        data
    })
    return res?.stats?.updated !== 0
}

export {
    setBackupData,
    setDownloadData,
    updateUserAutoSync
}
