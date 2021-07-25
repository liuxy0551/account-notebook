import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Input, Button, Image } from '@tarojs/components'
import { getUuid, showToast, setStorage, getTime } from '../../../utils'
import TopBar from '../../../components/TopBar/index'
import TagList from '../components/TagList'
import passwordIconUrl from '../../../assets/images/password-icon.png'

import './index.scss'

export default class Home extends Component {
    state = {
        title: '新增账号',
        accountId: null,
        accountList: [],
        name: '',
        username: '',
        password: '',
        note: '',
        tagList: [],
        tagIdList: [],
        loading: false,
        nameFocus: false,
        usernameFocus: false,
        passwordFocus: false,
        tagListVisible: false
    }

    componentDidMount() {
        const { id: accountId } = Taro.getCurrentInstance().router.params
        const accountList = Taro.getStorageSync('accountList') || []
        this.setState({
            accountId,
            accountList,
            title: accountId ? '编辑账号' : '新增账号'
        }, () => {
            accountId && this.getDetail()
        })
    }

    // 获取详情
    getDetail = () => {
        const { accountId, accountList } = this.state
        const list = Taro.getStorageSync('tagList') || []
        const { name, username, password, note, tagIdList } = accountList.filter(item => item.id === accountId)[0]
        const tagList = []
        for (let tag of list) {
            tagIdList.includes(tag.id) && tagList.push(tag)
        }
        this.setState({ name, username, password, note, tagList, tagIdList })
    }

    getPassword = () => {

    }

    // 账号名称输入框变化
    handleNameChange = (e) => {
        const name = e.detail.value
        this.setState({ name })
    }

    // 账号输入框变化
    handleUsernameChange = (e) => {
        const username = e.detail.value
        this.setState({ username })
    }

    // 密码输入框变化
    handlePasswordChange = (e) => {
        const password = e.detail.value
        this.setState({ password })
    }

    // 备注输入框变化
    handleNoteChange = (e) => {
        const note = e.detail.value
        this.setState({ note })
    }

    // 点击标签列表
    handleTagList = () => {
        this.setState({ tagListVisible: true })
    }

    onClose = () => {
        this.setState({ tagListVisible: false })
    }

    // 选择标签
    onTagConfirm = (tagList) => {
        this.onClose()
        this.setState({ tagList })
    }

    // 保存
    save = () => {
        const { accountId, name, username, password, note, tagList } = this.state
        let { accountList } = this.state
        const time = getTime()
        if (!name) {
            showToast('请输入账号名称')
            return this.setState({ nameFocus: true })
        }
        if (!username) {
            showToast('请输入账号')
            return this.setState({ usernameFocus: true })
        }
        if (!password) {
            showToast('请输入密码')
            return this.setState({ passwordFocus: true })
        }
        this.setState({ loading: true })

        const tagIdList = tagList.map(item => item.id)
        const account = {
            id: accountId ? accountId : getUuid(),
            name,
            username,
            password,
            note,
            tagIdList,
            time
        }
        if (accountId) {
            accountList = accountList.map(item => {
                return item.id === accountId ? account : item
            })
        } else {
            accountList.push(account)
        }

        setStorage('accountList', accountList).then(() => {
            showToast('保存成功').then(() => {
                this.setState({ loading: false })
                Taro.navigateBack()
            })
        })
    }

    render() {
        const { title, name, username, password, note, tagList, tagIdList, loading, nameFocus, usernameFocus, passwordFocus, tagListVisible } = this.state

        return (
            <View className='full-page'>
                <TopBar title={title} />

                <View className='container'>
                    <View className='form-box'>
                        <View className='form-item'>
                            <View className='label'>账号名称</View>
                            <Input className='account-input' value={name} onInput={this.handleNameChange} placeholder='请输入账号名称' maxlength={50} focus={nameFocus} onBlur={() => { this.setState({ nameFocus: false }) }} />
                        </View>
                        <View className='form-item'>
                            <View className='label'>账号</View>
                            <Input className='account-input' value={username} onInput={this.handleUsernameChange} placeholder='请输入账号' maxlength={50} focus={usernameFocus} onBlur={() => { this.setState({ usernameFocus: false }) }} />
                        </View>
                        <View className='form-item'>
                            <View className='label'>密码</View>
                            <Input className='account-input' value={password} onInput={this.handlePasswordChange} placeholder='请输入密码' maxlength={50} focus={passwordFocus} onBlur={() => { this.setState({ passwordFocus: false }) }} />
                        </View>
                        <View className='form-item'>
                            <View className='label'>备注</View>
                            <Input className='account-input' value={note} onInput={this.handleNoteChange} placeholder='请输入备注' maxlength={200} />
                        </View>
                        <View className='form-item'>
                            <View className='label'>标签</View>
                            <View className='tag-name' onClick={this.handleTagList}>{ tagList.map(item => item.name).join('、') || '无' }</View>
                        </View>
                    </View>

                    <View className='bottom-box'>
                        <Button className='save-btn' loading={loading} disabled={loading} onClick={this.save}>保 存</Button>
                    </View>
                </View>

                <Image className='add-btn password' src={passwordIconUrl} onClick={this.getPassword} />

                <TagList tagListVisible={tagListVisible} tagIdList={tagIdList} onConfirm={this.onTagConfirm} onClose={this.onClose} />
            </View>
        )
    }
}