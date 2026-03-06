import React, { useEffect, useRef, useState } from 'react';
import { X, Zap, Info, Camera, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ARScanScreenProps {
  onClose: () => void;
}

export const ARScanScreen: React.FC<ARScanScreenProps> = ({ onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [scanningStatus, setScanningStatus] = useState('Initializing AR...');
  const [detectedPoint, setDetectedPoint] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function setupCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' }, 
          audio: false 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraReady(true);
          setScanningStatus('Scanning for body landmarks...');
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setScanningStatus('Camera access denied. Please check permissions.');
      }
    }

    setupCamera();

    // Simulate detection after 3 seconds
    const timer = setTimeout(() => {
      setScanningStatus('Acupoint Detected: LI4 (Hegu)');
      setDetectedPoint('LI4');
    }, 4000);

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      clearTimeout(timer);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col"
    >
      {/* Camera Viewport */}
      <div className="relative flex-1 bg-slate-900 overflow-hidden">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover"
        />
        
        {/* AR Overlay Grid */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full border-[40px] border-black/20 flex items-center justify-center">
            <div className="w-64 h-64 border-2 border-primary/40 rounded-3xl relative">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
              
              {/* Scanning Line */}
              <motion.div 
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-0.5 bg-primary/60 shadow-[0_0_15px_rgba(6,224,224,0.8)]"
              />
            </div>
          </div>
        </div>

        {/* Detected Point Marker */}
        <AnimatePresence>
          {detectedPoint && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            >
              <div className="relative">
                <div className="size-6 bg-primary rounded-full animate-ping absolute inset-0" />
                <div className="size-6 bg-primary rounded-full relative z-10 border-2 border-white" />
                <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-lg border border-primary/20 whitespace-nowrap">
                  <span className="text-xs font-bold text-slate-900">LI4 (Hegu)</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Controls */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start">
          <button 
            onClick={onClose}
            className="size-10 rounded-full bg-black/40 backdrop-blur text-white flex items-center justify-center"
          >
            <X size={24} />
          </button>
          <div className="flex flex-col gap-2">
            <button className="size-10 rounded-full bg-black/40 backdrop-blur text-white flex items-center justify-center">
              <Zap size={20} />
            </button>
            <button className="size-10 rounded-full bg-black/40 backdrop-blur text-white flex items-center justify-center">
              <RefreshCw size={20} />
            </button>
          </div>
        </div>

        {/* Bottom Status */}
        <div className="absolute bottom-10 left-0 right-0 px-6">
          <div className="bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-4">
            <div className={`size-3 rounded-full ${detectedPoint ? 'bg-primary animate-pulse' : 'bg-white/40'}`} />
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{scanningStatus}</p>
              {detectedPoint && (
                <p className="text-primary text-xs font-bold uppercase tracking-wider mt-0.5">Point Identified</p>
              )}
            </div>
            {detectedPoint && (
              <button className="bg-primary text-slate-900 px-4 py-2 rounded-xl text-xs font-bold">
                VIEW DETAILS
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Instructions Overlay */}
      {!isCameraReady && (
        <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center p-10 text-center">
          <Camera size={48} className="text-primary mb-4 animate-pulse" />
          <h3 className="text-white text-xl font-bold mb-2">Requesting Camera Access</h3>
          <p className="text-slate-400 text-sm">Please allow camera permissions to use the AR identification feature.</p>
        </div>
      )}
    </motion.div>
  );
};
