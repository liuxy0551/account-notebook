import { Component } from 'react'
import Taro from '@tarojs/taro'
import { AtFloatLayout } from "taro-ui"
import { View, Button } from '@tarojs/components'
import { getRandomPassword } from '../../../../utils'

import './index.scss'

class TagList extends Component {
    static defaultProps = {
    }

    state = {
        password: '',
        length: 10
    }

    componentDidMount() {
        this.getNewPassword()
    }

    getNewPassword = async () => {
        const { length } = this.state
        const password = await getRandomPassword(['upper', 'lower', 'number', 'symbol'], length)
        this.setState({ password })
    }

    copyText = () => {
        const { password } = this.state
        Taro.setClipboardData({ data: password })
    }

    render() {
        const { password } = this.state
        const { passwordVisible, onClose } = this.props
        
        return (
            <AtFloatLayout isOpened={passwordVisible} onClose={onClose}>
                <View className='password-content'>
                    <View className='title-row'>
                        <View className='title'>随机密码生成器</View>
                        <View className='reset' onClick={this.getNewPassword}>重新生成</View>
                    </View>

                    <View className='password-text' onClick={this.getNewPassword}>{ password }</View>

                    <View className='picker-checkbox'>
                        <View className='picker-part'>
                            picker-part
                        </View>
                        <View className='checkbox-part'>
                            checkbox-part
                        </View>
                    </View>

                    <View className='bottom-box'>
                        <Button className='save-btn' onClick={this.copyText}>复制密码</Button>
                    </View>
                </View>
            </AtFloatLayout>
        )
    }
}

export default TagList
