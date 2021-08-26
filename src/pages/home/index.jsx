import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import TopBar from '../../components/TopBar/index'
import Empty from '../../components/Empty/index'
import Tabs from './components/Tabs/index'
import AccountDetail from './components/AccountDetail/index'
import { setStorage, getTimeStr, initData, showShareMenu } from '../../utils'
import addBtnUrl from '../../assets/images/add-btn.png'

import './index.scss'

export default class Home extends Component {
    state = {
        selectedTagId: null,
        tagList: [],
        accountList: [],
        accountVisible: false,
        account: null,
        userInfo: null
    }

    componentDidMount() {
        showShareMenu()
    }

    componentDidShow() {
        Taro.showLoading({ title: '加载中...', mask: true })
        const { userInfo } = this.state
        this.getTagList()
        !userInfo && this.getUserInfo()
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
        }, () => {
            this.getAccountList()
        })
    }

    // 获取标签下的账号列表
    getAccountList = () => {
        const { selectedTagId, tagList } = this.state
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
        this.setState({ accountList }, () => {
            Taro.hideLoading()
            this.getPasswordInfo()
        })
    }

    // 添加账号
    addAccount = () => {
        Taro.navigateTo({ url: `/pages/account/form/index` })
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

    render() {
        const { selectedTagId, tagList, accountList, accountVisible, account, userInfo } = this.state

        return (
            <View className='full-page'>
                <TopBar showAvatar showBack={false} userInfo={userInfo} title='记账簿' />

                <View className='container'>
                    <Tabs tagList={tagList} selectedTagId={selectedTagId} tagChange={this.tagChange} />
                    <View className='account-content'>
                        {
                            !!accountList.length ? this.rendAccountList() : <Empty />
                        }
                    </View>
                </View>

                <Image className='add-btn' src={addBtnUrl} onClick={this.addAccount} />

                <AccountDetail accountVisible={accountVisible} account={account} onClose={this.onClose} getAccountList={this.getAccountList} />
            </View>
        )
    }
}
