export default /* html */`
  <frm-media
    id="med-audio"
    class="block"
    type="audio"
    title="Audio title"
    url="/static/audio/test.mp3"
    loader="med-loader"
    error="med-error"
  >
    <audio></audio>
    <button type="button" data-media-control="play">Play</button>
    <button type="button" data-media-control="pause">Pause</button>
    <button type="button" data-media-control="toggle">Toggle</button>
    <div data-media-time>0:00</div>
    <div
      class="media-progress relative h-1"
      tabindex="0"
      role="slider"
      aria-label="Audio timeline"
      aria-valuemin="0"
      aria-valuemax="0"
      aria-valuenow="0"
      aria-valuetext=""
      data-media-progress
    >
      <div class="media-bar absolute all-0 after"></div>
      <div class="media-scrub absolute w-2 h-2 bg-foreground-dark b-radius-full"></div>
    </div>
  </frm-media>
  <template id="med-loader">
    <div tabindex="-1">Media loader</div>
  </template>
  <template id="med-error">
    <div tabindex="-1">
      <p>Sorry, there is a problem with the service. Open <a data-media-link></a></p>
    </div>
  </template>
`
