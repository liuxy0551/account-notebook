import Taro from '@tarojs/taro'
import { getTimeStr, showToast } from '../index'
import { setStorage } from '../updateData'
import { aesEncrypt, aesDecrypt } from './crypto'
import API from '../api'

// 备份需要加密账号和密码
const setBackupData = async (list = ['tagList', 'accountList']) => {
    list.length === 2 && Taro.showLoading({ title: '备份中...', mask: true })
    try {
        let tagList, accountList
        if (list.includes('tagList')) {
            tagList = Taro.getStorageSync('tagList') || []
            tagList = tagList.filter(item => item.id !== 'all')
            await updateCloudData(tagList, false)
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
            await updateCloudData(accountList)
        }
        list.length === 2 && showToast('备份成功')
    } catch (err) {
        const msg = '备份失败，请稍后重试'
        console.log(msg, err)
        showToast(msg)
    }
}

// 更新云端数据
const updateCloudData = async (value, isAccount = true) => {
    const _openid = Taro.getStorageSync('_openid')
    const { nickName = '' } = Taro.getStorageSync('userInfo') || {}
    const data = {
        [isAccount ? 'accountList' : 'tagList']: value,
        nickName,
        updateTime: getTimeStr()
    }
    await API[isAccount ? 'updateAccountData' : 'updateTagData']({ _openid, data })
}

// 下载后解密账号和密码 isFirst 为 true 的时候，是第一次进入小程序下载远程数据
const setDownloadData = async (index, isFirst = false) => {
    !isFirst && Taro.showLoading({ title: '下载中...', mask: true })
    try {
        const _openid = Taro.getStorageSync('_openid')

        const { data: tagListData } = await API.getTagList({ _openid })
        const { data: accountListData } = await API.getAccountList({ _openid })
        const { tagList } = tagListData
        const { accountList } = accountListData

        if (!tagList.length && !accountList.length) {
            !isFirst && showToast('没有备份记录，请先备份')
        } else {
            await setDataStorage(index, tagList, accountList)
            !isFirst && showToast(`${ index === 2 ? '下载' : '合并' }成功`).then(() => {
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
    const _openid = Taro.getStorageSync('_openid')
    const data = {
        autoSync,
        updateTime: getTimeStr()
    }
    const res = await API.updateUserAutoSync({ _openid, data })
    return res.code === 200
}

export {
    setBackupData,
    setDownloadData,
    updateUserAutoSync,
    updateCloudData
}
