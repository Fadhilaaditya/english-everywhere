<script setup lang="ts">
const contactWhatsApp = () => {
  window.open('https://wa.me/62895322721820', '_blank')
}
</script>

<template>
  <section class="relative bg-white pt-32 px-6 md:px-12 overflow-hidden min-h-[70vh]"> 

    <div class="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10 mb-28 md:mb-40"> 
      <div class="relative">
        <div class="absolute -top-16 -left-52 opacity-80">
           <img src="/sun.svg" alt="Sun" class="w-32 h-32 md:w-40 md:h-40" /> 
        </div>
        <h1 class="text-4xl md:text-6xl font-bold text-text-dark mb-4 leading-tight">
          EMBRACE YOUR <br />
          FUTURE WITH US
        </h1>
      </div>
      <p class="text-text-dark text-lg md:text-xl max-w-2xl mb-8 font-poppins">
        Our fun and interactive courses are designed from kids to professionals to learn English confidently, anytime and anywhere.
      </p>
      
      <button 
        @click="contactWhatsApp"
        class="bg-secondary hover:bg-teal-500 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-transform hover:scale-105 cursor-pointer"
      >
        Grow With Us
      </button>
    </div>

    <div class="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto flex justify-between items-end px-4 md:px-0 pointer-events-none z-0">
      
      <div class="w-1/2 flex justify-start pl-0 md:pl-6">
        <img src="https://res.cloudinary.com/dosfggbxu/image/upload/v1773216524/Eng_Ever_Design_Image_40_vcridr.png" alt="Boy raising hand" class="w-32 sm:w-48 md:w-[450px] h-auto object-contain" />
      </div>

      <div class="w-1/2 flex justify-end pr-0 md:pr-6 relative">
        <div class="absolute -top-30 right-60 text-secondary opacity-60 hidden md:block">
            <img src="/iconhero1.svg" alt="Decorative Icon" class="w-30 h-30" />
        </div>
        <img src="https://res.cloudinary.com/dosfggbxu/image/upload/v1773216524/Eng_Ever_Design_Image_41_dqzuzy.png" alt="Boy reading" class="w-28 sm:w-44 md:w-[450px] h-auto object-contain" />
      </div>
    </div>
  </section>
</template>