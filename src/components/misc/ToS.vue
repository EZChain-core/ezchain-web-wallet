<template>
    <p>
        By using this application you agree to the
        <router-link to="/legal" tag="a">Terms of Use</router-link>
        .
    </p>
</template>
<style scoped lang="scss">
p {
    color: var(--primary-color-light);
    font-size: 13px;
}
a {
    text-decoration: none;
    font-size: 16px;
    line-height: 24px;
    color: #000000 !important;
    font-weight: bold;
}
</style>
