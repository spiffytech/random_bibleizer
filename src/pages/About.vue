<script setup lang="ts">
import {
  IconBrandGithub,
  IconMail,
  IconPigMoney,
  IconUser,
} from "@tabler/icons-vue";
</script>

<template>
  <p class="align-middle mb-4 text-xl border-b-4 border-dotted w-max">
    <IconUser class="inline" /> Built by spiffytech a.k.a. Brian
  </p>

  <p class="align-middle mb-4">
    <IconMail class="inline" />
    If you like this app, or have a suggestion, feel free to
    <a
      href="mailto:randombibleizer@spiffy.tech?subject=%5BRandom%20Bibleizer%5D"
      class="underline text-blue-500"
    >
      email me.
    </a>
  </p>

  <p class="align-middle mb-4">
    <IconPigMoney class="inline" />
    Some people have asked if they can donate to me. If you wish, you can do so
    with
    <!-- inline-block prevents hanging whitespace, because HTML is dumb about
   line breaks -->
    <a
      href="https://www.paypal.com/donate/?hosted_button_id=8AJY73K28DCHE"
      class="underline text-blue-500 inline-block"
      target="_blank"
    >
      PayPal
    </a>
    or
    <a
      href="https://account.venmo.com/u/spiffytech"
      class="underline text-blue-500"
      target="_blank"
    >
      Venmo.
    </a>
  </p>

  <p class="align-middle">
    <IconBrandGithub class="inline" />
    You can find the source code for this project
    <a
      href="https://github.com/spiffytech/random_bibleizer"
      class="underline text-blue-500"
    >
      on Github.
    </a>
  </p>
</template>
