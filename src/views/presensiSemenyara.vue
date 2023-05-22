<template>
    <v-form ref="form"
    lazy-valdation>
        <v-select
        v-model="member"
        :items="members"
        label="Select Member"
        item-text="nama_member"
        item-value="id"></v-select> 
        
    </v-form>
    
</template>
<script>
export default {
    data(){
        return{
            members: []
        }
    },
    mounted(){
        var url = this.$api + "/member";
        this.$http.get(url)
        .then(response => {
            this.members = response.data.data;
        }).catch(error => {
            console.log(error.response.data)
        })
    }
}
</script>