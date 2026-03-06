import React, { useEffect, useRef, useState } from 'react';
import { X, Zap, Info, Camera, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ARScanScreenProps {
  onClose: () => void;
}

interface AcupointResult {
  code: string;
  name: string;
  description: string;
  x: number;
  y: number;
}

export const ARScanScreen: React.FC<ARScanScreenProps> = ({ onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [scanningStatus, setScanningStatus] = useState('Initializing Scanner...');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedPoints, setDetectedPoints] = useState<AcupointResult[]>([]);
  const [error, setError] = useState<string | null>(null);

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
          setScanningStatus('Ready to identify points');
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setScanningStatus('Camera access denied.');
      }
    }
    setupCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsAnalyzing(true);
    setScanningStatus('Analyzing image...');
    setDetectedPoints([]);
    setError(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/jpeg', 0.8);

      try {
        const response = await fetch('http://localhost:3001/api/analyze-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: imageData })
        });

        if (!response.ok) throw new Error('Failed to analyze image');
        const data = await response.json();

        if (data.points && data.points.length > 0) {
          setDetectedPoints(data.points);
          setScanningStatus(`${data.points.length} points identified`);
        } else {
          setScanningStatus('No points identified. Try moving closer or adjusting lightning.');
        }
      } catch (err) {
        console.error('Analysis error:', err);
        setError('Connection error. Is the backend running?');
        setScanningStatus('Analysis failed');
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col"
    >
      <canvas ref={canvasRef} className="hidden" />

      {/* Camera Viewport */}
      <div className="relative flex-1 bg-slate-900 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {/* AR Overlay Grid - only show when not analyzing */}
        {!isAnalyzing && detectedPoints.length === 0 && (
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
        )}

        {/* Detected Points Markers */}
        <AnimatePresence>
          {detectedPoints.map((point, index) => (
            <motion.div
              key={`${point.code}-${index}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute pointer-events-none"
              style={{ top: `${point.y * 100}%`, left: `${point.x * 100}%` }}
            >
              <div className="relative -translate-x-1/2 -translate-y-1/2">
                <div className="size-6 bg-primary rounded-full animate-ping absolute inset-0" />
                <div className="size-6 bg-primary rounded-full relative z-10 border-2 border-white" />
                <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-lg border border-primary/20 whitespace-nowrap">
                  <span className="text-xs font-bold text-slate-900">{point.code} ({point.name})</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Analyzing Spinner */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center">
            <div className="flex flex-col items-center">
              <RefreshCw className="text-primary animate-spin mb-4" size={48} />
              <p className="text-white font-bold tracking-widest">ANALYZING...</p>
            </div>
          </div>
        )}

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
            <button
              onClick={() => {
                setDetectedPoints([]);
                setScanningStatus('Ready to identify points');
              }}
              className="size-10 rounded-full bg-black/40 backdrop-blur text-white flex items-center justify-center"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </div>

        {/* Bottom Status & Controls */}
        <div className="absolute bottom-10 left-0 right-0 px-6 flex flex-col gap-6">
          <div className="bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-4">
            <div className={`size-3 rounded-full ${detectedPoints.length > 0 ? 'bg-primary animate-pulse' : 'bg-white/40'}`} />
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{scanningStatus}</p>
              {error && <p className="text-red-400 text-[10px] mt-0.5">{error}</p>}
            </div>
          </div>

          {!isAnalyzing && (
            <div className="flex justify-center">
              <button
                onClick={handleCapture}
                className="size-20 bg-white rounded-full border-4 border-primary flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all"
              >
                <div className="size-14 bg-slate-900 rounded-full flex items-center justify-center">
                  <Camera size={32} className="text-primary" />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Instructions Overlay */}
      {!isCameraReady && (
        <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center p-10 text-center">
          <Camera size={48} className="text-primary mb-4 animate-pulse" />
          <h3 className="text-white text-xl font-bold mb-2">Requesting Camera Access</h3>
          <p className="text-slate-400 text-sm">Please allow camera permissions to use the identification feature.</p>
        </div>
      )}
    </motion.div>
  );
};
