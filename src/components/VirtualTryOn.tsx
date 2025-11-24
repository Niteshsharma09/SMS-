'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { virtualTryOn } from '@/ai/flows/virtual-try-on';
import { Loader2, Camera, RefreshCw, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface VirtualTryOnProps {
  frameId: string;
  onExit: () => void;
}

type TryOnStatus = 'idle' | 'initializing' | 'ready' | 'capturing' | 'loading' | 'success' | 'error';

export function VirtualTryOn({ frameId }: VirtualTryOnProps) {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [status, setStatus] = useState<TryOnStatus>('idle');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    setStatus('initializing');
    setError(null);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setStatus('ready');
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access the camera. Please check your browser permissions and try again.");
        setStatus('error');
      }
    } else {
      setError("Your browser does not support camera access.");
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      // Stop camera stream when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  const handleCaptureAndTryOn = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setStatus('capturing');

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    
    if (context) {
      // Flip the image horizontally
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const faceImageUri = canvas.toDataURL('image/jpeg');
      setCapturedImage(faceImageUri);
      
      setStatus('loading');
      try {
        const result = await virtualTryOn({ faceImageUri, frameId });
        setResultImage(result.modifiedImageUri);
        setStatus('success');
      } catch (e) {
        console.error(e);
        toast({
          title: 'Virtual Try-On Failed',
          description: 'Could not process the image. Please try again.',
          variant: 'destructive',
        });
        setError('An unexpected error occurred. Please try again.');
        setStatus('error');
      }
    }
  };

  const reset = () => {
    setCapturedImage(null);
    setResultImage(null);
    setError(null);
    startCamera();
  };
  
  const renderContent = () => {
    switch (status) {
      case 'idle':
      case 'initializing':
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Initializing Camera...</p>
          </div>
        );
      case 'ready':
      case 'capturing':
        return (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover rounded-md transform -scale-x-100"
                />
                <div className="absolute bottom-4">
                    <Button size="lg" onClick={handleCaptureAndTryOn} disabled={status === 'capturing'}>
                        <Camera className="mr-2 h-5 w-5" />
                        {status === 'capturing' ? 'Capturing...' : 'Capture'}
                    </Button>
                </div>
            </div>
        );
      case 'loading':
         return (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Applying glasses... this may take a moment.</p>
          </div>
        );
      case 'success':
        return (
          <div className="flex flex-col h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-auto p-1">
              <Card>
                <CardContent className="p-2 aspect-video relative">
                  {capturedImage && <Image src={capturedImage} alt="Your snapshot" layout="fill" objectFit="contain" className="rounded-md" />}
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-2 aspect-video relative">
                  {resultImage && <Image src={resultImage} alt="Virtual try-on result" layout="fill" objectFit="contain" className="rounded-md" />}
                </CardContent>
              </Card>
            </div>
            <div className="pt-4 flex justify-center">
              <Button size="lg" onClick={reset}>
                <RefreshCw className="mr-2 h-5 w-5" />
                Try Again
              </Button>
            </div>
          </div>
        );
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <AlertTriangle className="h-12 w-12 text-destructive" />
            <p className="mt-4 text-lg font-semibold">Something went wrong</p>
            <p className="mt-2 text-muted-foreground max-w-sm">{error}</p>
            <Button size="lg" onClick={reset} className="mt-6">
              <RefreshCw className="mr-2 h-5 w-5" />
              Try Again
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
        <canvas ref={canvasRef} className="hidden" />
        <div className="flex-1 w-full h-full min-h-0">{renderContent()}</div>
    </div>
  );
}
