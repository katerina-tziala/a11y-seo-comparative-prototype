<script setup lang="ts">
import {
  validateEmail,
  validateName,
  validateRequiredSelection,
  validateWebsiteUrl,
  type ValidationErrorKey,
} from '../../../utils/form-validators'

withDefaults(defineProps<{ disabled?: boolean }>(), { disabled: false })
const emit = defineEmits<{ 'valid-submit': [] }>()

const concernOptions = [
  { id: 'concern-accessibility', value: 'accessibility', label: 'Accessibility' },
  { id: 'concern-search', value: 'search', label: 'Search visibility' },
  { id: 'concern-content', value: 'content', label: 'Content & conversion' },
  { id: 'concern-unsure', value: 'unsure', label: 'Not sure yet' },
]

const nameInput = ref<HTMLInputElement | null>(null)
const emailInput = ref<HTMLInputElement | null>(null)
const websiteInput = ref<HTMLInputElement | null>(null)
const selectedConcern = ref('')
type RequiredField = 'name' | 'email' | 'website' | 'concern'
const errorKeys = reactive<Record<RequiredField, ValidationErrorKey | null>>({ name: null, email: null, website: null, concern: null })
const hasBeenValidated = reactive<Record<RequiredField, boolean>>({ name: false, email: false, website: false, concern: false })
const hints = {
  name: 'Enter a name',
  email: 'Enter an email address (name@example.com)',
  website: 'Enter a website address (https://example.com)',
  concern: 'Select one option',
}
const errorMessages: Record<RequiredField, Partial<Record<ValidationErrorKey, string>>> = {
 name: {
    required: 'A name is required',
    contains_numbers: 'A name cannot contain numbers',
    invalid_length: 'Enter at least 2 characters',
  },
  email: {
    required: 'An email address is required',
    invalid_format: 'Enter a valid email address (name@example.com)',
  },
  website: {
    required: 'A website address is required',
    invalid_format: 'Enter a valid website address (https://example.com)',
    invalid_protocol: 'Enter a valid website address (https://example.com)',
  },
  concern: {
    required: 'A main concern is required',
  },
}

const validators: Record<RequiredField, () => ValidationErrorKey | null> = {
  name: () => validateName(nameInput.value!.value),
  email: () => validateEmail(emailInput.value!.value, emailInput.value!.validity.typeMismatch),
  website: () => validateWebsiteUrl(websiteInput.value!.value),
  concern: () => validateRequiredSelection(selectedConcern.value),
}

function validateField(field: RequiredField) {
  const errorKey = validators[field]()
  errorKeys[field] = errorKey
  hasBeenValidated[field] = true
  return errorKey
}

function getErrorMessage(field: RequiredField) {
  const errorKey = errorKeys[field]
  return errorKey ? errorMessages[field][errorKey] ?? '' : ''
}

function revalidateField(field: RequiredField) {
  if (hasBeenValidated[field]) validateField(field)
}

function changeConcern(event: Event) {
  selectedConcern.value = (event.target as HTMLInputElement).value
  revalidateField('concern')
}

function leaveConcern(event: FocusEvent) {
  const group = event.currentTarget as HTMLElement
  if (!group.contains(event.relatedTarget as Node | null)) validateField('concern')
}

function submitForm(event: Event) {
  const fields: RequiredField[] = ['name', 'email', 'website', 'concern']
  const invalid = fields.filter(field => validateField(field) !== null)
  if (invalid.length) {
    const first = invalid[0]
    const input = first === 'name' ? nameInput.value
      : first === 'email' ? emailInput.value
        : first === 'website' ? websiteInput.value
          : (event.target as HTMLFormElement).querySelector<HTMLInputElement>('.radio-input')
    input?.focus()
    return
  }
  emit('valid-submit')
}

function focusName() {
  nameInput.value?.focus()
}

defineExpose({ focusName })
</script>

<template>
  <form class="audit-form" novalidate @submit.prevent="submitForm">
    <div class="form-row">
      <div class="field">
        <span class="field-label">Name <span class="field-required" aria-hidden="true">(required)</span></span>
        <input
          id="audit-name"
          ref="nameInput"
          name="name"
          type="text"
          required
          :disabled="disabled"
          :class="{ 'is-invalid': errorKeys.name }"
          @blur="validateField('name')"
          @input="revalidateField('name')"
        />
        <BaseFieldMessage id="audit-name-message" :hint="hints.name" :error="getErrorMessage('name')" />
      </div>
      <div class="field">
        <span class="field-label">Email <span class="field-required" aria-hidden="true">(required)</span></span>
        <input
          id="audit-email"
          ref="emailInput"
          name="email"
          type="email"
          required
          :disabled="disabled"
          :class="{ 'is-invalid': errorKeys.email }"
          @blur="validateField('email')"
          @input="revalidateField('email')"
        />
        <BaseFieldMessage id="audit-email-message" :hint="hints.email" :error="getErrorMessage('email')" />
      </div>
    </div>
    <div class="field">
      <span class="field-label">Website URL <span class="field-required" aria-hidden="true">(required)</span></span>
      <input
        id="audit-website"
        ref="websiteInput"
        name="website"
        type="url"
        required
        :disabled="disabled"
        :class="{ 'is-invalid': errorKeys.website }"
        @blur="validateField('website')"
        @input="revalidateField('website')"
      />
      <BaseFieldMessage id="audit-website-message" :hint="hints.website" :error="getErrorMessage('website')" />
    </div>
    <BaseRadioGroup
      label="Main concern"
      name="concern"
      :options="concernOptions"
      required
      :disabled="disabled"
      :class="{ 'is-invalid': errorKeys.concern }"
      @focusout="leaveConcern"
      @change="changeConcern"
    >
      <BaseFieldMessage id="concern-message" :hint="hints.concern" :error="getErrorMessage('concern')" />
    </BaseRadioGroup>
    <div class="field">
      <label class="field-label" for="audit-details">Message <span class="field-optional">(optional)</span></label>
      <textarea
        id="audit-details"
        name="details"
        rows="4"
        :disabled="disabled"
        aria-describedby="audit-details-hint"
      />
      <BaseFieldMessage class="field-hint" id="audit-details-hint" hint="For example, specific pages, goals or deadlines" />
    </div>
    <BaseButton type="submit" aria-label="Send form" :disabled="disabled">Request an Audit <span aria-hidden="true">→</span></BaseButton>
  </form>
</template>

<style scoped>
@reference "../../../assets/css/main.css";

.audit-form {
  @apply grid
    gap-6
    p-6
    sm:p-8;
  border-radius: inherit;
}

.form-row {
  @apply grid
    grid-cols-1
    items-start
    gap-6
    sm:grid-cols-2;
}

.audit-form .field {
  @apply grid
    gap-1;
}

.audit-form .field-label {
  margin-bottom: .25rem;
}

.audit-form .field,
.audit-form .field-label {
  @apply text-[.88rem]
    font-bold
    text-ink;
}

.audit-form input:not(.radio-input),
.audit-form textarea {
  @apply w-full
    rounded-sm
    border
    border-deep
    bg-transparent
    px-4
    py-[.85rem]
    font-normal
    text-ink
    outline-none;
}

.audit-form input:not(.radio-input) {
  @apply h-12;
}

.audit-form input:not(.radio-input):focus,
.audit-form textarea:focus {
  @apply border-deep
    ring-3
    ring-deep/20;
}

.audit-form .button {
  @apply justify-self-start;
}

.audit-form input.is-invalid {
  @apply border-error;
  box-shadow: inset 0 0 0 1px var(--lr-color-error), var(--tw-ring-shadow, 0 0 var(--lr-color-transparent));
}

.audit-form input.is-invalid:focus {
  @apply border-error;
}

.audit-form :is(input:not(.radio-input), textarea):is(:autofill, :-webkit-autofill) {
  -webkit-text-fill-color: var(--lr-color-ink);
  caret-color: var(--lr-color-ink);
  background-clip: text;
  -webkit-background-clip: text;
}

.audit-form .field-hint {
  margin: 0;
  @apply text-muted;
  font-size: .8rem;
  font-weight: 400;
  line-height: 1.5;
}

.radio-group :deep(.field-message) {
  margin-top: .25rem;
}

</style>
