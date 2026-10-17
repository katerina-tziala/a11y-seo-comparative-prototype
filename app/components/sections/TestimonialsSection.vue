<script setup lang="ts">
import StarIcon from '../icons/StarIcon.vue'
</script>

<template>
  <BaseSection class="testimonials-section">
    <BaseSectionContainer>
      <BaseSectionIntro
        class="testimonials-intro"
        variant="vertical"
      >
        <template #eyebrow>Testimonials</template>
        <template #heading>What our clients say</template>
        Teams use our audits to make their websites clearer, more usable and easier to find.
      </BaseSectionIntro>
      <div class="testimonial-grid">
        <figure class="testimonial">
          <div class="testimonial-rating">
            <span
              class="testimonial-stars"
              aria-hidden="true"
            >
              <StarIcon
                v-for="star in 5"
                :key="star"
              /> </span
            ><span class="sr-only">Rated 5 out of 5</span>
          </div>
          <blockquote>
            <p>
              LucidReach helped us find the barriers our customers kept running into. The audit was
              clear, practical and easy to act on.
            </p>
          </blockquote>
          <figcaption>
            <span class="testimonial-name">Elena Rossi</span>,
            <span class="testimonial-role">Marketing Lead, Northfield Studio</span>
          </figcaption>
        </figure>
        <figure class="testimonial">
          <div class="testimonial-rating">
            <span
              class="testimonial-stars"
              aria-hidden="true"
            >
              <StarIcon
                v-for="star in 5"
                :key="star"
              /> </span
            ><span class="sr-only">Rated 5 out of 5</span>
          </div>
          <blockquote>
            <p>
              „Die Empfehlungen waren klar und sofort umsetzbar. Unsere Website ist jetzt für mehr
              Menschen zugänglich.“
            </p>
          </blockquote>
          <p class="testimonial-translation">
            The recommendations were clear and immediately actionable. Our website is now accessible
            to more people.
          </p>
          <figcaption>
            <span class="testimonial-name">Jonas Weber</span>,
            <span class="testimonial-role">Head of Digital, Weber &amp; Partner</span>
          </figcaption>
        </figure>
        <figure class="testimonial">
          <div class="testimonial-rating">
            <span
              class="testimonial-stars"
              aria-hidden="true"
            >
              <StarIcon
                v-for="star in 5"
                :key="star"
                :filled="star <= 4"
              /> </span
            ><span class="sr-only">Rated 4 out of 5</span>
          </div>
          <blockquote>
            <p>
              The prioritised findings made it easy for our small team to plan the work and see what
              to fix first.
            </p>
          </blockquote>
          <figcaption>
            <span class="testimonial-name">Amira Haddad</span>,
            <span class="testimonial-role">Founder, Brightpath Coaching</span>
          </figcaption>
        </figure>
      </div>
    </BaseSectionContainer>
  </BaseSection>
</template>

<style scoped>
@reference "../../assets/css/main.css";

.testimonials-section {
  @apply bg-services-bg;
}

.testimonials-intro {
  @apply mx-auto
    mb-12
    max-w-[720px]
    text-center;
}

.testimonials-intro :deep(.intro-grid) {
  @apply text-center;
}

.testimonial-grid {
  @apply grid
    grid-cols-1
    gap-6
    md:grid-cols-3;
}

.testimonial {
  @apply m-0
    flex
    flex-col
    gap-6
    rounded-lg
    bg-surface
    p-8
    shadow-sm;
}

.testimonial-rating {
  @apply text-lg
    text-brand;
}

.testimonial-stars {
  @apply inline-flex
    gap-[.1em]
    align-middle;
}

.testimonial blockquote,
.testimonial p {
  @apply m-0;
}

.testimonial .testimonial-translation {
  @apply text-sm
    text-muted;
}

.testimonial figcaption {
  @apply mt-auto
    text-sm
    text-ink-soft;
}

.testimonial-name {
  @apply font-semibold
    text-ink;
}
</style>
