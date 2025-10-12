export default /* html */`
  <frm-media
    id="med-video"
    class="block"
    type="video"
    title="Video title"
    url="/static/video/test.mp4"
    loader="med-loader"
    error="med-error"
  >
    <video></video>
    <button type="button" data-media-control="play">Play</button>
    <button type="button" data-media-control="pause">Pause</button>
    <button type="button" data-media-control="toggle">Toggle</button>
    <div data-media-time>0:00</div>
    <div
      class="media-progress relative h-1"
      tabindex="0"
      role="slider"
      aria-label="Video timeline"
      aria-valuemin="0"
      aria-valuemax="0"
      aria-valuenow="0"
      aria-valuetext=""
      data-media-progress
    >
      <div class="media-bar absolute inset-0 after"></div>
      <div class="media-scrub absolute w-2 h-2 bg-foreground-dark b-radius-full"></div>
    </div>
  </frm-media>
`
