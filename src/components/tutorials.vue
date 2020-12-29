<template>
<v-card>
  <v-card-title>
    Tutorials
    <v-spacer></v-spacer>
    <v-text-field v-model="search"
    append-icon="mdi-magnify"
    label="Search"
    single-line
    hide-details>

    </v-text-field>
  </v-card-title>
  <v-card-text>
    <v-data-table
      :headers="headers"
      :items="displayTutorials"
      :items-per-page="5"
      :search="search"
      class="elevation-1"
      ref="tutorialsTable">
      <template v-slot:[`item.actions`]="{item}">
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
      </template>
      <template v-slot:top>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs}">
            <v-btn color="primary" dark class="mb-2"
                   v-bind="attrs"
                   v-on="on">New Item</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{formTitle}}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-dialog>
      </template>
    </v-data-table>
  </v-card-text>
</v-card>
</template>

<script>
import TutorialsService from '../services/tutorials-service';
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
      tutorials:[],
      displayTutorials:[],
      editedIndex: -1,
      editedItem: {
        id: 0,
        title: '',
        description: '',
        published: false,
      },
      defaultItem:{
        id: 0,
        title: '',
        description: '',
        published: false,
      }
    }
  },
  computed:{
    formTitle(){
      return this.editedIndex === -1 ? 'New Tutorial' : 'Edit Tutorial'
    }
  },
  watch: {
    dialog(val){
      val || this.close();
    },
    dialogDelete(val){
      val || this.closeDelete();
    }
  },
  methods: {
    getDisplayTutorial(tutorial){
      return{
        id: tutorial.id,
        title: tutorial.title,
        description: tutorial.description,
        status: tutorial.published ? "Published" : "Pending"
      };
    },
    retrieveTutorials(){
      TutorialsService.getAll()
      .then(response=>{
        this.tutorials = response.data;
        this.displayTutorials = response.data.map(this.getDisplayTutorial());
      })
    },
    refreshList(){
      this.retrieveTutorials();
    },
    removeAllTutorials(){
      TutorialsService.deleteAll()
      .then(()=>{
        this.refreshList();
      })
      .catch(e=>{
        alert('The backend does not support this operation.');
        console.log(e);
      });
    },
    editItem(item){
      this.editedIndex = this.displayTutorials.indexOf(item);
      this.editedItem = this.tutorials[this.editedIndex];
      this.dialog = true;
    },
    deleteItem(item){
      this.editedIndex = this.displayTutorials.indexOf(item);
      this.editedItem = Object.assign({}, this.tutorials[this.editedIndex]);
    },
    deleteTutorial(id){
      TutorialsService.delete(id)
      .then(()=>{
        this.refreshList();
      })
      .catch(e=>{
        console.log(e);
      });
    },
    deleteItemConfirm(){
      this.deleteTutorial(this.editedItem.id);
      this.tutorials.splice(this.editedItem, 1);
      this.closeDelete();
    },
    close(){
      this.dialog = false;
      this.$nextTick(()=>{
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    closeDelete(){
      this.dialogDelete=false;
      this.$nextTick(()=>{
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    save(){
      if(this.editedIndex>-1){
        this.tutorials[this.editedIndex] = this.editedItem;
        this.displayTutorials[this.editedIndex] =
            this.getDisplayTutorial(this.tutorials[this.editedIndex]);
        TutorialsService.update(this.editedItem.id, this.editedItem)
        .then(()=>{
          this.refreshList();
        })
        .catch(e=>{
          console.log(e);
        });
      }
      else{
        TutorialsService.create(this.editedItem)
        .then(response=>{
          let item = response.data;
          this.tutorials.push(item);
          this.displayTutorials.push(this.getDisplayTutorial(item));
        })
        .catch(e=>{
          console.log(e);
        });
      }
    }
  },
  mounted() {
    this.retrieveTutorials();
  }
}
</script>

<style scoped>

</style>