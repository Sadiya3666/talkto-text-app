import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import SpeechToText from "@/components/SpeechToText";
import TextToSpeech from "@/components/TextToSpeech";
import ContentManager from "@/components/ContentManager";
import { Mic, Volume2, FileText, Sparkles, Globe, Shield } from 'lucide-react';

const Index = () => {
  const [sharedContent, setSharedContent] = useState('');

  const handleTranscriptChange = (transcript: string) => {
    setSharedContent(transcript);
  };

  const handleContentChange = (content: string) => {
    setSharedContent(content);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-8">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">AI-Powered Speech Platform</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-6">
            Transform Your Voice
            <br />
            Into Powerful Content
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Advanced speech-to-text and text-to-speech platform with AI summarization, 
            multi-language support, and seamless content management.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" className="text-lg px-8 py-6">
              Get Started Free
            </Button>
            <Button variant="glass" size="lg" className="text-lg px-8 py-6">
              Watch Demo
            </Button>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need for Voice & Text
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Professional-grade tools for transcription, speech synthesis, and content creation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-gradient-card p-6 rounded-xl border border-border shadow-card">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Mic className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Speech Recognition</h3>
              <p className="text-muted-foreground">
                Real-time speech-to-text with support for 10+ languages and high accuracy.
              </p>
            </div>

            <div className="bg-gradient-card p-6 rounded-xl border border-border shadow-card">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                <Volume2 className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Text to Speech</h3>
              <p className="text-muted-foreground">
                Natural-sounding voice synthesis with customizable speed, pitch, and voice selection.
              </p>
            </div>

            <div className="bg-gradient-card p-6 rounded-xl border border-border shadow-card">
              <div className="w-12 h-12 bg-primary-glow/20 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary-glow" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Content Export</h3>
              <p className="text-muted-foreground">
                Export your content as PDF, text files, or copy to clipboard instantly.
              </p>
            </div>

            <div className="bg-gradient-card p-6 rounded-xl border border-border shadow-card">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Multi-Language</h3>
              <p className="text-muted-foreground">
                Support for multiple languages with translation capabilities (coming soon).
              </p>
            </div>

            <div className="bg-gradient-card p-6 rounded-xl border border-border shadow-card">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">AI Summarization</h3>
              <p className="text-muted-foreground">
                Intelligent content summarization and key point extraction (coming soon).
              </p>
            </div>

            <div className="bg-gradient-card p-6 rounded-xl border border-border shadow-card">
              <div className="w-12 h-12 bg-primary-glow/20 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary-glow" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Secure Storage</h3>
              <p className="text-muted-foreground">
                Cloud storage with user authentication and data security (requires Supabase).
              </p>
            </div>
          </div>

          {/* App Interface */}
          <div className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-8">
              Try It Now - No Sign Up Required
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SpeechToText onTranscriptChange={handleTranscriptChange} />
              <TextToSpeech initialText={sharedContent} />
            </div>
            
            <ContentManager 
              content={sharedContent} 
              onContentChange={handleContentChange} 
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-card/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Unlock Full Power?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Connect to Supabase to enable user authentication, cloud storage, AI features, and more.
          </p>
          <Button variant="hero" size="lg" className="text-lg px-8 py-6">
            Connect Supabase Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
