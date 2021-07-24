// 初始化数据
import { setStorage } from './updateData'

// 获取单个 uuid v4
const getUuid = () => {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
		let r = Math.random() * 16 | 0, // 随机数取整
			v = c == 'x' ? r : (r & 0x3 | 0x8)
		return v.toString(16)
	})
}

// 初始化标签列表
const initTagList = () => {
    const tagList = [
        {
            id: 'all',
            name: '全部账号'
        },
        {
            id: getUuid(),
            name: '社交'
        },
        {
            id: getUuid(),
            name: '购物'
        },
        {
            id: getUuid(),
            name: '学习'
        }
    ]
    setStorage('tagList', tagList)
}

export {
    getUuid,
    initTagList
}
