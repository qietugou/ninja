<template>
  <div class="content">
    <div class="card">
      <div class="card-header">
        <p class="card-title">个人中心</p>
      </div>
      <div class="card-body" style="color:red;">
         恭喜您，录入成功。等待发财！！！！
      </div>
      <div class="card-footer">
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <p class="card-title">常见活动位置</p>
        <span class="card-subtitle">下面是一些常见活动的位置</span>
      </div>
      <div class="card-body">
        <ul>
          <li
            v-for="(item, index) in activity"
            :key="index"
            class="leading-normal"
          >
            <span>{{ item.name }}：</span>
            <span class="pr-2">{{ item.address }}</span>
            <a
              v-if="item.href"
              class="text-blue-400"
              href="#"
              @click="openUrlWithJD(item.href)"
              >直达链接</a
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserInfoAPI, delAccountAPI, remarkupdateAPI, WSCKLoginAPI, WSCKDelaccountAPI, remarkupdateWSCKAPI } from '@/api/index'
import { onMounted, reactive, toRefs } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
export default {
  setup() {
    const router = useRouter()
    const route = useRoute()

    let data = reactive({
      remark: '',
      jdwsck: undefined,
      nickName: undefined,
      timestamp: undefined,
    })

    const getInfo = async () => {
      const eid = localStorage.getItem('eid')
      const wseid = localStorage.getItem('wseid')
      if (!eid && !wseid) {
        logout()
        return
      }
      if (eid) {
        const userInfo = await getUserInfoAPI(eid)
        if (!userInfo) {
          ElMessage.error('获取用户CK信息失败，请重重新登录')
          logout()
          return
        }
        data.nickName = userInfo.data.nickName
        data.timestamp = new Date(userInfo.data.timestamp).toLocaleString()
      }

      if (wseid) {
        const userInfo = await getWSCKUserinfoAPI(wseid)
        if (!userInfo) {
          ElMessage.error('获取用户WSCK信息失败，请重重新登录')
          logout()
          return
        }
        data.nickName = userInfo.data.nickName
        data.timestamp = new Date(userInfo.data.timestamp).toLocaleString()
      }
    }

    onMounted(getInfo)

    const logout = () => {
      localStorage.removeItem('eid')
      localStorage.removeItem('wseid')
      router.push('/login')
    }

    const delAccount = async () => {
      const eid = localStorage.getItem('eid')
      const body = await delAccountAPI({ eid })
      if (body.code !== 200) {
        ElMessage.error(body.message)
      } else {
        ElMessage.success(body.message)
        setTimeout(() => {
          logout()
        }, 1000)
      }
    }

    const changeremark = async () => {
      const eid = localStorage.getItem('eid')
      const wseid = localStorage.getItem('wseid')
      const remark = data.remark
      if (eid) {
        const body = await remarkupdateAPI({ eid, remark })
        if (body.code !== 200) {
          ElMessage.success(body.message)
        } else {
          ElMessage.error(body.message)
        }
      }
      if (wseid) {
        const wsbody = await remarkupdateWSCKAPI({ wseid, remark })
        if (wsbody.code !== 200) {
          ElMessage.success(wsbody.message)
        } else {
          ElMessage.error(wsbody.message)
        }
      }
    }

    const WSCKLogin = async () => {
      const wskey =
        data.jdwsck.match(/wskey=(.*?);/) &&
        data.jdwsck.match(/wskey=(.*?);/)[1]
      const pin =
        data.jdwsck.match(/pin=(.*?);/) &&
        data.jdwsck.match(/pin=(.*?);/)[1]
      if (wskey && pin) {
        const body = await WSCKLoginAPI({ wskey: wskey, pin: pin })
        if (body.data.wseid) {
          localStorage.setItem('wseid', body.data.wseid)
          ElMessage.success(body.message)
        } else {
          ElMessage.error(body.message || 'wskey 解析失败，请检查后重试！')
        }
      } else {
        ElMessage.error('wskey 解析失败，请检查后重试！')
      }
    }

    const delWSCKAccount = async () => {
      const wseid = localStorage.getItem('wseid')
      const body = await WSCKDelaccountAPI({ wseid })
      if (body.code !== 200) {
        ElMessage.error(body.message)
      } else {
        ElMessage.success(body.message)
        setTimeout(() => {
          logout()
        }, 1000)
      }
    }

    const openUrlWithJD = (url) => {
      const params = encodeURIComponent(
        `{"category":"jump","des":"m","action":"to","url":"${url}"}`
      )
      window.location.href = `openapp.jdmobile://virtual?params=${params}`
      console.log(window.location.href)
    }

    const activity = [
      {
        name: '玩一玩（可找到大多数活动）',
        address: '京东 APP 首页-频道-边玩边赚',
        href: 'https://funearth.m.jd.com/babelDiy/Zeus/3BB1rymVZUo4XmicATEUSDUgHZND/index.html',
      },
      {
        name: '宠汪汪',
        address: '京东APP-首页/玩一玩/我的-宠汪汪',
      },
      {
        name: '东东萌宠',
        address: '京东APP-首页/玩一玩/我的-东东萌宠',
      },
      {
        name: '东东农场',
        address: '京东APP-首页/玩一玩/我的-东东农场',
      },
      {
        name: '东东工厂',
        address: '京东APP-首页/玩一玩/我的-东东工厂',
      },
      {
        name: '东东超市',
        address: '京东APP-首页/玩一玩/我的-东东超市',
      },
      {
        name: '领现金',
        address: '京东APP-首页/玩一玩/我的-领现金',
      },
      {
        name: '东东健康社区',
        address: '京东APP-首页/玩一玩/我的-东东健康社区',
      },
      {
        name: '京喜农场',
        address: '京喜APP-我的-京喜农场',
      },
      {
        name: '京喜牧场',
        address: '京喜APP-我的-京喜牧场',
      },
      {
        name: '京喜工厂',
        address: '京喜APP-我的-京喜工厂',
      },
      {
        name: '京喜财富岛',
        address: '京喜APP-我的-京喜财富岛',
      },
      {
        name: '京东极速版红包',
        address: '京东极速版APP-我的-红包',
      },
    ]

    return {
      ...toRefs(data),
      activity,
      getInfo,
      logout,
      delAccount,
      changeremark,
      WSCKLogin,
      delWSCKAccount,
      openUrlWithJD,
    }
  },
}
</script>

<style scoped>
/*没被访问过之前*/
 a:link{
            color: #B321FF;
        }
        /*默认*/
 a{
            color: #EECDFF;
        }
        /*鼠标掠过*/
 a:hover{
            color: red;
        }
</style>
