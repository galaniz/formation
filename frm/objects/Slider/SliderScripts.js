export default /* html */`
  <script>
    (() => {
      document.documentElement.style.setProperty(
        '--frm-scrollbar-width',
        window.innerWidth - document.body.clientWidth + 'px'
      )
    })()
  </script>
`
