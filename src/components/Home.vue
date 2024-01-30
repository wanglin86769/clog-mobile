<template>
	<div>
		<Panel v-for="(group, index) of groups" :key="index" :toggleable="true">
			<template #header>
				<div style="font-weight: bold">
					<span v-if="group.name">{{ group.name }}</span>
					<span v-else>{{ $t('home_default_group') }}</span>
				</div>
			</template>
			<div v-if="group && group.logbooks && group.logbooks.length">
				<div v-for="(logbook, index) of group.logbooks" :key="index">
					<div class="col-12">
						<div class="card shadow-2" @click="onLogbookClick(logbook)">
							<div class="grid">
								<div class="col-9" style="color: RGB(33, 150, 243)">
									<i class="fa fa-book"></i>
									<span style="margin-left: .5em;">{{ logbook.name }}</span>
								</div>
								<div class="col-3">
									{{ logbook.entries }}
								</div>
								<div class="col-12">
									<div v-if="logbook.lastSubmittedAt && logbook.lastSubmittedBy">
										<span style="margin-right: 1em;">{{ showDateTime(logbook.lastSubmittedAt) }}</span>
										<span>{{ logbook.lastSubmittedBy.name }}</span>
									</div>
									<div v-else>----</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div v-else>
				<div class="col-12">
					<div style="color: orange">{{ $t('global_no_data') }}</div>
				</div>
			</div>
        </Panel>

		<Panel v-if="!groups || !groups.length" header="Demo" :toggleable="true">
			<div class="col-12">
				<div class="card shadow-2" @click="onLogbookClick('Demo logbook 1')">
					<div class="grid">
						<div class="col-9" style="color: RGB(33, 150, 243)">
							<i class="fa fa-book"></i>
							<span style="margin-left: .5em;">Demo logbook 1</span>
						</div>
						<div class="col-3">
							N/A
						</div>
						<div class="col-12">
							N/A
						</div>
					</div>
				</div>
			</div>
			<div class="col-12">
				<div class="card shadow-2" @click="onLogbookClick('Demo logbook 2')">
					<div class="grid">
						<div class="col-9" style="color: RGB(33, 150, 243)">
							<i class="fa fa-book"></i>
							<span style="margin-left: .5em;">Demo logbook 2</span>
						</div>
						<div class="col-3">
							N/A
						</div>
						<div class="col-12">
							N/A
						</div>
					</div>
				</div>
			</div>
        </Panel>
	</div>
</template>

<script>
import moment from 'moment';
import LogbookService from '@/service/LogbookService';

export default {
	data() {
        return {
			groups: [],
        }
    },
	logbookService: null,

	created() {
		this.logbookService = new LogbookService();
	},

	mounted() {
		this.loadData();
	},

	methods: {
		loadData() {
			this.logbookService.findLogbooksDetail()
			.then(groups => {
				this.groups = groups;
			}).catch(error => {
				if(error.response) {
					this.$toast.add({ severity: 'error', summary: this.$t('home_logbook_load_error'), detail: error.response.data.message });
				} else {
                    this.$toast.add({ severity: 'error', summary: this.$t('home_logbook_load_error'), detail: error.message });
				}
			});
		},
		onLogbookClick(logbook) {
			this.$router.push({name: 'logbook', params: { logbook: logbook._id }, query: { randomId: new Date().getTime() }});
		},
		showDateTime(value) {
			return moment(value).format("YYYY-MM-DD HH:mm:ss");
		},
	},

}
</script>

<style scoped>
::v-deep(.p-panel-header) {
	background-color: RGB(217, 241, 249);
}

::v-deep(.p-panel-content) {
	background-color: RGB(247, 247, 247);
}

</style>
