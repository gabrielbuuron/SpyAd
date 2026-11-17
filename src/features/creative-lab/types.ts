export type ImageFormat = 'jpeg' | 'png' | 'webp';
export type MetadataStatus = 'found' | 'not-found' | 'unsupported' | 'unverified';
export type MetadataId = 'exif' | 'gps' | 'xmp' | 'icc' | 'text' | 'comment' | 'orientation' | 'other';
export type MetadataField = { label: string; status: MetadataStatus; value: string };
export type Inspection = {
  format: ImageFormat; mime: string; bytes: number;
  width: number; height: number; displayWidth: number; displayHeight: number;
  color: string; alpha: 'present' | 'not-found' | 'unknown';
  orientation: number; patch: { offset: number; little: boolean; crc?: {start:number;end:number;offset:number} } | null;
  metadata: Record<MetadataId, MetadataField>;
  details: { label: string; value: string }[];
  warnings: string[]; decoded: boolean; sha256: string | null;
};
export type Comparison = { id: MetadataId; label: string; before: string; after: string; status: 'removed' | 'preserved' | 'not-found' | 'unverifiable' }[];
export type CleanResult = { bytes: Uint8Array; before: Inspection; after: Inspection; comparison: Comparison; outputName: string };
export type LabStage = 'idle' | 'reading' | 'inspecting' | 'decoding' | 'ready' | 'encoding' | 'verifying' | 'complete' | 'error';
