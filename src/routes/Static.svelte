<script>
    import { context } from "../store.js";

    let node;
    //node.start();

    console.group("static");
    $: if ($context) {
        node = $context.createOscillator();
        console.log(node, "node");
    }
    console.groupEnd();
</script>

<div>This is the page</div>
