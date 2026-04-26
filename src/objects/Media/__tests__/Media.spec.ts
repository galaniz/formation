/**
 * Objects - Media Test
 */

/* Imports */

import type { Media } from '../Media.js'
import { test, expect } from '@playwright/test'
import { doCoverage } from '@alanizcreative/formation-coverage/coverage.js'

/* Types */

declare global {
  interface Window {
    testMediaToggle: string[]
    testMediaResize: boolean
  }
}

/* Tests */

test.describe('Media', () => {
  /* Test page and coverage */

  test.beforeEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, true)

    await page.addInitScript(() => {
      window.testMediaToggle = []
      window.testMediaResize = false

      requestAnimationFrame(() => {
        const ids = [
          'med-empty',
          'med-partial-none',
          'med-partial',
          'med-video',
          'med-audio',
          'med-minimal'
        ]

        ids.forEach(id => {
          const med = document.getElementById(id)

          if (!med) {
            return
          }

          med.addEventListener('media:toggle', (e) => {
            window.testMediaToggle.push((e.target as HTMLElement).id)
          })
        })
      })
    })

    await page.goto('/spec/objects/Media/__tests__/Media.html')
  })

  test.afterEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, false)
  })

  /* Test init */

  test('should not initialize if missing required elements', async ({ page }) => {
    const mediaInit = await page.evaluate(() => {
      const media = document.querySelector('#med-empty') as Media
      return media.init
    })

    expect(mediaInit).toBe(false)
  })

  test('should initialize if contains required elements', async ({ page }) => {
    const mediaInit = await page.evaluate(() => {
      const media: Media[] = Array.from(document.querySelectorAll('frm-media'))
      return media.map(med => med.init)
    })

    expect(mediaInit).toStrictEqual([
      false, // #med-empty
      false, // #med-partial-none
      false, // #med-partial
      true,  // #med-video
      true,  // #med-audio
      true   // #med-minimal
    ])
  })

  test('should move instance and not reinitialize', async ({ page }) => {
    const mediaProps = await page.evaluate(async () => {
      const media = document.querySelector('#med-video') as Media

      media.parentElement?.insertAdjacentElement('beforeend', media)

      await Promise.resolve()

      return {
        init: media.init,
        mediaTag: media.media?.tagName,
        timeText: media.time?.textContent,
        durationText: media.duration?.textContent,
        progressRole: media.progress?.role,
        controlsCount: media.controls.length
      }
    })

    expect(mediaProps.init).toBe(true)
    expect(mediaProps.mediaTag).toBe('VIDEO')
    expect(mediaProps.timeText).toBe('0:00')
    expect(mediaProps.durationText).toBe('0:00')
    expect(mediaProps.progressRole).toBe('slider')
    expect(mediaProps.controlsCount).toBe(3)
  })

  /* Test minimal video */

  test('should display error on minimal video on media click', async ({ page }) => {
    await page.getByTestId('med-minimal-media').click()

    const error = page.getByTestId('med-error')

    await expect(error).toBeVisible()
    await expect(error).toBeFocused()
  })

  test('should not display error on minimal video if templates cleared', async ({ page }) => {
    await page.evaluate(async () => {
      const { Media } = await import('../Media.js')
      Media.templates.clear()
    })

    await page.getByTestId('med-minimal-toggle').click()
    await expect(page.getByTestId('med-error')).not.toBeVisible()
  })

  test('should play minimal video on toggle button click', async ({ page }) => {
    await page.evaluate(() => {
      const media = document.querySelector('#med-minimal') as Media
      media.url = '/static/video/test.mp4'
    })

    await page.getByTestId('med-minimal-toggle').click()
    await page.waitForFunction(() => { // Wait for playing
      return window.testMediaToggle.filter(id => id === 'med-minimal').length === 1
    })

    const mediaPlayProps = await page.evaluate(() => {
      const media = document.querySelector('#med-minimal') as Media

      return {
        playing: media.playing && media.hasAttribute('playing'),
        labels: media.controls.map(control => (control.ariaLabel || control.textContent).trim())
      }
    })

    await page.getByTestId('med-minimal-toggle').click()
    await page.waitForFunction(() => { // Wait for play
      return window.testMediaToggle.filter(id => id === 'med-minimal').length === 2
    })

    const mediaPauseProps = await page.evaluate(() => {
      const media = document.querySelector('#med-minimal') as Media

      return {
        paused: !media.playing && !media.hasAttribute('playing'),
        labels: media.controls.map(control => (control.ariaLabel || control.textContent).trim())
      }
    })

    expect(mediaPlayProps.playing).toBe(true)
    expect(mediaPlayProps.labels).toStrictEqual(['Pause'])
    expect(mediaPauseProps.paused).toBe(true)
    expect(mediaPauseProps.labels).toStrictEqual(['Play'])
  })

  test('should play minimal video until end', async ({ page }) => {
    await page.evaluate(() => {
      const media = document.querySelector('#med-minimal') as Media
      media.url = '/static/video/test.mp4'
    })

    await page.getByTestId('med-minimal-media').click()
    await page.waitForFunction(() => { // Wait for end
      const media = document.querySelector('#med-minimal') as Media
      return !media.playing
    })

    const mediaProps = await page.evaluate(() => {
      const media = document.querySelector('#med-minimal') as Media

      return {
        paused: !media.playing && !media.hasAttribute('playing'),
        currentTime: Math.round(media.media?.currentTime as number)
      }
    })

    expect(mediaProps.paused).toBe(true)
    expect(mediaProps.currentTime).toBe(5)
  })

  /* Test video controls */

  test('should play video on play button click', async ({ page }) => {
    await page.getByTestId('med-video-play').click()
    await page.waitForFunction(() => { // Wait for playing
      return window.testMediaToggle.filter(id => id === 'med-video').length === 1
    })

    const mediaProps = await page.evaluate(() => {
      const media = document.querySelector('#med-video') as Media

      return {
        playing: media.playing && media.hasAttribute('playing'),
        labels: media.controls.map(control => (control.ariaLabel || control.textContent).trim())
      }
    })

    expect(mediaProps.playing).toBe(true)
    expect(mediaProps.labels).toStrictEqual([
      'Play',
      'Pause',
      'Pause'
    ])
  })

  test('should pause video on pause button click', async ({ page }) => {
    await page.getByTestId('med-video-play').click()
    await page.waitForFunction(() => { // Wait for playing
      return window.testMediaToggle.filter(id => id === 'med-video').length === 1
    })

    await page.getByTestId('med-video-pause').click()
    await page.waitForFunction(() => { // Wait for pause
      return window.testMediaToggle.filter(id => id === 'med-video').length === 2
    })

    const mediaProps = await page.evaluate(() => {
      const media = document.querySelector('#med-video') as Media

      return {
        paused: !media.playing && !media.hasAttribute('playing'),
        labels: media.controls.map(control => (control.ariaLabel || control.textContent).trim())
      }
    })

    expect(mediaProps.paused).toBe(true)
    expect(mediaProps.labels).toStrictEqual(['Play', 'Pause', 'Play'])
  })

  test('should play and pause video on toggle button click', async ({ page }) => {
    await page.getByTestId('med-video-toggle').click()
    await page.waitForFunction(() => { // Wait for playing
      return window.testMediaToggle.filter(id => id === 'med-video').length === 1
    })

    const mediaPlayProps = await page.evaluate(() => {
      const media = document.querySelector('#med-video') as Media

      return {
        playing: media.playing && media.hasAttribute('playing'),
        labels: media.controls.map(control => (control.ariaLabel || control.textContent).trim())
      }
    })

    await page.getByTestId('med-video-toggle').click()
    await page.waitForFunction(() => { // Wait for play
      return window.testMediaToggle.filter(id => id === 'med-video').length === 2
    })

    const mediaPauseProps = await page.evaluate(() => {
      const media = document.querySelector('#med-video') as Media

      return {
        paused: !media.playing && !media.hasAttribute('playing'),
        labels: media.controls.map(control => (control.ariaLabel || control.textContent).trim())
      }
    })

    expect(mediaPlayProps.playing).toBe(true)
    expect(mediaPlayProps.labels).toStrictEqual(['Play', 'Pause', 'Pause'])
    expect(mediaPauseProps.paused).toBe(true)
    expect(mediaPauseProps.labels).toStrictEqual(['Play', 'Pause', 'Play'])
  })

  /* Test video media */

  test('should pause and play video on media click', async ({ page }) => {
    await page.getByTestId('med-video-play').click()
    await page.waitForFunction(() => { // Wait for playing
      return window.testMediaToggle.filter(id => id === 'med-video').length === 1
    })

    await page.getByTestId('med-video-media').click()
    await page.waitForFunction(() => { // Wait for pause
      return window.testMediaToggle.filter(id => id === 'med-video').length === 2
    })

    const mediaPauseProps = await page.evaluate(() => {
      const media = document.querySelector('#med-video') as Media

      return {
        paused: !media.playing && !media.hasAttribute('playing'),
        labels: media.controls.map(control => (control.ariaLabel || control.textContent).trim())
      }
    })

    await page.getByTestId('med-video-media').click()
    await page.waitForFunction(() => { // Wait for play
      return window.testMediaToggle.filter(id => id === 'med-video').length === 3
    })

    const mediaPlayProps = await page.evaluate(() => {
      const media = document.querySelector('#med-video') as Media

      return {
        playing: media.playing && media.hasAttribute('playing'),
        labels: media.controls.map(control => (control.ariaLabel || control.textContent).trim())
      }
    })

    expect(mediaPauseProps.paused).toBe(true)
    expect(mediaPauseProps.labels).toStrictEqual(['Play', 'Pause', 'Play'])
    expect(mediaPlayProps.playing).toBe(true)
    expect(mediaPlayProps.labels).toStrictEqual(['Play', 'Pause', 'Pause'])
  })

  /* Test video keyboard events */

  test('should not pause or play video on space key if not active', async ({ page }) => {
    await page.keyboard.press('Space')

    const mediaPlaying = await page.evaluate(() => {
      const media = document.querySelector('#med-video') as Media
      return media.playing && media.hasAttribute('playing')
    })

    expect(mediaPlaying).toBe(false)
  })

  test('should pause and play video on space key if active', async ({ page }) => {
    await page.evaluate(async () => {
      const { addFilter } = await import('../../../filters/filters.js')

      addFilter('media:active:med-video', () => true)
    })

    await page.keyboard.press('Space')
    await page.waitForFunction(() => { // Wait for play
      return window.testMediaToggle.filter(id => id === 'med-video').length === 1
    })

    const mediaPlayProps = await page.evaluate(() => {
      const media = document.querySelector('#med-video') as Media

      return {
        playing: media.playing && media.hasAttribute('playing'),
        labels: media.controls.map(control => (control.ariaLabel || control.textContent).trim())
      }
    })

    await page.keyboard.press('Space')
    await page.waitForFunction(() => { // Wait for pause
      return window.testMediaToggle.filter(id => id === 'med-video').length === 2
    })

    const mediaPauseProps = await page.evaluate(() => {
      const media = document.querySelector('#med-video') as Media

      return {
        paused: !media.playing && !media.hasAttribute('playing'),
        labels: media.controls.map(control => (control.ariaLabel || control.textContent).trim())
      }
    })

    expect(mediaPlayProps.playing).toBe(true)
    expect(mediaPlayProps.labels).toStrictEqual(['Play', 'Pause', 'Pause'])
    expect(mediaPauseProps.paused).toBe(true)
    expect(mediaPauseProps.labels).toStrictEqual(['Play', 'Pause', 'Play'])
  })

  /* Test video progress */

  test('should load video on progress click', async ({ page }) => {
    await page.getByTestId('med-video-progress').click()
    await page.waitForFunction(() => { // Wait for load
      const media = document.querySelector('#med-video') as Media
      return media.loaded
    })

    const mediaProps = await page.evaluate(() => {
      const media = document.querySelector('#med-video') as Media

      return {
        readyState: media.media?.readyState,
        durationText: media.duration?.textContent
      }
    })

    expect(mediaProps.readyState).toBeGreaterThan(0)
    expect(mediaProps.durationText).toBe('0:05')
  })

  test('should update time and video frame on progress drag', async ({ page }) => {
    const progress = page.getByTestId('med-video-progress')
    const progressBox = await progress.boundingBox()
    const progressWidth = progressBox?.width as number
    const progressHeight = progressBox?.height as number

    await progress.dragTo(progress, {
      sourcePosition: {
        x: 0,
        y: progressHeight / 2
      },
      targetPosition: {
        x: progressWidth * 0.6,
        y: progressHeight / 2
      },
      steps: 10
    })

    await page.waitForFunction(() => { // Wait for load
      const media = document.querySelector('#med-video') as Media
      return media.loaded
    })

    const mediaProgress = await page.evaluate(() => {
      const media = document.querySelector('#med-video') as Media

      return {
        scale: parseFloat(media.style.getPropertyValue('--med-progress-bar')).toFixed(1),
        currentTime: Math.round(media.media?.currentTime as number),
        timeText: media.time?.textContent,
        ariaMin: media.progress?.ariaValueMin,
        ariaMax: media.progress?.ariaValueMax,
        ariaNow: media.progress?.ariaValueNow,
        ariaText: media.progress?.ariaValueText
      }
    })

    expect(mediaProgress.scale).toBe('0.6')
    expect(mediaProgress.currentTime).toBe(3)
    expect(mediaProgress.timeText).toBe('0:03')
    expect(mediaProgress.ariaMin).toBe('0')
    expect(mediaProgress.ariaMax).toBe('5')
    expect(mediaProgress.ariaNow).toBe('3')
    expect(mediaProgress.ariaText).toBe('3 seconds / 5 seconds')
  })

  // test('should mute and update video current time during progress drag', async ({ page }) => {})

  test('should update time and video frame on progress over and under drag', async ({ page }) => {
    const progress = page.getByTestId('med-video-progress')
    await progress.click()

    await page.waitForFunction(() => { // Wait for load
      const media = document.querySelector('#med-video') as Media
      return media.loaded
    })

    const progressBox = await progress.boundingBox()
    const progressX = progressBox?.x as number
    const progressY = progressBox?.y as number
    const progressWidth = progressBox?.width as number
    const progressHeight = progressBox?.height as number
    const progressCenterX = progressX + progressWidth / 2
    const progressCenterY = progressY + progressHeight / 2

    await page.mouse.move(progressCenterX, progressCenterY)
    await page.mouse.down()
    await page.mouse.move(progressX - 16, progressCenterY, { steps: 10 })
    await page.mouse.up()

    const mediaProgressUnder = await page.evaluate(() => {
      const media = document.querySelector('#med-video') as Media

      return {
        scale: parseFloat(media.style.getPropertyValue('--med-progress-bar')),
        currentTime: Math.round(media.media?.currentTime as number),
        timeText: media.time?.textContent,
        ariaMin: media.progress?.ariaValueMin,
        ariaMax: media.progress?.ariaValueMax,
        ariaNow: media.progress?.ariaValueNow,
        ariaText: media.progress?.ariaValueText
      }
    })

    await page.mouse.move(progressCenterX, progressCenterY)
    await page.mouse.down()
    await page.mouse.move(progressX + progressWidth + 16, progressCenterY)
    await page.mouse.up()

    const mediaProgressOver = await page.evaluate(() => {
      const media = document.querySelector('#med-video') as Media

      return {
        scale: parseFloat(media.style.getPropertyValue('--med-progress-bar')),
        currentTime: Math.round(media.media?.currentTime as number),
        timeText: media.time?.textContent,
        ariaMin: media.progress?.ariaValueMin,
        ariaMax: media.progress?.ariaValueMax,
        ariaNow: media.progress?.ariaValueNow,
        ariaText: media.progress?.ariaValueText
      }
    })

    expect(mediaProgressUnder.scale).toBe(0)
    expect(mediaProgressUnder.currentTime).toBe(0)
    expect(mediaProgressUnder.timeText).toBe('0:00')
    expect(mediaProgressUnder.ariaMin).toBe('0')
    expect(mediaProgressUnder.ariaMax).toBe('5')
    expect(mediaProgressUnder.ariaNow).toBe('0')
    expect(mediaProgressUnder.ariaText).toBe('0 seconds / 5 seconds')
    expect(mediaProgressOver.scale).toBe(1)
    expect(mediaProgressOver.currentTime).toBe(5)
    expect(mediaProgressOver.timeText).toBe('0:05')
    expect(mediaProgressOver.ariaMin).toBe('0')
    expect(mediaProgressOver.ariaMax).toBe('5')
    expect(mediaProgressOver.ariaNow).toBe('5')
    expect(mediaProgressOver.ariaText).toBe('5 seconds / 5 seconds')
  })

  test('should update time and video frame on progress arrow key', async ({ page }) => {
    const getTime = () => {
      const media = document.querySelector('#med-video') as Media

      return {
        currentTime: Math.round(media.media?.currentTime as number),
        timeText: media.time?.textContent,
        ariaMin: media.progress?.ariaValueMin,
        ariaMax: media.progress?.ariaValueMax,
        ariaNow: media.progress?.ariaValueNow,
        ariaText: media.progress?.ariaValueText
      }
    }

    await page.waitForFunction(() => { // Wait for load
      const media = document.querySelector('#med-video') as Media
      media.load()
      return media.loaded
    })

    await page.getByTestId('med-video-progress').focus()
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowUp')

    const mediaProgressRight = await page.evaluate(getTime)

    await page.keyboard.press('ArrowLeft')
    await page.keyboard.press('ArrowDown')

    const mediaProgressLeft = await page.evaluate(getTime)

    await page.keyboard.press('End')

    const mediaProgressEnd = await page.evaluate(getTime)

    await page.keyboard.press('ArrowRight')

    const mediaProgressOver = await page.evaluate(getTime)

    await page.keyboard.press('Home')

    const mediaProgressHome = await page.evaluate(getTime)

    await page.keyboard.press('ArrowLeft')

    const mediaProgressUnder = await page.evaluate(getTime)

    expect(mediaProgressRight.currentTime).toBe(2)
    expect(mediaProgressRight.timeText).toBe('0:02')
    expect(mediaProgressRight.ariaMin).toBe('0')
    expect(mediaProgressRight.ariaMax).toBe('5')
    expect(mediaProgressRight.ariaNow).toBe('2')
    expect(mediaProgressRight.ariaText).toBe('2 seconds / 5 seconds')
    expect(mediaProgressLeft.currentTime).toBe(0)
    expect(mediaProgressLeft.timeText).toBe('0:00')
    expect(mediaProgressLeft.ariaMin).toBe('0')
    expect(mediaProgressLeft.ariaMax).toBe('5')
    expect(mediaProgressLeft.ariaNow).toBe('0')
    expect(mediaProgressLeft.ariaText).toBe('0 seconds / 5 seconds')
    expect(mediaProgressEnd.currentTime).toBe(5)
    expect(mediaProgressEnd.timeText).toBe('0:05')
    expect(mediaProgressEnd.ariaMin).toBe('0')
    expect(mediaProgressEnd.ariaMax).toBe('5')
    expect(mediaProgressEnd.ariaNow).toBe('5')
    expect(mediaProgressEnd.ariaText).toBe('5 seconds / 5 seconds')
    expect(mediaProgressOver.currentTime).toBe(5)
    expect(mediaProgressOver.timeText).toBe('0:05')
    expect(mediaProgressOver.ariaMin).toBe('0')
    expect(mediaProgressOver.ariaMax).toBe('5')
    expect(mediaProgressOver.ariaNow).toBe('5')
    expect(mediaProgressOver.ariaText).toBe('5 seconds / 5 seconds')
    expect(mediaProgressHome.currentTime).toBe(0)
    expect(mediaProgressHome.timeText).toBe('0:00')
    expect(mediaProgressHome.ariaMin).toBe('0')
    expect(mediaProgressHome.ariaMax).toBe('5')
    expect(mediaProgressHome.ariaNow).toBe('0')
    expect(mediaProgressHome.ariaText).toBe('0 seconds / 5 seconds')
    expect(mediaProgressUnder.currentTime).toBe(0)
    expect(mediaProgressUnder.timeText).toBe('0:00')
    expect(mediaProgressUnder.ariaMin).toBe('0')
    expect(mediaProgressUnder.ariaMax).toBe('5')
    expect(mediaProgressUnder.ariaNow).toBe('0')
    expect(mediaProgressUnder.ariaText).toBe('0 seconds / 5 seconds')
  })

  test('should resize video progress bar on viewport width change', async ({ page }) => {
    await page.evaluate(async () => { // Resize flag
      const { onResize } = await import('../../../actions/actionResize.js')

      onResize(() => {
        window.testMediaResize = true
      })
    })

    const progress = page.getByTestId('med-video-progress')
    const viewport = page.viewportSize() as { width: number, height: number }

    await progress.click()

    await page.setViewportSize({
      width: 600,
      height: viewport.height
    })

    await page.waitForFunction(() => { // Wait for resize
      return window.testMediaResize
    })

    const newProgressX = await page.evaluate(() => {
      const media = document.querySelector('#med-video') as Media
      return parseInt(media.style.getPropertyValue('--med-progress-scrub'), 10)
    })

    const progressBox = await progress.boundingBox()

    expect(newProgressX).toBe(progressBox?.width as number / 2)
  })

  test('should not resize video progress bar on viewport height change', async ({ page }) => {
    await page.evaluate(async () => { // Resize flag
      const { onResize } = await import('../../../actions/actionResize.js')

      onResize(() => {
        window.testMediaResize = true
      })
    })

    const getProgressX = () => {
      const media = document.querySelector('#med-video') as Media
      return parseInt(media.style.getPropertyValue('--med-progress-scrub'), 10)
    }

    const progress = page.getByTestId('med-video-progress')
    const viewport = page.viewportSize() as { width: number, height: number }

    await progress.click()

    const oldProgressX = await page.evaluate(getProgressX)

    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height - 100
    })

    await page.waitForFunction(() => { // Wait for resize
      return window.testMediaResize
    })

    const newProgressX = await page.evaluate(getProgressX)

    expect(newProgressX).toBe(oldProgressX)
  })

  /* Test video error */

  test('should display error on video play if media does not exist', async ({ page }) => {
    await page.evaluate(() => {
      const media = document.querySelector('#med-video') as Media

      media.media?.remove()
      media.media = null
    })

    await page.getByTestId('med-video-toggle').click()

    const error = page.getByTestId('med-error')

    await expect(error).toBeVisible()
    await expect(error).toBeFocused()
  })

  test('should display error on video toggle if url does not exist', async ({ page }) => {
    await page.evaluate(() => {
      const media = document.querySelector('#med-video') as Media
      media.url = ''
    })

    await page.getByTestId('med-video-toggle').click()

    const error = page.getByTestId('med-error')

    await expect(error).toBeVisible()
    await expect(error).toBeFocused()
  })

  test('should display and hide error on video toggle for empty and valid url', async ({ page }) => {
    await page.evaluate(() => {
      const media = document.querySelector('#med-video') as Media
      media.url = ''
    })

    const error = page.getByTestId('med-error')

    await page.getByTestId('med-video-toggle').click()
    await expect(error).toBeVisible()

    await page.evaluate(() => {
      const media = document.querySelector('#med-video') as Media
      media.url = '/static/video/test.mp4'
    })

    await page.getByTestId('med-video-toggle').click()
    await expect(error).not.toBeVisible()
  })

  test('should display 0:00 time if video duration is not a number', async ({ page }) => {
    await page.evaluate(() => {
      const media = document.querySelector('#med-video') as Media

      media.url = '/static/video/test.mp4'

      Object.defineProperty(media.media, 'duration', {
        get: () => NaN
      })

      media.load()
    })

    await page.waitForFunction(() => { // Wait for load
      const media = document.querySelector('#med-video') as Media
      return media.loaded
    })

    const mediaTimeText = await page.evaluate(() => {
      const media = document.querySelector('#med-video') as Media
      return media.time?.textContent
    })

    expect(mediaTimeText).toBe('0:00')
  })

  /* Test audio controls */

  test('should play audio on play button click', async ({ page }) => {
    await page.getByTestId('med-audio-play').click()
    await page.waitForFunction(() => { // Wait for playing
      return window.testMediaToggle.filter(id => id === 'med-audio').length === 1
    })

    const mediaProps = await page.evaluate(() => {
      const media = document.querySelector('#med-audio') as Media

      return {
        playing: media.playing && media.hasAttribute('playing'),
        labels: media.controls.map(control => (control.ariaLabel || control.textContent).trim())
      }
    })

    expect(mediaProps.playing).toBe(true)
    expect(mediaProps.labels).toStrictEqual([
      'Play',
      'Pause',
      'Pause'
    ])
  })

  test('should pause audio on pause button click', async ({ page }) => {
    await page.getByTestId('med-audio-play').click()
    await page.waitForFunction(() => { // Wait for playing
      return window.testMediaToggle.filter(id => id === 'med-audio').length === 1
    })

    await page.getByTestId('med-audio-pause').click()
    await page.waitForFunction(() => { // Wait for pause
      return window.testMediaToggle.filter(id => id === 'med-audio').length === 2
    })

    const mediaProps = await page.evaluate(() => {
      const media = document.querySelector('#med-audio') as Media

      return {
        paused: !media.playing && !media.hasAttribute('playing'),
        labels: media.controls.map(control => (control.ariaLabel || control.textContent).trim())
      }
    })

    expect(mediaProps.paused).toBe(true)
    expect(mediaProps.labels).toStrictEqual(['Play', 'Pause', 'Play'])
  })

  test('should play and pause audio on toggle button click', async ({ page }) => {
    await page.getByTestId('med-audio-toggle').click()
    await page.waitForFunction(() => { // Wait for playing
      return window.testMediaToggle.filter(id => id === 'med-audio').length === 1
    })

    const mediaPlayProps = await page.evaluate(() => {
      const media = document.querySelector('#med-audio') as Media

      return {
        playing: media.playing && media.hasAttribute('playing'),
        labels: media.controls.map(control => (control.ariaLabel || control.textContent).trim())
      }
    })

    await page.getByTestId('med-audio-toggle').click()
    await page.waitForFunction(() => { // Wait for play
      return window.testMediaToggle.filter(id => id === 'med-audio').length === 2
    })

    const mediaPauseProps = await page.evaluate(() => {
      const media = document.querySelector('#med-audio') as Media

      return {
        paused: !media.playing && !media.hasAttribute('playing'),
        labels: media.controls.map(control => (control.ariaLabel || control.textContent).trim())
      }
    })

    expect(mediaPlayProps.playing).toBe(true)
    expect(mediaPlayProps.labels).toStrictEqual(['Play', 'Pause', 'Pause'])
    expect(mediaPauseProps.paused).toBe(true)
    expect(mediaPauseProps.labels).toStrictEqual(['Play', 'Pause', 'Play'])
  })

  /* Test audio keyboard events */

  test('should not pause or play audio on space key if not active', async ({ page }) => {
    await page.keyboard.press('Space')

    const mediaPlaying = await page.evaluate(() => {
      const media = document.querySelector('#med-audio') as Media
      return media.playing && media.hasAttribute('playing')
    })

    expect(mediaPlaying).toBe(false)
  })

  test('should pause and play audio on space key if active', async ({ page }) => {
    await page.evaluate(async () => {
      const { addFilter } = await import('../../../filters/filters.js')

      addFilter('media:active:med-audio', () => true)
    })

    await page.keyboard.press('Space')
    await page.waitForFunction(() => { // Wait for play
      return window.testMediaToggle.filter(id => id === 'med-audio').length === 1
    })

    const mediaPlayProps = await page.evaluate(() => {
      const media = document.querySelector('#med-audio') as Media

      return {
        playing: media.playing && media.hasAttribute('playing'),
        labels: media.controls.map(control => (control.ariaLabel || control.textContent).trim())
      }
    })

    await page.keyboard.press('Space')
    await page.waitForFunction(() => { // Wait for pause
      return window.testMediaToggle.filter(id => id === 'med-audio').length === 2
    })

    const mediaPauseProps = await page.evaluate(() => {
      const media = document.querySelector('#med-audio') as Media

      return {
        paused: !media.playing && !media.hasAttribute('playing'),
        labels: media.controls.map(control => (control.ariaLabel || control.textContent).trim())
      }
    })

    expect(mediaPlayProps.playing).toBe(true)
    expect(mediaPlayProps.labels).toStrictEqual(['Play', 'Pause', 'Pause'])
    expect(mediaPauseProps.paused).toBe(true)
    expect(mediaPauseProps.labels).toStrictEqual(['Play', 'Pause', 'Play'])
  })

  /* Test audio progress */

  test('should load audio on progress click', async ({ page }) => {
    await page.getByTestId('med-audio-progress').click()
    await page.waitForFunction(() => { // Wait for load
      const media = document.querySelector('#med-audio') as Media
      return media.loaded
    })

    const mediaProps = await page.evaluate(() => {
      const media = document.querySelector('#med-audio') as Media

      return {
        readyState: media.media?.readyState,
        durationText: media.duration?.textContent
      }
    })

    expect(mediaProps.readyState).toBeGreaterThan(0)
    expect(mediaProps.durationText).toBe('0:19')
  })

  test('should update time and audio frame on progress drag', async ({ page }) => {
    const progress = page.getByTestId('med-audio-progress')
    const progressBox = await progress.boundingBox()
    const progressWidth = progressBox?.width as number
    const progressHeight = progressBox?.height as number

    await progress.dragTo(progress, {
      sourcePosition: {
        x: 0,
        y: progressHeight / 2
      },
      targetPosition: {
        x: progressWidth * 0.6,
        y: progressHeight / 2
      },
      steps: 10
    })

    await page.waitForFunction(() => { // Wait for load
      const media = document.querySelector('#med-audio') as Media
      return media.loaded
    })

    const mediaProgress = await page.evaluate(() => {
      const media = document.querySelector('#med-audio') as Media

      return {
        scale: parseFloat(media.style.getPropertyValue('--med-progress-bar')).toFixed(1),
        currentTime: Math.round(media.media?.currentTime as number),
        timeText: media.time?.textContent,
        ariaMin: media.progress?.ariaValueMin,
        ariaMax: media.progress?.ariaValueMax,
        ariaNow: media.progress?.ariaValueNow,
        ariaText: media.progress?.ariaValueText
      }
    })

    expect(mediaProgress.scale).toBe('0.6')
    expect(mediaProgress.currentTime).toBe(12)
    expect(mediaProgress.timeText).toBe('0:12')
    expect(mediaProgress.ariaMin).toBe('0')
    expect(mediaProgress.ariaMax).toBe('19')
    expect(mediaProgress.ariaNow).toBe('12')
    expect(mediaProgress.ariaText).toBe('12 seconds / 19 seconds')
  })

  // test('should not update audio current time during progress drag', async ({ page }) => {})

  test('should update time and audio frame on progress over and under drag', async ({ page }) => {
    const progress = page.getByTestId('med-audio-progress')
    await progress.click()

    await page.waitForFunction(() => { // Wait for load
      const media = document.querySelector('#med-audio') as Media
      return media.loaded
    })

    const progressBox = await progress.boundingBox()
    const progressX = progressBox?.x as number
    const progressY = progressBox?.y as number
    const progressWidth = progressBox?.width as number
    const progressHeight = progressBox?.height as number
    const progressCenterX = progressX + progressWidth / 2
    const progressCenterY = progressY + progressHeight / 2

    await page.mouse.move(progressCenterX, progressCenterY)
    await page.mouse.down()
    await page.mouse.move(progressX - 16, progressCenterY, { steps: 10 })
    await page.mouse.up()

    const mediaProgressUnder = await page.evaluate(() => {
      const media = document.querySelector('#med-audio') as Media

      return {
        scale: parseFloat(media.style.getPropertyValue('--med-progress-bar')),
        currentTime: Math.round(media.media?.currentTime as number),
        timeText: media.time?.textContent,
        ariaMin: media.progress?.ariaValueMin,
        ariaMax: media.progress?.ariaValueMax,
        ariaNow: media.progress?.ariaValueNow,
        ariaText: media.progress?.ariaValueText
      }
    })

    await page.mouse.move(progressCenterX, progressCenterY)
    await page.mouse.down()
    await page.mouse.move(progressX + progressWidth + 16, progressCenterY)
    await page.mouse.up()

    const mediaProgressOver = await page.evaluate(() => {
      const media = document.querySelector('#med-audio') as Media

      return {
        scale: parseFloat(media.style.getPropertyValue('--med-progress-bar')),
        currentTime: Math.round(media.media?.currentTime as number),
        timeText: media.time?.textContent,
        ariaMin: media.progress?.ariaValueMin,
        ariaMax: media.progress?.ariaValueMax,
        ariaNow: media.progress?.ariaValueNow,
        ariaText: media.progress?.ariaValueText
      }
    })

    expect(mediaProgressUnder.scale).toBe(0)
    expect(mediaProgressUnder.currentTime).toBe(0)
    expect(mediaProgressUnder.timeText).toBe('0:00')
    expect(mediaProgressUnder.ariaMin).toBe('0')
    expect(mediaProgressUnder.ariaMax).toBe('19')
    expect(mediaProgressUnder.ariaNow).toBe('0')
    expect(mediaProgressUnder.ariaText).toBe('0 seconds / 19 seconds')
    expect(mediaProgressOver.scale).toBe(1)
    expect(mediaProgressOver.currentTime).toBe(19)
    expect(mediaProgressOver.timeText).toBe('0:19')
    expect(mediaProgressOver.ariaMin).toBe('0')
    expect(mediaProgressOver.ariaMax).toBe('19')
    expect(mediaProgressOver.ariaNow).toBe('19')
    expect(mediaProgressOver.ariaText).toBe('19 seconds / 19 seconds')
  })

  test('should update time and audio frame on progress arrow key', async ({ page }) => {
    const getTime = () => {
      const media = document.querySelector('#med-audio') as Media

      return {
        currentTime: Math.round(media.media?.currentTime as number),
        timeText: media.time?.textContent,
        ariaMin: media.progress?.ariaValueMin,
        ariaMax: media.progress?.ariaValueMax,
        ariaNow: media.progress?.ariaValueNow,
        ariaText: media.progress?.ariaValueText
      }
    }

    await page.waitForFunction(() => { // Wait for load
      const media = document.querySelector('#med-audio') as Media
      media.load()
      return media.loaded
    })

    await page.getByTestId('med-audio-progress').focus()
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowUp')

    const mediaProgressRight = await page.evaluate(getTime)

    await page.keyboard.press('ArrowLeft')
    await page.keyboard.press('ArrowDown')

    const mediaProgressLeft = await page.evaluate(getTime)

    await page.keyboard.press('End')

    const mediaProgressEnd = await page.evaluate(getTime)

    await page.keyboard.press('ArrowRight')

    const mediaProgressOver = await page.evaluate(getTime)

    await page.keyboard.press('Home')

    const mediaProgressHome = await page.evaluate(getTime)

    await page.keyboard.press('ArrowLeft')

    const mediaProgressUnder = await page.evaluate(getTime)

    expect(mediaProgressRight.currentTime).toBe(2)
    expect(mediaProgressRight.timeText).toBe('0:02')
    expect(mediaProgressRight.ariaMin).toBe('0')
    expect(mediaProgressRight.ariaMax).toBe('19')
    expect(mediaProgressRight.ariaNow).toBe('2')
    expect(mediaProgressRight.ariaText).toBe('2 seconds / 19 seconds')
    expect(mediaProgressLeft.currentTime).toBe(0)
    expect(mediaProgressLeft.timeText).toBe('0:00')
    expect(mediaProgressLeft.ariaMin).toBe('0')
    expect(mediaProgressLeft.ariaMax).toBe('19')
    expect(mediaProgressLeft.ariaNow).toBe('0')
    expect(mediaProgressLeft.ariaText).toBe('0 seconds / 19 seconds')
    expect(mediaProgressEnd.currentTime).toBe(19)
    expect(mediaProgressEnd.timeText).toBe('0:19')
    expect(mediaProgressEnd.ariaMin).toBe('0')
    expect(mediaProgressEnd.ariaMax).toBe('19')
    expect(mediaProgressEnd.ariaNow).toBe('19')
    expect(mediaProgressEnd.ariaText).toBe('19 seconds / 19 seconds')
    expect(mediaProgressOver.currentTime).toBe(19)
    expect(mediaProgressOver.timeText).toBe('0:19')
    expect(mediaProgressOver.ariaMin).toBe('0')
    expect(mediaProgressOver.ariaMax).toBe('19')
    expect(mediaProgressOver.ariaNow).toBe('19')
    expect(mediaProgressOver.ariaText).toBe('19 seconds / 19 seconds')
    expect(mediaProgressHome.currentTime).toBe(0)
    expect(mediaProgressHome.timeText).toBe('0:00')
    expect(mediaProgressHome.ariaMin).toBe('0')
    expect(mediaProgressHome.ariaMax).toBe('19')
    expect(mediaProgressHome.ariaNow).toBe('0')
    expect(mediaProgressHome.ariaText).toBe('0 seconds / 19 seconds')
    expect(mediaProgressUnder.currentTime).toBe(0)
    expect(mediaProgressUnder.timeText).toBe('0:00')
    expect(mediaProgressUnder.ariaMin).toBe('0')
    expect(mediaProgressUnder.ariaMax).toBe('19')
    expect(mediaProgressUnder.ariaNow).toBe('0')
    expect(mediaProgressUnder.ariaText).toBe('0 seconds / 19 seconds')
  })

  test('should resize audio progress bar on viewport width change', async ({ page }) => {
    await page.evaluate(async () => { // Resize flag
      const { onResize } = await import('../../../actions/actionResize.js')

      onResize(() => {
        window.testMediaResize = true
      })
    })

    const progress = page.getByTestId('med-audio-progress')
    const viewport = page.viewportSize() as { width: number, height: number }

    await progress.click()

    await page.setViewportSize({
      width: 600,
      height: viewport.height
    })

    await page.waitForFunction(() => { // Wait for resize
      return window.testMediaResize
    })

    const newProgressX = await page.evaluate(() => {
      const media = document.querySelector('#med-audio') as Media
      return parseInt(media.style.getPropertyValue('--med-progress-scrub'), 10)
    })

    const progressBox = await progress.boundingBox()

    expect(newProgressX).toBe(progressBox?.width as number / 2)
  })

  test('should not resize audio progress bar on viewport height change', async ({ page }) => {
    await page.evaluate(async () => { // Resize flag
      const { onResize } = await import('../../../actions/actionResize.js')

      onResize(() => {
        window.testMediaResize = true
      })
    })

    const getProgressX = () => {
      const media = document.querySelector('#med-audio') as Media
      return parseInt(media.style.getPropertyValue('--med-progress-scrub'), 10)
    }

    const progress = page.getByTestId('med-audio-progress')
    const viewport = page.viewportSize() as { width: number, height: number }

    await progress.click()

    const oldProgressX = await page.evaluate(getProgressX)

    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height - 100
    })

    await page.waitForFunction(() => { // Wait for resize
      return window.testMediaResize
    })

    const newProgressX = await page.evaluate(getProgressX)

    expect(newProgressX).toBe(oldProgressX)
  })

  /* Test audio error */

  test('should display error on audio play if media does not exist', async ({ page }) => {
    await page.evaluate(() => {
      const media = document.querySelector('#med-audio') as Media

      media.media?.remove()
      media.media = null
    })

    await page.getByTestId('med-audio-toggle').click()

    const error = page.getByTestId('med-error')

    await expect(error).toBeVisible()
    await expect(error).toBeFocused()
  })

  test('should display error on audio toggle if url does not exist', async ({ page }) => {
    await page.evaluate(() => {
      const media = document.querySelector('#med-audio') as Media
      media.url = ''
    })

    await page.getByTestId('med-audio-toggle').click()

    const error = page.getByTestId('med-error')

    await expect(error).toBeVisible()
    await expect(error).toBeFocused()
  })

  test('should display and hide error on audio toggle for empty and valid url', async ({ page }) => {
    await page.evaluate(() => {
      const media = document.querySelector('#med-audio') as Media
      media.url = ''
    })

    const error = page.getByTestId('med-error')

    await page.getByTestId('med-audio-toggle').click()
    await expect(error).toBeVisible()

    await page.evaluate(() => {
      const media = document.querySelector('#med-audio') as Media
      media.url = '/static/audio/test.mp3'
    })

    await page.getByTestId('med-audio-toggle').click()
    await expect(error).not.toBeVisible()
  })

  test('should display 0:00 time if audio duration is not a number', async ({ page }) => {
    await page.evaluate(() => {
      const media = document.querySelector('#med-audio') as Media

      media.url = '/static/audio/test.mp3'

      Object.defineProperty(media.media, 'duration', {
        get: () => NaN
      })

      media.load()
    })

    await page.waitForFunction(() => { // Wait for load
      const media = document.querySelector('#med-audio') as Media
      return media.loaded
    })

    const mediaTimeText = await page.evaluate(() => {
      const media = document.querySelector('#med-audio') as Media
      return media.time?.textContent
    })

    expect(mediaTimeText).toBe('0:00')
  })

  /* Test clean up */

  test('should remove video instance and event listeners', async ({ page }) => {
    const mediaProps = await page.evaluate(async () => {
      const { Media } = await import('../Media.js')
      const mediaVideo = document.querySelector('#med-video') as Media

      mediaVideo.remove()

      await Promise.resolve()

      mediaVideo.media?.click()

      return {
        init: mediaVideo.init,
        playing: mediaVideo.playing,
        media: mediaVideo.media,
        progress: mediaVideo.progress,
        time: mediaVideo.time,
        duration: mediaVideo.duration,
        controlsCount: mediaVideo.controls.length,
        clonesSize: mediaVideo.clones.size,
        templatesSize: Media.templates.size
      }
    })

    expect(mediaProps.init).toStrictEqual(false)
    expect(mediaProps.playing).toStrictEqual(false)
    expect(mediaProps.media).toStrictEqual(null)
    expect(mediaProps.progress).toStrictEqual(null)
    expect(mediaProps.time).toStrictEqual(null)
    expect(mediaProps.duration).toStrictEqual(null)
    expect(mediaProps.controlsCount).toStrictEqual(0)
    expect(mediaProps.clonesSize).toStrictEqual(0)
    expect(mediaProps.templatesSize).toStrictEqual(2)
  })

  test('should remove all instances and templates', async ({ page }) => {
    const mediaProps = await page.evaluate(async () => {
      const { Media } = await import('../Media.js')
      const media: Media[] = Array.from(document.querySelectorAll('frm-media'))

      media.forEach(med => {
        med.remove()
      })

      await Promise.resolve()

      return {
        init: media.map(med => med.init),
        playing: media.map(med => med.playing),
        media: media.map(med => med.media),
        progress: media.map(med => med.progress),
        time: media.map(med => med.time),
        duration: media.map(med => med.duration),
        controlsCount: media.map(med => med.controls.length),
        clonesSize: media.map(med => med.clones.size),
        templatesSize: Media.templates.size
      }
    })

    expect(mediaProps.init).toStrictEqual([false, false, false, false, false, false])
    expect(mediaProps.playing).toStrictEqual([false, false, false, false, false, false])
    expect(mediaProps.media).toStrictEqual([null, null, null, null, null, null])
    expect(mediaProps.progress).toStrictEqual([null, null, null, null, null, null])
    expect(mediaProps.time).toStrictEqual([null, null, null, null, null, null])
    expect(mediaProps.duration).toStrictEqual([null, null, null, null, null, null])
    expect(mediaProps.controlsCount).toStrictEqual([0, 0, 0, 0, 0, 0])
    expect(mediaProps.clonesSize).toStrictEqual([0, 0, 0, 0, 0, 0])
    expect(mediaProps.templatesSize).toStrictEqual(0)
  })
})
