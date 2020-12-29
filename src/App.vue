<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-toolbar-title>Tutorials Client</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <tutorials></tutorials>
    </v-main>
  </v-app>
</template>

<script>
import Tutorials from "@/components/tutorials";

export default {
  name: 'App',

  components: {
    Tutorials,
  },

  data: () => ({
    //
  }),
};
</script>
