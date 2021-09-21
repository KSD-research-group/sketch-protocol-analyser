export interface AssetLocation {
  upload: string;
  download: string;
}

export interface SessionConfig {
  id: string;
  name: string;
  sketch: AssetLocation;
  tapTranscript: AssetLocation;
  retroTranscript: AssetLocation;
  labels: AssetLocation;
  tapVideo: AssetLocation;
  retroVideo: AssetLocation;
  correlations: AssetLocation;
  [key: string]: string | AssetLocation;
}
