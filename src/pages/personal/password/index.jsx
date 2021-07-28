import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Input, Button } from '@tarojs/components'
import { showToast, setStorage, getTime } from '../../../utils'
import TopBar from '../../../components/TopBar/index'

export default class Home extends Component {
    state = {
        isFirst: false,
        passwordInfo: null,
        oldPassword: '',
        password: '',
        passwordTip: '',
        loading: false,
        oldPasswordFocus: true,
        passwordFocus: false,
        passwordTipFocus: false
    }

    componentDidMount() {
        this.getDetail()
        // showToast('安全密码建议 4 至 8 位数字', 3000)
    }

    // 获取详情
    getDetail = () => {
        const passwordInfo = Taro.getStorageSync('passwordInfo')
        this.setState({
            isFirst: !passwordInfo,
            passwordInfo,
            passwordTip: passwordInfo?.passwordTip || ''
        })
    }

    handleOldPasswordChange = (e) => {
        Taro.vibrateShort()
        const oldPassword = e.detail.value
        this.setState({ oldPassword })
    }

    handlePasswordChange = (e) => {
        Taro.vibrateShort()
        const password = e.detail.value
        this.setState({ password })
    }

    handlePasswordTipChange = (e) => {
        Taro.vibrateShort()
        const passwordTip = e.detail.value
        this.setState({ passwordTip })
    }

    // 保存
    save = () => {
        const { isFirst, passwordInfo, oldPassword, password, passwordTip } = this.state
        if (!isFirst && !oldPassword) {
            Taro.vibrateShort()
            showToast('请输入当前安全密码')
            return this.setState({ oldPasswordFocus: true })
        }
        if (!password) {
            Taro.vibrateShort()
            showToast(`请输入${ !isFirst ? '新的' : '' }安全密码`)
            return this.setState({ passwordFocus: true })
        }
        if (!isFirst && passwordInfo?.password !== oldPassword) {
            Taro.vibrateShort()
            showToast('当前安全密码错误')
            return this.setState({
                oldPassword: '',
                oldPasswordFocus: true
            })
        }
        
        this.setState({ loading: true })
        Taro.showModal({
            cancelColor: '#333',
            content: `每次打开账号簿都需要输入安全密码，务必牢记！`,
            success: ({ confirm, cancel }) => {
                if (confirm) {
                    const info = { password, passwordTip, changed: true, remindDay: getTime(true) }
                    setStorage('passwordInfo', info).then(() => {
                        showToast('保存成功').then(() => {
                            this.setState({ loading: false })
                            Taro.navigateBack()
                        })
                    })
                } else if (cancel) {
                    this.setState({ loading: false })
                }
            }
        })
    }

    render() {
        const { isFirst, oldPassword, password, passwordTip, loading, oldPasswordFocus, passwordFocus, passwordTipFocus } = this.state

        return (
            <View className='full-page'>
                <TopBar title='设置安全密码' />

                <View className='password-container'>
                    <View className='form-box'>
                        {
                            !isFirst && (
                                <View className='form-item'>
                                    <View className='label'>当前安全密码</View>
                                    <Input className='password-input' type='number' password value={oldPassword} onInput={this.handleOldPasswordChange} placeholder='请输入当前安全密码' maxlength={8} focus={oldPasswordFocus} onBlur={() => { this.setState({ oldPasswordFocus: false }) }} />
                                </View>
                            )
                        }
                        <View className='form-item'>
                            <View className='label'>{ isFirst ? '安全密码' : '新的安全密码' }</View>
                            <Input className='password-input' type='number' password value={password} onInput={this.handlePasswordChange} placeholder={`请输入${ !isFirst ? '新的' : '' }安全密码`} maxlength={8} focus={passwordFocus} onBlur={() => { this.setState({ passwordFocus: false }) }} />
                        </View>
                        <View className='form-item'>
                            <View className='label'>密码提示</View>
                            <Input className='password-input' value={passwordTip} onInput={this.handlePasswordTipChange} placeholder='请输入密码提示' maxlength={50} focus={passwordTipFocus} onBlur={() => { this.setState({ passwordTipFocus: false }) }} />
                        </View>
                        <View className='tip'>
                            安全密码建议 4 至 8 位数字，每次打开账号簿都需要输入安全密码，请牢记！
                        </View>
                    </View>

                    <View className='bottom-box padding'>
                        <Button className='save-btn' loading={loading} disabled={loading} onClick={this.save}>保 存</Button>
                    </View>
                </View>
            </View>
        )
    }
}
