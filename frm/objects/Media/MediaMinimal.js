export default /* html */`
  <frm-media
    id="med-minimal"
    class="block"
    title="Minimal video title"
    loader="med-loader"
    error="med-error"
  >
    <video
      class="ar-16-9 w-full"
      playsinline
      data-testid="med-minimal-media"
    ></video>
    <button
      type="button"
      data-media-control="toggle"
      data-testid="med-minimal-toggle"
    >
      Toggle
    </button>
  </frm-media>
`
