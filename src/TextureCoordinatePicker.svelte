<script lang="ts">
    import {panzoom} from "./panzoom-action"

    let imageUrl: string | null = null
    let imgProps = null
    let fileInput
    let filename = null

    type Point = {x: number; y: number}

    let coords: null | {
        opengl: Point
        pixel: Point
        invertedOffset: Point
    } = null

    let settings: {
        mode: "center" | "corner" | "free"
        advanced: boolean
    } = JSON.parse(localStorage.getItem("settings")) || {mode: "center", advanced: false}
    $: localStorage.setItem("settings", JSON.stringify(settings))

    const onChange = (event: InputEvent & {currentTarget: EventTarget & HTMLInputElement}) => {
        let reader = new FileReader()

        reader.onload = () => {
            imageUrl = reader.result.toString()
            imgProps = null
        }

        reader.readAsDataURL(event.currentTarget.files[0])
        filename = event.currentTarget.files[0].name
    }

    const onImageLoad = (event: Event & {currentTarget: EventTarget & HTMLImageElement}) => {
        imgProps = {
            width: event.currentTarget.width,
            naturalWidth: event.currentTarget.naturalWidth,
            height: event.currentTarget.height,
            naturalHeight: event.currentTarget.naturalHeight,
        }
    }

    const updateLocation = (event: MouseEvent) => {
        if (imgProps) {
            let pixelCoords = {
                x: imgProps.naturalWidth * (event.offsetX / imgProps.width),
                y: imgProps.naturalHeight * (1 - event.offsetY / imgProps.height),
            }

            if (settings.mode === "center") {
                pixelCoords = {x: pixelCoords.x - 0.5, y: pixelCoords.y - 0.5}
            }

            if (settings.mode !== "free") {
                pixelCoords = {
                    x: Math.round(pixelCoords.x),
                    y: Math.round(pixelCoords.y),
                }
            }

            if (settings.mode === "center") {
                pixelCoords = {x: pixelCoords.x + 0.5, y: pixelCoords.y + 0.5}
            }

            coords = {
                pixel: pixelCoords,
                opengl: {
                    x: pixelCoords.x / imgProps.naturalWidth,
                    y: pixelCoords.y / imgProps.naturalHeight,
                },
                invertedOffset: {
                    x: (pixelCoords.x / imgProps.naturalWidth) * imgProps.width,
                    y: (pixelCoords.y / imgProps.naturalHeight) * imgProps.height,
                },
            }
        }
    }

    const toggleAdvanced = () => {
        settings = {...settings, advanced: !settings.advanced}
    }

    const setMode = (event: Event & {currentTarget: EventTarget & HTMLSelectElement}) => {
        settings = {
            ...settings,
            mode: event.currentTarget.value as "center" | "corner" | "free",
        }
    }
</script>

<div class="p-4">
    <div class="d-flex flex-justify-between">
        <div class="d-flex flex-items-baseline">
            <button class="btn mr-2" on:click={() => fileInput.click()}>Choose Image</button>
            <div>
                {#if filename}{filename}{:else}No file chosen{/if}
            </div>
            <input type="file" on:change={onChange} bind:this={fileInput} accept=".png,.jpg,.jpeg" hidden />
        </div>
        {#if imageUrl}
            <div class="d-flex flex-items-baseline">
                <div>
                    <span>OpenGL Coordinates X:</span>
                    {#if coords}
                        {coords.opengl.x}, Y: {coords.opengl.y}
                    {:else}
                        Hover over the image to determine coordinates.
                    {/if}
                </div>
                <button class="btn ml-2" on:click={toggleAdvanced}>Advanced</button>
            </div>
        {/if}
    </div>

    {#if imageUrl && settings.advanced}
        <div class="Popover position-relative">
            <div
                class="Popover-message Popover-message--top-right text-left p-4 mt-2 Box width-full right-0 color-shadow-medium"
            >
                <div>
                    <span>Pixel Coordinates X:</span>
                    {#if coords}
                        {coords.pixel.x}, Y: {coords.pixel.y}
                    {:else}
                        Hover over the image to determine coordinates.
                    {/if}
                </div>
                <div class="form-group mb-0">
                    <div class="form-group-header">
                        <label for="mode-select">Mode</label>
                    </div>
                    <div class="form-group-body">
                        <select class="form-select" aria-label="Mode" on:change={setMode} id="mode-select">
                            <option value="center">Center</option>
                            <option value="corner">Corner</option>
                            <option value="free">Free</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    {/if}

    {#if imageUrl}
        <div class="mt-4">
            <div use:panzoom class="panzoom">
                {#if coords}
                    <svg
                        width="11"
                        height="11"
                        style={`left: ${coords.invertedOffset.x - 5.5}px; bottom: ${coords.invertedOffset.y - 5.5}px;`}
                    >
                        <rect x="5" width="1" height="11" fill="rgb(0, 0, 0)" />
                        <rect y="5" width="11" height="1" fill="rgb(0, 0, 0)" />
                    </svg>
                {/if}
                <img src={imageUrl} alt="Uploaded by user." on:mousemove={updateLocation} on:load={onImageLoad} />
            </div>
        </div>
    {/if}
</div>

<style>
    img {
        image-rendering: optimizeSpeed; /* STOP SMOOTHING, GIVE ME SPEED  */
        image-rendering: -moz-crisp-edges; /* Firefox */
        image-rendering: -o-crisp-edges; /* Opera */
        image-rendering: -webkit-optimize-contrast; /* Chrome (and eventually Safari) */
        image-rendering: pixelated; /* Chrome */
        image-rendering: optimize-contrast; /* CSS3 Proposed */
        -ms-interpolation-mode: nearest-neighbor; /* IE8+ */

        cursor: none;
        width: 100%;
        display: block;
    }

    span {
        font-weight: bold;
    }

    svg {
        position: absolute;
        pointer-events: none;
    }

    .panzoom {
        position: relative;
    }
</style>
