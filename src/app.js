import { Component } from 'react'
import { cloudInit, getUpdateInfo } from './utils'
import './app.scss'

class App extends Component {
    componentDidMount() {
        cloudInit()
        getUpdateInfo()
    }

    // this.props.children 是将要会渲染的页面
    render() {
        return this.props.children
    }
}

export default App
