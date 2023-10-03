import { Component } from 'react'
import { View, Input, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import TopBar from '../../components/TopBar/index'
import Empty from '../../components/Empty/index'
import Tabs from './components/Tabs/index'
import AccountDetail from './components/AccountDetail/index'
import { setStorage, getTimeStr, initData, showShareMenu } from '../../utils'
import { setBackupData } from '../../utils/cloudSync'
import { getCloudIsPayAutoSync } from '../../utils/user'
import addBtnUrl from '../../assets/images/add-btn.png'
import uploadIconUrl from '../../assets/images/upload-icon.png'

import './index.scss'

export default class Home extends Component {
    state = {
        selectedTagId: null,
        tagList: [],
        accountList: [],
        accountVisible: false,
        account: null,
        userInfo: null,
        search: '',
        isPay: false
    }

    componentDidMount() {
        this.getIsPayAutoSync()
        showShareMenu()
    }

    componentDidShow() {
        Taro.showLoading({ title: '加载中...', mask: true })
        const { userInfo } = this.state
        this.getTagList()
        !userInfo && this.getUserInfo()
    }

    // 是否支付过、自动同步
    getIsPayAutoSync = async () => {
        const { isPay } = await getCloudIsPayAutoSync()
        this.setState({ isPay })
    }

    getUserInfo = () => {
        const userInfo = Taro.getStorageSync('userInfo') || null
        this.setState({ userInfo })
    }

    getPasswordInfo = () => {
        const passwordInfo = Taro.getStorageSync('passwordInfo')
        if (!passwordInfo?.changed && passwordInfo?.remindDay !== getTimeStr(true)) {
            setStorage('passwordInfo', {
                password: '1234',
                passwordTip: '默认密码 1234',
                changed: false,
                remindDay: getTimeStr(true)
            })

            Taro.showModal({
                title: '安全密码',
                cancelColor: '#999',
                cancelText: '知道了',
                confirmText: '去修改',
                content: `欢迎使用“记账簿”，默认安全密码 1234，请及时修改！`,
                success: ({ confirm }) => {
                    confirm && Taro.navigateTo({ url: `/pages/personal/password/index` })
                }
            })
        }
    }

    // 获取标签列表
    getTagList = async () => {
        let tagList = Taro.getStorageSync('tagList') || []
        if (!tagList.length) tagList = await initData()
        this.setState({ tagList })
        this.tagChange(tagList[0])
    }

    // 左侧tab变化
    tagChange = (tag) => {
        this.setState({
            selectedTagId: tag?.id
        }, this.getAccountList)
    }

    // 获取标签下的账号列表
    getAccountList = () => {
        const { selectedTagId, tagList, search } = this.state
        const list = Taro.getStorageSync('accountList') || []
        let accountList = []

        // 非全部账号
        if (selectedTagId !== tagList[0]?.id) {
            for (let account of list) {
                if (account.tagIdList.includes(selectedTagId)) {
                    accountList.push(account)
                }
            }
        } else {
            accountList = list
        }
        if (search !== '') accountList = accountList.filter(item => item.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) || item.username.toLocaleLowerCase().includes(search.toLocaleLowerCase()))

        this.setState({ accountList }, () => {
            Taro.hideLoading()
            this.getPasswordInfo()
        })
    }

    // 添加账号
    addAccount = () => {
        Taro.navigateTo({ url: `/pages/account/form/index` })
    }

    // 主动备份
    handleUpload = () => {
        const { isPay } = this.state
        isPay && Taro.showModal({
            confirmText: '开始备份',
            content: `备份操作会覆盖云端内容，是否立即备份？`,
            success: ({ confirm }) => {
                confirm && setBackupData()
            }
        })
    }

    // 编辑
    showAccount= (account) => {
        this.setState({
            account
        }, () => {
            setTimeout(() => {
                this.setState({ accountVisible: true })
            }, 50)
        })
    }

    rendAccountList = () => {
        const { accountList } = this.state
        return (
            <View className='account-box'>
                {
                    accountList.map(item => {
                        return (
                            <View className='account-item' key={item.id} onClick={() => { this.showAccount(item) }}>
                                <View className='account-name'>{ item.name }</View>
                                <View className='account-username'>{ item.username }</View>
                            </View>
                        )
                    })
                }
            </View>
        )
    }

    onClose = () => {
        this.setState({ accountVisible: false })
    }

    // 搜索框变化
    handleSearchChange = (e) => {
        const search = e.detail.value
        this.setState({
            search
        }, this.getAccountList)
    }

    render() {
        const { selectedTagId, tagList, accountList, accountVisible, account, userInfo, search, isPay } = this.state
        const isDemo = accountList.length === 2 && accountList.every(item => item.name?.includes('Demo') && item.password?.includes('123456'))

        return (
            <View className='full-page'>
                <TopBar showAvatar showBack={false} userInfo={userInfo} title='记账簿' />

                <View className='container'>
                    <Tabs tagList={tagList} selectedTagId={selectedTagId} tagChange={this.tagChange} />
                    <View className='account-content'>
                        <View className='search-box'>
                            <Input className='search-input' value={search} onInput={this.handleSearchChange} placeholder='可模糊搜索账号名称、账号' maxlength={20} />
                        </View>
                        {
                            !!accountList.length ? this.rendAccountList() : <Empty />
                        }
                        {
                            selectedTagId === 'all' && accountList.length > 10 ? <View className='account-count'>共有 { accountList.length } 个账号</View> : null
                        }
                    </View>
                </View>

                <Image className='add-btn' src={addBtnUrl} onClick={this.addAccount} />
                {
                    userInfo && isPay && !isDemo && <Image className='add-btn upload-icon' src={uploadIconUrl} onClick={this.handleUpload} />
                }

                <AccountDetail accountVisible={accountVisible} account={account} onClose={this.onClose} getAccountList={this.getAccountList} />
            </View>
        )
    }
}
