<script setup lang="ts">
import InfoIcon from '../icons/InfoIcon.vue'
import WarningIcon from '../icons/WarningIcon.vue'

withDefaults(defineProps<{
  hint: string
  error?: string
}>(), { error: '' })

const messageElement = ref<HTMLParagraphElement | null>(null)
let previousHeight = 0
let heightAnimation: Animation | undefined
let reducedMotion: MediaQueryList | undefined

function cancelHeightAnimation() {
  heightAnimation?.cancel()
  heightAnimation = undefined
}

function handleMotionChange() {
  if (reducedMotion?.matches) cancelHeightAnimation()
}

onMounted(() => {
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion.addEventListener('change', handleMotionChange)
})

onBeforeUpdate(() => {
  previousHeight = messageElement.value!.getBoundingClientRect().height
  cancelHeightAnimation()
})

onUpdated(() => {
  const element = messageElement.value!
  const height = element.getBoundingClientRect().height
  if (reducedMotion?.matches || Math.abs(height - previousHeight) < .5) return

  const animation = element.animate(
    [{ height: `${previousHeight}px` }, { height: `${height}px` }],
    { duration: 180, easing: 'ease-out' },
  )
  heightAnimation = animation
  animation.onfinish = () => {
    if (heightAnimation === animation) heightAnimation = undefined
  }
})

onBeforeUnmount(() => {
  cancelHeightAnimation()
  reducedMotion?.removeEventListener('change', handleMotionChange)
})
</script>

<template>
  <p ref="messageElement" class="field-message" :class="{ 'is-error': error }">
    <component
      :is="error ? WarningIcon : InfoIcon"
      class="message-icon"
    />
    <span class="message-text">{{ error || hint }}</span>
  </p>
</template>

<style scoped>
@reference "../../assets/css/main.css";

.field-message {
  @apply m-0
    grid
    grid-cols-[1rem_minmax(0,1fr)]
    gap-x-1
    overflow-hidden
    text-[.8rem]
    leading-normal
    font-normal;
}

.field-message:not(.is-error) {
  @apply text-muted;
}

.field-message.is-error {
  @apply text-error;
}

.message-text {
  @apply col-start-2
    row-start-1;
}

.message-icon {
  @apply col-start-1
    row-start-1
    mt-[.1rem]
    h-4
    w-4;
}
</style>
