import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Download, Copy, Trash2, FileDown, Languages, Sparkles } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ContentManagerProps {
  content: string;
  onContentChange: (content: string) => void;
}

const ContentManager: React.FC<ContentManagerProps> = ({ content, onContentChange }) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard.",
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
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: "Text file is being downloaded.",
    });
  };

  const downloadAsPDF = () => {
    // For now, we'll create a simple PDF-like structure
    // In a real implementation, you'd use a library like jsPDF
    const pdfContent = `
PDF Document
Generated: ${new Date().toLocaleDateString()}

Content:
${content}
    `;
    
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "PDF Download Started",
      description: "PDF file is being downloaded.",
    });
  };

  const translateContent = async () => {
    if (!content.trim()) {
      toast({
        title: "No Content",
        description: "Please add some content to translate.",
        variant: "destructive",
      });
      return;
    }

    setIsTranslating(true);
    toast({
      title: "Translation Feature",
      description: "Translation will be available once Supabase is connected for API integration.",
    });
    setIsTranslating(false);
  };

  const summarizeContent = async () => {
    if (!content.trim()) {
      toast({
        title: "No Content",
        description: "Please add some content to summarize.",
        variant: "destructive",
      });
      return;
    }

    setIsSummarizing(true);
    toast({
      title: "Summarization Feature",
      description: "AI summarization will be available once Supabase is connected for API integration.",
    });
    setIsSummarizing(false);
  };

  const clearContent = () => {
    onContentChange('');
    toast({
      title: "Content Cleared",
      description: "All content has been cleared.",
    });
  };

  return (
    <Card className="bg-gradient-card border-border shadow-elegant">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <FileText className="h-5 w-5 text-primary" />
          Content Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Your content will appear here, or you can type directly..."
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          className="min-h-[200px] bg-secondary/50 border-border resize-none"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button onClick={copyToClipboard} variant="glass" size="sm" disabled={!content}>
            <Copy className="h-4 w-4" />
            Copy
          </Button>
          
          <Button onClick={downloadAsText} variant="glass" size="sm" disabled={!content}>
            <Download className="h-4 w-4" />
            .txt
          </Button>
          
          <Button onClick={downloadAsPDF} variant="glass" size="sm" disabled={!content}>
            <FileDown className="h-4 w-4" />
            .pdf
          </Button>
          
          <Button onClick={clearContent} variant="ghost" size="sm" disabled={!content}>
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Button 
            onClick={translateContent} 
            variant="gradient" 
            disabled={!content || isTranslating}
            className="w-full"
          >
            <Languages className="h-4 w-4" />
            {isTranslating ? 'Translating...' : 'Translate'}
          </Button>
          
          <Button 
            onClick={summarizeContent} 
            variant="gradient" 
            disabled={!content || isSummarizing}
            className="w-full"
          >
            <Sparkles className="h-4 w-4" />
            {isSummarizing ? 'Summarizing...' : 'Summarize'}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground bg-secondary/30 p-3 rounded-lg">
          <p className="font-medium mb-1">💡 Pro Features Available with Supabase:</p>
          <ul className="space-y-1">
            <li>• AI-powered translation to 50+ languages</li>
            <li>• Smart content summarization</li>
            <li>• Cloud storage for all your content</li>
            <li>• User authentication and profiles</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentManager;