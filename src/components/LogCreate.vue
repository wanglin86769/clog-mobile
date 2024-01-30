<template>
	<div>
		<div class="col-12">
			<div style="font-size: large; color: RGB(33, 150, 243); margin-top: 10px; margin-bottom: 5px; text-align: center;">
				<span style="font-size: large; color: RGB(33, 150, 243)">
					<i style="margin-right: .5em" class="fa fa-book"></i>
					<span>{{ logbook.name }}</span>
				</span>
			</div>
		</div>

		<div class="col-12">
			<div style="padding-bottom: 0rem; padding-left: 1rem; padding-right: 1rem;">
				<div class="grid border">
					<div class="col-4 border-right" style="background-color: RGB(179, 217, 255)">
						<span>{{ $t('global_log_logbook') }}</span>
					</div>
					<div class="col-8" style="background-color: RGBA(221, 238, 187)">
						<span>{{ logbook.name }}</span>
					</div>
					<div class="col-4 border-top border-right" style="background-color: RGB(179, 217, 255)">
						<span>{{ $t('global_log_author') }}</span>
					</div>
					<div class="col-8 border-top" style="background-color: RGBA(221, 238, 187)">
						<span>{{ userInfo.name }}</span>
					</div>
					<div class="col-4 border-top border-right" style="background-color: RGB(179, 217, 255)">
						<span>{{ $t('global_log_author_email') }}</span>
					</div>
					<div class="col-8 border-top" style="background-color: RGBA(221, 238, 187)">
						<span>{{ userInfo.email }}</span>
					</div>
					<div class="col-4 border-top border-right" style="background-color: RGB(179, 217, 255)">
						<span>{{ $t('global_log_tag') }}</span>
					</div>
					<div class="col-8 border-top" style="background-color: RGBA(221, 238, 187)">
						<MultiSelect v-model="log.tags" :options="tags" optionLabel="name" optionValue="_id" :placeholder="$t('global_select')" style="width: 100%" display="chip" />
					</div>
					<div class="col-4 border-top border-right" style="background-color: RGB(179, 217, 255)">
						<span>{{ $t('global_log_category') }}</span>
					</div>
					<div class="col-8 border-top" style="background-color: RGBA(221, 238, 187)">
						<Dropdown v-model="log.category" :options="categories" :placeholder="$t('global_select')" style="width: 100%" />
					</div>
					<div class="col-4 border-top border-right" style="background-color: RGB(179, 217, 255)">
						<span>{{ $t('global_log_title') }}</span>
					</div>
					<div class="col-8 border-top" style="background-color: RGBA(221, 238, 187)">
						<InputText v-model.trim="log.title" placeholder="" style="width: 100%" />
					</div>
					<Textarea v-model="log.description" :placeholder="$t('global_log_description_placeholder')" :autoResize="true" rows="5" style="width: 100%;" />

					<Panel :header="$t('global_log_attachment')" :toggleable="true" style="width: 100%;">
						<div>
							<input type="file" id="file" ref="file" multiple v-on:change="handleFileUpload()"/>
						</div>
					</Panel>
				</div>
			</div>
		</div>

		<div class="col-12">
			<div style="padding-left: 1rem; padding-right: 1rem;" class="flex flex-wrap align-items-center justify-content-between gap-2">
				<Button icon="pi pi-times" :label="$t('global_cancel')" class="p-button-text" size="small" @click="onCancelClick" />
				<Button icon="pi pi-check" :label="$t('global_create')" size="small" @click="createLog" />
			</div>
		</div>

		<Dialog v-model:visible="discardLogDialog" :header="$t('global_message')" :modal="true" style="width: 100%">
			<div>
				<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2em; color: orange; vertical-align: middle;" />
				<span style="color: orange; font-size: 1.2em;">{{ $t('global_log_discard_edit_prompt') }}</span>
			</div>
			<template #footer>
				<Button :label="$t('global_cancel')" icon="pi pi-times" class="p-button-text" @click="discardLogDialog = false"/>
				<Button :label="$t('global_ok')" icon="pi pi-check" class="p-button-primary" @click="discardLog" />
			</template>
		</Dialog>
	</div>	
</template>

<script>
import LogService from '../service/LogService';
import LogbookService from '../service/LogbookService';
import TagService from '../service/TagService';

export default {
	data() {
		return {
			tags: [],
			categories: [],
			log: {},
			logbook: {},
			submittingAttachments: [],
			discardLogDialog: false,
		}
	},

	logService: null,
	logbookService: null,
	tagService: null,

	created() {
		this.logService = new LogService();
		this.logbookService = new LogbookService();
		this.tagService = new TagService();

		this.log.logbook = this.$route.params.logbookId;
	},

	mounted() {
		// Permission guard
		if(!this.userInfo) {
			this.$router.push({path: '/access'});
			return;
		}

		this.fetchLogbook();
		this.fetchTags();
		this.fetchCategories();

		if(this.categories && this.categories.length) {
			this.log.category = this.categories[0];
		}
		// console.log(this.log);
	},

	methods: {
		fetchLogbook() {
			if(!this.$route.params.logbookId) {
				console.log('Logbook id not found.');
				return;
			}

            this.logbookService.findLogbook(this.$route.params.logbookId)
            .then(logbook => {
                this.logbook = logbook;
            }).catch((error) => {
                if(error.response) {
					this.$toast.add({ severity: 'error', summary: 'Fail to load the current logbook', detail: error.response.data.message });
				} else {
					this.$toast.add({ severity: 'error', summary: 'Fail to load the current logbook', detail: error.message });
				}
            });
        },
		fetchTags() {
            this.tagService.findTags()
            .then(tags => {
                this.tags = tags;
            }).catch((error) => {
                if(error.response) {
					this.$toast.add({ severity: 'error', summary: 'Fail to load tags', detail: error.response.data.message });
				} else {
					this.$toast.add({ severity: 'error', summary: 'Fail to load tags', detail: error.message });
				}
            });
        },
		fetchCategories() {
            this.categories = LogService.categories;
        },
		onCancelClick() {
			this.discardLogDialog = true;
		},
		createLog() {
			let validity = this.logService.validate(this.log);
			if(!validity.valid) {
				this.$toast.add({ severity: 'error', summary: this.$t('global_fail'), detail: validity.message });
				return;
			}

			let loader = this.$loading.show();

			let formData = new FormData();
            formData.append('log', JSON.stringify(this.log));
			for(let i=0; i<this.submittingAttachments.length; i++) {
                formData.append('attachments', this.submittingAttachments[i]);
            }

            this.logService.addLogFormData(formData)
			.then(() => {
                this.$router.push({name: 'logbook', params: { logbook: this.$route.params.logbookId }, query: { randomId: new Date().getTime() }});
            }).catch((error) => {
                if(error.response) {
					this.$toast.add({ severity: 'error', summary: this.$t('global_fail'), detail: error.response.data.message });
				} else {
					this.$toast.add({ severity: 'error', summary: this.$t('global_fail'), detail: error.message });
				}
            }).finally(() => {
				loader.hide();
			});
        },
		discardLog() {
			this.$router.push({name: 'logbook', params: { logbook: this.$route.params.logbookId }, query: { randomId: new Date().getTime() }});
		},
		handleFileUpload(){
            this.submittingAttachments = this.$refs.file.files;
            // console.log(this.submittingAttachments);
        },
	},

	computed: {
        userInfo() {
            return this.$store.state.authentication.user;
        }
    },

	watch: {
		userInfo() {
			if(!this.userInfo) {
				this.$router.push({path: '/access'});
			}
		}
	},
}
</script>

<style scoped>

</style>
