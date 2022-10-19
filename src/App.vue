<template>
  <div id="app">
    <HeaderItem />
  </div>
</template>

<script>
import HeaderItem from './components/Header/HeaderItem';

export default {
  name: 'App',
  components: { HeaderItem },
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
}
</style>
