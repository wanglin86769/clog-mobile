<template>
	<div>
		<DataView :value="accounts" layout="list" :paginator="true" :rows="10"
					paginatorPosition="both" :pageLinkSize="3" v-model:first="currentPageFirstIndex"
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink">
			<template #header>
				<div style="font-size: large; color: RGB(33, 150, 243); text-align: center;">
					<i style="margin-right: .5em" class="fa fa-fw fa-user-o"></i>
					<span>{{ $t('accountmanagement_account') }}</span>
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
								<span>******</span>
							</div>
							<div class="col-6 border-top border-right" :style="{ 'background-color': logHeaderColor(slotProps.index) }">
								<span>{{ slotProps.data.name }}</span>
							</div>
							<div class="col-6 border-top" :style="{ 'background-color': logHeaderColor(slotProps.index) }">
								<span>{{ slotProps.data.email }}</span>
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
import AccountService from '../service/AccountService';

export default {
	data() {
        return {
			accounts: [],
			currentPageFirstIndex: 0,
        }
    },
	accountService: null,

	created() {
		this.accountService = new AccountService();
	},

	mounted() {
		this.loadData();
	},

	methods: {
		loadData() {
			let loader = this.$loading.show();
			this.accountService.findAccounts()
			.then(accounts => {
				this.accounts = accounts;
			}).catch(error => {
				if(error.response) {
					this.$toast.add({ severity: 'error', summary: this.$t('accountmanagement_account_load_error'), detail: error.response.data.message });
				} else {
                    this.$toast.add({ severity: 'error', summary: this.$t('accountmanagement_account_load_error'), detail: error.message });
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
