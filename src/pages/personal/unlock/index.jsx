import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Input, Button } from '@tarojs/components'
import ChangeLog from '../../../components/ChangeLog'
import { showToast, getFingerPrintSupport, startSoterAuthentication, setStorage } from '../../../utils'
import TopBar from '../../../components/TopBar/index'
import { version } from '../../../../package.json'

export default class Home extends Component {
    state = {
        title: '',
        showContent: false,
        passwordInfo: null,
        password: '',
        passwordFocus: false,
        fingerPrintSupport: false,
        useFingerPrint: true,
        logVisible: false
    }

    componentDidMount() {
        this.getIsUpdatedFirst()
    }

    // 是否更新后第一次进入小程序
    getIsUpdatedFirst = () => {
        let localVersion = Taro.getStorageSync('version')
        const logVisible = localVersion !== version

        if (!logVisible) return this.getFingerPrint()
        setStorage('version', version)
        this.setState({ logVisible })
    }

    // 当前设备是否支持指纹解锁、是否开启了指纹解锁
    getFingerPrint = async () => {
        Taro.showLoading({ title: '加载中...', mask: true })
        const fingerPrintSupport = await getFingerPrintSupport()
        let useFingerPrint = Taro.getStorageSync('useFingerPrint')
        if (useFingerPrint === '') { // 第一次进入，默认使用指纹解锁
            useFingerPrint = fingerPrintSupport ? true : false
            setStorage('useFingerPrint', useFingerPrint)
        }

        this.setState({ fingerPrintSupport, useFingerPrint }, () => {
            this.getDetail()
        })
    }

    // 获取详情
    getDetail = () => {
        const { fingerPrintSupport, useFingerPrint } = this.state
        const passwordInfo = Taro.getStorageSync('passwordInfo')
        if (!passwordInfo?.password) return Taro.redirectTo({ url: '/pages/home/index' })
        this.setState({
            title: '输入安全密码',
            passwordInfo,
            showContent: true
        }, () => {
            Taro.hideLoading()

            if (!fingerPrintSupport) return this.setState({ passwordFocus: true })
            if (!useFingerPrint) return this.setState({ passwordFocus: true })
            this.startFingerPrint()
        })
    }

    // 开始指纹识别
    startFingerPrint = async () => {
        const result = await startSoterAuthentication()
        if (result?.errMsg?.includes('cancel') && result?.errCode === 90008) return showToast('用户取消指纹解锁').then(() => {
            this.setState({ passwordFocus: true })
        })
        if (result?.errMsg?.includes('later') && result?.errCode === 90010) return showToast('指纹解锁失败，请稍后再试')
        if (result?.errMsg?.includes('ok') && result?.errCode === 0) return Taro.redirectTo({ url: '/pages/home/index' })
    }

    // 打开帮助弹框
    showHelpModal = () => {
        const { passwordInfo } = this.state
        Taro.showModal({
            title: '密码提示',
            cancelColor: '#999',
            cancelText: '忘记密码',
            confirmColor: '#333',
            content: `${ passwordInfo?.passwordTip }`,
            confirmText: '知道了',
            success: ({ confirm, cancel }) => {
                confirm && this.setState({ passwordFocus: true })
                cancel && this.forgetPassword()
            }
        })
    }

    forgetPassword = () => {
        Taro.showModal({
            cancelColor: '#333',
            confirmColor: '#ff0333',
            confirmText: '清除',
            content: `忘记安全密码只能通过清除所有用户数据进行重置，这将导致保存在本地的账号信息丢失，请谨慎操作！默认安全密码 1234`,
            success: ({ confirm }) => {
                confirm && Taro.showModal({
                    cancelColor: '#333',
                    confirmColor: '#999',
                    content: `真的要清除所有用户数据吗？`,
                    success: ({ confirm: removeConfirm }) => {
                        removeConfirm && Taro.clearStorage({
                            success: () => {
                                Taro.redirectTo({ url: '/pages/home/index' })
                            }
                        })
                    }
                })
            }
        })
    }

    handlePasswordChange = (e) => {
        Taro.vibrateShort()
        const password = e.detail.value
        this.setState({ password })
    }

    onClose = () => {
        this.setState({ logVisible: false }, () => {
            this.getFingerPrint()
        })
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
        const { title, showContent, password, passwordFocus, fingerPrintSupport, useFingerPrint, logVisible } = this.state

        return (
            <View className='full-page'>
                <TopBar title={title} showBack={false} />

                {
                    showContent && <View className='password-container'>
                        <View className='form-box'>
                            <View className='form-item'>
                                <View className='label'>当前安全密码</View>
                                <Input className='password-input' type='number' password value={password} onInput={this.handlePasswordChange} placeholder='请输入当前安全密码' maxlength={8} focus={passwordFocus} onBlur={() => { this.setState({ passwordFocus: false }) }} />
                            </View>
                            <View className='help-box'>
                                {
                                    fingerPrintSupport && useFingerPrint ? <Text onClick={this.startFingerPrint}>指纹解锁</Text> : <Text />
                                }
                                <Text onClick={this.showHelpModal}>帮助？</Text>
                            </View>
                        </View>

                        <View className='bottom-box padding'>
                            <Button className='save-btn' onClick={this.save}>确 定</Button>
                        </View>
                    </View>
                }
                
                <ChangeLog logVisible={logVisible} onClose={this.onClose} />
            </View>
        )
    }
}
