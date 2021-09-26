<script lang="ts">
    import {link} from "svelte-routing"
</script>

<div class="Header">
    <div class="Header-item">
        <a href="/" class="Header-link f2" use:link>OpenGL Utils</a>
    </div>
    <div class="Header-item">
        <a href="/texture-coordinate-picker" class="Header-link" use:link>Texture Coordinate Picker</a>
    </div>
    <div class="Header-item">
        <a href="/spritesheet-splitter" class="Header-link" use:link>Spritesheet Splitter</a>
    </div>
</div>
