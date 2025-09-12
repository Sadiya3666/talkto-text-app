import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Play, Pause, Square, Volume2, Settings } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface TextToSpeechProps {
  initialText?: string;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({ initialText = '' }) => {
  const [text, setText] = useState(initialText);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    setText(initialText);
  }, [initialText]);

  React.useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !voice) {
        const defaultVoice = availableVoices.find(v => v.default) || availableVoices[0];
        setVoice(defaultVoice);
      }
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [voice]);

  const speak = () => {
    if (!text.trim()) {
      toast({
        title: "No Text",
        description: "Please enter some text to speak.",
        variant: "destructive",
      });
      return;
    }

    if (isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    if (isPlaying) {
      speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      toast({
        title: "Speaking Started",
        description: "Text-to-speech is now playing.",
      });
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = (error) => {
      setIsPlaying(false);
      setIsPaused(false);
      toast({
        title: "Speech Error",
        description: `Error: ${error.error}`,
        variant: "destructive",
      });
    };

    speechSynthesis.speak(utterance);
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    toast({
      title: "Stopped",
      description: "Text-to-speech has been stopped.",
    });
  };

  const englishVoices = voices.filter(v => v.lang.startsWith('en'));
  const otherVoices = voices.filter(v => !v.lang.startsWith('en'));
  const sortedVoices = [...englishVoices, ...otherVoices];

  return (
    <Card className="bg-gradient-card border-border shadow-elegant">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Volume2 className="h-5 w-5 text-primary" />
          Text to Speech
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Enter text to convert to speech..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[120px] bg-secondary/50 border-border resize-none"
        />

        <div className="flex items-center gap-4">
          <Button
            onClick={speak}
            variant={isPlaying && !isPaused ? "destructive" : "hero"}
            size="lg"
            className="flex-1"
          >
            {isPlaying && !isPaused ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isPaused ? 'Resume' : isPlaying ? 'Pause' : 'Speak'}
          </Button>
          
          <Button
            onClick={stop}
            variant="ghost"
            size="lg"
            disabled={!isPlaying && !isPaused}
          >
            <Square className="h-4 w-4" />
            Stop
          </Button>
        </div>

        <div className="space-y-3 p-4 bg-secondary/30 rounded-lg">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Voice Settings
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Voice</label>
              <select 
                value={voice?.name || ''} 
                onChange={(e) => {
                  const selectedVoice = voices.find(v => v.name === e.target.value);
                  setVoice(selectedVoice || null);
                }}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm"
              >
                {sortedVoices.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground block mb-1">Speed: {rate.toFixed(1)}</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground block mb-1">Pitch: {pitch.toFixed(1)}</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground block mb-1">Volume: {Math.round(volume * 100)}%</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TextToSpeech;