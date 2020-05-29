<template>
  <div class="c-search-result">
    <template v-if="name === 'all'">
      <p v-if="users.length === 0 && groups.length === 0">没有搜索到内容，换个关键字试试吧</p>
      <template v-else>
        <div class="c-list" v-if="name === 'all' || name === 'user'">
          <p>用户</p>
          <ul>
            <li
              v-for="item in users.slice(0,2)"
              :key="item._id"
              @click="addFriend(item)">
              <img :src="item.avatar" alt="">
              <span>{{ item.username }}</span>
            </li>
          </ul>
          <p v-if="users.length > 2" class="more" @click="lookAllUserOrGroup('user')">查看更多</p>
        </div>
        <div class="c-list">
          <p>群组</p>
          <ul >
            <li
              v-for="item in groups.slice(0,2)"
              :key="item._id"
              @click="joinGroup(item)">
              <img :src="item.avatar" alt="">
              <div class="c-group">
                <span>{{ item.name }}</span>
                <span class="sum">{{ item.membersNum }}人</span>
              </div>
            </li>
          </ul>
          <p v-if="groups.length > 2" class="more" @click="lookAllUserOrGroup('group')">查看更多</p>
        </div>
      </template>
    </template>
    <template v-else-if="name === 'user'">
      <p v-if="users.length === 0 && groups.length === 0">没有搜索到内容，换个关键字试试吧</p>
      <template v-else>
          <div class="c-list">
              <ul>
                <li
                  v-for="item in users"
                  :key="item._id"
                  @click="addFriend(item)" >
                  <img :src="item.avatar" alt="">
                  <span>{{ item.username }}</span>
                </li>
              </ul>
          </div>
      </template>
    </template>
    <template v-else-if="name === 'group'">
      <p v-if="users.length === 0 && groups.length === 0">没有搜索到内容，换个关键字试试吧</p>
      <template v-else>
        <div class="c-list">
          <ul>
            <li
              v-for="item in groups"
              :key="item._id"
              @click="joinGroup(item)">
              <img :src="item.avatar" alt="">
              <div class="c-group">
                <span>{{ item.name }}</span>
                <span class="sum">{{ item.membersNum }}人</span>
              </div>
            </li>
          </ul>
        </div>
      </template>
    </template>
  </div>
</template>
<script>
export default {
  name: 'searchResult',
  props: {
    name: String,
    users: {
      type: Array,
      default: function () {
        return []
      }
    },
    groups: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
    }
  },
  methods: {
    /**
     * 加为好友
     */
    addFriend (user) {
      this.$emit('addFriend', user)
    },
    /**
     * 加入群组
     */
    joinGroup (group) {
      this.$emit('joinGroup', group)
    },
    /**
     * 查看查找到的所用用户或群组
     */
    lookAllUserOrGroup (flag) {
      this.$emit('lookAllUserOrGroup', flag)
    }
  }
}
</script>
<style lang="less" scoped>
.c-search-result {
  max-height: 348px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 0px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 20px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.2);
  }
  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 20px;
    background: rgba(0,0,0,0.1);
  }
  .c-list {
    p {
      font-weight: bold;
      font-size: 14px;
      line-height: 31px;

      &.more {
        text-align: center;
        font-size: 12px;
        font-weight: normal;
        cursor: pointer;
      }
    }
    ul {
      li {
        height: 56px;
        display: flex;
        align-items: center;
        cursor: pointer;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 10px;
        }

        &:hover {
          background-color: #eee;
        }

        .c-group {
          display: flex;
          flex-direction: column;

          .sum {
            font-size: 14px;
            color: #666;
          }
        }
      }
    }
  }
}
</style>
