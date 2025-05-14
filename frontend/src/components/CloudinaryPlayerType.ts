export interface CloudinaryPlayer {
  duration(): number;
  currentTime(time: number): void;
  dispose(): void;
}
