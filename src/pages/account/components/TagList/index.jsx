import { Component } from 'react'
import Taro from '@tarojs/taro'
import { AtFloatLayout } from "taro-ui"
import { View, Button } from '@tarojs/components'

import './index.scss'

class TagList extends Component {
    static defaultProps = {
        tagIdList: []
    }

    state = {
        tagList: []
    }

    componentDidMount() {
        this.getTagList()
    }

    componentDidUpdate(prevProps) {
        const { tagIdList } = this.props
        if (tagIdList?.length !== prevProps.tagIdList.length) this.getTagList()
    }

    // 获取标签列表
    getTagList = () => {
        const { tagIdList } = this.props
        const list = Taro.getStorageSync('tagList') || []
        const tagList = list.map(item => {
            return {
                ...item,
                active: tagIdList.includes(item.id)
            }
        })
        this.setState({ tagList })
    }

    chooseTag = (idx) => {
        let { tagList } = this.state
        tagList[idx].active = !tagList[idx].active
        this.setState({ tagList })
    }

    comfirm = () => {
        const { tagList } = this.state
        const { onConfirm } = this.props
        onConfirm(tagList.filter(item => item.active))
    }

    render() {
        const { tagList } = this.state
        const { tagListVisible, onClose } = this.props
        
        return (
            <AtFloatLayout isOpened={tagListVisible} onClose={onClose}>
                <View className='tag-content'>
                    <View className='tag-box-part'>
                        <View className='tag-box'>
                            {
                                tagList.map((item, idx) => {
                                    return (
                                        item.id !== 'all' && <View className={`tag-item ${ item.active ? 'active' : '' }`} key={item.id} onClick={() => this.chooseTag(idx)}>{ item.name }</View>
                                    )
                                })
                            }
                        </View>
                    </View>

                    <View className='bottom-box'>
                        <Button className='save-btn' onClick={this.comfirm}>确 定</Button>
                    </View>
                </View>
            </AtFloatLayout>
        )
    }
}

export default TagList
