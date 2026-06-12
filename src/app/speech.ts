import type { Command, Defense, FootworkMove, Punch } from "./rounds";
import { isPunch } from "./rounds";

const PUNCH_WORD: Record<Punch, string> = {
  jab: "one",
  cross: "two",
  hookL: "three",
  hookR: "four",
};

const DEFENSE_WORD: Record<Defense, string> = {
  pullBack: "pull",
  slipLeft: "slip left",
  slipRight: "slip right",
  roll: "roll",
  block: "block",
};

const MOVE_WORD: Record<FootworkMove, string> = {
  stepLeft: "step left",
  stepRight: "step right",
  stepForward: "step forward",
  stepBack: "step back",
  pivotLeft: "pivot left",
  pivotRight: "pivot right",
};

export function commandSpeech(command: Command): string {
  if (command.kind === "footwork") return MOVE_WORD[command.move];
  const words = command.calls.map((call) =>
    isPunch(call) ? PUNCH_WORD[call] : DEFENSE_WORD[call],
  );
  // Commas make the TTS pause so the defense call reads as its own beat.
  const hasDefense = command.calls.some((call) => !isPunch(call));
  return words.join(hasDefense ? ", " : " ");
}

// iOS blocks speech that isn't triggered by a user gesture. Speaking a
// silent utterance inside the tap that starts a round unlocks the rest.
export function unlockSpeech() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(" ");
  utterance.volume = 0;
  window.speechSynthesis.speak(utterance);
}

export function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const synth = window.speechSynthesis;
  // Unconditional cancel() right before speak() drops utterances on iOS.
  if (synth.speaking || synth.pending) synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.2;
  synth.speak(utterance);
  // iOS sometimes leaves the queue paused after cancel().
  synth.resume();
}

export function cancelSpeech() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
}
