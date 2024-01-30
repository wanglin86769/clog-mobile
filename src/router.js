import {createRouter, createWebHistory} from 'vue-router';


const routes = [
	{
		path: '/',
		name: 'home',
		component: () => import('./components/Home.vue')
	},
	{
        path: '/login',
        name: 'login',
        component: () => import('./pages/Login.vue'),
    },
    {
        path: '/oauth/redirect',
        name: 'oauth',
        component: () => import('./components/OAuth.vue'),
    },
    {
        path: '/registeraccount',
        name: 'registeraccount',
        component: () => import('./pages/RegisterAccount.vue'),
    },
    {
        path: '/verifyaccount/:random',
        name: 'verifyaccount',
        component: () => import('./pages/emailLink/VerifyAccount.vue'),
    },
    {
        path: '/updatepassword',
        name: 'updatepassword',
        component: () => import('./pages/UpdatePassword.vue'),
    },
    {
        path: '/forgetpassword',
        name: 'forgetpassword',
        component: () => import('./pages/ForgetPassword.vue'),
    },
    {
        path: '/resetpassword/:random',
        name: 'resetpassword',
        component: () => import('./pages/emailLink/ResetPassword.vue'),
    },
	{
		path: '/logbook/:logbook',
		name: 'logbook',
		meta: { keepAlive: true }, // Enable component cache
		component: () => import('./components/Logbook.vue')
	},
	{
        path: '/logcreate/:logbookId',
        name: 'logcreate',
        component: () => import('./components/LogCreate.vue'),
    },
	{
        path: '/logedit/:logId',
        name: 'logedit',
        component: () => import('./components/LogEdit.vue'),
    },
	{
		path: '/logdetail/:logbook/:log',
		name: 'logdetail',
		component: () => import('./components/LogDetail.vue')
	},
	{
		path: '/groups',
		name: 'groups',
		component: () => import('./components/GroupList.vue')
	},
	{
		path: '/logbooks',
		name: 'logbooks',
		component: () => import('./components/LogbookList.vue')
	},
	{
		path: '/tags',
		name: 'tags',
		component: () => import('./components/TagList.vue')
	},
	{
		path: '/users',
		name: 'users',
		component: () => import('./components/UserList.vue')
	},
    {
		path: '/accounts',
		name: 'accounts',
		component: () => import('./components/AccountList.vue')
	},
	{
		path: '/about',
		name: 'about',
		component: () => import('./components/About.vue')
	},
    {
        path: "/:catchAll(.*)",
        name: 'notfound',
        component: () => import('./components/NotFound.vue')
    },
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
    routes: routes
});


export default router;