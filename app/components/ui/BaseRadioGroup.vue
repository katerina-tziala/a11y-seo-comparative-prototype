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
    <p class="group-label">{{ label }}<BaseFieldIndicator v-if="required"> (required)</BaseFieldIndicator></p>
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
  @apply relative
    m-0
    border-0
    px-0
    pt-[calc(.88rem*1.65+.5rem)]
    pb-0
    [min-inline-size:0];
}

.radio-group .group-label {
  @apply absolute
    start-0
    m-0
    block
    p-0
    text-[.88rem]
    leading-[1.65]
    font-bold
    text-ink
    [inline-size:100%]
    [inset-block-start:0];
}

.radio-options {
  @apply grid
    grid-cols-1
    gap-3
    sm:grid-cols-2;
}

.radio-option {
  @apply relative;
}

.radio-input {
  @apply sr-only;
}

.radio-card {
  @apply flex
    h-10
    cursor-pointer
    items-center
    gap-2
    rounded-sm
    border
    border-deep
    bg-transparent
    px-3
    py-1.5
    text-[.88rem]
    font-normal
    text-ink;
}

.radio-card::before {
  @apply size-[1rem]
    shrink-0
    rounded-full
    border-2
    border-deep
    bg-white
    content-[''];
}

.radio-input:disabled + .radio-card::before {
  @apply bg-transparent;
}

.radio-card:hover {
  @apply bg-mint-light;
}

.radio-input:checked + .radio-card::before {
  @apply bg-[radial-gradient(circle,var(--lr-color-deep)_0_3px,var(--lr-color-transparent)_3.5px)];
}

.radio-input:focus-visible + .radio-card {
  @apply outline-2
    outline-offset-4
    outline-brand
    shadow-md
    shadow-deep/20;
}

.radio-input:checked + .radio-card {
  @apply [box-shadow:inset_0_0_0_1px_var(--lr-color-deep),_var(--tw-shadow,_0_0_var(--lr-color-transparent))];
}

.radio-group.is-invalid .radio-card {
  @apply border-error
    [box-shadow:inset_0_0_0_1px_var(--lr-color-error),_var(--tw-shadow,_0_0_var(--lr-color-transparent))];
}
</style>
