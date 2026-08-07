<script setup lang="ts">
import ChevronDownIcon from '../icons/ChevronDownIcon.vue'

type AccordionItem = {
  title: string
  content: string
}

defineProps<{
  items: AccordionItem[]
}>()

const expandedItems = ref(new Set([0]))
const closingItems = ref(new Set<number>())

function isExpanded(index: number) {
  return expandedItems.value.has(index)
}

function isOpen(index: number) {
  return isExpanded(index) || closingItems.value.has(index)
}

function toggleItem(index: number) {
  const expanded = new Set(expandedItems.value)
  const closing = new Set(closingItems.value)

  if (expanded.has(index)) {
    closing.add(index)
    expanded.delete(index)
  } else {
    closing.delete(index)
    expanded.add(index)
  }

  expandedItems.value = expanded
  closingItems.value = closing
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function finishOnHeightTransition(element: HTMLElement, done: () => void) {
  const onTransitionEnd = (event: TransitionEvent) => {
    if (event.propertyName !== 'height') return
    element.removeEventListener('transitionend', onTransitionEnd)
    done()
  }

  element.addEventListener('transitionend', onTransitionEnd)
}

function beforeEnter(element: Element) {
  const content = element as HTMLElement
  content.style.height = '0'
  content.style.opacity = '0'
  content.style.overflow = 'hidden'
}

function enter(element: Element, done: () => void) {
  const content = element as HTMLElement

  if (prefersReducedMotion()) {
    done()
    return
  }

  content.style.transition = 'height 300ms ease-out, opacity 220ms ease-out'
  content.style.height = `${content.scrollHeight}px`
  content.style.opacity = '1'
  finishOnHeightTransition(content, done)
}

function afterEnter(element: Element) {
  const content = element as HTMLElement
  content.style.height = 'auto'
  content.style.overflow = ''
  content.style.transition = ''
}

function beforeLeave(element: Element) {
  const content = element as HTMLElement
  content.style.height = `${content.scrollHeight}px`
  content.style.opacity = '1'
  content.style.overflow = 'hidden'
}

function leave(element: Element, done: () => void) {
  const content = element as HTMLElement

  if (prefersReducedMotion()) {
    done()
    return
  }

  content.style.transition = 'height 300ms ease-out, opacity 220ms ease-out'
  void content.offsetHeight
  content.style.height = '0'
  content.style.opacity = '0'
  finishOnHeightTransition(content, done)
}

function afterLeave(element: Element, index: number) {
  const content = element as HTMLElement
  const closing = new Set(closingItems.value)
  closing.delete(index)
  closingItems.value = closing
  content.removeAttribute('style')
}
</script>

<template>
  <div class="accordion">
    <details
      v-for="(item, index) in items"
      :key="item.title"
      :open="isOpen(index)"
    >
      <summary @click.prevent="toggleItem(index)">
        {{ item.title }}
        <span :class="{ 'is-expanded': isExpanded(index) }">
          <ChevronDownIcon />
        </span>
      </summary>
      <Transition
        :css="false"
        @before-enter="beforeEnter"
        @enter="enter"
        @after-enter="afterEnter"
        @before-leave="beforeLeave"
        @leave="leave"
        @after-leave="(element) => afterLeave(element, index)"
      >
        <div
          v-if="isExpanded(index)"
          class="accordion-content"
        >
          <p>{{ item.content }}</p>
        </div>
      </Transition>
    </details>
  </div>
</template>

<style scoped>
@reference "../../assets/css/main.css";

.accordion details {
  @apply border-t
    border-line;
}

.accordion details:first-child {
  @apply border-t-0;
}

.accordion summary {
  @apply flex
    cursor-pointer
    items-center
    justify-between
    py-6
    font-heading
    font-bold;
}

.accordion summary::marker {
  @apply content-[''];
}

.accordion summary span {
  @apply grid
    shrink-0
    place-items-center
    text-xl
    transition-transform
    duration-200
    ease-out;
}

.accordion summary span.is-expanded {
  @apply rotate-180;
}

.accordion-content p {
  @apply mb-4
    pr-8;
}
</style>
