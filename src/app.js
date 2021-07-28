import { Component } from 'react'
import { getUpdateInfo } from './utils'
import './app.scss'

class App extends Component {
    componentDidMount() {
        getUpdateInfo()
    }

    // this.props.children 是将要会渲染的页面
    render() {
        return this.props.children
    }
}

export default App
