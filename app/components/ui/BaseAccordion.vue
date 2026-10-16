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

function isExpanded(index: number) {
  return expandedItems.value.has(index)
}

function toggleItem(index: number) {
  const expanded = new Set(expandedItems.value)

  if (expanded.has(index)) {
    expanded.delete(index)
  } else {
    expanded.add(index)
  }

  expandedItems.value = expanded
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
  void content.offsetHeight
  content.style.height = `${content.scrollHeight}px`
  content.style.opacity = '1'
  finishOnHeightTransition(content, done)
}

function afterEnter(element: Element) {
  const content = element as HTMLElement
  content.style.height = 'auto'
  content.style.opacity = '1'
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

function afterLeave(element: Element) {
  const content = element as HTMLElement
  content.style.height = ''
  content.style.opacity = ''
  content.style.overflow = ''
  content.style.transition = ''
}
</script>

<template>
  <div class="accordion">
    <div
      v-for="(item, index) in items"
      :key="item.title"
      class="accordion-item"
    >
      <div class="accordion-trigger" @click="toggleItem(index)">
        {{ item.title }}
        <span :class="{ 'is-expanded': isExpanded(index) }">
          <ChevronDownIcon />
        </span>
      </div>
      <Transition
        :css="false"
        @before-enter="beforeEnter"
        @enter="enter"
        @after-enter="afterEnter"
        @before-leave="beforeLeave"
        @leave="leave"
        @after-leave="afterLeave"
      >
        <div
          v-show="isExpanded(index)"
          class="accordion-panel"
          :id="`faq-panel-${index}`"
        >
          <p>{{ item.content }}</p>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
@reference "../../assets/css/main.css";

.accordion-item {
  @apply border-t
    border-line;
}

.accordion-item:first-child {
  @apply border-t-0;
}

.accordion-trigger {
  @apply m-0
    flex
    w-full
    cursor-pointer
    items-center
    justify-between
    border-0
    bg-transparent
    px-0
    py-6
    text-start
    [font-size:inherit]
    [line-height:inherit]
    [letter-spacing:inherit]
    font-heading
    font-bold
    text-inherit;
}

.accordion-trigger span {
  @apply grid
    shrink-0
    place-items-center
    text-xl
    transition-transform
    duration-200
    ease-out;
}

.accordion-trigger span.is-expanded {
  @apply rotate-180;
}

.accordion-panel p {
  @apply mb-4
    pr-8;
}
</style>
