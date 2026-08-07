<script setup lang="ts">
const menuRoot = ref<HTMLElement>()
const menuPanel = ref<HTMLElement>()
const isOpen = ref(false)

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function getTrigger() {
  return menuRoot.value?.querySelector<HTMLElement>('button')
}

function getFocusableElements(container = menuRoot.value) {
  if (!container) return []

  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
    (element) => element.offsetParent !== null,
  )
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
  if (!isOpen.value) return

  if (event.key === 'Escape') {
    event.preventDefault()
    closeMenu(true)
    return
  }

  if (event.key !== 'Tab') return

  const focusableElements = getFocusableElements()
  if (!focusableElements.length) return

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]
  const activeElement = document.activeElement

  if (event.shiftKey && activeElement === firstElement) {
    event.preventDefault()
    lastElement?.focus()
  } else if (!event.shiftKey && activeElement === lastElement) {
    event.preventDefault()
    firstElement?.focus()
  } else if (!focusableElements.includes(activeElement as HTMLElement)) {
    event.preventDefault()
    ;(event.shiftKey ? lastElement : firstElement)?.focus()
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
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('pointerdown', handleOutsidePointer)
  window.addEventListener('resize', handleResize)
}

function removeListeners() {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('pointerdown', handleOutsidePointer)
  window.removeEventListener('resize', handleResize)
}

watch(isOpen, async (open) => {
  if (!import.meta.client) return

  if (open) {
    addListeners()
    await nextTick()
    getFocusableElements(menuPanel.value)[0]?.focus()
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
  >
    <slot
      name="trigger"
      :open="isOpen"
      :toggle="toggleMenu"
    />
    <div
      ref="menuPanel"
      class="toggle-menu-panel"
    >
      <slot
        :open="isOpen"
        :close="closeMenu"
      />
    </div>
  </div>
</template>

<style scoped>
@reference "../../assets/css/main.css";

.toggle-menu,
.toggle-menu-panel {
  @apply contents;
}
</style>
