<template>
	<div>
		<div class="col-12">
			<h3 style="color: RGB(33, 150, 243); text-align: center; margin-bottom: .5em;">
				<i style="margin-right: .5em" class="fa fa-book"></i>
				<span v-if="logbook">{{ logbook.name }}</span>
			</h3>
			<div style="padding-left: 1rem; padding-right: 1rem;" class="flex flex-wrap align-items-center justify-content-between gap-2">
				<Button :disabled="!canEdit" :label="$t('global_edit')" icon="fa fa-pencil" severity="warning" rounded raised size="small" @click="onEditClick()" />
				<Button :disabled="!canEdit" :label="$t('global_delete')" icon="fa fa-trash" severity="danger" rounded raised size="small" @click="onDeleteClick()" />
			</div>
		</div>
		<div class="col-12">
			<div style="padding-bottom: 1rem; padding-left: 1rem; padding-right: 1rem;">
				<div class="grid border">
					<div class="col-4 border-right" style="background-color: RGB(179, 217, 255)">
						{{ $t('global_log_author') }}
					</div>
					<div class="col-8" style="background-color: RGBA(221, 238, 187)">
						<span v-if="log.createdBy">{{ log.createdBy.name }}</span>
					</div>
					<div class="col-4 border-top border-right" style="background-color: RGB(179, 217, 255)">
						{{ $t('global_log_author_email') }}
					</div>
					<div class="col-8 border-top" style="background-color: RGBA(221, 238, 187)">
						<span v-if="log.createdBy">{{ log.createdBy.email }}</span>
					</div>
					<div class="col-4 border-top border-right" style="background-color: RGB(179, 217, 255)">
						{{ $t('global_log_create_date') }}
					</div>
					<div class="col-8 border-top" style="background-color: RGBA(221, 238, 187)">
						{{ showDateTime(log.createdAt) }}
					</div>
					<div v-if="showModifiedDate(log)" class="col-4 border-top border-right" style="background-color: RGB(179, 217, 255)">
						{{ $t('global_log_modify_date') }}
					</div>
					<div v-if="showModifiedDate(log)" class="col-8 border-top" style="background-color: RGBA(221, 238, 187)">
						{{ showDateTime(log.updatedAt) }}
					</div>
					<div class="col-4 border-top border-right" style="background-color: RGB(179, 217, 255)">
						{{ $t('global_log_logbook') }}
					</div>
					<div class="col-8 border-top" style="background-color: RGBA(221, 238, 187)">
						<span v-if="log.logbook">{{ log.logbook.name }}</span>
					</div>
					<div class="col-4 border-top border-right" style="background-color: RGB(179, 217, 255)">
						{{ $t('global_log_tag') }}
					</div>
					<div class="col-8 border-top" style="background-color: RGBA(221, 238, 187)">
						<div v-if="log.tags && log.tags.length">
							<span v-for="(tag, index) of log.tags" :key="index" style="margin-bottom: 10px">
								<span v-if="index !== 0">, </span>
								<span>{{ tag.name }}</span>
							</span>
						</div>
					</div>
					<div class="col-4 border-top border-right" style="background-color: RGB(179, 217, 255)">
						{{ $t('global_log_category') }}
					</div>
					<div class="col-8 border-top" style="background-color: RGBA(221, 238, 187)">
						{{ log.category }}
					</div>
					<div class="col-4 border-top border-right" style="background-color: RGB(179, 217, 255)">
						{{ $t('global_log_title') }}
					</div>
					<div class="col-8 border-top" style="background-color: RGBA(221, 238, 187)">
						{{ log.title }}
					</div>
					<div v-html="log.description" class="content" style="white-space: pre-wrap;"></div>

					<div v-for="(attachment, index) of log.attachments" :key="index" class="col-12" style="padding-bottom: 0">
						<div class="grid">
							<div class="col-4 border-top border-right" style="background-color: RGB(179, 217, 255)">
								{{ $t('global_log_attachment') }} {{ index + 1 }}
							</div>
							<div class="col-8 border-top" style="background-color: RGBA(221, 238, 187); word-wrap: break-word;">
								<!-- <a :href="attachmentUrl(item.id)">{{ attachment.filename }}</a> -->
								<div style="cursor: pointer; color: rgb(59,130,246);" @click="openAttachment(log._id, attachment.name)">
									<span>{{ attachment.name }}</span>
								</div>
							</div>
							<div class="col-12">
								<el-image v-if="imageMimeTypes.includes(attachment.contentType)"
									style="width: 150px"
									:src="attachmentUrl(log._id, attachment.name)"
									:zoom-rate="1.2"
									:max-scale="7"
									:min-scale="0.2"
									:preview-src-list="previewSrcList"
									:initial-index="attachment.index"
									:infinite="false"
									fit="cover"
								/>
								<!-- <img v-else alt="Attachment File" :src="attachmentIcon(attachment.name)" width="150px" style="cursor: pointer;" @click="downloadAttachment(log._id, attachment.name)" /> -->
								<Image v-else :src="attachmentIcon(attachment.name)" alt="Attachment File" width="150" style="cursor: pointer" @click="downloadAttachment(log._id, attachment.name)" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<Dialog v-model:visible="logDeleteConfirmDisplay" :header="$t('global_message')" :modal="true" style="width: 100vw">
			<div>
				<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2em; color: orange; vertical-align: middle;" />
				<span style="color: orange; font-size: 1.2em;">{{ $t('logdetail_delete_log_prompt') }}</span>
			</div>
			<template #footer>
				<Button :label="$t('global_cancel')" icon="pi pi-times" class="p-button-text" @click="logDeleteConfirmDisplay = false"/>
				<Button :label="$t('global_ok')" icon="pi pi-check" class="p-button-primary" @click="deleteLog" />
			</template>
		</Dialog>
	</div>
</template>

<script>
import moment from 'moment';
import fileDownload from 'js-file-download';
import LogbookService from '../service/LogbookService';
import LogService from '../service/LogService';

export default {
	data() {
        return {
            logbookId: null,
			logbook: {},

			logId: null,
			log: {},

			imageMimeTypes: ['image/jpeg', 'image/png', 'image/bmp', 'image/gif'],
			previewSrcList: [],

			logDeleteConfirmDisplay: false,
        }
    },
	logbookService: null,
	logService: null,

	created() {
		this.logbookService = new LogbookService();
		this.logService = new LogService();

		this.logbookId = this.$route.params.logbook;
		this.logId = this.$route.params.log;
	},

	mounted() {
		this.fetchLogbook();
		this.fetchLog();
	},

	methods: {
		processAttachments(log) {
			let attachments = log.attachments;
			if(!attachments || !attachments.length)  return;
			
			this.previewSrcList = [];
			let index = 0;

			for(let attachment of attachments) {
				if(this.imageMimeTypes.includes(attachment.contentType)) {
					// Add image index
					attachment.index = index++;
					// Build preview source list
					let url = this.attachmentUrl(log._id, attachment.name);
					this.previewSrcList.push(url);
				}
			}
		},
		fetchLogbook() {
			if(!this.logbookId) {
				console.log('Logbook id not found.');
				return;
			}

            this.logbookService.findLogbook(this.logbookId)
            .then(logbook => {
                this.logbook = logbook;
            }).catch(error => {
				if(error.response) {
					this.$toast.add({ severity: 'error', summary: 'Failed to load current logbook', detail: error.response.data.message });
				} else {
					this.$toast.add({ severity: 'error', summary: 'Failed to load current logbook', detail: error.message });
				}
			});
        },
		fetchLog() {
			if(!this.logId) {
				console.log('Log id not found.');
				return;
			}

            this.logService.findLog(this.logId)
            .then(log => {
                this.log = log;
				this.processAttachments(log);
            }).catch((error) => {
                if(error.response) {
					this.$toast.add({ severity: 'error', summary: this.$t('logdetail_log_load_error'), detail: error.response.data.message });
				} else {
					this.$toast.add({ severity: 'error', summary: this.$t('logdetail_log_load_error'), detail: error.message });
				}
            });
        },
		onEditClick() {
			this.$router.push({name: 'logedit', params: { logId: this.logId }});
		},
		onDeleteClick() {
			this.logDeleteConfirmDisplay = true;
		},
		deleteLog() {
			this.logService.deleteLog(this.logId).then(() => {
				this.deleteLogDialog = false;
                this.$router.push({name: 'logbook', params: { logbook: this.log.logbook._id }, query: { randomId: new Date().getTime() }});
            }).catch((error) => {
                if(error.response) {
					this.$toast.add({ severity: 'error', summary: this.$t("global_fail"), detail: error.response.data.message });
				} else {
					this.$toast.add({ severity: 'error', summary: this.$t("global_fail"), detail: error.message });
				}
            });
		},
		isImageFile(url) {
			let imageExtensions = ['JPG', 'jpg', 'JPEG', 'jpeg', 'PNG', 'png', 'GIF', 'gif', 'BMP', 'bmp'];
			let ext = url.split('.').pop();
			return imageExtensions.includes(ext) ? true : false;
		},
		attachmentUrl(logId, fileName) {
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
                this.$toast.add({ severity: 'error', summary: this.$t("global_fail"), detail: error.message });
            });
        },
		showModifiedDate(log) {
			if(!log || !log.createdAt || !log.updatedAt) return false;
			let createdAt = new Date(log.createdAt);
			let updatedAt = new Date(log.updatedAt);
			return createdAt.getTime() === updatedAt.getTime() ? false : true;
		},
		showDate(value) {
			return moment(value).format("YYYY-MM-DD");
        },
        showTime(value) {
			return moment(value).format("HH:mm");
        },
		showDateTime(value) {
			return moment(value).format("YYYY-MM-DD HH:mm:ss");
		},
	},

	computed: {
		userInfo() {
            return this.$store.state.authentication.user;
        },
		canEdit() {
			// Clog admin can edit the log
			if(this.isAdmin) {
				return true;
			}
			// Log author can edit the log
			if(this.log && this.log.createdBy && this.userInfo && this.log.createdBy.email === this.userInfo.email) {
				return true;
			}
			// Logbook admin can edit the log
			if(this.log && this.log.logbook && this.log.logbook.admins && this.userInfo && this.log.logbook.admins.includes(this.userInfo.email)) {
				return true;
			}
			return false;
		},
    }

}
</script>

<style scoped>

.content {
	border-top: 1px solid RGBA(33, 150, 243, 0.8);
	padding: .5em;
	width: 100%;
	overflow: auto;
	min-height: 4.8em;
	line-height: 1.8em;
}

</style>
