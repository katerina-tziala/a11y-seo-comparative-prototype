<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    name: string
    options: { id: string; value: string; label: string }[]
    required?: boolean
    disabled?: boolean
  }>(),
  { required: false, disabled: false },
)
</script>

<template>
  <div class="radio-group">
    <p class="group-label">{{ label }}<span v-if="required" class="field-required"> (required)</span></p>
    <div class="radio-options">
      <div
        v-for="option in options"
        :key="option.id"
        class="radio-option"
      >
        <input
          type="radio"
          class="radio-input"
          :id="option.id"
          :name="name"
          :value="option.value"
          :required="required"
          :disabled="disabled"
        />
        <label class="radio-card" :for="option.id">{{ option.label }}</label>
      </div>
    </div>
    <slot />
  </div>
</template>

<style scoped>
@reference "../../assets/css/main.css";

.radio-group {
  position: relative;
  min-inline-size: 0;
  margin: 0;
  border: 0;
  padding: calc(.88rem * 1.65 + .5rem) 0 0;
}

.radio-group .group-label {
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
  inline-size: 100%;
  margin: 0;
  padding: 0;
  @apply block text-[.88rem] font-bold leading-[1.65] text-ink;
}

.radio-options {
  @apply grid grid-cols-1 gap-3 sm:grid-cols-2;
}

.radio-option {
  @apply relative;
}

.radio-input {
  @apply sr-only;
}

.radio-card {
  @apply flex h-12 cursor-pointer items-center gap-2 rounded-sm border border-deep
    bg-transparent px-4 py-[.85rem] text-[.88rem] font-normal text-ink;
}

.radio-card::before {
  content: '';
  @apply size-[1rem] shrink-0 rounded-full border-2 border-deep bg-white;
}

.radio-input:disabled + .radio-card::before {
  @apply bg-transparent;
}

.radio-card:hover {
  @apply bg-mint-light;
}

.radio-input:checked + .radio-card {
  box-shadow: inset 0 0 0 1px var(--lr-color-deep);
}

.radio-input:checked + .radio-card::before {
  background-image: radial-gradient(circle, var(--lr-color-deep) 0 3px, var(--lr-color-transparent) 3.5px);
}

.radio-input:focus-visible + .radio-card {
  outline: 3px solid var(--lr-color-deep);
  outline-offset: 3px;
}

.radio-group.is-invalid .radio-card {
  @apply border-error;
  box-shadow: inset 0 0 0 1px var(--lr-color-error);
}

</style>
