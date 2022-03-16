<script setup lang="ts">
const name = $ref('')

const router = useRouter()
const go = () => {
  if (name)
    router.push(`/hi/${encodeURIComponent(name)}`)
}
</script>

<template>
  <div>
    扫雷

    <confetti :passed="play.state.value.status === 'won'" />
  </div>
</template>
