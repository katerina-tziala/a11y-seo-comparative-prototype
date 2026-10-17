<script setup lang="ts">
import InfoIcon from '../../icons/InfoIcon.vue'
import RequestAuditOverlay from './RequestAuditOverlay.vue'
import RequestAuditForm from './RequestAuditForm.vue'

const submitted = ref(false)
const form = ref<InstanceType<typeof RequestAuditForm> | null>(null)
const overlay = ref<InstanceType<typeof RequestAuditOverlay> | null>(null)

async function submitRequest() {
  submitted.value = true
  await nextTick()
  overlay.value?.focusEditButton()
}

async function editRequest() {
  submitted.value = false
  await nextTick()
  form.value?.focusName()
}
</script>

<template>
  <BaseSection class="request-audit-section">
    <BaseSectionContainer class="audit-grid">
      <div>
        <BaseEyebrow class="eyebrow-mint">Start with clarity</BaseEyebrow>
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
        class="audit-card"
        :class="{ 'audit-card-submitted': submitted }"
      >
        <RequestAuditForm
          ref="form"
          :disabled="submitted"
          @valid-submit="submitRequest"
        />
        <RequestAuditOverlay
          ref="overlay"
          :active="submitted"
          @edit="editRequest"
        />
      </BaseCard>
    </BaseSectionContainer>
  </BaseSection>
</template>

<style scoped>
@reference "../../../assets/css/main.css";

.request-audit-section {
  @apply bg-[linear-gradient(135deg,var(--color-audit-start),var(--color-audit-end))]
    text-white;
}

.request-audit-section p {
  @apply text-audit-copy;
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

.audit-card {
  @apply relative;
}

.audit-card.audit-card-submitted {
  @apply bg-surface/60;
}

.audit-card-submitted .audit-form {
  @apply opacity-60;
}
</style>
