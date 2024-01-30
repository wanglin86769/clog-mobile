<template>
	<div class="layout-wrapper" >
        <div class="above-footer-wrapper">
            <Menubar :model="menu">
                <template #start>
                    <img alt="logo" src="@/assets/images/clog_logo_yellow.png" style="vertical-align: middle" height="30" class="mr-2">
                    <span class="logo">Clog</span>
                </template>
                <template #end>
                    <SplitButton v-if="userInfo" :label="userInfo.email ? userInfo.email.split('@')[0] : ''" class="p-button-sm" icon="pi pi-user" :model="buttonItems"></SplitButton>
                    <Button v-else :label="$t('app_login')" class="p-button-primary p-button-sm" style="width: 100px" @click="onLoginClick" />
                </template>
            </Menubar>

            <div style="overflow-x: hidden">
                <router-view v-slot="{ Component }">
                    <keep-alive>
                        <component :is="Component" :key="$route.fullPath" v-if="$route.meta.keepAlive"></component>
                    </keep-alive>
                    <component :is="Component" :key="$route.fullPath" v-if="!$route.meta.keepAlive"></component>
                </router-view>
            </div>
        </div>

        <div class="layout-footer" style="text-align: center">
            <span class="footer-text">{{ softwareUser }}</span>
        </div>

        <Dialog :header="$t('global_message')" v-model:visible="logoutDialogDisplay" style="width: 100vw" :modal="true">
            <div>
                <i class="fa fa-exclamation-circle fa-2x" style="vertical-align: middle; color: orange"></i>
                <span class="text-center ml-2" style="vertical-align: middle">{{ $t('app_logout_confirm_message') }}</span>
            </div>

            <template #footer>
                <Button :label="$t('global_cancel')" icon="pi pi-times" @click="logoutDialogDisplay=false" class="p-button-text"/>
                <Button :label="$t('global_ok')" icon="pi pi-check" @click="handleLogout" />
            </template>
        </Dialog>

		<Dialog :header="$t('app_account_information')" v-model:visible="showAccountDialogDisplay" style="width: 100vw" :modal="true">
            <div v-if="userInfo">
                <p><span style="font-weight: bold">{{ $t('global_email') }}: </span><span>{{ userInfo.email }}</span></p>
                <p><span style="font-weight: bold">{{ $t('global_name') }}: </span><span>{{ userInfo.name }}</span></p>
                <p>
                    <span style="font-weight: bold">{{ $t('global_admin') }}: </span>
                    <span>{{ isAdmin ? $t('global_yes') : $t('global_no') }}</span>
                </p>
            </div>

            <template #footer>
                <Button :label="$t('global_close')" icon="pi pi-times" @click="showAccountDialogDisplay=false" class="p-button-text"/>
            </template>
        </Dialog>

        <Dialog :header="$t('global_message')" v-model:visible="sessionExpireDialogDisplay" style="width: 100vw" :modal="true" :closable="false">
            <div style="color: orange; font-weight: bold">
                <i class="fa fa-exclamation-triangle fa-2x" style="vertical-align: middle; color: orange"></i>
                <span class="text-center ml-2" style="vertical-align: middle">{{ $t('app_session_expire_message') }}</span>
            </div>

            <template #footer>
                <Button :label="$t('global_ok')" icon="pi pi-check" @click="handleLogout" />
            </template>
        </Dialog>

        <Dialog :header="$t('app_browser_languages')" v-model:visible="browserLanguagesDialogDisplay" style="width: 100vw" :modal="true" :closable="false">
            <div v-for="(item, index) in browserLanguages" :key="index">
                <i class="fa fa-circle" style="vertical-align: middle; margin-right: .8em; color: orange;"></i>
                <span style="vertical-align: middle; font-size: 1.4em;">{{ item }}</span>
            </div>

            <template #footer>
                <Button :label="$t('global_close')" icon="pi pi-times" @click="browserLanguagesDialogDisplay=false" class="p-button-text"/>
            </template>
        </Dialog>
	</div>
</template>

<script>
import jwt from 'jsonwebtoken';
import AuthenticationService from '@/service/AuthenticationService';
import config from './config/configuration.js';

export default {
    data() {
        return {
            intervalId: null,
			sessionExpireDialogDisplay: false,

            logoutDialogDisplay: false,
            showAccountDialogDisplay: false,

            softwareUser: config.softwareUser,

			menu: [],

            browserLanguagesDialogDisplay: false,
            browserLanguages: [],

            buttonItems: [
                {
                    label: this.$t('app_account_information'),
                    icon: 'pi pi-user',
                    command: () => {
                        this.onAccountInfoClick();
                    }
                },
                {
                    label: this.$t('app_logout'),
                    icon: 'pi pi-power-off',
                    command: () => {
                        this.onLogoutClick();
                    }
                },
            ]
        }
    },
    authenticationService: null,
    created() {
        this.authenticationService = new AuthenticationService();
        this.checkSessionStatus();
		this.intervalId = setInterval(this.checkSessionStatus, 30000);  // Every 30 seconds
	},
    mounted() {
        this.browserLanguages = navigator.languages && navigator.languages.length ? navigator.languages : navigator.language;
        this.updateMenuItems();
    },
    methods: {
        updateMenuItems() {
            this.menu = [
                {
                   label: this.$t('menu_home'),
                   icon: 'pi pi-fw pi-home',
                   to: '/'
                },
                {
                   label: this.$t('menu_logbook_grouping'),
                   icon: 'fa fa-fw fa-bars',
                   to: '/groups'
                },
                {
                   label: this.$t('menu_logbook'),
                   icon: 'pi pi-fw pi-book',
                   to: '/logbooks'
                },
                {
                   label: this.$t('menu_tag'),
                   icon: 'pi pi-fw pi-tag',
                   to: '/tags'
                },
                {
                   label: this.$t('menu_user_management'),
                   icon: 'fa fa-fw fa-lock',
                   to: '/users',
                   disabled: () => !this.userInfo
                },
                {
                    label: this.$t('menu_account_management'),
                    icon: 'fa fa-fw fa-user',
                    to: '/accounts',
                    disabled: () => !this.isAdmin,
                    visible: () => this.isLocalLogin
                },
                {
                    label: this.$t('menu_multi_language'),
                    icon: 'fa fa-fw fa-globe',
                    items: [
                        {
                            label: this.$t('menu_browser_languages'),
                            icon: 'fa fa-fw fa-edge',
                            command: () => { this.browserLanguagesDialogDisplay = true; },
                        },
                        {
                            label: '简体中文',
                            icon: 'fa fa-fw fa-circle-o',
                            command: () => { this.$i18n.locale='zh'; },
                        },
                        {
                            label: 'English',
                            icon: 'fa fa-fw fa-circle-o',
                            command: () => { this.$i18n.locale='en'; },
                        },
                    ]
                },
                {
                   label: this.$t('menu_about'),
                   icon: 'pi pi-fw pi-info-circle',
                   to: '/about'
                },
            ];
        },
        onAccountInfoClick() {
            this.showAccountDialogDisplay = true;
        },
        onLoginClick() {
            // Save the page before login
            localStorage.setItem(config.localStoragePageBeforeLogin, this.$route.path);

            if(config.loginMethod === 'oauth') {
                this.loginOAuth();
            } else {
                this.loginLocalOrLdap();
            }
        },
        onLogoutClick() {
            this.logoutDialogDisplay = true;
        },
        handleLogout() {
            this.$store.dispatch('alert/clear');

            this.$store.dispatch('authentication/logout')
            .then(() => {
                console.log("logout done");
                this.logoutDialogDisplay = false;
                this.sessionExpireDialogDisplay = false;
                if(this.isOauthLogin) {
                    window.location.href = this.authenticationService.oauthLogoutFullUrl();
                }
            })
        },
        loginOAuth() {
            let url = this.authenticationService.oauthFullUrl();
            // console.log(url);
            window.location = url;
        },
        loginLocalOrLdap() {
            // this.$router.push('/login');
            let url = '/login';
            window.location = url;
        },
        checkSessionStatus() {
            // console.log("checkSessionStatus");
            const user = JSON.parse(localStorage.getItem(config.localStorageUser));
            if(!user) return;

            let token = user.token;
            // get the decoded payload and header
            let decoded = jwt.decode(token, {complete: true});

            let dateNow = new Date();
            // console.log(decoded.payload.exp);
            // console.log(dateNow / 1000);
            if(decoded.payload.exp < dateNow / 1000) {
                console.log("JWT token expired!!!");
                this.sessionExpireDialogDisplay = true;
            }
        },
    },
    computed: {
        userInfo() {
            return this.$store.state.authentication.user;
        },
        isAdmin() {
			return this.$store.state.authentication.user && this.$store.state.authentication.user.admin === true;
        },
        isLocalLogin() {
            return config.loginMethod === 'local';
        },
        isOauthLogin() {
            return config.loginMethod === 'oauth';
        },
    },
    watch: {
        '$i18n.locale'() {
            this.updateMenuItems();
        },
    },
}
</script>

<style lang="scss">
@import './assets/layout/layout.scss';
@import './App.scss';

</style>
