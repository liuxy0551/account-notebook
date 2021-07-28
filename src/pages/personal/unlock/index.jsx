import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Input, Button } from '@tarojs/components'
import { showToast } from '../../../utils'
import TopBar from '../../../components/TopBar/index'

export default class Home extends Component {
    state = {
        title: '',
        showContent: false,
        passwordInfo: null,
        password: '',
        passwordFocus: true
    }

    componentDidMount() {
        Taro.showLoading({ title: '加载中...' })
        this.getDetail()
    }

    // 获取详情
    getDetail = () => {
        const passwordInfo = Taro.getStorageSync('passwordInfo')
        if (!passwordInfo?.password) return Taro.redirectTo({ url: '/pages/home/index' })
        this.setState({
            title: '输入安全密码',
            passwordInfo,
            showContent: true
        }, () => {
            Taro.hideLoading()
        })
    }

    handlePasswordChange = (e) => {
        Taro.vibrateShort()
        const password = e.detail.value
        this.setState({ password })
    }

    // 保存
    save = () => {
        const { passwordInfo, password } = this.state
        if (!password) {
            Taro.vibrateShort()
            showToast(`请输入安全密码`)
            return this.setState({ passwordFocus: true })
        }
        if (passwordInfo?.password !== password) {
            Taro.vibrateShort()
            showToast('当前安全密码错误')
            return this.setState({
                password: '',
                passwordFocus: true
            })
        }
        Taro.redirectTo({ url: '/pages/home/index' })
    }

    render() {
        const { title, showContent, password, passwordFocus } = this.state

        return (
            <View className='full-page'>
                <TopBar title={title} />

                {
                    showContent && <View className='password-container'>
                        <View className='form-box'>
                        <View className='form-item'>
                            <View className='label'>当前安全密码</View>
                                <Input className='password-input' type='number' password value={password} onInput={this.handlePasswordChange} placeholder='请输入当前安全密码' maxlength={8} focus={passwordFocus} onBlur={() => { this.setState({ passwordFocus: false }) }} />
                            </View>
                            <View className='tip'>
                                安全密码建议 4 至 8 位数字，每次打开账号簿都需要输入安全密码，请牢记！
                            </View>
                        </View>

                        <View className='bottom-box padding'>
                            <Button className='save-btn' onClick={this.save}>保 存</Button>
                        </View>
                    </View>
                }
            </View>
        )
    }
}
