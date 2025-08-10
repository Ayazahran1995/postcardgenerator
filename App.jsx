import React, { useState, useEffect, useRef, useCallback } from 'react';

// Main App component
const App = () => {
    // State to manage the drawing process
    const [isDrawing, setIsDrawing] = useState(false);
    const [brushColor, setBrushColor] = useState('#2563eb');
    const [brushSize, setBrushSize] = useState(5);
    const [brushStyle, setBrushStyle] = useState('standard');
    const [canvasBackground, setCanvasBackground] = useState('#ffffff');
    const [showInstructions, setShowInstructions] = useState(true);

    // Refs to get direct access to the canvas and its context
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);

    // Initial setup for the canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctxRef.current = ctx;

        // Set initial canvas size based on window dimensions, with a max width
        const resizeCanvas = () => {
            canvas.width = Math.min(window.innerWidth * 0.9, 800);
            canvas.height = Math.min(window.innerHeight * 0.7, 600);
            ctxRef.current.fillStyle = canvasBackground;
            ctxRef.current.fillRect(0, 0, canvas.width, canvas.height);
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        return () => window.removeEventListener('resize', resizeCanvas);
    }, [canvasBackground]);

    // Function to handle the start of a drawing
    const startDrawing = useCallback(({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        ctxRef.current.beginPath();
        ctxRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
        setShowInstructions(false);
    }, []);

    // Function to handle the drawing motion
    const draw = useCallback(({ nativeEvent }) => {
        if (!isDrawing) {
            return;
        }

        const { offsetX, offsetY } = nativeEvent;
        const ctx = ctxRef.current;

        switch (brushStyle) {
            case 'standard':
                ctx.lineWidth = brushSize;
                ctx.strokeStyle = brushColor;
                ctx.lineTo(offsetX, offsetY);
                ctx.stroke();
                break;
            case 'impressionist':
                // Impressionist style with short, choppy strokes
                ctx.lineWidth = brushSize * 2;
                ctx.strokeStyle = brushColor;
                ctx.globalAlpha = 0.5;
                ctx.beginPath();
                ctx.moveTo(offsetX + (Math.random() * 5), offsetY + (Math.random() * 5));
                ctx.lineTo(offsetX, offsetY);
                ctx.stroke();
                ctx.globalAlpha = 1.0;
                break;
            case 'pointillist':
                // Pointillist style using dots
                ctx.beginPath();
                ctx.fillStyle = brushColor;
                ctx.arc(offsetX, offsetY, brushSize / 2, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'expressionist':
                // Expressionist style with thick, bold strokes
                ctx.lineWidth = brushSize * 1.5;
                ctx.strokeStyle = brushColor;
                ctx.lineTo(offsetX + (Math.random() * 2), offsetY + (Math.random() * 2));
                ctx.stroke();
                break;
            case 'eraser':
                // Eraser "style" simply draws with the background color
                ctx.lineWidth = brushSize * 2;
                ctx.strokeStyle = canvasBackground;
                ctx.lineTo(offsetX, offsetY);
                ctx.stroke();
                break;
            default:
                break;
        }
    }, [isDrawing, brushColor, brushSize, brushStyle, canvasBackground]);

    // Function to handle the end of a drawing
    const stopDrawing = useCallback(() => {
        ctxRef.current.closePath();
        setIsDrawing(false);
    }, []);

    // Function to clear the entire canvas
    const clearCanvas = () => {
        const canvas = canvasRef.current;
        ctxRef.current.fillStyle = canvasBackground;
        ctxRef.current.fillRect(0, 0, canvas.width, canvas.height);
        setShowInstructions(true);
    };

    // Function to download the canvas content as an image
    const downloadImage = () => {
        const canvas = canvasRef.current;
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'my-postcard.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const colorPalette = ['#2563eb', '#ef4444', '#10b981', '#fcd34d', '#f97316', '#a855f7'];
    
    // Style for buttons
    const buttonStyle = "px-4 py-2 font-semibold text-white transition-all duration-200 rounded-lg shadow-lg hover:scale-105 active:scale-95";
    const activeButtonStyle = "ring-2 ring-blue-500 transform scale-110";

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-sky-100 text-gray-800 font-inter">
            <h1 className="mb-8 text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 drop-shadow-xl">
                Postcard Creator
            </h1>
            <div className="flex flex-col items-center w-full max-w-4xl p-8 bg-white rounded-2xl shadow-3xl">
                {/* Control Panel */}
                <div className="flex flex-wrap items-center justify-center w-full p-4 mb-6 space-y-4 rounded-xl md:space-y-0 md:space-x-4 bg-blue-100">
                    <div className="flex items-center space-x-2">
                        <label className="text-gray-600">Size:</label>
                        <input
                            type="range"
                            min="1"
                            max="50"
                            value={brushSize}
                            onChange={(e) => setBrushSize(e.target.value)}
                            className="w-24 h-2 rounded-lg appearance-none cursor-pointer bg-blue-200"
                        />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <label className="text-gray-600">Style:</label>
                        <div className="flex flex-wrap justify-center gap-2">
                            <button
                                onClick={() => setBrushStyle('standard')}
                                className={`${buttonStyle} bg-blue-600 ${brushStyle === 'standard' ? activeButtonStyle : ''}`}
                            >
                                Standard
                            </button>
                            <button
                                onClick={() => setBrushStyle('impressionist')}
                                className={`${buttonStyle} bg-orange-500 ${brushStyle === 'impressionist' ? activeButtonStyle : ''}`}
                            >
                                Impressionist
                            </button>
                            <button
                                onClick={() => setBrushStyle('pointillist')}
                                className={`${buttonStyle} bg-teal-500 ${brushStyle === 'pointillist' ? activeButtonStyle : ''}`}
                            >
                                Pointillist
                            </button>
                            <button
                                onClick={() => setBrushStyle('expressionist')}
                                className={`${buttonStyle} bg-purple-500 ${brushStyle === 'expressionist' ? activeButtonStyle : ''}`}
                            >
                                Expressionist
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <label className="text-gray-600">Color:</label>
                        <div className="flex space-x-1">
                            {colorPalette.map(color => (
                                <button
                                    key={color}
                                    onClick={() => setBrushColor(color)}
                                    className={`w-8 h-8 rounded-full border-2 transition-transform duration-100 shadow-md ${brushColor === color ? 'border-blue-400 scale-110' : 'border-transparent'}`}
                                    style={{ backgroundColor: color }}
                                ></button>
                            ))}
                        </div>
                        <input
                            type="color"
                            value={brushColor}
                            onChange={(e) => setBrushColor(e.target.value)}
                            className="w-10 h-10 rounded-full cursor-pointer bg-transparent border-none"
                        />
                    </div>
                </div>

                {/* Main Canvas and Buttons */}
                <div className="relative w-full overflow-hidden rounded-xl shadow-inner aspect-[4/3] max-w-[800px] max-h-[600px] bg-white border border-gray-300">
                    <canvas
                        ref={canvasRef}
                        onMouseDown={startDrawing}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onMouseMove={draw}
                        onTouchStart={(e) => startDrawing({ nativeEvent: e.touches[0] })}
                        onTouchEnd={stopDrawing}
                        onTouchCancel={stopDrawing}
                        onTouchMove={(e) => draw({ nativeEvent: e.touches[0] })}
                        className="w-full h-full"
                    ></canvas>
                    {showInstructions && (
                        <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-gray-500 bg-white bg-opacity-70">
                            <p className="text-lg">Click or tap to start drawing your postcard!</p>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap justify-center gap-4 p-4 mt-6">
                    <button
                        onClick={() => setBrushStyle('eraser')}
                        className={`${buttonStyle} bg-red-600 ${brushStyle === 'eraser' ? activeButtonStyle : ''}`}
                    >
                        Eraser
                    </button>
                    <button
                        onClick={clearCanvas}
                        className={`${buttonStyle} bg-blue-500 hover:bg-blue-600`}
                    >
                        Clear
                    </button>
                    <button
                        onClick={downloadImage}
                        className={`${buttonStyle} bg-teal-500 hover:bg-teal-600`}
                    >
                        Download Postcard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default App;
