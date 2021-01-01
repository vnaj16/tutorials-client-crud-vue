<template>
  <v-card>
    <v-card-title>
      Tutorials
      <v-spacer></v-spacer>
      <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
      ></v-text-field>
    </v-card-title>
    <v-card-text>
      <v-data-table :headers="headers" :items="displayTutorials" :items-per-page="5" :search="search"
                    class="elevation-1" ref="tutorialsTable">
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
          <v-icon small class="mr-2" @click="navigateToEditTutorial(item.id)">mdi-pen</v-icon>
          <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
        <template v-slot:top>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">New Item</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.id" label="Id"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.title" label="Tutorial Title"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.description" label="Description"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-checkbox v-model="editedItem.published" label="Published"></v-checkbox>
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
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline">Delete Item</v-card-title>
              <v-card-text>
                <p>Are you sure you want to delete the item <b>{{ editedItem.title }}</b></p>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
      </v-data-table>
    </v-card-text>
    <v-card-actions>
      <v-btn small color="primary" @click="navigateToAddTutorial">Add Tutorial</v-btn>
      <v-btn small color="error" @click="removeAllTutorials">Remove All</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import TutorialService from '../services/tutorials-service';

export default {
  name: "tutorials",
  data() {
    return {
      search: '',
      dialog: false,
      dialogDelete: false,
      headers: [
        {text: 'Id', value: 'id'},
        {text: 'Title', value: 'title'},
        {text: 'Description', value: 'description'},
        {text: 'Status', value: 'status'},
        {text: 'Actions', value: 'actions', sortable: false}
      ],
      tutorials: [],
      displayTutorials: [],
      editedIndex: -1,
      editedItem: {
        id: 0,
        title: '',
        description: '',
        published: false
      },
      defaultItem: {
        id: 0,
        title: '',
        description: '',
        published: false
      },
    }
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Tutorial' : 'Edit Tutorial'
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },
  methods: {
    retrieveTutorials() {
      TutorialService.getAll()
          .then(response => {
            this.tutorials = response.data;
            this.displayTutorials = response.data.map(this.getDisplayTutorial);
          })
          .catch((e) => {
            console.log(e);
          });
    },

    getDisplayTutorial(tutorial) {
      return {
        id: tutorial.id,
        title: tutorial.title,
        description: tutorial.description,
        status: tutorial.published ? "Published" : "Pending",
      };
    },

    refreshList() {
      this.retrieveTutorials();
    },

    removeAllTutorials() {
      TutorialService.deleteAll()
          .then(() => {
            this.refreshList();
          })
          .catch((e) => {
            alert("The Backend does not support this operation.");
            console.log(e);
          });
    },

    editItem(item) {
      this.editedIndex = this.displayTutorials.indexOf(item);
      console.log(item);
      this.editedItem = this.tutorials[this.editedIndex];
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.displayTutorials.indexOf(item);
      this.editedItem = Object.assign({}, this.tutorials[this.editedIndex]);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.deleteTutorial(this.editedItem.id);
      this.tutorials.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save() {
      if (this.editedIndex > -1) {
        this.tutorials[this.editedIndex] = this.editedItem;
        this.displayTutorials[this.editedIndex] = this.getDisplayTutorial(this.tutorials[this.editedIndex]);
        TutorialService.update(this.editedItem.id, this.editedItem)
            .then(() => {
              this.refreshList();
            })
            .catch(e => {
              console.log(e);
            });

      } else {
        TutorialService.create(this.editedItem)
            .then(response => {
              let item = response.data;
              this.tutorials.push(item);
              this.displayTutorials.push(this.getDisplayTutorial(item));
            })
            .catch(e => {
              console.log(e);
            })
      }
      this.close()
    },

    deleteTutorial(id) {
      TutorialService.delete(id)
          .then(() => {
            this.refreshList();
          })
          .catch((e) => {
            console.log(e);
          });
    },

    navigateToAddTutorial() {
      this.$router.push({name: 'add-tutorial'});
    },
    navigateToEditTutorial(id) {
      this.$router.push({name: 'edit-tutorial', params: { id: id}});
    }
  },
  mounted() {
    this.retrieveTutorials();
  }

}
</script>

<style scoped>

</style>