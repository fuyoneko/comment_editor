<template>
  <v-dialog v-model="dialog" width="500">
    <v-card>
      <slot></slot>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="dialog = false">
          <slot name="cancel">キャンセル</slot>
        </v-btn>
        <slot name="ok" :callback="onClickOk">
          <v-btn color="primary" text @click="onClickOk">OK</v-btn>
        </slot>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  data() {
    return {
      dialog: false
    };
  },
  methods: {
    onClickOk() {
      this.dialog = false;
      this.$emit("on-click-ok");
    },
    showDialog() {
      this.dialog = true;
    }
  }
};
</script>