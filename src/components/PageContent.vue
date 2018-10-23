<template>
  <div class="page-content col-md-9 py-3">
    <ActionForm />
    <PostView />
  </div>
</template>

<script>
import ActionForm from './ActionForm'
import PostView from './PostView'

export default {
	name: "PageContent",
  components: {
    ActionForm,
    PostView
  }
};
</script>

<style>
</style>
