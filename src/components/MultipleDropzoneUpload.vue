<template>
    <form @submit.prevent="sendFile" enctype="multipart/form-data">
        <div v-if="message"
             :class="`message ${error ? 'is-danger': 'is-success'}`"
        >
            <div class="message-body">
                {{message}}
            </div>
        </div>
        <div class="dropzone">
            <input
                    :accept="this.accept"
                    multiple
                    type="file"
                    class="input-file"
                    ref="files"
                    @change="selectFile"
            />
            <p v-if="!uploading" class="call-to-action">
                Cliquez ici pour ajouter vos fichiers ou déposez les ici
            </p>
        </div>
        <div v-if="fileExist">
            <h2 class="is-size-2">Fichier en cours de transfert</h2>
            <div class="columns" v-for="file in ToUpload" :key="file.name">
                <div class="column">
                    {{file.name}}
                </div>
                <div class="column">
                    <progress
                            class="progress is-primary"
                            :value="progress[file.id]"
                            max="100"
                    >
                        {{progress[file.id]}} %
                    </progress>
                </div>
            </div>
        </div>
        <div v-if="fileUpload">
            <h2 class="is-size-2">Fichier déjà envoyé sur le serveur</h2>
            <div class="columns" v-for="file in uploadedFiles" :key="file.name">
                <div class="column is-one-fifth">
                    <img :src="'http://127.0.0.1:3344/'+ file.path" class="image is-96x96"/>
                </div>
                <div class="column">
                    {{ file.originalname }}
                </div>
                <div class="column is-one-fifth has-text-right">
                    <a class="delete is-medium is-danger"></a>
                </div>
            </div>
        </div>
    </form>
</template>

<script>
    import _ from "lodash"
    import axios from "axios";

    export default {
        name: "MultipledropzoneUpload",
        props : {
            accept: {type: String, required: false, default: '*'}
        },
        data () {
            return {
                files: [],
                message: "",
                error: false,
                uploading: false,
                uploadFiles: [],
                uploadedFiles: [],
                progress: {},
                fileExist: false,
                allowedType: [],
                ToUpload: [],
                fileUpload: false
            }
        },
        mounted() {
            this.AcceptedTransform();
        },
        methods: {
            AcceptedTransform() {
                this.allowedTypes = this.accept.split(',');
            },
            get_extension(filename) {
                return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
            },
            selectFile() {
                this.fileExist = true;
                const files = this.$refs.files.files;
                this.ToUpload = [
                    ...this.ToUpload,
                    ...this.files,
                    ..._.map(files, file => ({
                        id: Math.random().toString(36).substr(2, 9),
                        content: file,
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        invalidMessage: this.validate(file)
                    }))
                ];
                _.forEach(this.ToUpload, file => {
                    // this.$set(this.progress, file.id, 0);
                    this.progress[file.id] = 0;
                })
                this.sendFile()
            },
            async sendFile() {
                _.forEach(this.ToUpload, async file => {
                    const formData = new FormData();
                    formData.append('file', file.content);
                    const res = await axios.post('/dropzone', formData, {
                        onUploadProgress: e => this.progress[file.id] = Math.round(e.loaded * 100 / e.total)
                    });
                    if (res.status === 200) {
                        //suppression de l'ensemble des valeurs dans le toUpload ????
                        this.ToUpload.splice(this.ToUpload.find(f => f.id === file.id), 1);
                        // Récupération des informations de l'upload pour suite traitement
                        this.uploadedFiles.push(res.data.file);
                        if (this.ToUpload.length === 0){
                            this.fileExist = false;
                        }
                        this.fileUpload = true;
                    }
                })
            },
            validate (file) {
                const extension = '.'+this.get_extension(file.name.toLowerCase());
                if (this.allowedTypes.includes(extension) || this.accept === "*") {
                    return "";
                } else {
                    return "Ce type de fichier est interdit";
                }
            },
        }
    }
</script>

<style>
    .dropzone{
        min-height: 200px;
        padding: 10px;
        position: relative;
        cursor: pointer;
        outline: 2px dashed grey;
        /*outline-radius: 25px;*/
        outline-offset: -10px;
        background-color: lightcyan;
        color: grey;
        /*border-radius: 25px;*/
    }
    .dropzone:hover{
        background-color: lightblue;
    }
    .dropzone .call-to-action{
        font-size: 1.2rem;
        text-align: center;
        vertical-align: middle;
        padding-top: 70px;
    }
    .dropzone .progress-bar{
        text-align: center;
        padding: 70px 10px;
    }
    .input-file{
        opacity: 0;
        width: 100%;
        height: 200px;
        position: absolute;
        cursor: pointer;
    }
    table{
        width: 100%;
    }
</style>