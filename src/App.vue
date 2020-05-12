<template>
    <div class="section">
        <div class="container">
            <!-- <div class="columns">
                <div class="column">
                    <simple-upload url="/upload"/>
                </div>
                <div class="column">
                    <multiple-upload url="/upload"/>
                </div>
            </div>
            <simpledropzone-upload accept=".jpg,.jpeg,.png,.gif"/> -->
            <multipledropzone-upload accept=".jpg,.jpeg,.png,.gif"/>
        </div>
    </div>
</template>

<script>
import 'bulma/css/bulma.css'
import '@fortawesome/fontawesome-free/js/all.min'
// import SimpleUpload from './components/SimpleUpload.vue'
// import MultipleUpload from "./components/MultipleUpload.vue";
// import SimpledropzoneUpload from "./components/SimpleDropzoneUpload.vue";
import MultipledropzoneUpload from "./components/MultipleDropzoneUpload.vue";
export default {
  name: 'App',
    components: { MultipledropzoneUpload }
}
</script>