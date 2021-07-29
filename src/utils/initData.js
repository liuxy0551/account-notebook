// 初始化数据
import { setStorage } from './updateData'
import { getTimeStr } from './index'

// 获取单个 uuid v4
const getUuid = () => {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
		let r = Math.random() * 16 | 0, // 随机数取整
			v = c == 'x' ? r : (r & 0x3 | 0x8)
		return v.toString(16)
	})
}

// 初始化标签列表
const initTagList = async () => {
    const tagId1 = getUuid(), tagId2 = getUuid()
    const tagList = [
        {
            id: 'all',
            name: '全部账号'
        },
        {
            id: tagId1,
            name: '社交'
        },
        {
            id: tagId2,
            name: '购物'
        },
        {
            id: getUuid(),
            name: '学习'
        }
    ]
    const data = await setStorage('tagList', tagList)
    await initAccount(tagId1, tagId2)
    return data
}

// 初始化一个示例账号
const initAccount = async (tagId1, tagId2) => {
    const accountList = [
        {
            id: getUuid(),
            name: '社交账号 Demo',
            username: '12345678@qq.com',
            password: 'Aa123456',
            note: '这是一个社交示例账号',
            tagIdList: [tagId1],
            time: getTimeStr()
        },
        {
            id: getUuid(),
            name: '购物账号 Demo',
            username: '87654321',
            password: '123456',
            note: '这是一个购物示例账号',
            tagIdList: [tagId2],
            time: getTimeStr()
        }
    ]
    await setStorage('accountList', accountList)
}

export {
    getUuid,
    initTagList
}
