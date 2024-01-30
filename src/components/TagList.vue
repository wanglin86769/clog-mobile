<template>
	<div>
		<DataView :value="tags" layout="list" :paginator="true" :rows="10"
					paginatorPosition="both" :pageLinkSize="3" v-model:first="currentPageFirstIndex"
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink">
			<template #header>
				<div style="font-size: large; color: RGB(33, 150, 243); text-align: center;">
					<i style="margin-right: .5em" class="pi pi-tag"></i>
					<span>{{ $t('global_log_tag') }}</span>
				</div>
			</template>

			<template #list="slotProps">
				<div class="col-12">
					<div style="padding: 1rem;">
						<div class="grid border shadow-2">
							<div class="col-6 border-right" :style="{ 'background-color': logHeaderColor(slotProps.index) }">
								<span>{{ currentPageFirstIndex + slotProps.index + 1 }}</span>
							</div>
							<div class="col-6" :style="{ 'background-color': logHeaderColor(slotProps.index) }">
								<span></span>
							</div>
							<div class="col-6 border-top border-right" :style="{ 'background-color': logHeaderColor(slotProps.index) }">
								<span style="font-weight: bold">{{ slotProps.data.name }}</span>
							</div>
							<div class="col-6 border-top" :style="{ 'background-color': logHeaderColor(slotProps.index) }">
								<span></span>
							</div>
						</div>
					</div>
				</div>
			</template>

			<template #empty>
				<div style="color: orange; padding: 10px;">{{ $t('global_no_data') }}</div>
			</template>
		</DataView>
	</div>
</template>

<script>
import TagService from '../service/TagService';

export default {
	data() {
        return {
			tags: [],
			currentPageFirstIndex: 0,
        }
    },
	tagService: null,

	created() {
		this.tagService = new TagService();
	},

	mounted() {
		this.loadData();
	},

	methods: {
		loadData() {
			let loader = this.$loading.show();
			this.tagService.findTags()
			.then(tags => {
				this.tags = tags;
			}).catch(error => {
				if(error.response) {
					this.$toast.add({ severity: 'error', summary: this.$t('tagmanagement_tag_load_error'), detail: error.response.data.message });
				} else {
                    this.$toast.add({ severity: 'error', summary: this.$t('tagmanagement_tag_load_error'), detail: error.message });
				}
			}).finally(() => {
				loader.hide();
			});
		},
		logHeaderColor(index) {
			return index % 2 ? 'Cornsilk' : 'LightCyan';
		},
	},

	computed: {
		userInfo() {
            return this.$store.state.authentication.user;
        },
    }

}
</script>

<style scoped>

</style>
