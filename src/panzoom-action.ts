import Panzoom from "@panzoom/panzoom"

export const panzoom = (node: HTMLElement) => {
    const panzoom = Panzoom(node, {
        maxScale: Infinity,
        minScale: 1,
        contain: "outside"
    })

    node.parentElement.addEventListener('wheel', panzoom.zoomWithWheel)
}