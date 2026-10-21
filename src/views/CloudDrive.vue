<template>
  <div :class="embedded ? '' : 'page'">
    <header v-if="!embedded" class="subhead">
      <button type="button" class="back" @click="$router.back()">‹</button>
      <span>云盘</span>
      <span class="spacer" />
    </header>
    <section class="pad">
      <input v-model="query" class="input" placeholder="搜索录音" />
      <article v-for="file in files" :key="file.id" class="file">
        <div>
          <b>{{ file.title }}</b>
          <p><span class="badge">{{ file.kind }}</span> {{ formatClock(file.durationSec) }}</p>
        </div>
        <div class="ops">
          <button type="button" @click="startRename(file)">改名</button>
          <a :href="file.mediaUrl" :download="`${file.title}.${file.kind}`">下载</a>
          <button type="button" @click="deleteCloud(file.id)">删除</button>
        </div>
        <label v-if="editing === file.id" class="rename">
          <input v-model="draft" class="input" />
          <button type="button" @click="save(file)">保存</button>
        </label>
      </article>
      <p v-if="!files.length" class="note">云盘还是空的。回放页可以转存。</p>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { dbState, deleteCloud, formatClock, listCloud, renameCloud } from '../services/api.js'

defineProps({
  embedded: { type: Boolean, default: false },
})

const query = ref('')
const editing = ref('')
const draft = ref('')
const files = computed(() => {
  dbState.cloudFiles?.length
  const q = query.value.trim()
  return listCloud().filter((item) => !q || item.title.includes(q))
})

function startRename(file) {
  editing.value = file.id
  draft.value = file.title
}

function save(file) {
  renameCloud(file.id, draft.value || file.title)
  editing.value = ''
}
</script>

<style scoped>
.back { font-size: 28px; width: 36px; color: #333; }
.spacer { width: 36px; }
.file { background: #fff; border-radius: 12px; padding: 12px; margin-top: 8px; }
.file p { margin-top: 4px; font-size: 12px; color: #888; }
.badge { display: inline-block; background: #e8eef8; color: #1a3a6b; border-radius: 8px; padding: 1px 6px; margin-right: 4px; }
.ops { display: flex; gap: 12px; margin-top: 8px; font-size: 13px; color: var(--navy); }
.rename { display: flex; gap: 8px; margin-top: 8px; }
.rename .input { flex: 1; }
</style>
