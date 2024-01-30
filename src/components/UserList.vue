<template>
	<div>
		<DataView :value="users" layout="list" :paginator="true" :rows="10"
					paginatorPosition="both" :pageLinkSize="3" v-model:first="currentPageFirstIndex"
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink">
			<template #header>
				<div style="font-size: large; color: RGB(33, 150, 243); text-align: center;">
					<i style="margin-right: .5em" class="fa fa-fw fa-lock"></i>
					<span>{{ $t('usermanagement_title') }}</span>
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
								<span v-if="slotProps.data.admin === true">{{ $t('global_admin') }}</span>
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
import UserService from '../service/UserService';

export default {
	data() {
        return {
			users: [],
			currentPageFirstIndex: 0,
        }
    },
	userService: null,

	created() {
		this.userService = new UserService();
	},

	mounted() {
		this.loadData();
	},

	methods: {
		loadData() {
			let loader = this.$loading.show();
			this.userService.findUsers()
			.then(users => {
				this.users = users;
			}).catch(error => {
				if(error.response) {
					this.$toast.add({ severity: 'error', summary: this.$t('usermanagement_user_load_error'), detail: error.response.data.message });
				} else {
                    this.$toast.add({ severity: 'error', summary: this.$t('usermanagement_user_load_error'), detail: error.message });
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
