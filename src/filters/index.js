export default {
    install: (Vue) => {
        Vue.filter('string', function (value) {
            return value.toString();
        })
    }
}