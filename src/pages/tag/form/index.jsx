import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Input, Button } from '@tarojs/components'
import { getUuid, showToast, setStorage } from '../../../utils'
import TopBar from '../../../components/TopBar/index'

import './index.scss'

export default class Home extends Component {
    state = {
        name: '',
        tagId: null,
        tagList: [],
        nameFocus: false,
        loading: false
    }

    componentDidMount() {
        const { id: tagId } = Taro.getCurrentInstance().router.params
        const tagList = Taro.getStorageSync('tagList') || []
        this.setState({
            tagId,
            tagList
        }, () => {
            tagId && this.getDetail()
        })
    }

    // 获取详情
    getDetail = () => {
        const { tagId, tagList } = this.state
        const { name } = tagList.filter(item => item.id === tagId)[0]
        this.setState({ name })
    }

    // 监听输入框变化
    handleNameChange = (e) => {
        const name = e.detail.value
        this.setState({ name })
    }

    // 保存
    save = () => {
        const { name, tagId, tagList } = this.state
        if (!name) return this.setState({ nameFocus: true })
        this.setState({ loading: true })

        const list = tagList.map(item => {
            return {
                ...item,
                name: item.id === tagId ? name : item.name
            }
        })
        !tagId && list.push({
            id: getUuid(),
            name
        })

        setStorage('tagList', list).then(() => {
            showToast('保存成功').then(() => {
                this.setState({ loading: false })
                Taro.navigateBack()
            })
        })
    }

    render() {
        const { name, nameFocus, loading } = this.state

        return (
            <View className='full-page'>
                <TopBar title='标签名称' />

                <View className='container'>
                    <Input className='tag-input' value={name} onInput={this.handleNameChange} placeholder='请输入标签名称' maxlength={30} focus={nameFocus} onBlur={() => { this.setState({ nameFocus: false }) }} confirmType='done' />
                    <Button className='save-btn' loading={loading} disabled={loading} onClick={this.save}>保 存</Button>
                </View>
            </View>
        )
    }
}
