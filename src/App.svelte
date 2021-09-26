<script lang="ts">
    import Header from "./Header.svelte"
    import {Router, Route} from "svelte-routing"
    import TextureCoordinatePicker from "./TextureCoordinatePicker.svelte"

    export let url = ""
</script>

<Router {url}>
    <Header />
    <main class="container-lg">
        <Route path="texture-coordinate-picker" component={TextureCoordinatePicker} />
        <Route path="spritesheet-splitter">
            <div class="blankslate">
                <h3 class="mb-1">I haven't built this yet.</h3>
                <p>
                    In the meantime, you might want to try
                    <a href="https://www.piskelapp.com/">Piskel</a>,
                    <a href="https://www.codeandweb.com/texturepacker"> Texture Packer </a>
                    or just plain old
                    <a href="https://www.gimp.org/">GIMP</a>.
                </p>
            </div>
        </Route>
        <Route path="/">
            <div class="blankslate">
                <h3 class="mb-1">OpenGL Utilities</h3>
                <p>I built some small utilities to help me with annoying tasks in OpenGL.</p>
            </div>
        </Route>
    </main>
</Router>
