const heights = [120, 200, 90, 160, 110, 180]

const items = heights.map((height, i) => /* html */`
  <li
    id="msn-sen-${i}"
    class="masonry-item col-6 col-4-s"
    style="height: ${height}px"
    data-masonry-item
  ></li>
`).join('')

export default /* html */`
  <frm-masonry
    id="msn-loads"
    class="block"
    breakpoints="0,600"
    columns="2,3"
    gaps="16,24"
    loads-offset="64"
  >
    <ul class="masonry-list grid cols gap-4 gap-6-s align-start" data-masonry-list>
      ${items}
    </ul>
    <div class="masonry-loads" data-masonry-loads></div>
  </frm-masonry>
`
