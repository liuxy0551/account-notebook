import { Component } from 'react'
import Taro from '@tarojs/taro'
import { AtFloatLayout } from "taro-ui"
import { View, Image } from '@tarojs/components'
import editIconUrl from '../../../../assets/images/edit-icon.png'

import './index.scss'

class AccountDetail extends Component {
    static defaultProps = {
        account: null
    }

    state = {
        tagNameList: []
    }

    componentDidMount() {
        
    }

    componentDidUpdate(prevProps) {
        const { account } = this.props
        if (JSON.stringify(prevProps.account) !== JSON.stringify(account)) {
            this.getTagList()
        }
    }

    // 获取标签列表
    getTagList = () => {
        const { account } = this.props
        const { tagIdList } = account
        const tagList = Taro.getStorageSync('tagList') || []
        const tagNameList = []
        for (let tag of tagList) {
            tagIdList.includes(tag.id) && tagNameList.push(tag.name)
        }
        this.setState({ tagNameList })
    }

    // 跳转页面
    goPage = () => {
        const { account, onClose } = this.props
        onClose()
        Taro.navigateTo({ url: `/pages/account/form/index?id=${ account?.id }` })
    }

    // 复制
    copyText = (data) => {
        Taro.setClipboardData({ data })
    }
  
    render() {
        const { tagNameList } = this.state
        const { accountVisible, account, onClose } = this.props
        
        return (
            <AtFloatLayout isOpened={accountVisible} onClose={onClose} key={`${ account?.id }`}>
                {
                    account && (
                        <View className='account-detail'>
                            <View className='name-icon'>
                                <View className='name'>{ account.name }</View>
                                <Image className='icon' src={editIconUrl} onClick={this.goPage} />
                            </View>

                            <View className='box'>
                                <View className='item'>
                                    <View className='label'>账号名称</View>
                                    <View className='value' onClick={() => { this.copyText(account.name) }}>{ account.name }</View>
                                </View>
                                <View className='item'>
                                    <View className='label'>账号</View>
                                    <View className='value' onClick={() => { this.copyText(account.username) }}>{ account.username }</View>
                                </View>
                                <View className='item'>
                                    <View className='label'>密码</View>
                                    <View className='value' onClick={() => { this.copyText(account.password) }}>{ account.password }</View>
                                </View>
                                <View className='item'>
                                    <View className='label'>备注</View>
                                    <View className='value'>{ account.note || '无' }</View>
                                </View>
                                <View className='item'>
                                    <View className='label'>标签</View>
                                    <View className='value'>{ tagNameList.join('、') || '无' }</View>
                                </View>
                                <View className='item'>
                                    <View className='label'>修改时间</View>
                                    <View className='value'>{ account.time }</View>
                                </View>
                            </View>
                        </View>
                    )
                }
            </AtFloatLayout>
        )
    }
}

export default AccountDetail
