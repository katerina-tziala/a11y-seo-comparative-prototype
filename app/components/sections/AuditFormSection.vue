<script setup lang="ts">
import InfoIcon from '../icons/InfoIcon.vue'

const submitted = ref(false)
function submitForm() {
  submitted.value = true
}
</script>

<template>
  <div class="section section--audit">
    <BaseSectionContainer class="audit-grid">
      <div>
        <p class="eyebrow eyebrow--mint">Start with clarity</p>
        <h2>Request an Audit</h2>
        <p>Tell us a little about your website and the challenge(s) you’re trying to solve.</p>
        <div class="privacy-note">
          <span><InfoIcon /></span>
          <p>
            <strong>Your details stay here.</strong>This research prototype does not send or store
            any form data.
          </p>
        </div>
      </div>
      <BaseCard
        as="form"
        class="audit-form"
        @submit.prevent="submitForm"
      >
        <div class="form-row">
          <label
            >Name<input
              name="name"
              type="text"
              autocomplete="name"
              required
              placeholder="Your name" /></label
          ><label
            >Email<input
              name="email"
              type="email"
              autocomplete="email"
              required
              placeholder="you@company.com"
          /></label>
        </div>
        <label
          >Website URL<input
            name="website"
            type="url"
            autocomplete="url"
            required
            placeholder="https://example.com"
        /></label>
        <label
          >Main concern<textarea
            name="concern"
            rows="4"
            required
            placeholder="What would you like to improve?"
          />
        </label>
        <BaseButton type="submit">Request an Audit <span>→</span></BaseButton>
        <p
          v-if="submitted"
          class="confirmation"
        >
          Thank you. This is a research prototype, so no data was transmitted or stored.
        </p>
      </BaseCard>
    </BaseSectionContainer>
  </div>
</template>

<style scoped>
@reference "../../assets/css/main.css";

.section--audit {
  @apply bg-[linear-gradient(135deg,#10433d,#17665b)]
    text-white;
}

.section--audit p {
  @apply text-[#d5e5e1];
}

.audit-grid {
  @apply grid
    grid-cols-1
    items-start
    gap-12
    md:grid-cols-[.8fr_1.2fr];
}

.privacy-note {
  @apply mt-8
    flex
    gap-2
    border-t
    border-white/15
    pt-6;
}

.privacy-note > span {
  @apply grid
    size-8
    shrink-0
    place-items-center
    text-3xl
    text-mint;
}

.privacy-note p,
.privacy-note strong {
  @apply m-0
    block;
}

.privacy-note strong {
  @apply text-white;
}

.audit-form {
  @apply grid
    gap-6
    p-6
    sm:p-8;
}

.form-row {
  @apply grid
    grid-cols-1
    gap-6
    sm:grid-cols-2;
}

.audit-form label {
  @apply grid
    gap-2
    text-[.88rem]
    font-bold
    text-ink;
}

.audit-form input,
.audit-form textarea {
  @apply w-full
    rounded-sm
    border
    border-deep
    bg-white
    px-4
    py-[.85rem]
    font-normal
    text-ink
    outline-none;
}

.audit-form input:focus,
.audit-form textarea:focus {
  @apply border-deep
    ring-3
    ring-deep/20;
}

.audit-form .button {
  @apply justify-self-start;
}

.confirmation {
  @apply m-0
    rounded-sm
    bg-mint-light
    p-4
    text-deep!;
}
</style>
