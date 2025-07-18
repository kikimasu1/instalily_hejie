import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Download, X, FileText } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface Message {
  id: string;
  sessionId: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  productCards?: any[];
}

interface ChatDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  sessionId: string;
}

export default function ChatDownloadModal({ isOpen, onClose, messages, sessionId }: ChatDownloadModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin;

      // Add header
      pdf.setFontSize(16);
      pdf.setTextColor(59, 130, 246); // PartSelect blue
      pdf.text("PartSelect AI Chat History", margin, yPosition);
      yPosition += 10;

      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Session ID: ${sessionId}`, margin, yPosition);
      yPosition += 5;
      pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, yPosition);
      yPosition += 15;

      // Add messages
      pdf.setFontSize(11);
      
      for (const message of messages) {
        // Check if we need a new page
        if (yPosition > pageHeight - 50) {
          pdf.addPage();
          yPosition = margin;
        }

        // Message header
        pdf.setTextColor(0, 0, 0);
        pdf.setFont("helvetica", "bold");
        const sender = message.sender === 'user' ? 'You' : 'PartSelect AI';
        const timestamp = formatTimestamp(message.timestamp);
        pdf.text(`${sender} - ${timestamp}`, margin, yPosition);
        yPosition += 7;

        // Message content
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(50, 50, 50);
        
        // Split long text into multiple lines
        const lines = pdf.splitTextToSize(message.content, pageWidth - 2 * margin);
        
        for (const line of lines) {
          if (yPosition > pageHeight - 30) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.text(line, margin, yPosition);
          yPosition += 5;
        }

        // Add product cards if any
        if (message.productCards && message.productCards.length > 0) {
          yPosition += 3;
          pdf.setFont("helvetica", "italic");
          pdf.setTextColor(100, 100, 100);
          pdf.text(`[${message.productCards.length} product recommendation(s) included]`, margin, yPosition);
          yPosition += 5;
        }

        yPosition += 10; // Space between messages
      }

      // Save the PDF
      pdf.save(`partselect-chat-${sessionId}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-partselect-blue" />
            Download Chat History
          </DialogTitle>
          <DialogDescription>
            Review your conversation and download as PDF
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-sm">Session Details</p>
              <p className="text-xs text-gray-600">Session ID: {sessionId}</p>
              <p className="text-xs text-gray-600">Messages: {messages.length}</p>
            </div>
            <Badge variant="secondary" className="bg-partselect-blue text-white">
              Ready to Download
            </Badge>
          </div>

          <ScrollArea className="h-[300px] border rounded-lg p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={`${message.id}-${index}`} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant={message.sender === 'user' ? 'default' : 'secondary'}>
                      {message.sender === 'user' ? 'You' : 'PartSelect AI'}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(message.timestamp)}
                    </span>
                  </div>
                  <div className="text-sm p-3 bg-gray-50 rounded-lg">
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {message.productCards && message.productCards.length > 0 && (
                      <div className="mt-2 text-xs text-gray-600 italic">
                        [{message.productCards.length} product recommendation(s) included]
                      </div>
                    )}
                  </div>
                  {index < messages.length - 1 && <hr className="my-4" />}
                </div>
              ))}
              {messages.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No messages to download
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isGenerating}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={generatePDF}
            disabled={isGenerating || messages.length === 0}
            className="bg-partselect-blue hover:bg-partselect-dark"
          >
            <Download className="h-4 w-4 mr-2" />
            {isGenerating ? "Generating PDF..." : "Download PDF"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}