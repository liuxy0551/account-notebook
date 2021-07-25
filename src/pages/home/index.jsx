import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import TopBar from '../../components/TopBar/index'
import Empty from '../../components/Empty/index'
import Tabs from './components/Tabs/index'
import AccountDetail from './components/AccountDetail/index'
import { initTagList } from '../../utils'
import addBtnUrl from '../../assets/images/add-btn.png'

import './index.scss'

export default class Home extends Component {
    state = {
        selectedTagId: null,
        tagList: [],
        accountList: [],
        accountVisible: false,
        account: null
    }

    componentDidMount() {
        
    }

    componentDidShow() {
        this.getTagList()
    }

    // 获取标签列表
    getTagList = async () => {
        let tagList = Taro.getStorageSync('tagList') || []
        if (!tagList.length) tagList = await initTagList()
        this.setState({ tagList })
        this.tagChange(tagList[0])
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

        this.setState({ accountList })
    }

    // 添加账号
    addAccount = () => {
        Taro.navigateTo({ url: `/pages/account/form/index` })
    }

    // 编辑
    showAccount= (account) => {
        this.setState({
            account,
            accountVisible: true
        })
    }

    // 左侧tab变化
    tagChange = (tag) => {
        this.setState({
            selectedTagId: tag?.id
        }, () => {
            this.getAccountList()
        })
    }

    rendAccount = () => {
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
        const { selectedTagId, tagList, accountList, accountVisible, account } = this.state

        return (
            <View className='full-page'>
                <TopBar showAvatar title='记账簿' />

                <View className='container'>
                    <Tabs tagList={tagList} selectedTagId={selectedTagId} tagChange={this.tagChange} />
                    <View className='account-content'>
                        {
                            !!accountList.length ? this.rendAccount() : <Empty />
                        }
                    </View>
                </View>

                <Image className='add-btn' src={addBtnUrl} onClick={this.addAccount} />

                <AccountDetail accountVisible={accountVisible} account={account} onClose={this.onClose} />
            </View>
        )
    }
}
