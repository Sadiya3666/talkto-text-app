import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Download, Copy, Trash2, Languages } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface SpeechToTextProps {
  onTranscriptChange?: (transcript: string) => void;
}

// Extend the Window interface to include speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const SpeechToText: React.FC<SpeechToTextProps> = ({ onTranscriptChange }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [language, setLanguage] = useState('en-US');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language;

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const fullTranscript = transcript + finalTranscript;
        setTranscript(fullTranscript);
        onTranscriptChange?.(fullTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Recognition Error",
          description: `Error: ${event.error}`,
          variant: "destructive",
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [language, transcript, onTranscriptChange, toast]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
      toast({
        title: "Recording Started",
        description: "Listening for speech...",
      });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      toast({
        title: "Recording Stopped",
        description: "Transcription complete.",
      });
    }
  };

  const clearTranscript = () => {
    setTranscript('');
    onTranscriptChange?.('');
    toast({
      title: "Transcript Cleared",
      description: "Text has been cleared.",
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      toast({
        title: "Copied!",
        description: "Transcript copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const downloadAsText = () => {
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: "Transcript file is being downloaded.",
    });
  };

  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'es-ES', name: 'Spanish' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
    { code: 'it-IT', name: 'Italian' },
    { code: 'pt-BR', name: 'Portuguese' },
    { code: 'zh-CN', name: 'Chinese' },
    { code: 'ja-JP', name: 'Japanese' },
    { code: 'ko-KR', name: 'Korean' },
  ];

  if (!isSupported) {
    return (
      <Card className="bg-gradient-card border-border shadow-elegant">
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">
            Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card border-border shadow-elegant">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Mic className="h-5 w-5 text-primary" />
          Speech to Text
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
          
          <Button
            onClick={isListening ? stopListening : startListening}
            variant={isListening ? "destructive" : "hero"}
            size="lg"
            className="flex-1"
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {isListening ? 'Stop Recording' : 'Start Recording'}
          </Button>
        </div>

        <div className="min-h-[200px] p-4 bg-secondary/50 border border-border rounded-lg">
          <p className="text-foreground whitespace-pre-wrap">
            {transcript || 'Your speech will appear here...'}
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button onClick={copyToClipboard} variant="glass" size="sm" disabled={!transcript}>
            <Copy className="h-4 w-4" />
            Copy
          </Button>
          <Button onClick={downloadAsText} variant="glass" size="sm" disabled={!transcript}>
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button onClick={clearTranscript} variant="ghost" size="sm" disabled={!transcript}>
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpeechToText;