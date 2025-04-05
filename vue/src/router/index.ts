import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { nextTick } from 'vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Radio Fodder',
            component: HomeView,
        },
        {
            path: '/schedule',
            name: 'Schedule – Radio Fodder',
            component: () => import('../views/ScheduleView.vue'),
        },
        // {
        //     path: '/submit',
        //     name: 'submit',
        //     component: () => import('../views/SubmissionView.vue'),
        // },
    ],
})

// This is how we could change title, but we are instead doing it in Home View to add whats currently playing to the title
// router.afterEach(async (to, from) => {
//     await nextTick( () => {
//         document.title = to.name!.toString()
//     });
// })
  

export default router
