
<script>
  import { stores } from '@sapper/app';
  const { page } = stores();
  $: {
    if (typeof gtag !== "undefined"){
      gtag("config", process.env.GA_TAG, {
        page_path: $page.path
      });
    }
  }
</script>