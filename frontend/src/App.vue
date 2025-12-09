<script setup lang="ts">
import NavBar from './views/user/components/NavBar.vue'
import HeroSection from './views/user/Homepage/_components/HeroSection.vue'
import AboutSection from './views/user/Homepage/_components/AboutSection.vue'
import ProgramsSection from './views/user/Homepage/_components/ProgramsSection.vue'
import FaqSection from './views/user/Homepage/_components/FaqSection.vue'
import TestimonialsSection from './views/user/Homepage/_components/TestimonialsSection.vue'
import CtaSection from './views/user/Homepage/_components/CtaSection.vue'
import Footer from './views/user/components/Footer.vue'
</script>

<template>
  <div class="min-h-screen bg-bg-light">
    <NavBar />
    <main>
      <HeroSection />
      <AboutSection />
      <ProgramsSection />
      <FaqSection />
      <TestimonialsSection />
      <CtaSection />
    </main>
    <Footer />
  </div>
</template>

<style scoped></style>
