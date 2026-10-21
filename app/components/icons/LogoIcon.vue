<script setup lang="ts">
const id = useId()
const lMaskId = `${id}-l-mask`
const rMaskId = `${id}-r-mask`
</script>

<template>
  <svg
    viewBox="0 0 64 64"
    width="1em"
    height="1em"
  >
    <defs>
      <mask :id="rMaskId">
        <rect
          width="64"
          height="64"
          fill="var(--lr-color-black)"
        />
        <g transform="translate(32 32) scale(1.08) translate(-33 -32)">
          <path
            d="M34 16h4.5C42 16 44 18.5 44 22s-2 6-5.5 6H36l8 8"
            fill="none"
            stroke="var(--lr-color-white)"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="4"
          />
        </g>
      </mask>
      <mask :id="lMaskId">
        <rect
          width="64"
          height="64"
          fill="var(--lr-color-black)"
        />
        <g transform="translate(32 32) scale(1.08) translate(-33 -32)">
          <path
            d="M24 18v28h18"
            fill="none"
            stroke="var(--lr-color-white)"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="8"
          />
        </g>
      </mask>
    </defs>
    <path
      d="M0 32C0 14.33 14.33 0 32 0s32 14.33 32 32-14.33 32-32 32H8.96A8.96 8.96 0 0 1 0 55.04Z"
      fill="var(--brand-mark-bg, var(--lr-color-logo-bg))"
    />
    <rect
      width="64"
      height="64"
      fill="var(--brand-mark-l, var(--lr-color-logo-letter))"
      :mask="`url(#${lMaskId})`"
    />
    <rect
      width="64"
      height="64"
      fill="var(--brand-mark-r, var(--lr-color-cream))"
      :mask="`url(#${rMaskId})`"
    />
  </svg>
</template>
