<template>
  <v-card>
    <v-card-title>
      <span class="headline">Edit Tutorial</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="item.id" label="Tutorial Id"></v-text-field>
          </v-col>

          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="item.title" label="Tutorial Title"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="item.description" label="Description"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-checkbox v-model="item.published" label="Published"></v-checkbox>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
      <v-btn color="blue darken-1" text @click="save">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import TutorialService from "@/services/tutorials-service";

export default {
  name: "edit-tutorial",
  data() {
    return {
      item: {
        id: 0,
        title: '',
        description: '',
        published: false
      }
    }
  },
  methods: {
    retrieveTutorial(id) {
      TutorialService.get(id)
          .then((response) => {
            this.item = response.data;
          })
          .catch(e => {
            console.log((e));
          })
    },

    save() {
      TutorialService.update(this.item.id, this.item)
          .then(() => {
            this.navigateToTutorials();
          })
          .catch(e => {
            console.log(e);
          })
    },
    close() {
      this.navigateToTutorials();
    },
    navigateToTutorials() {
      this.$router.push({name: 'tutorials'});
    }
  },
  created() {
    this.retrieveTutorial(this.$route.params.id);
  }
}
</script>

<style scoped>

</style>