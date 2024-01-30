<template>
	<div>
		<DataView :value="logs" layout="list" :paginator="true" :rows="10"
					paginatorPosition="both" :pageLinkSize="3" ref="dt"
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink" :rowsPerPageOptions="[5,10,25,50,100]"
					:lazy="true" :totalRecords="totalRecords" @page="onPage($event)">
			<template #header>
				<div class="flex flex-wrap align-items-center justify-content-between gap-2">
					<span style="font-size: large; color: RGB(33, 150, 243)">
						<i style="margin-right: .5em" class="fa fa-book"></i>
						<span v-if="logbook">{{ logbook.name }}</span>
					</span>
					<Button v-if="userInfo" :label="$t('global_new')" icon="pi pi-plus" rounded raised size="small" @click="onLogCreateClick()" />
				</div>
			</template>

			<template #list="slotProps">
				<div class="col-12" @click="onLogClick(slotProps.data)">
					<div style="padding: 1rem;">
						<div class="shadow-3">
							<div class="grid border">
								<div class="col-6 border-right" :style="{ 'background-color': logHeaderColor(slotProps.index, slotProps.data) }">
									<span>{{ slotProps.data.category }}</span>
								</div>
								<div class="col-6" :style="{ 'background-color': logHeaderColor(slotProps.index, slotProps.data) }">
									<span>{{ showDateTime(slotProps.data.createdAt) }}</span>
								</div>
								<div class="col-6 border-top border-right" :style="{ 'background-color': logHeaderColor(slotProps.index, slotProps.data) }">
									<span v-if="slotProps.data.createdBy">{{ slotProps.data.createdBy.name }}</span>
								</div>
								<div class="col-6 border-top" :style="{ 'background-color': logHeaderColor(slotProps.index, slotProps.data) }">
									<span v-if="slotProps.data.createdBy">{{ slotProps.data.createdBy.email }}</span>
								</div>
								<div class="col-12 border-top" :style="{ 'color': 'RGB(33, 150, 243)', 'background-color': logHeaderColor(slotProps.index, slotProps.data) }">
									{{ slotProps.data.title }}
									&nbsp;&nbsp;
									<i v-if="slotProps.data.attachments && slotProps.data.attachments.length" class="pi pi-paperclip p-text-secondary">{{ slotProps.data.attachments.length }}</i>
								</div>
								<div class="col-12 border-top" :style="{ 'background-color': logHeaderColor(slotProps.index, slotProps.data) }">
									<div class="max-lines" style="white-space: pre-wrap;" v-html="slotProps.data.description"></div>
								</div>
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
import moment from 'moment';
import LogbookService from '../service/LogbookService';
import LogService from '../service/LogService';

export default {
	data() {
        return {
			logbookId: null,
            logbook: null,

			lazyParams: {},
			logs: [],
			totalRecords: 0,
        }
    },
	logbookService: null,
	logService: null,

	created() {
		this.logbookService = new LogbookService();
		this.logService = new LogService();

		this.logbookId = this.$route.params.logbook;
	},

	mounted() {
		this.resetLazyParams();

		this.fetchLogbook();
		this.loadLazyData();
	},

	activated() {
		// console.log('activated');
    },

    deactivated () {
		// console.log('deactivated');
    },

	methods: {
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
		loadLazyData() {
			this.loading = true;
			this.logService.findLogs(this.logbookId, this.lazyParams)
			.then(data => {
				this.logs = data.entries;
				this.totalRecords = data.count;
			}).catch(error => {
				if(error.response) {
					this.$toast.add({ severity: 'error', summary: this.$t('logbook_log_load_error'), detail: error.response.data.message });
				} else {
					this.$toast.add({ severity: 'error', summary: this.$t('logbook_log_load_error'), detail: error.message });
				}
			}).finally(() => {
				this.loading = false;
			});
		},
		onPage(event) {
            this.lazyParams.first = event.first;
			this.lazyParams.rows = event.rows;
            this.loadLazyData();
        },
		resetLazyParams() {
			this.lazyParams = {
				first: 0,
				rows: this.$refs.dt.rows,
				sortField: null,
				sortOrder: null,
				filters: null
			};
		},
		onLogClick(log) {
			this.$router.push({ name: 'logdetail', params: { logbook: this.logbookId, log: log._id }});
		},
		onLogCreateClick() {
			this.$router.push({name: 'logcreate', params: { logbookId: this.logbookId }});
		},
		logHeaderColor(index, log) {
			if(!log) return;
			let dateNow = new Date();

			if(log.updatedAt) {
				let updatedAt = new Date(log.updatedAt);
				if (updatedAt.getTime() > dateNow.getTime() - 3 * 60 * 1000) 
					return 'rgb(204, 255, 204)';
			} else if(log.createdAt) {
				let createdAt = new Date(log.createdAt);
				if (createdAt.getTime() > dateNow.getTime() - 3 * 60 * 1000) 
					return 'rgb(204, 255, 204)';
			}
			return index % 2 ? 'Cornsilk' : 'LightCyan';
		},
		showDateTime(value) {
			return moment(value).format("YYYY-MM-DD HH:mm:ss");
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

.max-lines {
  display: block;/* or inline-block */
  word-wrap: break-word;
  overflow-y: hidden;
  max-height: 4.8em;
  line-height: 1.8em;
}

</style>
