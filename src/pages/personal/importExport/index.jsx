import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Textarea, Button } from '@tarojs/components'
import TopBar from '../../../components/TopBar/index'

import './index.scss'
import { getTimeStr, setStorage, showToast } from '../../../utils'

export default class Home extends Component {
    state = {
        content: ''
    }

    // 导出
    handleExport = () => {
        const tagList = Taro.getStorageSync('tagList') || []
        const accountList = Taro.getStorageSync('accountList') || []
        const content = JSON.stringify({
            tagList,
            accountList
        })
        this.setState({ content })
        Taro.setClipboardData({ data: content })
    }

    // 导入
    handleImport = async () => {
        const { content } = this.state
        let data = {}
        try {
            data = JSON.parse(content)
        } catch (error) {
            return Taro.showModal({
                title: `数据错误`,
                showCancel: false,
                confirmText: '知道了',
                content: `请检查数据，需要使用导出按钮生成的内容，手动修改数据会无法导入`,
                // success: ({ confirm }) => {
                //     confirm && this.setState({ content: '' })
                // }
            })
        }
        
        const { tagList, accountList } = data
        await setStorage('tagList', tagList)
        await setStorage('accountList', accountList)
        showToast('导入成功').then(() => {
            Taro.navigateBack({ delta: 2 })
        })
    }

    // 输入框发送变化
    handleContentChange = (e) => {
        const content = e.detail.value
        this.setState({ content })
    }

    // 输入框获取了焦点，每天仅提示一次
    handleContentFocus = () => {
        const fixTipedDate = Taro.getStorageSync('fixTipedDate')
        if (fixTipedDate === getTimeStr(true)) return
        Taro.showModal({
            title: `请勿修改`,
            showCancel: false,
            confirmText: '知道了',
            content: `请使用导出按钮生成的内容，手动修改数据会无法导入`,
            success: ({ confirm }) => {
                confirm && setStorage('fixTipedDate', getTimeStr(true))
            }
        })
    }

    render() {
        const { content } = this.state

        return (
            <View className='full-page'>
                <TopBar title='导入导出' />

                <View className='container'>
                    <View className='tip'>
                        点击
                        <Text className='tip-blod'>导出按钮</Text>
                        可以生成本地账号的内容并复制到剪切板，通过微信等方式发送到新设备上，在新设备的导入导出页面粘贴内容到下方文本框，再点击立即导入，就可以将数据迁移到新设备啦！
                    </View>
                    
                    <View className='btn-box'>
                        <Button className='btn' onClick={this.handleExport}>导出</Button>
                        <Button className='btn' onClick={this.handleImport}>立即导入</Button>
                    </View>

                    <View className='input-box'>
                        <Textarea className='content-input' autoHeight maxlength={-1} value={content} onInput={this.handleContentChange} onFocus={this.handleContentFocus} placeholder='请点击上方的导出按钮自动生成内容' />
                    </View>
                </View>
            </View>
        )
    }
}
