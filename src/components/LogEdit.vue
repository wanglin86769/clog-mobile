<template>
	<div>
		<div class="col-12">
			<div style="font-size: large; color: RGB(33, 150, 243); margin-top: 10px; margin-bottom: 5px; text-align: center;">
				<span style="font-size: large; color: RGB(33, 150, 243)">
					<i style="margin-right: .5em" class="fa fa-book"></i>
					<span v-if="currentLog && currentLog.logbook">{{ currentLog.logbook.name }}</span>
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
						<span v-if="currentLog && currentLog.logbook">{{ currentLog.logbook.name }}</span>
					</div>
					<div class="col-4 border-top border-right" style="background-color: RGB(179, 217, 255)">
						<span>{{ $t('global_log_author') }}</span>
					</div>
					<div class="col-8 border-top" style="background-color: RGBA(221, 238, 187)">
						<span v-if="currentLog && currentLog.createdBy">{{ userInfo.name }}</span>
					</div>
					<div class="col-4 border-top border-right" style="background-color: RGB(179, 217, 255)">
						<span>{{ $t('global_log_author_email') }}</span>
					</div>
					<div class="col-8 border-top" style="background-color: RGBA(221, 238, 187)">
						<span v-if="currentLog && currentLog.createdBy">{{ userInfo.email }}</span>
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

					<Panel v-if="currentLog && currentLog.attachments && currentLog.attachments.length" :header="$t('logedit_existing_attachments')" :toggleable="true" style="width: 100%;">
						<div class="grid" style="margin-top: 2em">
							<div class="col-12 md:col-6 lg:col-4 xl:col-3" v-for="(attachment, index) in currentLog.attachments" :key="index" style="padding: 1em;">
								<div v-if="imageMimeTypes.includes(attachment.contentType)">
									<Image :src="attachmentUrl(log._id, attachment.name)" alt="Attachment Image" width="100" preview />
								</div>
								<div v-else>
									<img alt="Attachment File" :src="attachmentIcon(attachment.name)" width="60" style="cursor: pointer;" @click="downloadAttachment(log._id, attachment.name)" />
								</div>
								<div>
									<span style="margin-right: 1em; color: rgb(59,130,246);">{{ attachment.name }}</span>
									<span style="margin-right: 1em;">{{ Math.round(attachment.size/1000) }} KB</span>
									<i v-if="attachment.deleting" class="fa fa-ban fa-lg" v-tooltip.top="$t('global_cancel')" style="cursor: pointer; color: orange; margin-right: .75em" @click="attachment.deleting=false"></i>
									<i v-else class="fa fa-close fa-lg" v-tooltip.top="$t('global_delete')" style="cursor: pointer; color: red; margin-right: .75em" @click="attachment.deleting=true"></i>
								</div>
							</div>
						</div>
					</Panel>

					<Panel :header="$t('logedit_new_attachments')" :toggleable="true" style="width: 100%;">
						<div>
							<input type="file" id="file" ref="increasefile" multiple v-on:change="handleIncreaseFileUpload()"/>
						</div>
					</Panel>
				</div>
			</div>
		</div>

		<div class="col-12">
			<div style="padding-left: 1rem; padding-right: 1rem;" class="flex flex-wrap align-items-center justify-content-between gap-2">
				<Button icon="pi pi-times" :label="$t('global_cancel')" class="p-button-text" size="small" @click="onCancelClick" />
				<Button icon="pi pi-check" :label="$t('global_ok')" size="small" @click="editLog" />
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
import fileDownload from 'js-file-download';
import LogService from '../service/LogService';
import TagService from '../service/TagService';

export default {
	data() {
		return {
			tags: [],
			categories: [],

			currentLog: {},
			log: {},
			discardLogDialog: false,

			submittingAttachments: [],
			increaseAttachments: [],

			imageMimeTypes: ['image/jpeg', 'image/png', 'image/bmp', 'image/gif'],
		}
	},

	logService: null,
	tagService: null,

	created() {
		this.logService = new LogService();
		this.tagService = new TagService();
	},

	mounted() {
		this.fetchLog();
		this.fetchTags();
		this.fetchCategories();
	},

	methods: {
		fetchLog() {
			if(!this.$route.params.logId) {
				console.log('Log id not found.');
				return;
			}

            this.logService.findLog(this.$route.params.logId)
            .then(log => {
                this.currentLog = log;

				this.log._id = log._id;
				this.log.logbook = log.logbook._id;
				if(log.tags && log.tags.length) {
					this.log.tags = log.tags.map(function(a) {return a._id;});
				}
				this.log.category = log.category;
				this.log.title = log.title;
				this.log.description = log.description;
				// console.log(this.log);
            }).catch((error) => {
                if(error.response) {
					this.$toast.add({ severity: 'error', summary: this.$t('logedit_log_load_error'), detail: error.response.data.message });
				} else {
					this.$toast.add({ severity: 'error', summary: this.$t('logedit_log_load_error'), detail: error.message });
				}
            })
        },
		fetchTags() {
            this.tagService.findTags()
            .then(tags => {
                this.tags = tags;
            }).catch((error) => {
                if(error.response) {
					this.$toast.add({ severity: 'error', summary: this.$t('logedit_tag_load_error'), detail: error.response.data.message });
				} else {
					this.$toast.add({ severity: 'error', summary: this.$t('logedit_tag_load_error'), detail: error.message });
				}
            });
        },
		fetchCategories() {
            this.categories = LogService.categories;
        },
		editLog() {
			let validity = this.logService.validate(this.log);
			if(!validity.valid) {
				this.$toast.add({ severity: 'error', summary: this.$t('global_fail'), detail: validity.message });
				return;
			}
			
			let loader = this.$loading.show();

			let formData = new FormData();
            formData.append('log', JSON.stringify(this.log));

			// for (const value of formData.values()) {
			// 	console.log(value);
			// }
			
			let reduceAttachments = [];
			if(this.currentLog && this.currentLog.attachments && this.currentLog.attachments.length) {
				for(let item of this.currentLog.attachments) {
					if(item.deleting) {
						reduceAttachments.push(item.name);
					}
				}
			}
            formData.append('reduceAttachments', JSON.stringify(reduceAttachments));
            // console.log(reduceAttachments);

            for(let i=0; i<this.increaseAttachments.length; i++) {
                formData.append('attachments', this.increaseAttachments[i]);
            }

            this.logService.editLogFormData(this.log._id, formData).then(() => {
                this.$router.push({name: 'logbook', params: { logbook: this.currentLog.logbook._id }, query: { randomId: new Date().getTime() }});
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
			this.$router.push({name: 'logbook', params: { logbook: this.currentLog.logbook._id }, query: { randomId: new Date().getTime() }});
		},
		onCancelClick() {
			this.discardLogDialog = true;
		},
		handleIncreaseFileUpload(){
            this.increaseAttachments = this.$refs.increasefile.files;
            // console.log(this.submittingAttachments);
        },
		attachmentUrl(logId, fileName) {
            // console.log(this.logService.attachmentUrl(logId, fileName));
            return this.logService.attachmentUrl(logId, fileName);
        },
		attachmentIcon(fileName) {
            return this.logService.attachmentIcon(fileName);
        },
        openAttachment(logId, fileName) {
            window.open(this.attachmentUrl(logId, fileName));
        },
        downloadAttachment(logId, fileName) {
            this.logService.findAttachment(logId, fileName)
            .then((attachment) => {
                fileDownload(attachment, fileName);
            }).catch(error => {
                this.$toast.add({ severity: 'error', summary: this.$t('global_fail'), detail: error.message });
            });
        },
	},

	computed: {
        userInfo() {
            return this.$store.state.authentication.user;
        }
    },
}
</script>

<style scoped>

</style>
