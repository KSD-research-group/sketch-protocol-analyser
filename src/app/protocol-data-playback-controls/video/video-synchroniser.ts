import { CorrelatedClock } from '../time-control/clocks/correlated-clock';

interface Seek {
  ts: number;
  pos: number;
  adjust: number;
}

// Adpated version of: https://raw.githubusercontent.com/2-IMMERSE/cloud-sync/master/examples/synchronisedvideo/src/js/VideoSynchroniser.js

export class VideoSynchroniser {
  private avgCorrection: number[] = [];
  private lastSeek?: Seek;
  private timeout: any;
  private thrashing = 0;

  constructor(
    private videoClock: CorrelatedClock,
    private videoElement: HTMLVideoElement
  ) {
    this.videoClock.change.subscribe(() => this.synchronise());
  }

  synchronise() {
    if (this.videoClock.effectiveSpeed === 0) {
      this.videoElement.pause();
      return;
    } else {
      this.videoElement.play();
    }

    const duration = this.videoElement.duration;

    // Kill update period timeout if there is one running
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    // Determine how out of sync the slave video player is w.r.t the master.
    var curTime = this.videoClock.seconds;

    // If video clock is out of duration of the video, do not sync.
    // This does not count for For (endless) Live streams or unset video src
    // duration equals infinity of NaN respectively.
    if (isFinite(duration) && curTime >= duration) {
      return;
    }

    // Compute different in playback position between the two videos.
    var delta = curTime - this.videoElement.currentTime;
    // logger.log("MediaClock [s]: " + curTime + ", Video: " + videoElement.currentTime + ", delta: " + delta);

    // A large delta will be corrected with a seek. Small delta with playbackRate changes.
    if (Math.abs(delta) > 1) {
      var now = performance.now();
      var adjust = 0;
      if (this.lastSeek !== undefined) {
        // Thrash detection - still out of sync despite an accurate seek.  This indicates
        // the system is under load and cannot seek fast enough to get back in sync.
        var elapsed = now - this.lastSeek.ts;
        if (elapsed < 1500) {
          // We seeked only a short time ago, we are thrashing
          ++this.thrashing;
          if (this.thrashing > 3) {
            console.log('VideoSynchroniser: Thrashing');
            //thrashing = 0;
          }
        } else {
          this.thrashing = 0;
        }

        var miss = this.lastSeek.pos + elapsed - curTime;
        adjust = this.lastSeek.adjust + miss;

        if (Math.abs(adjust) > 5) {
          adjust = 0;
        }
      }

      this.videoElement.playbackRate = 1;
      if (this.thrashing > 3) {
        // Don"t compound the thrashing behaviour by issuing more seeks.
        // Obviously, the video will remain out of sync / for longer.
        this.lastSeek = undefined;
        this.thrashing = 0;
      } else {
        // seeking is more efficient if the video element is paused.
        if (!this.videoElement.paused) {
          this.videoElement.pause();
        }

        // Factor a computed adjustment which represents the measured overhead of seek operations.
        this.videoElement.currentTime = curTime + adjust;
        this.videoElement.play();

        this.lastSeek = {
          ts: now, //performance.now(),
          pos: curTime,
          adjust: adjust,
        };
      }
      console.log('VideoSynchroniser: seek: ' + this.videoElement.currentTime);

      // Small difference --> change of playback rate
    } else {
      // Use average of last three deltas
      var samples = this.avgCorrection;
      samples.push(delta);

      var avg = 0;
      for (var j = 0; j < samples.length; j++) {
        avg += samples[j];
      }
      delta = avg / samples.length;
      if (samples.length >= 3) {
        // Use last 3 samples
        samples.splice(0, 1);
      }

      if (Math.abs(delta) > 1) {
        samples.length = 0;
        this.videoElement.playbackRate = this.clampRate(delta * 1.3, 1);
      } else if (Math.abs(delta) > 0.5) {
        samples.length = 0;
        this.videoElement.playbackRate = this.clampRate(delta * 0.75, 0.5);
      } else if (Math.abs(delta) > 0.1) {
        samples.length = 0;
        this.videoElement.playbackRate = this.clampRate(delta * 0.75, 0.4);
      } else if (Math.abs(delta) > 0.025) {
        samples.length = 0;
        this.videoElement.playbackRate = this.clampRate(delta * 0.6, 0.3);
      } else {
        this.videoElement.playbackRate = this.clampRate(delta * 0.07, 0.02);
      }

      // videoElement.playbackRate = videoClock.speed+(curTime-videoElement.currentTime)/750;

      // logger.log("playbackRate: " + videoElement.playbackRate + ",correction: " + delta);
    }

    // Resync on clock change or after timeout
    this.timeout = setTimeout(() => this.synchronise(), 750);
  }

  clampRate(rate: number, limit: number) {
    const clamp =
      Math.max(Math.min(1 + rate, 1 + limit), 1 - limit) *
      this.videoClock.effectiveSpeed;
    if (clamp || clamp === 0) {
      return clamp;
    } else {
      console.warn('Computed clamp rate', clamp);
      return 1;
    }
  }
}
