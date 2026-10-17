<script setup lang="ts">
defineProps<{
  active: boolean
}>()

const emit = defineEmits<{ edit: [] }>()
const editButton = ref<{ $el: HTMLButtonElement } | null>(null)

function focusEditButton() {
  editButton.value?.$el.focus()
}

defineExpose({ focusEditButton })
</script>

<template>
  <div class="audit-overlay" :class="{ 'is-active': active }">
    <div class="audit-overlay-content">
      <p class="form-status" id="audit-status" role="status">{{ active ? 'Thank you! This prototype does not send or store form data' : '' }}</p>
      <BaseButton
        v-if="active"
        id="audit-edit"
        ref="editButton"
        type="button"
        @click="emit('edit')"
      >Edit request</BaseButton>
    </div>
  </div>
</template>

<style scoped>
@reference "@styles/main.css";

.audit-overlay {
  @apply pointer-events-none
    absolute
    inset-0
    grid
    place-items-center
    rounded-[inherit]
    p-6;
}

.audit-overlay.is-active {
  @apply pointer-events-auto
    bg-audit-overlay;
}

.audit-overlay-content {
  @apply w-full
    max-w-[24rem];
}

.audit-overlay.is-active .audit-overlay-content {
  @apply grid
    gap-5
    rounded-md
    border
    border-line
    bg-white
    p-6
    shadow-soft;
}

.audit-overlay .form-status {
  @apply m-0
    text-center
    text-lg
    text-ink;
}

.audit-overlay-content .button {
  @apply justify-self-center;
}
</style>
