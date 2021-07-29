import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { showToast, setStorage } from '../../../utils'
import TopBar from '../../../components/TopBar/index'
import addBtnUrl from '../../../assets/images/add-btn.png'
import editIconUrl from '../../../assets/images/edit-icon.png'
import deleteIconUrl from '../../../assets/images/delete-icon.png'

import './index.scss'

export default class Home extends Component {
    state = {
        tagList: []
    }

    componentDidMount() {

    }

    componentDidShow () {
        this.getTagList()
    }

    // 获取标签列表
    getTagList = () => {
        const tagList = Taro.getStorageSync('tagList') || []
        this.setState({ tagList })
    }

    // 添加
    addTag = () => {
        Taro.navigateTo({ url: `/pages/tag/form/index` })
    }

    // 编辑
    editTag = (item) => {
        Taro.navigateTo({ url: `/pages/tag/form/index?id=${ item.id }` })
    }

    // 删除
    deleteTag = (item) => {
        const { tagList } = this.state
        Taro.showModal({
            cancelColor: '#333',
            confirmColor: '#ff0333',
            content: `删除后关联此标签的账号在“全部账号”中可见，是否删除此标签？`,
            success: ({ confirm }) => {
                if (!confirm) return
                tagList.splice(tagList.map(tag => tag.id).indexOf(item.id), 1)
                this.setState({ tagList })
                setStorage('tagList', tagList).then(() => {
                    showToast('删除成功')
                })
            }
        })
    }

    render() {
        const { tagList } = this.state

        return (
            <View className='full-page'>
                <TopBar title='标签管理' />

                <View className='container'>
                    <View className='tag-box'>
                        {
                            tagList.map(item => {
                                return (
                                    <View className='tag-item' key={item.id}>
                                        <View className='tag-name'>{ item.name }</View>
                                        {
                                            item.id !== 'all' && <Image className='icon' src={editIconUrl} onClick={() => this.editTag(item)} />
                                        }
                                        {
                                            item.id !== 'all' && <Image className='icon' src={deleteIconUrl} onClick={() => this.deleteTag(item)} />
                                        }
                                    </View>
                                )
                            })
                        }
                    </View>
                </View>

                <Image className='add-btn' src={addBtnUrl} onClick={this.addTag} />
            </View>
        )
    }
}
