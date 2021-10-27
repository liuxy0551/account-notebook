import { Component } from 'react'
import Taro from '@tarojs/taro'
import { AtFloatLayout } from "taro-ui"
import { View, Button, PickerView, PickerViewColumn, CheckboxGroup, Checkbox } from '@tarojs/components'
import { getRandomPassword } from '../../../../utils'

import './index.scss'

class TagList extends Component {
    static defaultProps = {
    }

    state = {
        password: '',
        lengthIdx: 2,
        lengthList: [],
        checkboxList: [
            { value: 'upper', label: '包含大写字母', checked: true },
            { value: 'lower', label: '包含小写字母', checked: true },
            { value: 'number', label: '包含数字', checked: true },
            { value: 'symbol', label: '包含符号', checked: false }
        ],
        checkboxValue: []
    }

    componentDidMount() {
        const { checkboxList } = this.state
        const lengthList = []
        for (let i = 6; i <= 30; i++) {
            lengthList.push(i)
        }

        const checkboxValue = checkboxList.filter(item => item.checked).map(item => item.value)

        this.setState({
            lengthList,
            checkboxValue
        }, this.getNewPassword)
    }

    getNewPassword = () => {
        const { lengthIdx, lengthList, checkboxValue } = this.state
        const password = getRandomPassword(checkboxValue, lengthList[lengthIdx])
        this.setState({ password })
    }

    copyText = () => {
        const { password } = this.state
        Taro.setClipboardData({ data: password })
    }

    // 选择密码长度
    handlePickerChange = (e) => {
        const lengthIdx = e.detail.value
        this.setState({ lengthIdx }, this.getNewPassword)
    }

    // 选择包含的元素
    handleCheckboxChange = (e) => {
        let { checkboxList } = this.state
        const checkboxValue = e.detail.value
        checkboxList = checkboxList.map(item => {
            return {
                ...item,
                checked: checkboxValue.includes(item.value)
            }
        })

        this.setState({
            checkboxList,
            checkboxValue
        }, this.getNewPassword)
    }

    handleConfirm = () => {
        const { onConfirm } = this.props
        const { password } = this.state
        onConfirm(password)
    }

    render() {
        const { password, lengthList, lengthIdx, checkboxList, checkboxValue } = this.state
        const { passwordVisible, onClose } = this.props
        
        return (
            <AtFloatLayout isOpened={passwordVisible} onClose={onClose}>
                <View className='password-content'>
                    <View className='title-row'>
                        <View className='title'>随机密码生成器</View>
                        <View className='reset' onClick={this.getNewPassword}>重新生成</View>
                    </View>

                    <View className='password-text'>
                        <View className='password' onClick={this.copyText}>{ password }</View>
                    </View>

                    <View className='picker-checkbox'>
                        <View className='picker-part'>
                            <PickerView className='picker-content' value={[lengthIdx]} onChange={this.handlePickerChange}>
                                <PickerViewColumn>
                                    {
                                        lengthList.map(item => {
                                            return <View className='text' key={item}>{ item }</View>
                                        })
                                    }
                                </PickerViewColumn>
                            </PickerView>
                        </View>
                        <View className='checkbox-part'>
                            <CheckboxGroup value={checkboxValue} onChange={this.handleCheckboxChange}>
                                {
                                    checkboxList.map(item => {
                                        return (
                                            <Checkbox className='checkbox' key={item.value} value={item.value} disabled={checkboxValue.length === 1 && item.checked} checked={item.checked}>{item.label}</Checkbox>
                                        )
                                    })
                                }
                            </CheckboxGroup>
                        </View>
                    </View>

                    <View className='bottom-box'>
                        <Button className='save-btn' onClick={this.handleConfirm}>使用此密码</Button>
                    </View>
                </View>
            </AtFloatLayout>
        )
    }
}

export default TagList
