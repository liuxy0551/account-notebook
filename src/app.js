import { Component } from 'react'
import { getUpdateInfo } from './utils'
// import { cloudInit, getUpdateInfo } from './utils'
import './app.scss'

class App extends Component {
    componentDidMount() {
        // 暂停使用微信小程序云开发
        // cloudInit()
        getUpdateInfo()
    }

    // this.props.children 是将要会渲染的页面
    render() {
        return this.props.children
    }
}

export default App
