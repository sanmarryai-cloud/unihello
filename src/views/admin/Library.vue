<template>
  <section class="pad">
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="tab"
        :class="{ active: tab.id === activeId }"
        @click="activeId = tab.id"
      >
        {{ tab.name }}
      </button>
    </div>

    <div class="inline">
      <input v-model="tabName" class="input" placeholder="新分类名称" maxlength="12" />
      <button class="btn-navy" type="button" @click="addTab">添加</button>
    </div>
    <div class="inline" v-if="active">
      <input v-model="rename" class="input" maxlength="12" />
      <button type="button" class="btn-ghost-sm" @click="saveRename">改名</button>
      <button type="button" class="btn-ghost-sm danger" @click="removeTab">删除分类</button>
    </div>

    <article v-for="video in videos" :key="video.id" class="row-card">
      <div>
        <b>{{ video.title }}</b>
        <p>{{ typeLabel[video.type] || '视频' }} · {{ video.size }} · {{ auditText(video.auditStatus) }}</p>
      </div>
      <button type="button" @click="removeVideo(video.id)">删除</button>
    </article>
    <p v-if="!videos.length" class="note">这个分类还没有内容。</p>

    <h3>添加内容</h3>
    <label class="field"><span>标题</span><input v-model="title" class="input" maxlength="40" placeholder="例如：功能介绍（演示）" /></label>
    <label class="field">
      <span>视频文件（可选，小文件会留在本机）</span>
      <input class="input" type="file" accept="video/mp4,video/*" @change="onFile" />
    </label>
    <button class="btn-navy stack-btn" type="button" @click="saveUpload">保存到当前分类</button>
    <button class="btn-line" type="button" @click="saveSample">改用示例 mp4</button>
    <button class="btn-line" type="button" @click="saveLive">添加 m3u8 占位</button>
    <p v-if="message" class="note">{{ message }}</p>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { SAMPLE_MP4, rememberPreview } from '../../services/media.js'
import {
  adminCardId,
  createTab,
  createVideo,
  dbState,
  deleteTab,
  deleteVideo,
  listTabs,
  listVideos,
  renameTab,
  TYPE_LABEL as typeLabel,
} from '../../services/api.js'

const cardId = computed(() => {
  dbState.meta && dbState.meta.adminCardId
  return adminCardId()
})
const tabName = ref('')
const rename = ref('')
const activeId = ref('')
const title = ref('')
const file = ref(null)
const message = ref('')

const tabs = computed(() => {
  dbState.tabs.length
  return listTabs(cardId.value)
})
const active = computed(() => tabs.value.find((tab) => tab.id === activeId.value) || null)
const videos = computed(() => {
  dbState.videos.length
  return activeId.value ? listVideos(activeId.value, { includeHidden: true }) : []
})

watch(
  tabs,
  (list) => {
    if (!list.some((tab) => tab.id === activeId.value)) activeId.value = list[0]?.id || ''
    if (active.value) rename.value = active.value.name
  },
  { immediate: true },
)
watch(active, (tab) => {
  if (tab) rename.value = tab.name
})

function auditText(status) {
  if (status === 'pending') return '待审核'
  if (status === 'rejected') return '已驳回'
  return '已通过'
}

function addTab() {
  if (!tabName.value.trim()) return
  const tab = createTab(cardId.value, tabName.value.trim())
  tabName.value = ''
  activeId.value = tab.id
}

function saveRename() {
  if (!active.value) return
  renameTab(active.value.id, rename.value)
}

function removeTab() {
  if (!active.value) return
  deleteTab(active.value.id)
}

function removeVideo(id) {
  deleteVideo(id)
}

function onFile(event) {
  file.value = event.target.files?.[0] || null
}

function readDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

async function saveUpload() {
  if (!active.value) return
  if (!title.value.trim()) {
    message.value = '请先写标题'
    return
  }
  let src = ''
  let note = ''
  let size = '未选文件'
  const picked = file.value
  if (picked) {
    size = picked.size > 1048576 ? `${(picked.size / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(picked.size / 1024))} KB`
    if (picked.size <= 600000) {
      src = await readDataUrl(picked)
      note = '保存在本机'
    } else {
      note = '文件较大，刷新后改播示例片'
      const video = createVideo(cardId.value, active.value.id, {
        title: title.value.trim(),
        src: SAMPLE_MP4,
        size,
        note,
        type: 'video',
      })
      rememberPreview(video.id, URL.createObjectURL(picked))
      title.value = ''
      file.value = null
      message.value = '已添加。当前会话播放你选的文件。'
      return
    }
  }
  createVideo(cardId.value, active.value.id, {
    title: title.value.trim(),
    src,
    size,
    note,
    type: 'video',
  })
  title.value = ''
  file.value = null
  message.value = src ? '已添加，刷新后仍可播放。' : '已添加封面条目，还没有片源。'
}

function saveSample() {
  if (!active.value || !title.value.trim()) {
    message.value = '请先写标题'
    return
  }
  createVideo(cardId.value, active.value.id, {
    title: title.value.trim(),
    src: SAMPLE_MP4,
    size: '示例 mp4',
    type: 'video',
  })
  title.value = ''
  message.value = '已挂上示例 mp4。'
}

function saveLive() {
  if (!active.value) return
  createVideo(cardId.value, active.value.id, {
    title: title.value.trim() || '直播流占位（演示）',
    src: 'https://example.com/live/demo.m3u8',
    size: 'm3u8',
    type: 'live',
  })
  title.value = ''
  message.value = '已添加直播占位，播放器不会去请求该地址。'
}
</script>

<style scoped>
.inline {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}
.inline .input {
  flex: 1;
}
.btn-ghost-sm {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0 10px;
  font-size: 12px;
  color: #555;
}
.danger {
  color: #b42318;
}
.row-card {
  background: #fff;
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
}
.row-card b {
  font-size: 14px;
}
.row-card p {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
}
.row-card button {
  color: #b42318;
  font-size: 13px;
}
h3 {
  margin: 16px 0 8px;
  font-size: 15px;
}
.btn-line {
  width: 100%;
  margin-top: 8px;
  height: 40px;
  border-radius: 20px;
  border: 1px solid var(--navy);
  color: var(--navy);
  font-size: 14px;
}
</style>
