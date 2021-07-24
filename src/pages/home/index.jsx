import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import TopBar from '../../components/TopBar/index'
import Empty from '../../components/Empty/index'
import Tabs from './components/Tabs/index'
import { initTagList } from '../../utils'
import addBtnUrl from '../../assets/images/add-btn.png'

import './index.scss'

export default class Home extends Component {
    state = {
        selectedTagId: null,
        tagList: []
    }

    componentDidMount() {
        const { tagList } = this.state
        const selectedTagId = tagList[0]?.id
        this.setState({ selectedTagId })

        this.getTagList()
    }

    // 获取标签列表
    getTagList = () => {
        const tagList = Taro.getStorageSync('tagList')
        this.setState({ tagList })
    }

    // 添加账号
    addAccount = () => {
        initTagList()
    }

    // 左侧tab变化
    tagChange = ({ id: selectedTagId }) => {
        this.setState({ selectedTagId })
    }

    render() {
        const { selectedTagId, tagList } = this.state

        return (
            <View className='full-page'>
                <TopBar showAvatar title='记账簿' />

                <View className='container'>
                    <Tabs tagList={tagList} selectedTagId={selectedTagId} tagChange={this.tagChange} />
                    <View className='account-content'>
                        <Empty />
                    </View>
                </View>

                <Image className='add-btn' src={addBtnUrl} onClick={this.addAccount} />
            </View>
        )
    }
}
