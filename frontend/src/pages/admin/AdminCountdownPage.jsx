import React, { useState, useEffect } from 'react';
import { getCountdown, saveCountdown } from '../../api/apiService';

const AdminCountdownPage = () => {
    // Basic Settings
    const [title, setTitle] = useState('');
    const [endDate, setEndDate] = useState('');
    const [enabled, setEnabled] = useState(false);
    
    // Color Settings
    const [backgroundColor, setBackgroundColor] = useState('#000000');
    const [textColor, setTextColor] = useState('#ffffff');
    const [borderColor, setBorderColor] = useState('#ff6b6b');
    const [timerBoxColor, setTimerBoxColor] = useState('#ffffff');
    const [timerTextColor, setTimerTextColor] = useState('#000000');
    const [urgentBgColor, setUrgentBgColor] = useState('#fef2f2');
    const [urgentTextColor, setUrgentTextColor] = useState('#dc2626');
    
    // Text Settings
    const [subtitle, setSubtitle] = useState('');
    const [urgentMessage, setUrgentMessage] = useState('');
    const [expiredMessage, setExpiredMessage] = useState('');
    const [packName, setPackName] = useState('');
    
    // Display Settings
    const [showDays, setShowDays] = useState(false);
    const [showHours, setShowHours] = useState(true);
    const [showMinutes, setShowMinutes] = useState(true);
    const [showSeconds, setShowSeconds] = useState(true);
    const [showPackName, setShowPackName] = useState(true);
    const [showSubtitle, setShowSubtitle] = useState(true);
    
    // Animation Settings
    const [enablePulse, setEnablePulse] = useState(true);
    const [enableBounce, setEnableBounce] = useState(true);
    const [urgentThreshold, setUrgentThreshold] = useState(3600); // 1 hour in seconds
    
    // Layout Settings
    const [borderRadius, setBorderRadius] = useState(12);
    const [padding, setPadding] = useState(16);
    const [fontSize, setFontSize] = useState(18);
    const [timerFontSize, setTimerFontSize] = useState(24);
    
    const [message, setMessage] = useState('');

    useEffect(() => {
        getCountdown().then(response => {
            if (response.data) {
                const data = response.data;
                // Basic Settings
                setTitle(data.title || '');
                setEndDate(data.endDate ? new Date(data.endDate).toISOString().slice(0, 16) : '');
                setEnabled(data.enabled || false);
                
                // Color Settings
                setBackgroundColor(data.backgroundColor || '#fef3c7');
                setTextColor(data.textColor || '#ea580c');
                setBorderColor(data.borderColor || '#f97316');
                setTimerBoxColor(data.timerBoxColor || '#ffffff');
                setTimerTextColor(data.timerTextColor || '#ea580c');
                setUrgentBgColor(data.urgentBgColor || '#fef2f2');
                setUrgentTextColor(data.urgentTextColor || '#dc2626');
                
                // Text Settings
                setSubtitle(data.subtitle || '');
                setUrgentMessage(data.urgentMessage || '');
                setExpiredMessage(data.expiredMessage || '');
                setPackName(data.packName || '');
                
                // Display Settings
                setShowDays(data.showDays || false);
                setShowHours(data.showHours !== undefined ? data.showHours : true);
                setShowMinutes(data.showMinutes !== undefined ? data.showMinutes : true);
                setShowSeconds(data.showSeconds !== undefined ? data.showSeconds : true);
                setShowPackName(data.showPackName !== undefined ? data.showPackName : true);
                setShowSubtitle(data.showSubtitle !== undefined ? data.showSubtitle : true);
                
                // Animation Settings
                setEnablePulse(data.enablePulse !== undefined ? data.enablePulse : true);
                setEnableBounce(data.enableBounce !== undefined ? data.enableBounce : true);
                setUrgentThreshold(data.urgentThreshold || 3600);
                
                // Layout Settings
                setBorderRadius(data.borderRadius || 12);
                setPadding(data.padding || 16);
                setFontSize(data.fontSize || 18);
                setTimerFontSize(data.timerFontSize || 24);
            }
        }).catch(error => console.error("Could not fetch countdown settings", error));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const countdownData = {
            // Basic Settings
            title,
            endDate: new Date(endDate).toISOString(),
            enabled,
            
            // Color Settings
            backgroundColor,
            textColor,
            borderColor,
            timerBoxColor,
            timerTextColor,
            urgentBgColor,
            urgentTextColor,
            
            // Text Settings
            subtitle,
            urgentMessage,
            expiredMessage,
            packName,
            
            // Display Settings
            showDays,
            showHours,
            showMinutes,
            showSeconds,
            showPackName,
            showSubtitle,
            
            // Animation Settings
            enablePulse,
            enableBounce,
            urgentThreshold,
            
            // Layout Settings
            borderRadius,
            padding,
            fontSize,
            timerFontSize,
        };
        saveCountdown(countdownData)
            .then(() => {
                setMessage('Settings saved successfully!');
                setTimeout(() => setMessage(''), 3000);
            })
            .catch(() => {
                setMessage('Error saving settings.');
                setTimeout(() => setMessage(''), 3000);
            });
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">🎛️ Full Countdown Control Panel</h1>
            {message && <p className="text-blue-500">{message}</p>}
            
            <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-8">
                
                {/* Basic Settings */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">📝 Basic Settings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} 
                                   placeholder="🔥 عرض محدود! / Limited Offer!" 
                                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500" />
                        </div>
                        <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date & Time</label>
                            <input type="datetime-local" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} 
                                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500" />
                        </div>
                        <div>
                            <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">Subtitle</label>
                            <input type="text" id="subtitle" value={subtitle} onChange={e => setSubtitle(e.target.value)} 
                                   placeholder="💰 وفر الآن قبل انتهاء العرض / Save now before offer ends" 
                                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500" />
                        </div>
                        <div>
                            <label htmlFor="packName" className="block text-sm font-medium text-gray-700">Pack/Product Name</label>
                            <input type="text" id="packName" value={packName} onChange={e => setPackName(e.target.value)} 
                                   placeholder="عروض اليوم الخاصة / Today's Special Offers" 
                                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500" />
                        </div>
                        <div>
                            <label htmlFor="urgentMessage" className="block text-sm font-medium text-gray-700">Urgent Message</label>
                            <input type="text" id="urgentMessage" value={urgentMessage} onChange={e => setUrgentMessage(e.target.value)} 
                                   placeholder="⚡ أسرع! الوقت ينفد / ⚡ Hurry! Time running out" 
                                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500" />
                        </div>
                        <div>
                            <label htmlFor="expiredMessage" className="block text-sm font-medium text-gray-700">Expired Message</label>
                            <input type="text" id="expiredMessage" value={expiredMessage} onChange={e => setExpiredMessage(e.target.value)} 
                                   placeholder="انتهت الفترة المحدودة! / Limited Time Expired!" 
                                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex items-center">
                            <input type="checkbox" id="enabled" checked={enabled} onChange={e => setEnabled(e.target.checked)} 
                                   className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500" />
                            <label htmlFor="enabled" className="ml-2 block text-sm text-gray-900">Enable Countdown</label>
                        </div>
                    </div>
                </div>

                {/* Color Settings */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">🎨 Color Settings</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label htmlFor="backgroundColor" className="block text-sm font-medium text-gray-700">Background</label>
                            <input type="color" id="backgroundColor" value={backgroundColor} onChange={e => setBackgroundColor(e.target.value)} 
                                   className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="textColor" className="block text-sm font-medium text-gray-700">Text Color</label>
                            <input type="color" id="textColor" value={textColor} onChange={e => setTextColor(e.target.value)} 
                                   className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="borderColor" className="block text-sm font-medium text-gray-700">Border Color</label>
                            <input type="color" id="borderColor" value={borderColor} onChange={e => setBorderColor(e.target.value)} 
                                   className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="timerBoxColor" className="block text-sm font-medium text-gray-700">Timer Box</label>
                            <input type="color" id="timerBoxColor" value={timerBoxColor} onChange={e => setTimerBoxColor(e.target.value)} 
                                   className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="timerTextColor" className="block text-sm font-medium text-gray-700">Timer Text</label>
                            <input type="color" id="timerTextColor" value={timerTextColor} onChange={e => setTimerTextColor(e.target.value)} 
                                   className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="urgentBgColor" className="block text-sm font-medium text-gray-700">Urgent Background</label>
                            <input type="color" id="urgentBgColor" value={urgentBgColor} onChange={e => setUrgentBgColor(e.target.value)} 
                                   className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="urgentTextColor" className="block text-sm font-medium text-gray-700">Urgent Text</label>
                            <input type="color" id="urgentTextColor" value={urgentTextColor} onChange={e => setUrgentTextColor(e.target.value)} 
                                   className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm" />
                        </div>
                    </div>
                </div>

                {/* Display Settings */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">👁️ Display Settings</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="flex items-center">
                            <input type="checkbox" id="showDays" checked={showDays} onChange={e => setShowDays(e.target.checked)} 
                                   className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500" />
                            <label htmlFor="showDays" className="ml-2 block text-sm text-gray-900">Show Days</label>
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" id="showHours" checked={showHours} onChange={e => setShowHours(e.target.checked)} 
                                   className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500" />
                            <label htmlFor="showHours" className="ml-2 block text-sm text-gray-900">Show Hours</label>
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" id="showMinutes" checked={showMinutes} onChange={e => setShowMinutes(e.target.checked)} 
                                   className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500" />
                            <label htmlFor="showMinutes" className="ml-2 block text-sm text-gray-900">Show Minutes</label>
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" id="showSeconds" checked={showSeconds} onChange={e => setShowSeconds(e.target.checked)} 
                                   className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500" />
                            <label htmlFor="showSeconds" className="ml-2 block text-sm text-gray-900">Show Seconds</label>
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" id="showPackName" checked={showPackName} onChange={e => setShowPackName(e.target.checked)} 
                                   className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500" />
                            <label htmlFor="showPackName" className="ml-2 block text-sm text-gray-900">Show Pack Name</label>
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" id="showSubtitle" checked={showSubtitle} onChange={e => setShowSubtitle(e.target.checked)} 
                                   className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500" />
                            <label htmlFor="showSubtitle" className="ml-2 block text-sm text-gray-900">Show Subtitle</label>
                        </div>
                    </div>
                </div>

                {/* Animation Settings */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">⚡ Animation Settings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center">
                            <input type="checkbox" id="enablePulse" checked={enablePulse} onChange={e => setEnablePulse(e.target.checked)} 
                                   className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500" />
                            <label htmlFor="enablePulse" className="ml-2 block text-sm text-gray-900">Enable Pulse Animation</label>
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" id="enableBounce" checked={enableBounce} onChange={e => setEnableBounce(e.target.checked)} 
                                   className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500" />
                            <label htmlFor="enableBounce" className="ml-2 block text-sm text-gray-900">Enable Bounce Animation</label>
                        </div>
                        <div>
                            <label htmlFor="urgentThreshold" className="block text-sm font-medium text-gray-700">Urgent Threshold (seconds)</label>
                            <input type="number" id="urgentThreshold" value={urgentThreshold} onChange={e => setUrgentThreshold(parseInt(e.target.value))} 
                                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500" />
                        </div>
                    </div>
                </div>

                {/* Layout Settings */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">📐 Layout Settings</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label htmlFor="borderRadius" className="block text-sm font-medium text-gray-700">Border Radius (px)</label>
                            <input type="number" id="borderRadius" value={borderRadius} onChange={e => setBorderRadius(parseInt(e.target.value))} 
                                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500" />
                        </div>
                        <div>
                            <label htmlFor="padding" className="block text-sm font-medium text-gray-700">Padding (px)</label>
                            <input type="number" id="padding" value={padding} onChange={e => setPadding(parseInt(e.target.value))} 
                                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500" />
                        </div>
                        <div>
                            <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700">Font Size (px)</label>
                            <input type="number" id="fontSize" value={fontSize} onChange={e => setFontSize(parseInt(e.target.value))} 
                                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500" />
                        </div>
                        <div>
                            <label htmlFor="timerFontSize" className="block text-sm font-medium text-gray-700">Timer Font Size (px)</label>
                            <input type="number" id="timerFontSize" value={timerFontSize} onChange={e => setTimerFontSize(parseInt(e.target.value))} 
                                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500" />
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <button type="submit" className="w-full bg-pink-600 text-white py-3 px-6 rounded-md hover:bg-pink-700 text-lg font-semibold">
                        💾 Save All Settings
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminCountdownPage;