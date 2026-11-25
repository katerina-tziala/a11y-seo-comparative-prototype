<script setup lang="ts">
const menuRoot = ref<HTMLElement>()
const isOpen = ref(false)

function getTrigger() {
  return menuRoot.value?.querySelector<HTMLElement>('button')
}

function openMenu() {
  isOpen.value = true
}

function closeMenu(restoreFocus = false) {
  if (!isOpen.value) return
  isOpen.value = false

  if (restoreFocus) {
    nextTick(() => getTrigger()?.focus())
  }
}

function toggleMenu() {
  if (isOpen.value) {
    closeMenu()
  } else {
    openMenu()
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (!isOpen.value || event.key !== 'Escape') return

  event.preventDefault()
  closeMenu(true)
}

function handleFocusout(event: FocusEvent) {
  const next = event.relatedTarget
  if (next instanceof Node && !menuRoot.value?.contains(next)) {
    closeMenu()
  }
}

function handleOutsidePointer(event: PointerEvent) {
  const target = event.target
  if (target instanceof Node && !menuRoot.value?.contains(target)) {
    closeMenu()
  }
}

function handleResize() {
  if (isOpen.value && getTrigger()?.offsetParent === null) {
    closeMenu()
  }
}

function addListeners() {
  document.addEventListener('pointerdown', handleOutsidePointer)
  window.addEventListener('resize', handleResize)
}

function removeListeners() {
  document.removeEventListener('pointerdown', handleOutsidePointer)
  window.removeEventListener('resize', handleResize)
}

watch(isOpen, (open) => {
  if (!import.meta.client) return

  if (open) {
    addListeners()
  } else {
    removeListeners()
  }
})

onBeforeUnmount(removeListeners)
</script>

<template>
  <div
    ref="menuRoot"
    class="toggle-menu"
    @keydown="handleKeydown"
    @focusout="handleFocusout"
  >
    <slot
      name="trigger"
      :open="isOpen"
      :toggle="toggleMenu"
    />
    <div class="toggle-menu-panel">
      <slot
        :open="isOpen"
        :close="closeMenu"
      />
    </div>
  </div>
</template>

<style scoped>
@reference "@styles/main.css";

.toggle-menu,
.toggle-menu-panel {
  @apply contents;
}
</style>
