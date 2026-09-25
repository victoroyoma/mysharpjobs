import { X, CheckCircle2 } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  googleFormUrl: string;
}

export default function WaitlistModal({ isOpen, onClose, googleFormUrl }: WaitlistModalProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !showSuccess) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, showSuccess]);

  // Check for form submission by monitoring iframe
  useEffect(() => {
    if (isOpen && iframeRef.current) {
      const iframe = iframeRef.current;
      
      const handleIframeLoad = () => {
        // Check if the iframe URL contains 'formResponse' which indicates submission
        try {
          const iframeUrl = iframe.contentWindow?.location.href;
          if (iframeUrl && iframeUrl.includes('formResponse')) {
            handleFormSubmission();
          }
        } catch (e) {
          // Cross-origin restriction - use alternative detection
          // Start checking after initial load
          if (checkIntervalRef.current) {
            clearInterval(checkIntervalRef.current);
          }
          
          checkIntervalRef.current = setInterval(() => {
            try {
              const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
              if (iframeDoc) {
                // Look for Google Forms success message elements
                const successElement = iframeDoc.querySelector('.freebirdFormviewerViewResponseConfirmationMessage');
                if (successElement) {
                  handleFormSubmission();
                }
              }
            } catch (err) {
              // Still cross-origin, keep trying
            }
          }, 500);
        }
      };

      iframe.addEventListener('load', handleIframeLoad);

      return () => {
        iframe.removeEventListener('load', handleIframeLoad);
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
        }
      };
    }
  }, [isOpen]);

  const handleFormSubmission = () => {
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
    }
    setShowSuccess(true);
    
    // Auto-close after 3 seconds
    setTimeout(() => {
      handleClose();
    }, 3000);
  };

  const handleClose = () => {
    setShowSuccess(false);
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={!showSuccess ? handleClose : undefined}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
          {showSuccess ? (
            // Success Message
            <div className="p-12 text-center">
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-green-400 to-emerald-500 rounded-full p-6">
                    <CheckCircle2 className="h-16 w-16 text-white animate-bounce" />
                  </div>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                🎉 You're on the list!
              </h2>
              <p className="text-lg text-gray-600 mb-2">
                Thank you for joining our waitlist!
              </p>
              <p className="text-gray-500">
                We'll notify you as soon as we launch with exclusive early access.
              </p>
              <div className="mt-8 text-sm text-gray-400">
                This window will close automatically...
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Join Our Waitlist</h2>
                  <p className="text-gray-600 mt-1">Be the first to know when we launch!</p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              {/* Google Form Embed */}
              <div className="flex-1 overflow-hidden">
                <iframe
                  ref={iframeRef}
                  src={googleFormUrl}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  marginHeight={0}
                  marginWidth={0}
                  className="min-h-[600px]"
                  title="Waitlist Form"
                >
                  Loading…
                </iframe>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                <p className="text-sm text-gray-600 text-center">
                  By joining our waitlist, you'll get exclusive early access and special launch offers.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
